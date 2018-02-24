*** This is the init.js file for MONGOOSE OS

Load Mongoose OS into a Node MCU device.

GPIO 4 goes to the DHT22 sensor output

GPIO 5 goes to the LED driver circuit 

The LED will turn on when connected to GCP.

There is a lot to set up.   

Some links:
The Tutorial I started with ( and then extended)
https://mongoose-os.com/gcp/



Supported hardware for mongoose os:
https://mongoose-os.com/docs/reference/supported-hardware.html

Pinout of the Node MCU
https://pradeepsinghblog.files.wordpress.com/2016/04/nodemcu_pins.png?w=616

---
How you set up the GCP SDK on your PC:
https://mongoose-os.com/docs/cloud_integrations/gcp.html
(The next set of instructions may be better
)
Google IoT Core integration for Mongoose OS

https://github.com/mongoose-os-libs/gcp

---
You will need to set up your GCP account too:


I did this from within MOS tool.  
You need to have your gcp project and registry set up  (Replace with your project and the registry name
mos gcp-iot-setup --gcp-project YOUR_PROJECT_ID --gcp-region us-central1 --gcp-registry iot-registry


Once you have it working you can check gcp to see if it is receiving messages:

gcloud beta pubsub subscriptions pull --auto-ack iot-subscription --limit=20
