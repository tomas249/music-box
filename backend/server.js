const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config', 'config.env') });
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('mySecrect'));
const whitelist = ['http://localhost:3000', '0.0.0.0'];
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1', routes);

const reactBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(reactBuildPath));
app.get('**', (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', console.log(`Server running on port ${PORT}`));
