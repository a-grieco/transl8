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
  var textotrans = req.query.Body;

  var formdata = {
    key:'',
    text: textotrans,
    lang: 'en-es'
  };

  request.post({url : 'https://translate.yandex.net/api/v1.5/tr.json/translate', form: formdata}, function(err, httpResponse, body){
    var info = JSON.parse(body);
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Message> translation: '+info.text+'</Message></Response>');
  });
}
);

module.exports = router;
