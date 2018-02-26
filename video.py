#!/usr/bin/env python

# Web streaming example
# Source code from the official PiCamera package
# http://picamera.readthedocs.io/en/latest/recipes2.html#web-streaming

#import google.cloud.vision
#from google.cloud import vision
#from google-cloud-vision import type

import sys
import io
import os
import picamera
import logging
import socketserver
from threading import Condition
from http import server
from apscheduler.schedulers.background import BackgroundScheduler
from subprocess import call


fileCount = 0
camera = None
outputFile = './output.json'
sched = BackgroundScheduler()

PAGE="""\
<html>
<head>
<title>Raspberry Pi - Image Capture</title>
<style>

body {
    font-family: Roboto;
    background-color: lightgray;
}


img {
   border: 2px solid #2c393f;
   border-radius: 10px;
}

button {
    display: inline-block;
    border: 2px solid #2c393f;
    border-radius: 10px;
    background-color: #607d8b;
    margin: 5px auto;
    width: 25%;
    padding: 2px;
    font-size:1.25em;
    font-weight: bold;
}
</style
</head>
<body>
<center><h1>Raspberry Pi - Image Capture</h1></center>
<div>
   <center><img src="stream.mjpg" width="640" height="480"></center>
</div>
<br>

<form action='/' method = 'post'>
<div style='text-align: center'>
   <button name = 'capture' type='submit' value='capture'>Capture</button>
</div>
</form>
</body>
</html>
"""

class StreamingOutput(object):
    def __init__(self):
        self.frame = None
        self.buffer = io.BytesIO()
        self.condition = Condition()

    def write(self, buf):
        if buf.startswith(b'\xff\xd8'):
            # New frame, copy the existing buffer's content and notify all
            # clients it's available
            self.buffer.truncate()
            with self.condition:
                self.frame = self.buffer.getvalue()
                self.condition.notify_all()
            self.buffer.seek(0)
        return self.buffer.write(buf)

class StreamingHandler(server.BaseHTTPRequestHandler):

    def do_PUT(self):
        print ('put')

    def do_GET(self):
        if self.path == '/':
            self.send_response(301)
            self.send_header('Location', '/index.html')
            self.end_headers()
        elif self.path == '/index.html':
            content = PAGE.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == '/stream.mjpg':
            self.send_response(200)
            self.send_header('Age', 0)
            self.send_header('Cache-Control', 'no-cache, private')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()
            try:
                while True:
                    with output.condition:
                        output.condition.wait()
                        frame = output.frame
                    self.wfile.write(b'--FRAME\r\n')
                    self.send_header('Content-Type', 'image/jpeg')
                    self.send_header('Content-Length', len(frame))
                    self.end_headers()
                    self.wfile.write(frame)
                    self.wfile.write(b'\r\n')
            except Exception as e:
                logging.warning(
                    'Removed streaming client %s: %s',
                    self.client_address, str(e))
        else:
            self.send_error(404)
            self.end_headers()

    def do_POST(self):
        global fileCount
        print('post')
        fileCount += 1
        filename = 'picture_' + str(fileCount) + '.jpg'
        print('filename' + filename)
        camera.capture (filename)
        self.send_response(302)
        self.send_header('Location', '/index.html')
        self.end_headers()
        if os.path.exists(outputFile) and os.path.isfile(outputFile):
           print ('delete the file')
           os.remove(outputFile)
        detect_labels_script(filename)

class StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def checkFile ():
#   print ('tick')
   if os.path.exists(outputFile):
      print (outputFile + ' ready')


def detect_labels_script(filename):
    call(["./detect.sh", filename, outputFile])

def detect_labels(filename):
    """Detects labels in the file."""
    client = vision.ImageAnnotatorClient()

    with io.open(filename, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)

    response = client.label_detection(image=image)
    labels = response.label_annotations
    print('Labels:')

    for label in labels:
        print(label.description)

print ('starting server')
port = 8000
if (len(sys.argv) > 1):
   port = int(sys.argv[1])

print ('port: '+str(port))
with picamera.PiCamera(resolution='640x480', framerate=24) as camera:
     output = StreamingOutput()

     sched.add_job(checkFile, 'interval', seconds=3)
     sched.start()

     if os.path.exists(outputFile) and os.path.isfile(outputFile):
         print ('delete the file')
         os.remove(outputFile)

     #Uncomment the next line to change your Pi's Camera rotation (in degrees)
#    camera.rotation = 180
#    camera.vflip = True
#    camera.hflip = True

     camera.start_recording(output, format='mjpeg')
     try:
        address = ('', port)
        server = StreamingServer(address, StreamingHandler)
        server.serve_forever()
     finally:
        camera.stop_recording()
        camera.capture ('image.jpg')
        sched.shutdown()

