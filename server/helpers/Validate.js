/* eslint-disable */
/**
 * @class Validate
 */
class Validate {
  /**
   * Validate Input Fields for User Update
   * 
   * @static
   * @param {Object} req resquest object
   * @memberof Validate
   * @return {void}
   */
  static userUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'email') {
        const email = req.body[element];
        req.checkBody('email', 'Please Input Valid Email').isEmail().notEmpty();
      }
      if (element === 'password') {
        const password = req.body[element];
        req.checkBody('password', 'Password is Required').notEmpty();
      }
      if (element === 'confirmPassword') {
        const confirmPassword = req.body[element];
        req.checkBody('confirmPassword', 'Passwords do not match').equals(
          req.body.password);
      }
      if (element === 'firstName') {
        const firstName = req.body[element];
        req.checkBody('firstName', 'Must be alphabets').isAlpha();
        req.checkBody('firstName', 'Required').notEmpty();
      }
      if (element === 'lastName') {
        const lastName = req.body[element];
        req.checkBody('lastName', 'Must be alphabets').isAlpha();
        req.checkBody('lastName', 'Required').notEmpty();
      }
    });
  }

  /**
   * Validate Input Fields for user Signup and Login
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static user(req) {
    let firstName, lastName, email, password, confirmPassword;
    if (!req.body.firstName || !req.body.lastName) {
      email = req.body.email;
      password = req.body.password;
      req.checkBody('email', 'Please Input Valid Email').isEmail().notEmpty();
      req.checkBody('password', 'Password is Required').notEmpty();
    } else {
      firstName = req.body.firstName;
      lastName = req.body.lastName;
      email = req.body.email;
      password = req.body.password;
      confirmPassword = req.body.confirmPassword;
      req.checkBody('firstName', 'First Name is Required').notEmpty();
      req.checkBody('firstName', 'Must be alphabets').isAlpha();
      req.checkBody('lastName', 'Last Name is Required').notEmpty();
      req.checkBody('lastName', 'Must be alphabets').isAlpha();
      req.checkBody('email', 'Email is Required').notEmpty();
      req.checkBody('email', 'Email is not valid').isEmail();
      req.checkBody('password', 'Password is Required').notEmpty();
      req.checkBody(
        'confirmPassword', 'Passwords do not match').equals(password);
    }
  }

  /**
   * Validate Input Fields for creating Roles
   * 
   * @static
   * @param {any} req 
   * @memberof Validate
   * @return {void}
   */
  static role(req) {
    const title = req.body.title;
    const description = req.body.description;

    req.checkBody('title', 'Title is Required').notEmpty();
    req.checkBody('title', 'Must be alphabets').isAlpha();
    req.checkBody('description', 'Descrition is Required').notEmpty();
  }

  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static roleUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'title') {
        const title = req.body[element];
        req.checkBody('title', 'Title is Required').notEmpty();
      }
      if (element === 'description') {
        const description = req.body[element];
        req.checkBody('description', 'Description is Required').notEmpty();
      }
    });
  }
  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static document(req) {
    const title = req.body.title;
    const content = req.body.content;
    const access = req.body.access;

    req.checkBody('title', 'Title is Required').notEmpty();
    req.checkBody('content', 'Content is Required').notEmpty();
    req.checkBody('access', 'Invalid Access Type').isAlpha().notEmpty();
  }

  /**
   * Validate Input Fields for updating Roles
   * 
   * @static
   * @param {Object} req request object
   * @return {void}
   * @memberof Validate
   */
  static documentUpdate(req) {
    const keys = Object.keys(req.body);
    keys.forEach((element, index, array) => {
      if (element === 'title') {
        const title = req.body[element];
        req.checkBody('title', 'Title is Required').notEmpty();
      }
      if (element === 'content') {
        const content = req.body[element];
        req.checkBody('content', 'Content is Required').notEmpty();
      }
      if (element === 'access') {
        const confirmPassword = req.body[element];
        req.checkBody('access', 'Invalid Access Type').isAlpha().notEmpty();
      }
    });
  }
}

export default Validate;

