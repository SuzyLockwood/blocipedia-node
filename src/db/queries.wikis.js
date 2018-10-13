const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Authorizer = require('../policies/application');

module.exports = {
  addWiki(newWiki, callback) {
    console.log(newWiki);
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },
  getAllWikis(callback) {
    return Wiki.all({
      where: {
        private: false
      }
    })
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },
  getWiki(id, callback) {
    return Wiki.findById(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
      .then(wiki => {
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
        } else {
          req.flash('notice', 'You are not authorized to do that.');
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findById(req.params.id).then(wiki => {
      if (!wiki) {
        return callback('Wiki not found');
      }
      const authorized = new Authorizer(req.user, wiki).update();
      if (authorized) {
        wiki
          .update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            callback(null, wiki);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash('notice', 'You are not authorized to do that.');
        callback('Forbidden');
      }
    });
  },
  updatePrivacy(req, callback) {
    return User.findById(req.params.id)
      .then(user => {
        Wiki.update({ private: false }, { where: { userId: user.id } });
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  }
};
