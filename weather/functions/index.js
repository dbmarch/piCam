const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bigquery = require('@google-cloud/bigquery')();
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

const db = admin.database();
/**
 * Receive data from pubsub, then 
 * Write telemetry raw data to bigquery
 * Maintain last data on firebase realtime database
 */
exports.receiveTelemetry = functions.pubsub
  .topic('iot-topic')
  .onPublish(event => {
    const attributes = event.data.attributes;
    const message = event.data.json;

    const deviceId = attributes['deviceId'];
    console.log (deviceId);

   const data = {
      humidity: message.h,
      temperature: message.t,
      deviceId: deviceId,
      timestamp: event.timestamp
    };

//    console.log (data);

    if (
      message.h < 0 ||
      message.h > 100 ||
      message.t > 100 ||
      message.t < -50
    ) {
      // Validate and do nothing
      return;
    }

    return Promise.all([
      insertIntoBigquery(data),
      updateCurrentDataFirebase(data)
    ]);
  });

/** 
 * Maintain last status in firebase
*/
function updateCurrentDataFirebase(data) {
  console.log ('updateCurrentDataFirebase');
//  console.log (data);
//  console.log ('***');
  return db.ref(`/devices/${data.deviceId}`).set({
    humidity: data.humidity,
    temperature: data.temperature,
    lastTimestamp: data.timestamp
  });
}

/**
 * Store all the raw data in bigquery
 */
function insertIntoBigquery(data) {
  // TODO: Make sure you set the `bigquery.datasetname` Google Cloud environment variable.
  const dataset = bigquery.dataset(functions.config().bigquery.datasetname);
  // TODO: Make sure you set the `bigquery.tablename` Google Cloud environment variable.
  const table = dataset.table(functions.config().bigquery.tablename); 
  console.log ('BigQuery: '+ functions.config().bigquery.datasetname + ' table: ' + functions.config().bigquery.tablename  );
  console.log (data);
  return table.insert(data);
}

/**
 * Query bigquery with the last 7 days of data
 * HTTPS endpoint to be used by the webapp
 */
exports.getReportData = functions.https.onRequest((req, res) => {
  const table = '`oci-iot-ml.weather_station.raw_data`';

  const query = `
    SELECT 
      TIMESTAMP_TRUNC(data.timestamp, HOUR, 'America/Chicago') data_hora,
      avg(data.temperature) as avg_temp,
      avg(data.humidity) as avg_hum,
      min(data.temperature) as min_temp,
      max(data.temperature) as max_temp,
      min(data.humidity) as min_hum,
      max(data.humidity) as max_hum,
      count(*) as data_points      
    FROM ${table} data
    WHERE data.timestamp between timestamp_sub(current_timestamp, INTERVAL 7 DAY) and current_timestamp()
    group by data_hora
    order by data_hora
  `;

  console.log ('querying 7 days...');

  return bigquery
    .query({
      query: query,
      useLegacySql: false
    })
    .then(result => {
      const rows = result[0];
      console.log (rows);
      cors(req, res, () => {
        res.json(rows);
      });
    });
});

