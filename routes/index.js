var express = require('express');
var fs = require("fs");

var router = express.Router();
var app = express();

function scan_to_ubit(scan) {
    var splits = scan.split('^');
    if (splits.length < 3) {
        return [scan, scan, scan];
    }
    var person_number = splits[2];
    if (person_number.length < 23) {
        return [scan, scan, scan];
    }
    person_number = person_number.substring(14, 22);
    var name = person_number;
    var ubit = person_number;

    var fileContent = fs.readFileSync(__dirname + '/roster').toString()
    console.log(fileContent);
    var lines = fileContent.split('\n');
    for (var i in lines) {
        var line = lines[i];
        var values = line.split('\t');
        console.log(values);
        console.log(person_number);
        if(values[0] === person_number) {
            ubit = values[2];
            name = values[1];
        }
    }

    return [ubit, name, person_number];
}

/* GET home page. */
router.get('/', function (req, res) {

    //var ubit = "nothing";
    //var db = req.db;
    //var collection = db.get('stuff');
    //collection.find({}, {}, function (e, docs) {
    //    ubit = docs.toJSON();
    //});

    res.render('index', {
        title: 'Scan For Credit',
        last_user: ''
    });
});


router.post('/', function (req, res) {
    //res.redirect('/');

    var dir = __dirname;
    var filename = "/hackathon";

    var ubit = scan_to_ubit(req.body.scan);
    console.log(ubit);
    var name = ubit;
    if (ubit[0].length > 1) {
        name = ubit[1];
        ubit = ubit[0];
    }
    if (ubit != '') {
        fs.appendFile(dir + filename, '\n' + ubit);
    }
    res.render('index', {
        title: 'Scan For Credit',
        last_user: name
    });
});

module.exports = router;



