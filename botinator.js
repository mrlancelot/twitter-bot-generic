var Twit = require('twit');
const fs = require('fs');

console.log("Starting now twitter Bot");
var downloader = require('./downloader');
var editor = require('./editor');
var config = require('./config');
var T = new Twit(config);

let rawdata = fs.readFileSync('animals.json');
let test = JSON.parse(rawdata);

var stream = T.stream('statuses/filter', { track: '@team_brackets' })

stream.on('tweet', tweetEvent);
var i;
var selectAnimal;
var animal_quote;
var refLink;

function tweetEvent(eventMsg) {
    // console.log(JSON.stringify(eventMsg))
    var replyTo = eventMsg.in_reply_to_screen_name;
    var textOnly = eventMsg.text;
    var from = eventMsg.user.screen_name;

    console.log(replyTo + "---" + from)

    var callback = function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + " " + time
        console.log("Download succesful: " + dateTime);
        setTimeout(function () { editIt() }, 10000);
        if (replyTo == 'Team_Brackets') {
            createTweet(eventMsg.text);
            var newTweet = '@' + from + " " + animal_quote;
            setTimeout(function () { tweetIt(newTweet) }, 10000);
        }
    }

    function createTweet(msg) {
        console.log(msg);
        for (i = 0; i < test.animals.length; i++) {
            // console.log(test.animals[i].animal)
            var a = test.animals[i].animal
            if (msg.includes(a)) {
                selectAnimal = a;
                animal_quote = test.animals[i].statement;
                refLink = test.animals[i].refLink;
                break;
            } else {
                var n = Math.floor(Math.random() * Math.floor(17));
                selectAnimal = test.animals[n].animal;
                animal_quote = test.animals[n].statement;
                refLink = test.animals[n].refLink;
            }
        }
        console.log(selectAnimal + " " + animal_quote + " " + refLink)
    }

    function tweetWithoutMedia(textOnly) {
        createTweet(textOnly);
        var textOnlyTweet = '@' + from + " " + animal_quote;
        console.log(textOnlyTweet);
        var tweet = {
            status: textOnlyTweet
        }

        T.post('statuses/update', tweet, tweeted);

        function tweeted(err, data, response) {
            if (err) {
                console.log("something went wrong!" + err);
            } else {
                console.log("Its working!")
            }
        }
    }

    function editIt() {
        console.log("editing tweet");
        var name = "./images/download.jpg";
        var smallFile = refLink;
        var outputFile = "./images/output.jpg"
        editor.editImage(name, smallFile, outputFile);
    }

    if (eventMsg.entities.media == undefined) {
        console.log("text-only tweet");
        tweetWithoutMedia(textOnly);
    } else {
        var name = "./images/download.jpg";
        var downloadURI = eventMsg.entities.media[0].media_url;
        console.log(eventMsg.entities.media[0].media_url)
        reply = downloader.download(downloadURI, name, callback)
    }
}

function tweetIt(message) {
    var fileName = './images/output.jpg'
    var b64 = fs.readFileSync(fileName, { encoding: 'base64' })

    T.post('media/upload', { media_data: b64 }, uploaded);
    function uploaded(err, data, response) {
        var id = data.media_id_string;

        var tweet = {
            status: message,
            media_ids: [id]
        }

        T.post('statuses/update', tweet, tweeted);

        function tweeted(err, data, response) {
            if (err) {
                console.log("something went wrong!" + err);
            } else {
                console.log("Its working!")
            }
        }
    }
}