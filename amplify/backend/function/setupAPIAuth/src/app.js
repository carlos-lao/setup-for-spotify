/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const SPOTIFY = {
  CLIENT_ID: '597cb332fd4b460db75d1e2ab15a766a',
  CLIENT_SECRET: 'ffd57fcd50cd437fa70c995ea616d558',
  REDIRECT_URI: 'http://localhost:3000/setup-for-spotify',
  // REDIRECT_URI: 'https://carlos-lao.github.io/setup-for-spotify/',
  SCOPES: [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
  ],
};

const spotify = require('spotify-web-api-node');

const spotifyClient = new spotify({
  clientId: SPOTIFY.CLIENT_ID,
  clientSecret: SPOTIFY.CLIENT_SECRET,
  redirectUri: SPOTIFY.REDIRECT_URI
});

app.get('/auth', function(req, res) {
  const { token } = req.query
  spotifyClient.setAccessToken(token);
  spotifyClient.getMe()
    .then((data) => {
      res.json({success: true, url: req.url, body: JSON.stringify(data.body)});
    })
    .catch(() => {
      res.json({success: false, url: req.url});
    })
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
