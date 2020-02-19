import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import db from '../models';
import validate from '../helpers/Validate';
import authenticate from '../helpers/Authenticate';
import paginate from '../helpers/paginate';
import handleError from '../helpers/handleError';


const { or, iLike } = Sequelize.Op;

/**
 * @class User
 */
class User {
  /**
  * Create a user
  * Route: POST: /users
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static create(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user !== null) {
            handleError(409, 'Email already exists', res);
          } else {
            return db.User.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: req.body.password,
              roleId: req.body.roleId || 2
            })
              .then((newUser) => {
                newUser.save()
                  .then((savedUser) => {
                    const userInfo = authenticate.setUserInfo(savedUser);
                    const token = authenticate.generateWebToken(userInfo);
                    res.status(201).send({
                      message: 'Signup successful',
                      userData: savedUser.filterUserDetails(),
                      token
                    });
                  }).catch(() => {
                    handleError(400,
                      "we're sorry, we couldn't sign you up", res);
                  });
              })
              .catch(() => {
                res.status(500).send({
                  message: "we're sorry, we couldn't sign you up"
                });
              });
          }
        });
    }
  }

  /**
  * Login a user
  * Route: POST: /users/login
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static login(req, res) {
    validate.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      handleError(400, validateErrors[0].msg, res);
    } else {
      db.User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (!user) {
            handleError(400, 'User does not exist', res);
          } else {
            const verifyUser = authenticate.verifyPassword(
              req.body.password, user.password
            );
            if (verifyUser) {
              const userInfo = authenticate.setUserInfo(user);
              const token = authenticate.generateWebToken(userInfo);
              res.status(200).send({
                message: 'login successful',
                userData: user.filterUserDetails(),
                token
              });
            } else {
              handleError(400,
                'Wrong password, Please input correct password', res);
            }
          }
        })
        .catch(() => {
          res.status(500).send({
            message: "we're sorry, we couldn't log you in"
          });
        });
    }
  }

  /**
  * Get a user
  * Route: GET: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static view(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    db.User.findOne({ where: { id } })
      .then((user) => {
        if (user) {
          res.status(200).send(
            {
              message: 'User found',
              user: user.filterUserDetails()
            }
          );
        } else {
          handleError(404, 'User not found', res);
        }
      })
      .catch(() => {
        res.status(500).send({
          message: "we're sorry, there was an error, please try again"
        });
      });
  }

  /**
  * Update a user
  * Route: PUT: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static async update(req, res) {
    validate.userUpdate(req, res);
    const validateErrors = req.validationErrors();

    if (validateErrors) return handleError(400, validateErrors[0].msg, res);

    if (req.body.oldPassword) {
      if (!bcrypt.compareSync(req.body.oldPassword, res.locals.user.password)) {
        return handleError(400, 'Old password is incorrect', res);
      }
      if (req.body.oldPassword === req.body.password) {
        return handleError(400, 'Please change your password', res);
      }
    }

    const id = authenticate.verify(req.params.id);
    if (!id) return handleError(400, 'Id must be a number', res);

    try {
      const existingUser = req.body.email ? await db.User.findOne({ where: { email: req.body.email } }) : null;
      if (existingUser && existingUser.id !== res.locals.user.id) return handleError(409, 'Email already exists', res);

      const user = await db.User.findByPk(id);
      const updatedUser = await user.update(req.body);
      const userInfo = authenticate.setUserInfo(updatedUser);
      const token = authenticate.generateWebToken(userInfo);

      return res.status(200).send(
        {
          message: 'User information has been updated',
          updatedUser: updatedUser.filterUserDetails(),
          token
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "we're sorry, there was an error, please try again"
      });
    }
  }

  /**
  * Delete a user
  * Route: DELETE: /users/:id
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static remove(req, res) {
    const id = authenticate.verify(req.params.id);
    if (id === false) {
      handleError(400, 'Id must be a number', res);
    }
    return db.User.findByPk(id)
      .then((user) => {
        if (user === null) {
          handleError(404, 'User not found', res);
        } else {
          user.destroy()
            .then(() => {
              res.status(200).send({ message: 'User has been deleted' });
            });
        }
      }).catch(() => {
        res.status(500).send({
          message: "we're sorry, there was an error, please try again"
        });
      });
  }

  /**
  * Get users
  * Route: GET: /search/users and
  * Route: GET: /users/?limit=[integer]&offset=[integer]&q=[username]
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static search(req, res) {
    let searchTerm = '%%';
    if (req.query.q) {
      searchTerm = `%${req.query.q}%`;
    }
    const offset = authenticate.verify(req.query.offset);
    const limit = authenticate.verify(req.query.limit);
    if ((req.query.limit && limit === false)
      || (req.query.offset && offset === false)) {
      handleError(400, 'Offset and Limit must be Numbers', res);
    }
    const query = {
      offset: offset || 0,
      limit: limit || 5,
      include: [{
        model: db.Role,
        attributes: ['title']
      }],
      where: {
        [or]: [
          { firstName: { [iLike]: `${searchTerm}` } },
          { lastName: { [iLike]: `${searchTerm}` } }
        ]
      }
    };

    return db.User.findAndCountAll(query)
      .then(({ rows: users, count }) => {
        res.status(200).send(
          {
            message: 'Users found',
            userList: users.map((user) => user.filterUserList()),
            metaData: paginate(count, limit, offset)
          }
        );
      })
      .catch(() => {
        res.status(500).send({
          message: "we're sorry, there was an error, please try again"
        });
      });
  }

  /**
  * Logout a user
  * Route: POST: /users/login
  *
  * @static
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {Response} response object
  * @memberof User
  */
  static logout(req, res) {
    res.status(200).send({
      message: 'Success, delete user token'
    });
  }
}

export default User;
