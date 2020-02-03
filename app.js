import noble from "@s524797336/noble-mac";
import async from "async";
import express from "express";
import bodyParser from "body-parser";
import template from "./templates/main";

const app = express();
const TIMEFLIP = 'ffff544676332e3100';
const FACETS = 'f1196f5071a411e6bdf40800200c9a66';
const ACCELEROMETER = 'f1196f5171a411e6bdf40800200c9a66';
const DEVICE = '180a';
const BATTERY = '180f';
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send(template)
});

const connect = function (peripheral) {
  peripheral.connect(function (error) {
      peripheral.discoverServices([], function (error, services) {
        services.forEach(service => {
          if (service.uuid === FACETS) {
            console.log(service._noble._characteristics[FACETS]);
            // console.log(service._noble._events.stateChange);
          }
        });
      });
  });
};

const discover = function (peripheral) {
    if (peripheral.advertisement.manufacturerData) {
        if (peripheral.advertisement.manufacturerData.toString('hex') == TIMEFLIP) {
            // console.log('\there is my manufacturer data:');
            // console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
            console.log(peripheral.id +
                ' with address <' + peripheral.address + ', ' + peripheral.addressType + '>,' +
                ' connectable ' + peripheral.connectable + ',' +
                ' RSSI ' + peripheral.rssi + ':');
            // if (peripheral.advertisement.txPowerLevel !== undefined) {
            //     console.log('\tmy TX power level is:');
            //     console.log('\t\t' + peripheral.advertisement.txPowerLevel);
            // }
            connect(peripheral);
        }
    }

};

app.listen(3020, function () {
    console.log('Timeflip listening on port 3020');
  noble.on('stateChange', function (state) {
      console.log('------------------------ state change ------------------------');
        if (state === 'poweredOn') {
            noble.startScanning([], true);
        } else {
            noble.stopScanning();
        }
    });
    noble.on('discover', discover);
});