export function loggerAll(req, res, next) {
  console.log(`FunctionMiddleware0 Request...`);
  next();
}
