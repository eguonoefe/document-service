import roles from './role';
import users from './user';
import documents from './document';

module.exports = (app) => {
  roles(app);
  users(app);
  documents(app);
};
