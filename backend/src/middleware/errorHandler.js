export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Unique constraint violation',
        details: err.meta
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found',
        details: err.meta
      });
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
