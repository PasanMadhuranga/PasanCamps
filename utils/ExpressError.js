// By extending the Error class, ExpressError allows you to create custom error objects that include a message and a status code. 
// This is useful for more precise error handling in your application.
// When an error occurs in your application, you can throw an ExpressError with a specific message and status code.
// This makes it easier to handle and respond to different types of errors in your application, 
// especially when you want to send specific HTTP status codes and error messages to the client.

class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
