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
// var whitelist = ['http://localhost:3000', 'http://example2.com'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback('not allowed by cors');
//     }
//   },
//   credentials: true,
// };
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// Routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
