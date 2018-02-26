// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();
var fname = '..images/image.jpg';

if ( process.argv.length >= 3) {
//   console.log ( process.argv[2] );
   fname = process.argv[2];
}

console.log ("Processing: " + fname);

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
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

exports.answer = answer;
