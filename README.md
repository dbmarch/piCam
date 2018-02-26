# SETTING UP THE RASPBERRY PI


## Getting the pi set up for GCP:


### Create an environment variable for the correct distribution

```
export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"
```

### Add the Cloud SDK distribution URI as a package


```
echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
```

### Import the Google Cloud Platform public key

```
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
```

### Update the package list and install the Cloud SDK

```
sudo apt-get update && sudo apt-get install google-cloud-sdk
```

### Docker tip: If installing the Cloud SDK inside a Docker image, use a single RUN step instead:

```
RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
    sudo apt-get update && sudo apt-get install google-cloud-sdk
```

---

## Authenticating PI to GCP

Now initialize your Raspberry PI and authenticate it with your GCP project


```
gcloud init --console-only
```

You will get a link to run in your browser on your PC.   Go to your PC - enter the link and your GCP credentials.

It returns a key.   Paste the key back into your PI.

----

## Accessing GCP Projects from PI

Your Raspberry PI is now authenticated to your GCP project

if you want to copy files up to  GCP storage

```
gsutil cp filename gs://yourBucketName
```


##  Additional python libraries
 pip install opencv-python

## Info on accessing camera from flask
https://blog.miguelgrinberg.com/post/flask-video-streaming-revisited


Set up tensor flow:

https://github.com/samjabrahams/tensorflow-on-raspberry-pi

## Setup Python libraries

# For Python 2.7
sudo apt-get install python-pip python-dev

# For Python 3.3+
sudo apt-get install python3-pip python3-dev
Next, download the wheel file from this repository and install it:

# For Python 2.7
wget https://github.com/samjabrahams/tensorflow-on-raspberry-pi/releases/download/v1.1.0/tensorflow-1.1.0-cp27-none-linux_armv7l.whl
sudo pip install tensorflow-1.1.0-cp27-none-linux_armv7l.whl

# For Python 3.4
wget https://github.com/samjabrahams/tensorflow-on-raspberry-pi/releases/download/v1.1.0/tensorflow-1.1.0-cp34-cp34m-linux_armv7l.whl
sudo pip3 install tensorflow-1.1.0-cp34-cp34m-linux_armv7l.whl


Finally, we need to reinstall the mock library to keep it from throwing an error when we import TensorFlow:

# For Python 2.7
sudo pip uninstall mock
sudo pip install mock

# For Python 3.3+
sudo pip3 uninstall mock
sudo pip3 install mock

Docker image
Instructions on setting up a Docker image to run on Raspberry Pi are being maintained by @romilly here, and a pre-built image is hosted on DockerHub here. Woot!

Troubleshooting
This section will attempt to maintain a list of remedies for problems that may occur while installing from pip

"tensorflow-1.1.0-cp27-none-linux_armv7l.whl is not a supported wheel on this platform."
This wheel was built with Python 2.7, and can't be installed with a version of pip that uses Python 3. If you get the above message, try running the following command instead:

sudo pip2 install tensorflow-1.1.0-cp27-none-linux_armv7l.whl
Vice-versa for trying to install the Python 3 wheel. If you get the error "tensorflow-1.1.0-cp34-cp34m-any.whl is not a supported wheel on this platform.", try this command:

sudo pip3 install tensorflow-1.1.0-cp34-cp34m-linux_armv7l.whl
Note: the provided binaries are for Python 2.7 and 3.4 only. If you've installed Python 3.5/3.6 from source on your machine, you'll need to either explicitly install these wheels for 3.4, or you'll need to build TensorFlow from source. Once there's an officially supported installation of Python 3.5+, this repo will start including wheels for those versions.




DOCKER SETUP:

Running the image
This run instruction expects a directory called myNotebooks within your
shome directory.

docker pull romilly/rpi-docker-tensorflow


If you save an IPython notebook to the myNotebooks sub-directory
while running your container, it will get saved to the myNotebooks
directory on your Pi.

Notebooks saved to that directory will be persistent - in other words,
they will still be there when the container is stopped and restarted.

Execute this command in a terminal:

docker run -it -p 8888:8888 -v ~/myNotebooks:/notebooks/myNotebooks romilly/rpi-docker-tensorflow

Previously there were some spurious warnings when the container started but the latest resin image fixes these.
(Thanks, resinators!)

You can probably ignore the warnings about the insecurity of the IPython server configuration so long as you do not store any sensitive data or code in your notebooks.

Connecting to the notebooks
Open a browser on http://raspberrypi:8888 where raspberrypi is the
hostname of the Pi on which the docker image is running, or on
http://localhost:8888 on the Pi itself.

Stopping the image
In the terminal session where you ran the container, type Ctr-C twice in
quick succession. The container will stop.

Sources
Docker: https://github.com/umiddelb/armhf/wiki/Get-Docker-up-and-running-on-the-RaspberryPi-(ARMv6)-in-four-steps-(Wheezy)
Base image: from a post by the chaps at resin.io
Pi tensorflow whl file
from Sam Abrahm's Github project
Notebooks and notebook config from The Tensorflow Docker Build on Github


**** THOSE DOcKER INSTALL INSTRUcTIONS DO NOT WORK

This installs docker on the PI 3 Jesse stretch




Installing Docker
Installing Docker CE on Raspbian (Jessie or Stretch) for Raspberry Pi 2 and 3 is straightforward, and it’s fully supported by Docker.

We’re going to install Docker from the official Docker repositories. While there are Docker packages on the Raspbian repos too, those are not kept up to date, which is something of an issue with a fast-evolving software like Docker.

To install Docker CE on Raspbian Jessie/Stretch:

# Install some required packages first
sudo apt update
sudo apt install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common

# Get the Docker signing key for packages
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -

# Add the Docker official repos
echo "deb [arch=armhf] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list

# Install Docker
sudo apt update
sudo apt install docker-ce
That’s it! The next step is about starting Docker and enabling it at boot:

sudo systemctl enable docker
sudo systemctl start docker
Now that we have Docker running, we can test it by running the “hello world” image:

sudo docker run --rm arm32v7/hello-world




# Install required packages
apt update
apt install -y python python-pip

# Install Docker Compose from pip
pip install docker-compose



### For the GOOGLE API's you need to have credentials 

Create a key for a service account on GCP.   It will then download a keyfile in json format.

You will need to have this environment variable set to the key.   I renamed mine and put it in a gcpkey directory.

> export GOOGLE_APPLICATION_CREDENTIALS="/home/pi/gcpkey/gcp.json"
