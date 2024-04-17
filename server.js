const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGODB_URI = '';
const app = express();
const path = require('path');
const port = 3000; // You can change this port number if needed
app.use(express.static(path.join(__dirname, 'public')));
// MongoDB connection setup
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define MongoDB schemas and models
const yourDataSchema = new mongoose.Schema({
  text: String
});
const YourData = mongoose.model('YourData', yourDataSchema);

const messageSchema = new mongoose.Schema({
  text: String
});
const Message = mongoose.model('Message', messageSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to save data to the "yourdatas" collection
app.post('/saveData', (req, res) => {
  const text = req.body.text;
  const newData = new YourData({ text: text });
  newData.save()
    .then(() => {
      console.log('Data saved to "yourdatas" collection:', text);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
      res.sendStatus(500);
    });
});

// Endpoint to fetch messages from the "messages" collection
app.get('/getMessages', (req, res) => {
  Message.find()
    .then((messages) => {
      res.json(messages);
    })
    .catch((err) => {
      console.error('Error fetching messages:', err);
      res.sendStatus(500);
    });
});

app.get('/getAndDeleteMessages', (req, res) => {
    Message.find()
      .then((messages) => {
        // Delete all fetched messages
        return Message.deleteMany({})
          .then(() => {
            res.json(messages);
          });
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
        res.sendStatus(500);
      });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}/ `);
});
