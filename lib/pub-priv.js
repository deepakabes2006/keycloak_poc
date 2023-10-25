const fs   = require('fs');
const jwt   = require('jsonwebtoken');
const {X509Certificate} = require('crypto') 
module.exports = {

 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}