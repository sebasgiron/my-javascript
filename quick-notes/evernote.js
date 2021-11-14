// Leer configuración
const CONFIG_FILE_PATH = './config.json'; 

const fs = require('fs'); 

// Objeto config
var config; 

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

exports.saveConfig = function(path = CONFIG_FILE_PATH) {
	rawData = JSON.stringify(config); 
	console.log('saveConfig en ' + path); 
	return fs.writeFileSync(path, rawData); 
}

function readConfig(path = CONFIG_FILE_PATH) {
	rawData = fs.readFileSync(path); 
	console.log('readConfig de ' + path); 
	return JSON.parse(rawData); 
}

exports.getConfigHTML = function() {
	return(
	'<table>'+
	'<tr><td>Propiedad</td><td>Valor</td></tr>' + 
	'<tr><td>API_CONSUMER_KEY</td><td>' + config.API_CONSUMER_KEY + '</td></tr>' + 
	'<tr><td>SANDBOX</td><td>' + config.SANDBOX + '</td></tr>' + 
	'<tr><td>OAUTH_TOKEN</td><td>' + config.OAUTH_TOKEN + '</td></tr>' + 
	'</table>'	
	); 
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
			// el access token lo guardas tb en el objeto config
			config.OAUTH_TOKEN = oauthAccessToken; 
			config.URL_NOTE_STORE = results.edam_noteStoreUrl; 
			redirect(res, endUrl);
		  }
  });
};

// Página Prueba 
exports.paginaPrueba = function(res) {
	var client = new Evernote.Client({token: config.OAUTH_TOKEN});
	var noteStore = client.getNoteStore();
	noteStore.listNotebooks().then(function(notebooks) {
	  // notebooks is the list of Notebook objects
	  for(i=0; i<notebooks.length; i++) {
		  nb = notebooks[i]; 
		  console.log(nb);
	  }
	  
	  res.writeHead(200, {'Content-Type' : 'text/html'});
	  res.end(
	  '<html><head></head>' + 
	  '<body>' + notebooks.length + '</body>'); 
	});	
}


config = readConfig(); 
