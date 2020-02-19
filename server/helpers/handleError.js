/**
 * Handle promise errors
 *
 * @param {Object} status status code
 * @param {Function} message error message
 * @param {Function} res server response function
 * @returns {Function} function that displays an error message
 */
export default function handleError(status, message, res) {
  res.status(status).send({ message });
}
