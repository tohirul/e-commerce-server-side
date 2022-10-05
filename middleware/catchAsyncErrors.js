// filtering async errors with try and catch
module.exports = (asyncErrors) => (req, res, next) => {
  Promise.resolve(asyncErrors(req, res, next)).catch(next);
};
