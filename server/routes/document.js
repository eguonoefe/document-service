import passport from 'passport';

import controllers from '../controllers';
import authenticate from '../helpers/Authenticate';

const documentController = controllers.Document;

const auth = passport.authenticate('jwt', {
  session: false
});
export default (app) => {
  app.get('/api/v1/users/:id/documents',
    auth, authenticate.permitUserOrAdmin, documentController.getUserDocuments);
  app.post('/api/v1/documents', auth, documentController.create);
  app.get('/api/v1/documents', auth, documentController.search);
  app.get('/api/v1/documents/:id', auth, documentController.view);
  app.put('/api/v1/documents/:id',
    auth, documentController.update);
  app.delete(
    '/api/v1/documents/:id', auth, documentController.delete);
  app.get('/api/v1/search/documents', auth, documentController.search);
};
