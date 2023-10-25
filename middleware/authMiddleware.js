const {promisify} = require('node:util');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
var request = require('request');
const constant = require("../lib/constant");
const e = require('express');
const getKey = (jwksUri) => (header, callback) => {
  const client = jwksClient({jwksUri});
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    callback(null, key.publicKey || key.rsaPublicKey);
  });
};

/**
 * Verify an OpenID Connect ID Token
 * @param {string} token - The JWT Token to verify
 */
const verify = async token => {
  const {iss: issuer} = jwt.decode(token);
  const jwksUri = await fetchJwksUri(issuer);
  return promisify(jwt.verify)(token, getKey(jwksUri));
};

const allowedIssuers = [
    'https://login.microsoftonline.com/common/v2.0',
    'https://sandrino.auth0.com',
    'http://localhost:8080/realms/s'
  ];
  
  const fetchJwksUri = async (issuer) => {
    if (!allowedIssuers.includes(issuer)) {
      throw new Error(`The issuer ${issuer} is not trusted here!`);
    }
    const response = await fetch(`${issuer}/.well-known/openid-configuration`);
    const {jwks_uri} = await response.json();
    return jwks_uri;
  };

  const getClientDetail = async (issuer) => {
    let isValid = true;
    if (!isValid) {
        throw new Error(`The issuer ${issuer} is not trusted here!`);
      }

    //TODO get client details from db and check
    return constant.realms[issuer];
}

exports.authMiddlewareOnline = async function(req, res, next){
    
   
    var token = req.headers.authorization;
    if(!token){
        res.status(400)
        res.end('Access Token Missing')
        return; 
    }
    var sp = token.split(' ')
    token = sp[1] || sp[0];
    const {iss: issuer} = jwt.decode(token);
    const {clientId,clientSecret} = await getClientDetail(issuer);

    var options = {
      'method': 'POST',
      'url': issuer+'/protocol/openid-connect/token/introspect',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'client_id': clientId,
        'client_secret': clientSecret,
        'token':token 
      }
    };
    request(options, function (error, response) {
      if (error){
        res.status(403)
        res.end('Access denied')
        return;
      }
      var resjson =JSON.parse(response.body);

      if(resjson.active == false){
        res.status(401)
        res.end('Token is expired')
        return; 
      }
      //console.log(response.body.active)
      console.log(response.body);
      next ()
    });
}
  
exports.authMiddlewareForClient = async function(req, res, next){
  var token = req.headers.authorization;
  if(!token){
    res.status(400);
    res.send('Token is missing');  return;
  }
  var st  =token.split(" "); 
  //console.log(st[1] || st[0]); 
  token =  st[1] || st[0];
  try{
    var detail =await verify(token);
    console.log(detail);
  }catch(e){
    res.status(401);
    res.send('invalid client token'); return;
  }
  var scopes =  detail.scope.split(" ");

  if(!(scopes.indexOf(constant.serviceName)>= 0)) {

    res.status(401);
    res.send('invalid scope');
    return;
  }
    next()
}  
  exports.verify=verify; 