export function errorMiddleware(err, req, res, next) {
  console.log(err);
  const message = err.message || 'Error del servidor';
  res.status(500).json({ message });
}