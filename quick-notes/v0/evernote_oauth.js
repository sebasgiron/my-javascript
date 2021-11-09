//import * as OAuth from './jsOAuth-1.3.7.min.js'; 
//const OAuth = require(); 

const evernote_oauth = {
	consumerKey : 'sebasgiron',
	consumerSecret : '6964b2dbd75e52e4',
	evernoteHostName : 'https://sandbox.evernote.com'
}; 


function loginWithEvernote() {
    options = {
        consumerKey: evernote_oauth.consumerKey,
        consumerSecret: evernote_oauth.consumerSecret,
        callbackUrl : "gotOAuth.html", // this filename doesn't matter in this example
        signatureMethod : "HMAC-SHA1",
    };
	console.log('Llamada a OAuth'); 
    oauth = OAuth(options);
    // OAuth Step 1: Get request token
	console.log('Llamada a OAuth.request'); 
    oauth.request({
		'method': 'GET', 
		'url': evernote_oauth.evernoteHostName + '/oauth', 
		'success': evernote_success, 
		'failure': evernote_failure,
		'headers': [
			'Access-Control-Allow-Origin: *',
			'Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'
		]
	});
}

function evernote_success() {
	console.log('evernote_success() que pasa gente'); 
}

function evernote_failure() {
	console.log('evernote_failure() que pasa gente'); 
}