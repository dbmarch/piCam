from importlib import import_module
import os
from flask import Flask, render_template, Response

print('real camera')
import picamera
import picamera.array

#camera = picamera.PiCamera(resolution='640x480',framerate=24)

app = Flask(__name__)
app.secret_key = 'some_secret'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test/')
def vid():
    return 'test'

def gen(camera):
    """Video streaming generator function."""
    with picamera.PiCamera() as camera:
       with picamera.array.PiRGBArray(camera) as stream:picam
           camera.resolution = (640,480)
           camera.capture(output, 'rgb')
           frame = output.array.shape	
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


