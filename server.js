//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/xtreme-admin-angular'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/xtreme-admin-angular/'}),
);

// Start the app by listening on the default Heroku port
const PORT = process.env.PORT || 8080
app.listen(PORT);
console.log(`started at ${PORT}`)