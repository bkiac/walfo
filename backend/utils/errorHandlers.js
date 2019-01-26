/*
  Catch Errors Handler
  Instead of using try-catch for async/await, a function is wrapped in catchErrors()
*/
exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);
