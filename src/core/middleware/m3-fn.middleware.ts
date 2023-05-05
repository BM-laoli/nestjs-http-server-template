export function logger(req, res, next) {
  console.log(`FunctionMiddleware3 Request...`);
  next();
}
