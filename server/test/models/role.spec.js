import chai from 'chai';

import db from '../../models';
import testData from '../testData';

const expect = chai.expect;

const owner = testData.owner;
let role;

before((done) => {
  db.Role.create(owner).then((newRole) => {
    role = newRole;
    done();
  });
});

after(() => db.sequelize.sync({ force: true }));

describe('Role model', () => {
  it('should save the role information', () => {
    expect(owner.name).to.equal(role.name);
    expect(owner.description).to.equal(role.description);
  });
});


describe('Role', () => {
  it('should be saved in database', () => {
    role.save().then((savedrole) => {
      expect(savedrole.name).to.equal(role.name);
      expect(savedrole.description).to.equal(role.description);
    });
  });
});

