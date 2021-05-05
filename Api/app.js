const https = require("https");
const fs = require("fs");
const GitHubUser = 'takenet';
const jsonPath = "./temp/myJson.json";

function getRepositories() {
    var options = {
        host: 'api.github.com',
        path: '/orgs/' + GitHubUser + "/repos?per_page=1000",
        headers: {
            'user-agent': 'node.js'
        },
        method: 'GET'
    };

    const req = https.request(options, function (res) {
        res.setEncoding('utf8');
        console.log('STATUS: ' + res.statusCode);
        let data = "";

        // Receving part of the data
        res.on('data', (chunk) => {
            data = data + chunk;
        });

        res.on('end', () => {
            let object = JSON.parse(data);
            let temp = [];
            let repositories = [];

            // Put all of C# repositories inside a temp variable
            for (let i = 0; i < object.length; i++) {
                if (object[i].language == "C#") {
                    temp.push(object[i]);
                }
            }

            for (let i = 0; i < 5; i++) {
                repositories.push(temp[i]);
            }

            // Put the first five C# repositories inside a JSON File
            fs.writeFile(jsonPath, JSON.stringify(repositories), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("JSON saved in the path: " + jsonPath);
                }
            });
        });
    });
    req.end();
}

// Setting up the server.
const express = require("express");
const app = express();
const port = 5000;

app.get('/', function (req, res) {
    getRepositories();
    res.send("Hello!");
});

app.get('/repositories', function (req, res) {
    fs.readFile(jsonPath, "utf8", function (err, data) {
        if (err) return res.redirect('/');
        res.send(data);
    });
})

const server = app.listen(port, function () {
    console.log(`Listening at: http://localhost:${port}`);
});