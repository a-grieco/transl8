# transl8
SMS translation service that doesn't rely on smart phones. 

## With node.js
cd twilio_webhook && npm install

npm start 

## With Docker
cd twilio_webhook && docker build --tag twilio .

docker run --name twilio -d -p 3000:3000 twilio

## Twilio Endpoint
http://\<hostname>:3000/twilioReceive