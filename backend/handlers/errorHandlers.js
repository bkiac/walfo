/*
  Catch Errors Handler

  Instead of using try-catch for async/await, a function is wrapped in catchErrors()
*/
exports.catchErrors = fn => function (req, res, next) {
  return fn(req, res, next).catch(next);
};
