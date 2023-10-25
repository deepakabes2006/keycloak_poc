//const Keycloak = require('keycloak-connect');
const express = require('express');
//const Keycloak = require('keycloak-connect');
const session = require('express-session');
const {authMiddlewareOnline,verify,authMiddlewareForClient} =require ('./middleware/authMiddleware') 
const app = express();
const KeycloakMultirealm = require('keycloak-connect-multirealm');
const authUtil = require('./lib/auth-util');
const constant = require("./lib/constant");

var serviceUrl="http://localhost:3000"

var memoryStore = new session.MemoryStore();                       

const config = {};
 
const keycloakConfig = {
  'auth-server-url': 'http://localhost:8080/',
  'bearer-only': true,
  'ssl-required': 'external',
  'resource': 'deepak1',
};
 
// Instantiate the class just as the official module. If no keycloakConfig
// is provided, it will read the configuration from keycloak.json file.
 
const keycloak = new KeycloakMultirealm(config, keycloakConfig);

//session                       
app.use(session({
    secret:'BeALongSecret',                         
    resave: false,                         
    saveUninitialized: true,                         
    store: memoryStore                       
}));

app.use(keycloak.middleware(
  {
    //logout: '/logout',
    //admin: '/',
    ///protected: '/protected/resource'
  }

));


app.get('/ep1', keycloak.protect(), (req, res) => {
  res.send('This is a protected route with offline auth');
});

app.get('/ep2',keycloak.protect(),authMiddlewareOnline, (req, res) => {
  res.send('This is a protected route with online auth');
});


app.get('/login', (req, res) => {
  var username = req.query.username;
  
  var issuerDetail = authUtil.getIssuerFromUsername(username);
  var url = issuerDetail.issuer+"/protocol/openid-connect/auth?client_id="+issuerDetail.clientId+"&response_type=code&redirect_uri="+serviceUrl+'/decode-code?issuer='+issuerDetail.issuer;
  res.redirect(301, url);
});
app.get('/decode-code/', async (req, res) => {
  var issuer = req.query.issuer;
  var code = req.query.code;
  var out = await authUtil.validateCode(issuer,code,serviceUrl+'/decode-code?issuer='+issuer);
  console.log(out);
  res.json(out);
});
app.get('/decode-code/:issuer', async (req, res) => {
  issuer = decodeURI(issuer);
  var code = req.query.code;
  var out = await authUtil.validateCode(issuer,code,serviceUrl+'/decode-code?issuer='+issuer);
  console.log(out);
  res.json(out);
});

app.post('/logout_back',(req, res) => {
 res.send('This is a public route1');
});

app.get('/logout_back',(req, res) => {

  res.send('This logout_back');
 });

 app.get('/logout1',keycloak.protect(), async (req, res) => {
  console.log("s");
  var token = req.headers.authorization;

  var realmDetail = authUtil.getRealmDetailFromJwt(token);
  
  var url= realmDetail.issuer+"/protocol/openid-connect/logout?post_logout_redirect_uri=http://localhost:3000/logout_back&client_id="+realmDetail.clientId;
  res.json({url});
 });

 app.get('/change-password',keycloak.protect(),(req, res) => {
  console.log("s");
  var token = req.headers.authorization;

  var realmDetail = authUtil.getRealmDetailFromJwt(token); 
  
  var url= realmDetail.issuer+"/protocol/openid-connect/auth?client_id="+realmDetail.clientId+"&redirect_uri=http://localhost:3000/pass_update&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD"
  res.json({url}); 
 });

 app.get('/forgot-password',(req, res) => {
  var username = req.query.username;
  
  var issuerDetail = authUtil.getIssuerFromUsername(username);
  var url= issuerDetail.issuer+"/login-actions/reset-credentials?client_id="+issuerDetail.clientId+"&redirect_uri="+serviceUrl+'/decode-code/'+encodeURI(issuerDetail.issuer);
  
  res.redirect(301, url);
 });

 app.get('/forgot_password_update',(req, res) => {

  console.log("forgot_password_update"); 
  res.send('This is a public route3');

 });
 app.get('/pass_update',(req, res) => {

  console.log("pass_update"); 
  res.send('pass_update function');

 });
 
app.get('/verify-client-jwt',authMiddlewareForClient, async (req, res) => {
  
 
  console.log("verify-client-jwt"); 
  res.end("verify-client-jwt");
 }

)
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

