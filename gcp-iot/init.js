load('api_config.js');
load('api_dht.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_events.js');
load('api_gpio.js');
load('api_sys.js');
load('api_net.js');

// This file is designed to work with a NodeMCU 
// Connect GPIO 5 to the LED Driver. 
// Connect GPIO 4 to the Temp/Humidity sensor output.  

let topic = '/devices/' + Cfg.get('device.id') + '/events';
let dht = DHT.create(4, DHT.DHT22);
let redLed = 5;
let isConnected = false;
let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
print('LED GPIO:', led, 'button GPIO:', button);
// Blink built-in LED every second
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
GPIO.set_mode(redLed, GPIO.MODE_OUTPUT);
GPIO.write (redLed,0);    // Turn off the Red Led.


Timer.set(5000, true, function() {
  let payload = { t: dht.getTemp(), h: dht.getHumidity() };
  let tempF = payload.t * 9/5 + 32.0;
  print ('Temperature: ' + JSON.stringify(tempF) + ' F');
  let msg = JSON.stringify(payload);
  let ok = MQTT.pub(topic, msg, 1);
  print(ok, msg);
}, null);


let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram(),
    free_ram: Sys.free_ram()
  });
};

Timer.set(1000 /* 1 sec */, Timer.REPEAT, function() {
  let value = GPIO.toggle(led);
  // print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), getInfo());
}, null);

// Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
  let message = getInfo();
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok, topic, '->', message);
}, null);

// Monitor network connectivity.
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);


MQTT.setEventHandler(function(conn, ev) {
  if (ev === MQTT.EV_CONNACK) {
    print('CONNECTED to GCP');
    isConnected = true;
    GPIO.write(redLed,1);
  }
}, null);
