import chai from 'chai';
import chaiHttp from 'chai-http';
import testData from '../testData';

import server from '../../../server';

const should = chai.should(); // eslint-disable-line

chai.use(chaiHttp);


describe('User', () => {
  let savedUser;
  let adminToken;
  let adminUser;
  let userToken;
  let updatedToken;
  let updatedUser;
  let savedUser5;
  let userToken5;
  let fineUser;
  let fineToken;
  before((done) => {
    chai.request(server)
      .post('/api/v1/users')
      .send(testData.userFive)
      .end((err, res) => {
        savedUser5 = res.body.userData;
        userToken5 = `Bearer ${res.body.token}`;
        res.should.have.status(201);
      });
    chai.request(server)
      .post('/api/v1/users')
      .send(testData.userSix)
      .end((err, res) => {
        fineUser = res.body.userData;
        fineToken = `Bearer ${res.body.token}`;
        res.should.have.status(201);
      });
    chai.request(server)
      .post('/api/v1/users')
      .send(testData.userFour)
      .end((err, res) => {
        res.should.have.status(201);
      });
    chai.request(server)
      .post('/api/v1/users')
      .send(testData.admin2)
      .end((err, res) => {
        res.should.have.status(201);
        adminToken = `Bearer ${res.body.token}`;
        adminUser = res.body.userData;
        done();
      });
  });

  describe('/api/v1/POST users', () => {
    it('should fail without email field', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send(testData.incompleteInfo)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql(
            'Email is Required'
          );
          done();
        });
    });
    it('should save user info', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send(testData.newUser)
        .end((err, res) => {
          savedUser = res.body.userData;
          userToken = `JWT ${res.body.token}`;
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('userData');
          res.body.should.have.property('message');
          res.body.userData.should.be.a('object');
          res.body.message.should.be.a('string').eql('Signup successful');
          res.body.userData.should.have.property('firstName');
          res.body.userData.should.have.property('lastName');
          res.body.userData.should.have.property('email');
          done();
        });
    });

    it('should return a token', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send(testData.userOne)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('token');
          `JWT ${res.body.token}`.should.be.a('string');
          done();
        });
    });

    it('should fail if email already exists', (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send(testData.newUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('message').eql('Email already exists');
          done();
        });
    });
  });

  // Login user
  describe('/api/v1/POST users/login', () => {
    it('should log in user', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send(testData.userTwo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('userData');
          res.body.should.have.property('message');
          res.body.userData.should.be.a('object');
          res.body.message.should.be.a('string').eql('login successful');
          res.body.userData.should.have.property('email');
          done();
        });
    });

    it('should return a token', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send(testData.userTwo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          `JWT ${res.body.token}`.should.be.a('string');
          done();
        });
    });

    it('should fail without email field', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send({ password: 'eguono' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql(
            'Please Input Valid Email'
          );
          done();
        });
    });

    it('should fail without correct password', (done) => {
      chai.request(server)
        .post('/api/v1/users/login')
        .send(testData.userThree)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql(
            'Wrong password, Please input correct password'
          );
          done();
        });
    });
  });

  // POST /users/logout
  describe('/api/v1/POST logout user', () => {
    it('should logout user', (done) => {
      chai.request(server)
        .post('/api/v1/users/logout')
        .send(testData.userThree)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.message.should.be.a('string').eql(
            'Success, delete user token'
          );
          done();
        });
    });
  });

  // GET /users
  describe('/api/v1/GET users', () => {
    it('should be only accessible to admins', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .set({ Authorization: userToken })
        .end((err, res) => {
          res.should.have.status(401);
          res.error.should.have.property('text').eql(
            'Unauthorized'
          );
          done();
        });
    });
    it('should get list of users', (done) => {
      chai.request(server)
        .get('/api/v1/users?roleId=1')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('userList');
          res.body.should.have.property('message').eql('Users found');
          res.body.should.have.property('metaData');
          res.body.metaData.should.be.a('object');
          res.body.userList.length.should.be.eql(5);
          done();
        });
    });

    it('should limit list of users', (done) => {
      chai.request(server)
        .get('/api/v1/users?roleId=1&limit=2')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('userList');
          res.body.should.have.property('message').eql('Users found');
          res.body.should.have.property('metaData');
          res.body.metaData.should.be.a('object');
          res.body.userList.length.should.be.eql(2);
          done();
        });
    });
    it('should limit users based on offset', (done) => {
      chai.request(server)
        .get('/api/v1/users?roleId=1&offset=3')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('userList');
          res.body.should.have.property('message').eql('Users found');
          res.body.should.have.property('metaData');
          res.body.metaData.should.be.a('object');
          res.body.userList.length.should.be.eql(5);
          done();
        });
    });
  });

  // Get user by id
  describe('/api/v1/GET user:id', () => {
    it('should allow admin to view user', (done) => {
      chai.request(server)
        .get(`/api/v1/users/${savedUser5.id}`)
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.should.have.property('message').eql('User found');
          res.body.user.should.be.a('object');
          done();
        });
    });

    it('should allow a user to view his/her infomation', (done) => {
      chai.request(server)
        .get(`/api/v1/users/${savedUser5.id}`)
        .set({ Authorization: userToken5 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('user');
          res.body.should.have.property('message').eql('User found');
          res.body.user.should.be.a('object');
          done();
        });
    });

    it("should return 'User not found' if user does not exist", (done) => {
      chai.request(server)
        .get('/api/v1/users/20')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.have.property('user');
          res.body.should.have.property('message').eql('User not found');
          done();
        });
    });

    it('should not allow users to view other users infomation', (done) => {
      chai.request(server)
        .get(`/api/v1/users/${adminUser.id}`)
        .set({ Authorization: userToken5 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  // Update user by id
  describe('/api/v1/PUT user:id', () => {
    it('should allow admin to update user information', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${savedUser.id}`)
        .set({ Authorization: adminToken })
        .send({ email: 'jonah@gmail.com' })
        .end((err, res) => {
          updatedToken = `Bearer ${res.body.token}`;
          updatedUser = res.body.updatedUser;
          res.should.have.status(200);
          res.body.should.have.property('updatedUser');
          res.body.should.have.property(
            'message'
          ).eql('User information has been updated');
          res.body.updatedUser.should.be.a('object');
          res.body.updatedUser.should.have.property(
            'email'
          ).not.eql(savedUser.firstName);
          done();
        });
    });

    it('should allow user to update his/her information', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${savedUser.id}`)
        .set({ Authorization: updatedToken })
        .send({ firstName: 'Boy' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('updatedUser');
          res.body.should.have.property(
            'message'
          ).eql('User information has been updated');
          res.body.updatedUser.should.be.a('object');
          res.body.updatedUser.should.have.property(
            'firstName'
          ).eql('Boy');
          done();
        });
    });

    it('should not allow users to update other users information', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${savedUser.id}`)
        .set({ Authorization: fineToken })
        .send({ firstName: 'Boy' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should fail if email already exists', (done) => {
      chai.request(server)
        .put(`/api/v1/users/${fineUser.id}`)
        .set({ Authorization: fineToken })
        .send({ email: 'jonah@gmail.com' })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property(
            'message'
          ).eql('Email already exists');
          done();
        });
    });
  });

  // Search documents by title
  describe('USERS search', () => {
    it('admin should search all users based on firstname or lastname',
      (done) => {
        chai.request(server)
          .get('/api/v1/search/users?q=o')
          .set({ Authorization: adminToken })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('userList');
            res.body.userList.length.should.eql(5);
            done();
          });
      });

    it('user not be able to search for other users', (done) => {
      chai.request(server)
        .get('/api/v1/search/users?q=o')
        .set({ Authorization: fineToken })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return empty if no searchterm was provided', (done) => {
      chai.request(server)
        .get('/api/v1/search/users?q=""')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('userList');
          res.body.userList.length.should.eql(0);
          done();
        });
    });
  });

  // Delete user by id
  describe('/api/v1/DELETE user:id', () => {
    it('user should be able to delete his/her account', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${updatedUser.id}`)
        .set({ Authorization: updatedToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('User has been deleted');
          done();
        });
    });

    it('admin should be able to delete user account', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${savedUser5.id}`)
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql(
            'User has been deleted'
          );
          done();
        });
    });

    it('admin should fail if user not found', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${updatedUser.id}`)
        .set({ Authorization: adminToken })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql(
            'User not found'
          );
          done();
        });
    });

    it('user should not be able to delete other users account', (done) => {
      chai.request(server)
        .delete(`/api/v1/users/${updatedUser.id}`)
        .set({ Authorization: fineToken })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql(
            'You are unauthorized for this action'
          );
          done();
        });
    });


    it('should fail if user was not found', (done) => {
      chai.request(server)
        .delete('/api/v1/users/30002')
        .set({ Authorization: updatedToken })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
