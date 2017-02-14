var express = require('express');
var fs = require("fs");

var router = express.Router();
var app = express();

// This function is gross.. but it works
function scan_to_ubit(scan) {
    var splits = scan.split('^');
    var person_number = "";
    if (splits.length < 3) {
        person_number = scan;
    }else {
        var person_number = splits[2];
        if (person_number.length < 23) {
            return [scan, scan, scan];
        }
        person_number = person_number.substring(14, 22);
    }
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
        if (values[0] === person_number) {
            ubit = values[2];
            name = values[1];
            break;
        }
    }

    return [ubit, name, person_number];
}

//router.get('/stuff', function (req, res) {
//
//    var db = req.db;
//    var collection = db.get('cse115lab');
//    collection.find({}, {}, function (e, docs) {
//        res.render('stuff', {
//            "stuff": docs
//        });
//    });
//});

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index', {
        title: 'Scan For Credit',
        last_user: '',
        last_scan: 'attended'
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

    if (req.body.hasOwnProperty("scan")) {
        var points = 'none';
        if (req.body.hasOwnProperty("points")){
            var points = req.body.points;
        }
        var notes = 'none';
        if (req.body.hasOwnProperty("notes")){
            var notes = req.body.notes;
        }
        if (req.body.hasOwnProperty("assignment")){
            var assignment = req.body.assignment;
        }
        var ubit = scan_to_ubit(req.body.scan);
        if (ubit[0].length > 1) {
            name = ubit[1];
            ubit = ubit[0];
        }
        if (ubit != '') {
            //fs.appendFile(dir + filename, '\n' + ubit);
            var db = req.db;
            var collection = db.get('cse115lab');
            collection.insert({
                "ubit": ubit,
                "points":points,
                "notes":notes,
                "time": Date.now(),
                "ip": req.ip,
                "assignment":assignment
            });
        }

    }
    res.render('index', {
        title: 'Scan For Credit',
        last_user: name,
        last_scan: points
    });
});



//router.post('/', function (req, res) {
//    //res.redirect('/');
//
//    var dir = __dirname;
//    var filename = "/hackathon";
//
//    var ubit = scan_to_ubit(req.body.scan);
//    console.log(ubit);
//    var name = ubit;
//    if (ubit[0].length > 1) {
//        name = ubit[1];
//        ubit = ubit[0];
//    }
//    if (ubit != '') {
//        fs.appendFile(dir + filename, '\n' + ubit);
//    }
//    res.render('index', {
//        title: 'Scan For Credit',
//        last_user: name
//    });
//});


//router.get('//listQuizzes', function (req, res, next) {
//    var db = req.db;
//    var collection = db.get('quizapi');
//    collection.find({}, {"quiz_name": 1, "_id": 0, "questions": 0}, function (e, docs) {
//        var quizzes = [];
//        for (var i in docs) {
//            quizzes.push(docs[i].quiz_name);
//        }
//        res.send(quizzes);
//    });
//});
//
//
//router.get('//getQuiz', function (req, res, next) {
//    if (req.query.hasOwnProperty('quiz')) {
//        var db = req.db;
//        var collection = db.get('quizapi');
//        collection.find({"quiz_name": req.query.quiz}, {"_id": 0}, function (e, docs) {
//            res.send(docs);
//        });
//    } else {
//        res.end("Invalid Request: url must be in the form /getQuiz?quiz=quizName. To get a list of valid quizNames use /listQuizzes");
//    }
//});
//
//
//// POST requests
//
//router.post('//addQuiz', function (req, res, next) {
//    if (req.body.hasOwnProperty("quiz_name")) {
//        var quiz_name = req.body.quiz_name;
//        var db = req.db;
//        var collection = db.get('quizapi');
//        // TODO: Check if quiz exists
//        collection.insert({
//            "quiz_name": quiz_name,
//            "questions": []
//        });
//        res.end("Success");
//    } else {
//        res.end("Invalid Request: Send a JSON string with a variable called 'quiz_name' containing the name of your " +
//            "quiz. ex: {'quiz_name':'CSE191_midterm'}");
//    }
//});
//
//router.post('//addQuestion', function (req, res, next) {
//    if (req.body.hasOwnProperty("question") && req.body.hasOwnProperty("quiz")) {
//        var question = req.body.question;
//        var quiz_name = req.body.quiz;
//        var db = req.db;
//        var collection = db.get('quizapi');
//        collection.update({"quiz_name": quiz_name}, {$push: {"questions": question}});
//        // TODO: Check if quiz exists
//        // TODO: Check if question is properly formatted? Might leave this up to an exception handling lesson when parsing quizzes
//    } else {
//        res.end("Invalid Request: Send a JSON string with a variable called 'question' containing all the details" +
//            " of the question to add and a variable called 'quiz' containing the name of the quiz to modify");
//    }
//});


module.exports = router;



