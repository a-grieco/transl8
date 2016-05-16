/* First attempt at merging tropo scripts with yandex post req*/


/*TODO:
	- Escape special chars from user input before sending post request. 
	- Allow more than one "from" languages for translation (i.e. not just english).
*/
// get user's initial text input
var userText = currentCall.initialText;
userText = userText.trim(); 

// check for valid input (<int 1-5> <string>)
if(userText.length() > 1 && /[a-z]/i.test(userText)){
	var langNum = userText.charAt(0);
	var untransTxt = userText.substring(1);
	var entryValid = 1;
	// language number must be 1-5 & user text contains letter(s)
	// get langNum's corresponding language code
	var langCode;
	switch(langNum){
		case 49:
			langCode = "es";
			break;
		case 50:
			langCode = "zh";
			break;
		case 51:
			langCode = "ar";
			break;
		case 52:
			langCode = "vi";
			break;
		case 53:
			langCode = "ja";
			break;
		default:
			entryValid = 0;							
	}
	if(entryValid){
		// pass the langCpode & untransTxt to translator
		
		//callback function to send response text
    	var reply = function(transTxt, untransTxt){
    		if(transTxt.localeCompare(untransTxt)){	
    			// translation failed
    			say("No translation found for '" + transTxt + "'");
    		}
    		else{	
    			// translation succeeded
    			say(transTxt + " from " + langCode + " " + untransTxt);
    		}
    	}

    	//translation function to communicate with translation api (yandex).
	    function translate(replyfn, untransTxt, lang){
			var http = new XMLHttpRequest();
			http.addEventListener('success', reqListener);
			
			//listen for response from translator
			function reqListener(){
				resp = JSON.parse(this.responseText);
				resp = resp['text'][0];
				replyfn(resp,untransTxt);
			}

			//create url
			var inputText = untransTxt;
			var dir = 'en-' + lang;
			var yandexKey = '[key goes here]';
			var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + yandexKey +"&text=" + inputText + "&lang=" + dir;
			
			//send post req
			http.open("POST", url, true);
			http.send();
		}

		//call translation function
		translate(reply,untransTxt,langCode);
	}
	else{
		say("Translate from English to...\n1 Espanol/" +
			"Spanish\n2 Zhongwen/Chinese\n3 Alearabia/Arabic" +
			"\n4 Tieng Viet/Vietnamese\n5 Nihongo/Japanese\n" +
			"Example: 1 Hello");
	}
}
else {
	say("Translate from English to...\n1 Espanol/" +
		"Spanish\n2 Zhongwen/Chinese\n3 Alearabia/Arabic" +
		"\n4 Tieng Viet/Vietnamese\n5 Nihongo/Japanese\n" +
		"Example: 1 Hello");
}


