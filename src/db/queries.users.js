const User = require('./models').User;
const bcrypt = require('bcryptjs');

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
  getUser(id, callback) {
    User.findById(id)
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  updateUserRole(user, action) {
    let newRole;
    User.findOne({
      where: { email: user.email }
    }).then(user => {
      if (action === 'upgrade') {
        newRole = 'premium';
      } else if (action === 'downgrade') {
        newRole = 'standard';
      }
      user.update({
        role: newRole
      });
    });
  }
};
