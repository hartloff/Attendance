var express = require('express');
var fs = require("fs");
var router = express.Router();
var app = express();

function scan_to_ubit(scan){
  var person_number = 2;

  return 'error';
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Scan For Credit', last_user: 'ubit', image_url:'http://imgs.xkcd.com/comics/old_days_2x.png' });
});

router.post('/', function(req, res) {
  //res.redirect('/');

  var dir = __dirname;
  var filename = "/hackathon";
  var the_response = 'error';

  var ubit = scan_to_ubit(req.body.scan);
  if(ubit == "error"){
    ubit = req.body.scan;
  }


  fs.appendFile(dir + filename, '\n' + ubit);

  res.render('index', { title: 'Scan For Credit', last_user: ubit, image_url:'http://imgs.xkcd.com/comics/old_days_2x.png' });
});

module.exports = router;



