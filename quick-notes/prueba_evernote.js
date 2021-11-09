// Leer configuración
var config = require('./config.json'); 

var Evernote = require('evernote'); 

// Página Oauth
exports.oauth = function(req, res, oauthCallbackUrl, session) {

  // Defines cliente evernote
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });
  
  console.log('**session:'); 
  console.log(session); 
  
  // Llamas a getRequestToken
  client.getRequestToken(oauthCallbackUrl, 
	// Función de callback
	function(error, oauthToken, oauthTokenSecret, results) {
		if (error) {
		session.error = JSON.stringify(error);
		res.redirect('/');
		} else {
		// store the tokens in the session
		session.oauthToken = oauthToken;
		session.oauthTokenSecret = oauthTokenSecret;
		// redirect the user to authorize the token
		res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });
};

// OAuth callback
exports.oauth_callback = function(req, res) {
	  // Defines cliente evernote
	  var client = new Evernote.Client({
		consumerKey: config.API_CONSUMER_KEY,
		consumerSecret: config.API_CONSUMER_SECRET,
		sandbox: config.SANDBOX,
		china: config.CHINA
	  });
	  // Llamas a getAccessToken
	  client.getAccessToken(
		req.session.oauthToken, 
		req.session.oauthTokenSecret, 
		req.query.oauth_verifier,
		function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
		  if (error) {
			console.log('error');
			console.log(error);
			res.redirect('/');
		  } else {
			// store the access token in the session
			req.session.oauthAccessToken = oauthAccessToken;
			req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
			req.session.edamShard = results.edam_shard;
			req.session.edamUserId = results.edam_userId;
			req.session.edamExpires = results.edam_expires;
			req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
			req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
			res.redirect('/');
		  }
  });
};