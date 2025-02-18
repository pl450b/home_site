const express = require('express');
const path = require('path');

const app = express();
const hostname = '0.0.0.0';
const port = 3000;

// Middleware to serve static files (HTML, CSS, JS, etc.) from the "public" directory
app.use(express.static('public'));

app.get('/det875.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'det875.html'));
});

app.get('/2bn', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '2bn.html'));
});

// Route to serve the "home.html" file
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send('Error 404: Not Found');
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});

