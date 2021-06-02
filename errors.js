class ErrorHandler extends Error {
    constructor(statusCode, message, stack) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.stack = stack;
    }
    notFound(message) {
      this.statusCode = 404;
      this.message = message;
      return {
        statusCode: this.statusCode,
        message: this.message
      }
    }
    badRequest(message, stack) {
      this.statusCode = 400
      this.message = message;
      this.stack = stack;
      return {
        statusCode: this.statusCode,
        message: this.message, 
        stack: this.stack
      }
    }
 };

const handleError = (err, res) => {
    const { statusCode, message, stack } = err;
    console.log(err);
    res.status(statusCode).send({
      status: "error",
      statusCode,
      message,
      stack
    });
  };

module.exports = { ErrorHandler, handleError};