// export function errorHandler(error, req, res, next) {
//   console.log('ERROR HANDLER');
//   console.error(error);

//   res.status(500).json({ status: 500, message: 'Internal Server Error' });
// }

export function errorHandler(err, req, res, next) {
  console.error('💥 Oops! Something went wrong:', err.stack); // Log the error for debugging

  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
}
