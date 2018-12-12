var settings = {
    mqtt: {
        host: process.env.MQTT_HOST || '',
        user: process.env.MQTT_USER || '',
        password: process.env.MQTT_PASS || '',
        clientId: process.env.MQTT_CLIENT_ID || null
    },
    keepalive: {
        topic: process.env.KEEP_ALIVE_TOPIC || 'keep_alive',
        message: process.env.KEEP_ALIVE_MESSAGE || 'keep_alive'
    },
    debug: process.env.DEBUG_MODE || false,
    auth_key: process.env.AUTH_KEY || '',
    http_port: process.env.PORT || 5000
}

var mqtt = require('mqtt');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();


var mqttClient =  mqtt.connect(process.env.CLOUDMQTT_URL);

mqttClient.on('connect', function () {
  mqttClient.subscribe('/post/');
});

mqttClient.on('message', function (t, m) {
    console.log(m.toString())
});

app.set('port', settings.http_port);
app.use(bodyParser.json());

app.post('/post/', function (req, res) {
    mqttClient.publish(req.body['topic'], req.body['message']);
    console.log(req.body['topic'])
    console.log(req.body['message'])
    console.log("Info has been posted!")
    res.sendStatus(200);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
