export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Error occurred",
  statusCode = 500,
  error = null
) => {
  const response = {
    success: false,
    message,
    statusCode,
  };

  if (error && process.env.NODE_ENV === "development") {
    response.error = error;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
