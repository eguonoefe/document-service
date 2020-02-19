import chai from 'chai';

import db from '../../models';
import testData from '../testData';

const expect = chai.expect;

const goodUser = testData.goodUser;
const role = testData.writer;

let user;

before((done) => {
  db.Role.create(role)
    .then((newRole) => {
      goodUser.roleId = newRole.id;
      db.User.create(goodUser).then((newUser) => {
        user = newUser;
        done();
      });
    });
});

after(() => db.sequelize.sync({ force: true }));

describe('User model', () => {
  it('should save the user information', () => {
    expect(goodUser.firstName).to.equal(user.firstName);
    expect(goodUser.lastName).to.equal(user.lastName);
    expect(goodUser.email).to.equal(user.email);
  });
});

describe('Bcrypt', () => {
  it('should encrpyt user password', () => {
    expect(goodUser.password).to.not.equal(user.password);
  });
});

describe('User', () => {
  it('should be saved in database', () => {
    user.save().then((savedUser) => {
      expect(savedUser.firstName).to.equal(user.firstName);
      expect(savedUser.lastName).to.equal(user.lastName);
      expect(savedUser.userName).to.equal(user.userName);
    });
  });
});

describe('Update User', () => {
  it('hashes updated passwords', () => {
    user.save()
      .then(newUser => newUser.update({ password: 'newpassword' }))
      .then((updatedUser) => {
        expect(updatedUser.password).to.not.equal(
          'newpassword');
      });
  });
});
