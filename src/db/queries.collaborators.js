const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const Authorizer = require('../policies/application');

module.exports = {
  createCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.newCollaborator
      }
    })
      .then(user => {
        if (!user) {
          return callback('User not found.');
        } else if (user.id === req.user.id) {
          return callback('As Wiki Owner, you are already a collaborator.');
        }
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.wikiId
          }
        })
          .then(alreadyCollaborator => {
            if (alreadyCollaborator) {
              return callback('That user is already a collaborator.');
            }
            return Collaborator.create({
              wikiId: req.params.wikiId,
              userId: user.id
            })
              .then(collaborator => {
                callback(null, collaborator);
              })
              .catch(err => {
                callback('Error adding collaborator. Please try again.');
              });
          })
          .catch(err => {
            callback('Error adding collaborator. Please try again.');
          });
      })
      .catch(err => {
        callback('Error adding collaborator. Please try again.');
      });
  },
  deleteCollaborator(req, callback) {
    const id = req.params.id;
    return Collaborator.findById(id)
      .then(collaborator => {
        if (!collaborator) {
          return callback('Collaborator Not Found');
        }
        const authorized = new Authorizer(req.user, collaborator).destroy();
        if (authorized) {
          Collaborator.destroy({ where: { id } })
            .then(deletedRecordsCount => {
              callback(null, deletedRecordsCount);
            })
            .catch(err => {
              console.log(err);
              callback('Error deleting collaborator. Please try again.');
            });
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          callback(401);
        }
      })
      .catch(err => {
        callback('Error deleting collaborator. Please try again.');
      });
  }
};
