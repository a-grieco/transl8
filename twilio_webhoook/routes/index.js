var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/twilioReceive', function(req, res, next) {
  for(var i in req.query) {
    console.log(`${i} -> ${req.query[i]}`)
  }
  // req.query.forEach(function(str) {
  //   console.log(str);
  // });
  // ToCountry=US&
  // ToState=WA&
  // SmsMessageSid=SM5e3727f68954bcb5e1df97fbbbce7c62&
  // NumMedia=0&
  // ToCity=SEATTLE&
  // FromZip=98154&
  // SmsSid=SM5e3727f68954bcb5e1df97fbbbce7c62&FromState=WA&
  // SmsStatus=received&
  // FromCity=SEATTLE&
  // Body=Disks&
  // FromCountry=US&
  // To=%2B12062586142&
  // ToZip=98105&
  // NumSegments=1&
  // MessageSid=SM5e3727f68954bcb5e1df97fbbbce7c62&
  // AccountSid=AC2736ca7643742f8cfd9c4c85c1abed8b&
  // From=%2B12066614527&
  // ApiVersion=2010-04-01
  
  res.setHeader('Content-Type', 'application/xml');
  // res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Message> I am going to translate '+req.query.Body+' for you.</Message></Response>');
  next();
},
function(req, res){
  var textBody = req.query.Body;
  var formdata = respond(textBody);
  console.log(formdata);


  if (typeof(formdata) === "object") {
     request.post({url : 'https://translate.yandex.net/api/v1.5/tr.json/translate', form: formdata}, function(err, httpResponse, body){
      if (httpResponse.statusCode == 200) {
        var info = JSON.parse(body);
        res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>'+ info.text+'</Message></Response>');
      }
    });   
   } else {
     res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>'+ formdata +'</Message></Response>');
   }

}
);

module.exports = router;
 


//takes body of text message, if it matches required regex will send to yandex, else will respond with reprompt. 
function respond(incomingText){
  var userText = incomingText;
  var langCodes = ['ar','en','es','fr','ro','ru','tl','vi','zh'];
  var langRequested = /^\d\s\w/g.test(userText);
  var langDirRequested = /([0-8]>[0-8])\s/g.test(userText);

  var fromLang = '';
  var toLang = '';
  var untransTxt = '';
  var formdata = {
    key:'',
    text: '',
    lang: ''
    }
  //if language requested, get numbers from matching positions, map to language code. 
  if(langDirRequested){
    fromLang = langCodes[parseInt(userText[0])];
    toLang = langCodes[parseInt(userText[2])];

    formdata['text'] = userText.substring(4);
    formdata['lang'] = fromLang + '-' + toLang;
  
  console.log(formdata);
  return formdata;

  } else if (langRequested) { //else if only a 'to' language requested, default 'from' direction = english.  
    fromLang = 'en';
    toLang = langCodes[parseInt(userText[0])];
    untransTxt = userText.substring(2);

    formdata['text'] = untransTxt;
    formdata['lang'] = fromLang + '-' + toLang;

    console.log(formdata);
    return formdata;

  } else if(userText == "???"){ //help retuquest
      return "Text the number that matches the language you want, followed by the text to translate. EX: 1 Hello! --> Hola! For more options, text ***."
  } else if(userText == "***") {
      return "Use the > for more control. Format: [FROM]>[TO] Text. EX: 1>0 Hola! --> Hello! // 1>2 Hola --> 你好!";
  } else { //invalid translation request format
    return "Options: 0:Arabic 1:English 2:Español 3:Francais 4:Rumanian 5:Pусский язык 6:Telegu 7:Người việt nam 8:中文 ???:Help. Powered by Yandex.";
  }
} //end respond