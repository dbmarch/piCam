var myFunctions = require('../index');


var data = {
   humidity:    "50.0",
   temperature: "27.3",
   timestamp: Date.now(),
   deviceId: "test"
}

myFunctions.updateCurrentDataFirebase(data);
myFunctions.insertIntoBigquery(data);
