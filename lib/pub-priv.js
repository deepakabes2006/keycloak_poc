const fs   = require('fs');
const jwt   = require('jsonwebtoken');
const {X509Certificate} = require('crypto') 

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = fs.readFileSync('/Users/deepak/Downloads/private_key.pem', 'utf8');
//var publicKEY  = fs.readFileSync('./public.key', 'utf8'); 
var publicKey ="MIICmzCCAYMCBgGLPZDB4DANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZkZWVwYWswHhcNMjMxMDE3MTIxNDM4WhcNMzMxMDE3MTIxNjE4WjARMQ8wDQYDVQQDDAZkZWVwYWswggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQChBlwF2YR07jzJ25qc5Y1sGHW0or3xDQC98UMpYPgevRV0pLMnjUZozPz2LhWl+mmpKhCzfJoK4IA+4880k+rXeM7PqGVTw9QalYc7poSdoaN1gB5C7F7i6KvQsENeGGWAb/LjHS5zG4+znQ/ETC5V8OrGCEaocnhcL5kTPH3Jbyvei73AqHPwTMI/g2bOeqjkxuYSRTb7sN9piwbX0Y8Y6EvRgRXqt9MeEWjIItsMQJnSv1YviVguM71dU0eJqrEPHTae2nBB4NBCnQn41rar0KnYelyBHrg/T2NtjDu07h479PjLMusyNBgeWY321t/uE39hAO46AtrUvKeWutyNAgMBAAEwDQYJKoZIhvcNAQELBQADggEBABjoiGJ4UKY2jFLZKgo+oLoJEwfUR1N2XxRGJZiD5+5botMvIguck0+h/9ECTfHQELCJ97GrdVSrPKNPTXNY/y5Invo1HFgAH0W+PSOheiCPq/+1lIzSnEI/N3rZb1BVMdIIjc3ywzSYWe8/XcSK0JQNY9o82oFPc7jt3LdwkuCnIXcPlSIHNJv/ZZfxBO8MiVD4MYbTec/UgalWHYvi/b2SFuEBbDxTO9t+MwWmvC/W+rH5C1t8H5DDziD7DiboYj+rREAkV6peoBXe8E2OsSKwUBsov/w4cooWhz9bcp+sdnmmkO8vbm+yJ6J3vfHrrgVfksru0DDWESDsKsTyKtE="; 
module.exports = {
  test:()=>{
  
// Importing fs module 
const fs = require('fs') 
  
// getting object of a PEM encoded X509 Certificate.  
const x509 = new X509Certificate(fs.readFileSync('/Users/deepak/Downloads/my.pem')); 
  
// getting subject included in this certificate. 
// by using x509.subject function 
const value = x509.subject 
  
// display the result 
console.log("subject :- " + value)
  },
 sign: (payload) => {
  
   $Options = {
    issuer: "Authorizaxtion/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }
  
  // Token signing options
  var signOptions = {
      issuer:  $Options.issuer,
      subject:  $Options.subject,
      audience:  $Options.audience,
      expiresIn:  "30d",    // 30 days validity
      algorithm:  "RS256"    
  };
  return jwt.sign(payload, privateKEY, signOptions);
},
verify: (token, $Option) => {
  
   $Option = {
    issuer: "Authorization/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }  
  
 var verifyOptions = {
      issuer:  $Option.issuer,
      subject:  $Option.subject,
      audience:  $Option.audience,
      expiresIn:  "30d",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}