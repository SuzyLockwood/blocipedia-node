const userQueries = require('../db/queries.users.js');
const wikiQueries = require('../db/queries.wikis.js');
const passport = require('passport');
const emailConfirmation = require('../routes/api/email');
const publicKey = 'pk_test_Yuj3qIdug9WYWpZ3eIrNIvmB';
const secretKey = process.env.secretTestKey;
var stripe = require('stripe')(secretKey);

module.exports = {
  signUp(req, res, next) {
    res.render('users/sign_up');
  },
  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      role: req.body.role
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', 'You have successfully signed up!');
          emailConfirmation.sendEmail(newUser.email);
          res.redirect('/');
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render('users/sign_in');
  },
  signIn(req, res, next) {
    passport.authenticate('local')(req, res, function() {
      if (!req.user) {
        req.flash('notice', 'Sign in failed. Please try again.');
        res.redirect('/users/sign_in');
      } else {
        req.flash('notice', 'You have successfully signed in!');
        res.redirect('/');
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash('notice', 'You have successfully signed out!');
    res.redirect('/');
  },
  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if (err || result.user === undefined) {
        req.flash('notice', 'No user found with that ID.');
        res.redirect('/');
      } else {
        res.render('users/show', { ...result });
      }
    });
  },
  upgradeForm(req, res, next) {
    res.render('users/upgrade', { publicKey });
  },
  upgrade(req, res, next) {
    const email = req.body.stripeEmail;
    const token = req.body.stripeToken;
    stripe.customers
      .create({
        email: email,
        source: token
      })
      .then(customer => {
        let customerCharge = stripe.charges.create({
          amount: 999,
          description: 'Blocipedia Premium Membership',
          currency: 'usd',
          customer: customer.id
        });
        return customerCharge;
      })
      .then(charge => {
        if (charge) {
          userQueries.updateUserRole(req.params.id, 1, (err, user) => {
            if (err || user == null) {
              console.log(err);
              res.redirect(404, '/');
            } else {
              req.flash(
                'notice',
                'You have successfully upgraded to a Premium account!'
              );
              res.redirect('/');
            }
          });
        } else {
          req.flash('notice', 'Error upgrading. Please try again.');
          res.redirect(`users/${req.user.id}`);
        }
      });
  },

  downgradeForm(req, res, next) {
    res.render('users/downgrade', { publicKey });
  },
  downgrade(req, res, next) {
    userQueries.updateUserRole(req.params.id, 0, (err, user) => {
      if (err || !user) {
        res.redirect(404, '/');
      } else {
        res.redirect('/');
      }
    });
    wikiQueries.updatePrivacy(req, (err, user) => {
      if (err || user == null) {
        req.flash('notice', 'Error downgrading. Please try again.');
        res.redirect(err, '/');
      } else {
        req.flash(
          'notice',
          'You have successfully downgraded to a Standard account. All Private Wikis are now Public.'
        );
        res.redirect('/');
      }
    });
  }
};
