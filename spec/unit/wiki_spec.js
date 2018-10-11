const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;
const sequelize = require('../../src/db/models/index').sequelize;

describe('Wiki', () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: 'tester',
        email: 'starman@tesla.com',
        password: 'Trekkie4lyfe',
        userId: this.user.id
      })
        .then(user => {
          this.user = user;
          Wiki.create({
            title: 'JS Frameworks',
            body: 'There is a lot of them',
            userId: user.id
          })
            .then(wiki => {
              this.wiki = wiki;
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe('#create()', () => {
    it('should create a wiki object with a title and body', done => {
      Wiki.create({
        title: 'JS Frameworks',
        body: 'There are a lot of them',
        userId: this.user.id
      })
        .then(wiki => {
          expect(wiki.title).toBe('JS Frameworks');
          expect(wiki.body).toBe('There are a lot of them');
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it('should not create a wiki with missing title or description', done => {
      Wiki.create({
        title: "Hitchhiker's Guide to the Galaxy"
      })
        .then(wiki => {
          //this code block will not be evaluated
          done();
        })
        .catch(err => {
          expect(err.message).toContain('Wiki.body cannot be null');
          done();
        });
    });
  });

  describe('#getUser()', () => {
    it('should return the associated user', done => {
      this.wiki.getUser().then(associatedUser => {
        expect(associatedUser.email).toBe('starman@tesla.com');
        done();
      });
    });
  });

  describe('#setUser()', () => {
    it('should associate a wiki and a user together', done => {
      User.create({
        username: 'mydog',
        email: 'mydog@example.com',
        password: '123123',
        passwordConfirmation: '123123'
      }).then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser).then(wiki => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });
});
