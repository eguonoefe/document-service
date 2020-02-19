import passport from 'passport';

import controllers from '../controllers';
import authenticate from '../helpers/Authenticate';

const userController = controllers.User;
const auth = passport.authenticate('jwt', {
  session: false
});

export default (app) => {
  app.post('/api/v1/users', userController.create);
  app.post('/api/v1/users/login', userController.login);
  app.post('/api/v1/users/logout', userController.logout);
  app.get('/api/v1/users',
    auth, authenticate.permitAdmin, userController.search);
  app.get(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.view);
  app.put(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.update);
  app.delete(
    '/api/v1/users/:id',
    auth, authenticate.permitUserOrAdmin, userController.remove);
  app.get('/api/v1/search/users',
    auth, authenticate.permitAdmin, userController.search);
};
