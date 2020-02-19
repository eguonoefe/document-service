import chai from 'chai';

import db from '../../models';
import testData from '../testData';

const expect = chai.expect;

const goodUser = testData.goodUser2;

const awesomeBook = testData.awesomeBook;


let book;

before((done) => {
  db.User.create(goodUser)
    .then((newUser) => {
      awesomeBook.authorId = newUser.id;
      awesomeBook.roleId = newUser.roleId;
      db.Document.create(awesomeBook).then((newBook) => {
        book = newBook;
        done();
      });
    });
});

after(() => db.sequelize.sync({ force: true }));

describe('Document model', () => {
  it('should save the document information', () => {
    expect(awesomeBook.title).to.equal(book.title);
    expect(awesomeBook.content).to.equal(book.content);
    expect(awesomeBook.access).to.equal(book.access);
  });
});


describe('Document', () => {
  it('should be saved in database', () => {
    book.save().then((savedBook) => {
      expect(savedBook.firstName).to.equal(book.firstName);
      expect(savedBook.lastName).to.equal(book.lastName);
      expect(savedBook.userName).to.equal(book.userName);
    });
  });
});

