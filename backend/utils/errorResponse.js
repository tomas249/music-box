/**
 * Custom class to easily throw errors
 */
class ErrorResponse extends Error {
  constructor(statusCode, message, errorCode = 'error') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

module.exports = ErrorResponse;
