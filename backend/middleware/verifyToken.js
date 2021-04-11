const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

module.exports = (opt = {}) =>
  asyncHandler(async (req, res, next) => {
    // Check refresh token
    const refreshToken = req.signedCookies['refresh-token'];
    if (!refreshToken) throw new ErrorResponse(401, 'RefreshToken no provided');

    // Get access token
    const rawHeader = req.header('Authorization');
    if (!rawHeader && !req.verifySkip) throw new ErrorResponse(401, 'AccessToken no provided');
    const accessToken = rawHeader.split('Bearer ')[1];

    // Verify access token
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) throw new ErrorResponse(401, 'Invalid AccessToken');
      // Check authorization
      const isBypassed = decoded.access.bypass && opt.acceptBypass;
      if (!decoded.access.allow && !isBypassed)
        throw new ErrorResponse(401, decoded.access.message);

      req.user = decoded;
      next();
    });
  });
