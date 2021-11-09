// Leer configuración
var config = require('./config.json'); 
// Objeto Evernote
var Evernote = require('evernote'); 

/* Funciones auxiliares de URLs y otras ************************************ */
const urlJS = require('url'); 

function redirect(res, url) {
	// Simplemente implementa una redirección HTML 302 
	res.writeHead(302, {'Location' : url});
	res.end(); 
}

function getQueryItem(req, item) {
	// Obtener los parámetros de la URL del request
	var searchParams = 
		new urlJS.URLSearchParams(urlJS.parse(req.url).query); 
	// Devolver el item solicitado
	return searchParams.get(item); 
}

// Página OAuth ************************************************************ */
exports.oauth = function(req, res, oauthCallbackUrl, session) {

  // Defines cliente evernote
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });
   
  // Llamas a getRequestToken
  client.getRequestToken(oauthCallbackUrl, 
	// Función de callback
	function(error, oauthToken, oauthTokenSecret, results) {
		if (error) {
		session.error = JSON.stringify(error);
		// Está mal que la url esté hardcodeada así, lo sé
		redirect(res, 'localhost:8081/');
		} else {
		// store the tokens in the session
		session.oauthToken = oauthToken;
		session.oauthTokenSecret = oauthTokenSecret;
		// redirect the user to authorize the token
		redirect(res, client.getAuthorizeUrl(oauthToken));
    }
  });
};

// Página OAuth Callback *************************************************** */
exports.oauth_callback = function(req, res, endUrl, session) {
	  // Defines cliente evernote
	  var client = new Evernote.Client({
		consumerKey: config.API_CONSUMER_KEY,
		consumerSecret: config.API_CONSUMER_SECRET,
		sandbox: config.SANDBOX,
		china: config.CHINA
	  });
	  // Llamas a getAccessToken
	  client.getAccessToken(
		session.oauthToken, 
		session.oauthTokenSecret, 
		getQueryItem(req, 'oauth_verifier'),		
		function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
		  if (error) {
			console.log('error');
			console.log(error);
			// Está mal que la url esté hardcodeada así, lo sé
			redirect(res, 'localhost:8081/');
		  } else {
			// store the access token in the session
			session.oauthAccessToken = oauthAccessToken;
			session.oauthAccessTokenSecret = oauthAccessTokenSecret;
			session.edamShard = results.edam_shard;
			session.edamUserId = results.edam_userId;
			session.edamExpires = results.edam_expires;
			session.edamNoteStoreUrl = results.edam_noteStoreUrl;
			edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;			
			redirect(res, endUrl);
		  }
  });
};