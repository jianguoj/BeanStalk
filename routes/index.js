var express = require('express');
var router = express.Router();

var greenBean = require("green-bean");

greenBean.connect("laundry", function (laundry) {
  laundry.remoteStart = laundry.erd({
    erd: 0x201E,
    endian: "big",
    format: "UInt8"
  });

  laundry.light = laundry.erd({
    erd: 0x2020,
    endian: "big",
    format: "UInt8"
  });

  // Turn on dryer light
  router.get('/dryerLightOn', function(req, res) {
    laundry.light.write(1);
  });

  // Turn off dryer light
  router.get('/dryerLightOff', function(req, res) {
    laundry.light.write(0);
  });
 
  // This will start the dryer
  router.get('/dryerStart', function(req, res) {
    laundry.remoteStart.write(1);
  });

/* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });

  router.get('/dryerStatus', function(req, res){
     laundry.machineStatus.read(function (value) {
        console.log("read:", value);
        var stat = "Idle";
	switch (value) {
 	   case 0:
        	stat = "Idle";
      		break;
    	   case 1:
        	stat = "Standby";
        	break;
     	   case 2:
        	stat = "Run";
        	break;
    	   case 3:
        	stat = "Pause";
        	break;
    	   case 4:
        	stat = "End of cycle";
        	break;
    	   case 5:
        	stat = "DSM delay run";
        	break;
    	   case 6:
        	stat = "Delay run";
        	break;
    	   case 7:
        	stat = "Delay pause";
        	break;
    	   case 8:
        	stat = "Drain timeout";
        	break;
    	   case 128:
        	stat = "Clean speak";
        	break;
	}	 
        res.send("Status is " + stat + ".");
     });
  });

});

module.exports = router;
