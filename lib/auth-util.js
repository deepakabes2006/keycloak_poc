var request = require('request');
const constant = require("../lib/constant");
const {sign,verify,test,decode} = require('../lib/pub-priv');
       

exports.getIssuerFromUsername = (username) => {
        var s = username.split("@"); 
        return constant.domainIssuerMap[s[1]]; 
    };
    exports.getRealmDetailFromJwt = (token) => {
        var st  =token.split(" "); 
        console.log(st[1] || st[0]); 
        var issuer =  decode(st[1] || st[0]).payload.iss;
        var realmDetail = constant.realms[issuer];
        realmDetail.issuer=issuer;
       return realmDetail; 
    };    
exports.validateCode= async (issuer,code,redirectURI)=>{
     
        var realmDetail = constant.realms[issuer];
    
  

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("client_id", realmDetail.clientId);
urlencoded.append("client_secret",realmDetail.clientSecret);
urlencoded.append("grant_type", "authorization_code");
urlencoded.append("code",code);
urlencoded.append("redirect_uri", redirectURI);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};
try{
var result = await fetch("http://localhost:8080//realms/s/protocol/openid-connect/token", requestOptions);
return await result.json();

 // .then(response => response.text())
 // .then(result => console.log(result))
 // .catch(error => console.log('error', error));

 
}catch( e ){
    throw e;
} 


    };

