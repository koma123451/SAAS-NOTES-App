// middleware/globalErrorHandler.js
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Return detailed error info in development
  const isDevelopment = process.env.NODE_ENV !== "production";
  
  // MongoDB validation error
  if(err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: messages
    });
  }

  // MongoDB duplicate key error
  if(err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT error
  if(err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if(err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(isDevelopment && { stack: err.stack })
  });
};
