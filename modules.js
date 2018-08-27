const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets");

module.exports.getToken = function getToken() {
    return new Promise((resolve, reject) => {
        let options = {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                Authorization:
                    "Basic " +
                    new Buffer(consumerKey + ":" + consumerSecret).toString(
                        "base64"
                    ),
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };

        let cb = function(response) {
            var str = "";
            if (response.statusCode != 200) {
                console.log(response.statusCode);
                reject(response);

                //reject
            }

            //get chunk of data for bearer token from twitter
            response.on("data", function(chunk) {
                str += chunk;
            });

            //parse response from twitter and add to callback to be used when triggered
            response.on("end", function() {
                //resolve
                str = JSON.parse(str);
                // console.log("bearerToken", str);
                resolve(str.access_token);
                // callback(null, str.access_token);
            });
        };

        const req = https.request(options, cb);
        req.write("grant_type=client_credentials"); //twitter expects the info to be passed with this as the body

        req.end();
    });
};

module.exports.getTweets = function getTweets(bearerToken) {
    return new Promise((resolve, reject) => {
        let options = {
            method: "GET",
            host: "api.twitter.com",
            path:
                "/1.1/statuses/user_timeline.json?screen_name=TheOnion&count=10?",
            json: true,
            headers: {
                Authorization: "Bearer " + bearerToken
            }
        };
        let cb = function(response) {
            var str = "";
            if (response.statusCode != 200) {
                console.log(response.statusCode);
                reject(response);
                return;
            }

            //append data recieved to string
            response.on("data", function(chunk) {
                str += chunk;
                // console.log(chunk);
            });

            response.on("end", function() {
                //parse the recieved chunk of data and delare as tweets variable
                var tweets = JSON.parse(str);
                resolve(tweets);
            });
        };
        const req = https.request(options, cb);

        req.end();
    });
};

//loop through array to find the url from the information recieved and push into array
module.exports.filterTweets = function filterTweets(arr) {
    return new Promise(resolve => {
        const newArr = [];
        for (var i = 0; i < arr.length; i++) {
            var resul = arr[i]["text"].split(" ");
            var newResul = resul.filter(function(item) {
                return !item.startsWith("http");
            });
            var toPush = newResul.join(" ");

            newArr.push({ headline: toPush, href: arr[i]["user"]["url"] });
        }
        resolve(newArr);
        // console.log(newArr);
    });
};
