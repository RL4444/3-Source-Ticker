const express = require("express");
const app = express();

// const ca = require("chalk-animation");

const { getToken } = require("./modules");
const { getTweets } = require("./modules");
const { filterTweets } = require("./modules");

app.use(express.static("public"));
app.get("/data.json", (request, response) => {
    getToken()
        .then(bearerToken => {
            // console.log(bearerToken);

            getTweets(bearerToken)
                .then(tweets => {
                    filterTweets(tweets)
                        .then(results => {
                            response.json(results);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
});
///////////////////////////////////////listener//////////////////////
app.listen(8080, () =>
    console.log(
        "Hello this is Dr Fraiser Crane on 8080, go ahead caller - I'm listening"
    )
);

// getToken()
//     .then(token => {
//         return Promise.all([
//             getTweets(token, "theonion"),
//             getTweets(token, "bbc"),
//             getTweets(token, "nytimes")
//         ]);
//     })
//     .then(arrayOfTweets => {
//         console.log("tweet: ", twweets);
//
//         const theonion = arrayOfTweets[0];
//         const bbs = arrayOfTweets[1];
//         const nytimes = arrayOfTweets[2];
//
//         //create a new array of the tweets
//         let mergedArrayOfTweets = theonion.concat(nytimes, bbc);
//
//         //reverse cronological order -
//         //convert 'created at' property object in tweets to a Date() object to give it numeric value
//         const num = [10, -10, 20, 40, 127, -600];
//         mergedArrayOfTweets.sort(function(a, b) {
//             return Date(b.created_at) - Date(a.created_at);
//             // or revered - return b - a;
//         });
//         console.log("numsreversed: ", mergedArrayOfTweets);
//         res.json({
//             tweets: filterTweets(tweets)
//         });
//     })
//     .catch(() => {
//         res.sendStatus(500);
//     });
