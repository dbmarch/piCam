# SETTING UP THE RASPBERRY PI 


## Getting the pi set up for GCP:


### Create an environment variable for the correct distribution
```
export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"
```

### Add the Cloud SDK distribution URI as a package ```
source
echo "deb http://packages.cloud.google.com/apt 

$CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
```

### Import the Google Cloud Platform public key
```
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
```

### Update the package list and install the Cloud SDK
```
sudo apt-get update && sudo apt-get install google-cloud-sdk
```

## Docker tip: If installing the Cloud SDK inside a Docker image, use a single RUN step instead:

```
RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
    sudo apt-get update && sudo apt-get install google-cloud-sdk
```

---
Now initialize your Raspberry PI and authenticate it with your GCP project

```
gcloud init --console-only'
```

You will get a link to run in your browser on your PC.   Go to your PC - enter the link and your GCP credentials. 

It returns a key.   Paste the key back into your PI.

----
Your Raspberry PI is now authenticated to your GCP project

if you want to copy files up to  GCP storage

gsutil cp filename gs://yourBucketName




