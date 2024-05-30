// This catchAsync wrapper function can catch errors that are passed to the next function.
// The catchAsync function simplifies error handling for asynchronous route handlers in Express.js by:
// Wrapping the asynchronous function.
// Catching any errors that occur during its execution.
// Passing those errors to the next error-handling middleware.

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
