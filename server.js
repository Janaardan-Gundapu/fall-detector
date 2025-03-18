// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to receive alerts from the client
app.post('/alert', (req, res) => {
  const { message, timestamp } = req.body;
  console.log(`Alert received: ${message} at ${new Date(timestamp)}`);
  // You can add integration with an SMS/email API here.
  res.json({ status: 'success' });
});

// Optionally, serve static files if you want to host your client here
// For example, if your index.html and main.js are in a folder named "public":
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
