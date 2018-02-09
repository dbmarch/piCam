#!/usr/bin/python3

import picamera

camera = picamera.PiCamera()



camera.hflip = True
camera.vflip = True


camera.capture('image.jpg')



