import passport from 'passport';

import controllers from '../controllers';
import authenticate from '../helpers/Authenticate';

const roleController = controllers.Role;
const auth = passport.authenticate('jwt', {
  session: false
});

export default (app) => {
  app.post('/api/v1/roles',
    auth, authenticate.permitAdmin, roleController.create);
  app.get('/api/v1/roles', auth, authenticate.permitAdmin, roleController.view);
  app.put('/api/v1/roles/:id',
    auth, authenticate.permitAdmin, roleController.update);
  app.delete('/api/v1/roles/:id',
    auth, authenticate.permitAdmin, roleController.delete);
};
