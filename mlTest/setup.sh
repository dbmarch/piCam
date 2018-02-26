export FULL_PROJECT=$(gcloud config list project --format "value(core.project)")
export PROJECT="$(echo $FULL_PROJECT | cut -f2 -d ':')"
export REGION='us-central1' #OPTIONALLY CHANGE THIS

export PROJECT=oci-iot-ml
export MODEL_NAME=equipmentparts
#export MODEL_VERSION="${MODEL_NAME}_1_$(date +%s)"
export MODEL_VERSION="${MODEL_NAME}_1_1517331745"
