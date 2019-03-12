/** ExpressError extends the normal JS error so we can easily
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

class ExpressError extends Error {
  constructor(message, status) {
    if (Array.isArray(message)) { 
      message = JSON.stringify(message)
    }
    super(message);
    this.status = status;
    console.error(this.stack);
  }
}


module.exports = ExpressError;