import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * @class Authenticate
 */
class Authenticate {
  /**
  * Return secure user details
  *
  * @static
  * @param {String} request user details
  * @returns {Object} secure data
  * @memberof Authenticate
  */
  static setUserInfo(request) {
    return {
      id: request.id,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      roleId: request.roleId,
    };
  }

  /**
  * Generate a token
  *
  * @static
  * @param {Object} user user details
  * @returns {String} token
  * @memberof Authenticate
  */
  static generateWebToken(user) {
    return jwt.sign(user, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7
    });
  }

  /**
   * Compares password with hashed password
   *
   * @static
   * @param {String} password password
   * @param {String} hash hashed password
   * @return {boolean} boolean
   * @memberof Authenticate
   */
  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * check if input is a number
   *
   * @static
   * @param {String/Integer} request
   * @returns {Integer/Boolean} false or number
   * @memberof Authenticate
   */
  static verify(request) {
    const number = Number(request);
    if (isNaN(number)) return false;
    return Number(request);
  }

  /**
   * Permits user or admin
   *
   * @static
   * @param {request} req request object
   * @param {response} res response object
   * @param {Function} next next function
   * @returns {response} response object
   * @memberof Authenticate
   */
  static permitUserOrAdmin(req, res, next) {
    if (
      req.user.roleId === 1 || Number(req.params.id) === Number(req.user.id)) {
      res.locals.user = req.user;
      return next();
    }
    return res.status(401).send(
      { message: 'You are unauthorized for this action' }
    );
  }

  /**
   * Permits only admin
   *
   * @static
   * @param {request} req request object
   * @param {response} res response object
   * @param {Function} next next function
   * @returns {response} response object
   * @memberof Authenticate
   */
  static permitAdmin(req, res, next) {
    if (req.user.roleId !== 1) {
      return res.status(401).send(
        { message: "We're sorry, you're not authorized for this feature" }
      );
    }
    res.locals.user = req.user;
    return next();
  }
}
export default Authenticate;
