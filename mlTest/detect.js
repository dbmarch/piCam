// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');


// Creates a client
const client = new vision.ImageAnnotatorClient();
var fname = '../image.jpg';
var fOutput  = '../output.json';

if ( process.argv.length >= 3) {
//   console.log ( process.argv[2] );
   fname = process.argv[2];
}
if (process.argv.length >=4) {
   fOutput = process.argv[3];
}


console.log ("Processing: " + fname + "   Output: " + fOutput );

var answer = [];

// Performs label detection on the image file
client
  .labelDetection(String(fname))
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => {
     var found = { "description" : label.description,
                   "score" : parseFloat(Number(label.score) * 100).toFixed(2)
                 };
     answer.push(found); 
     console.log (' [ ' + parseFloat(Number(label.score) * 100).toFixed(2) + ' % ]   ' + label.description );
    });
//  console.log (answer);
  
    fs.writeFileSync (fOutput, JSON.stringify(answer), 'utf8', function(err) {
       if (err) {
           console.log(err);
       }
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

exports.answer = answer;
