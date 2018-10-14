const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const bcrypt = require('bcryptjs');
const Authorizer = require('../policies/application');

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role
    })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  getUser(req, callback) {
    let result = {};
    User.findById(req.params.id).then(user => {
      if (!user) {
        callback(404);
      } else {
        result['user'] = user;
        if (req.user && (req.user.role === 2 || req.user.id === user.id)) {
          Wiki.findAll({
            where: {
              userId: user.id
            }
          })
            .then(wikis => {
              result['wikis'] = wikis;
              Collaborator.scope({
                method: ['collaboratorOn', user.id]
              })
                .all()
                .then(collaborators => {
                  result['collaborators'] = collaborators;
                  callback(null, result);
                })
                .catch(err => {
                  console.log(err);
                  callback(err);
                });
            })
            .catch(err => {
              console.log(err);
              callback(err);
            });
        } else {
          Wiki.scope({ method: ['userWikisPublic', user.id] })
            .all()
            .then(wikis => {
              result['wikis'] = wikis;
              result['collaborators'] = [];
              callback(null, result);
            })
            .catch(err => {
              console.log(err);
              callback(err);
            });
        }
      }
    });
  },
  updateUserRole(id, newRole, callback) {
    return User.findById(id).then(user => {
      user
        .update(
          {
            role: newRole
          },
          {
            fields: ['role']
          }
        )
        .then(user => {
          callback(null, user);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
