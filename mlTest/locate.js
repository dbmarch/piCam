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
  .cropHints( String(fname))
  .then(results => {
    const cropHints = results[0].cropHintsAnnotation;

    console.log (cropHints);

    cropHints.cropHints.forEach((hintBounds, hintIdx) => {

      console.log(`Crop Hint ${hintIdx}:`);
      hintBounds.boundingPoly.vertices.forEach((bound, boundIdx) => {
        console.log(`  Bound ${boundIdx}: (${bound.x}, ${bound.y})`);
      });
    })
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

exports.answer = answer;
