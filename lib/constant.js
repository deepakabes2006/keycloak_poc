exports.realms= {
    "http://localhost:8080/realms/s":{clientId:"deepak",clientSecret:"ATJxqUpci56MszE81CHNlX6LRzwfVySd"},
    "http://localhost:8080/realms/heroes":{clientId:"deepak",clientSecret:"Kquy4C7HLNr0vX8Lea0cgdx1HffnpPEK"}
    };
exports.domainIssuerMap = {
        'gmail.com' :  {issuer:"http://localhost:8080/realms/s" , clientId:"deepak",clientSecret:"ATJxqUpci56MszE81CHNlX6LRzwfVySd"},
        'gmail1.com':  {issuer: "http://localhost:8080/realms/heroes", clientId:"deepak",clientSecret:"Kquy4C7HLNr0vX8Lea0cgdx1HffnpPEK"} 
    }
exports.serviceName = "service2";        