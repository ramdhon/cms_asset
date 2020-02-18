const User = require('../models/user');
const { sign } = require('../helpers/jwt');
const { decrypt } = require('../helpers/bcrypt');

class AuthController {
  static registerAdmin(req, res, next) {
    const { name, email, password } = req.body;
    
    User
      .create({ name, email, password, role: 'admin', created: new Date(), updated: new Date(), lastLogin: null })
      .then(newUser => {
        res
          .status(201)
          .json({
            message: 'Admin registered',
            newUser
          });
      })
      .catch(err => {
        next(err);
      });
  }

  static register(req, res, next) {
    const { name, email, password } = req.body;

    User
      .create({ name, email, password, role: 'user', created: new Date(), updated: new Date(), lastLogin: null })
      .then(newUser => {
        res
          .status(201)
          .json({
            message: 'User registered',
            newUser
          });
      })
      .catch(err => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    User
      .findOne({
        email
      })
      .then(foundUser => {
        if (!foundUser) {
          const err = {
            status: 400,
            message: 'Email / password incorrect'
          }
          next(err);
        } else {
          if (decrypt(password, foundUser.password)) {
            const token = sign({
              _id: foundUser._id, 
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role
            });

            const newDate = new Date();
            foundUser.lastLogin = newDate;
            foundUser.update({ lastLogin: newDate }).then((info) => console.log('LOGGED IN', { foundUser, info }));

            res
              .status(200)
              .json({
                message: 'Login success',
                token
              });
          } else {
            const err = {
              status: 400,
              message: 'Email / password incorrect'
            }
            next(err);
          }
        }
      })
      .catch(err => {
        next(err);
      });
  }

  static add(req, res, next) {
    const { name, email, password, role } = req.body;

    User
      .create({ name, email, password, role, created: new Date(), updated: new Date(), lastLogin: null })
      .then(newUser => {
        res
          .status(201)
          .json({
            message: 'User added',
            newUser
          });
      })
      .catch(err => {
        next(err);
      });
  }
  
  static findAll(req, res, next) {
    //add query above, alter below as needed
    let query = {};

    if(req.query.search) {
      let search = new RegExp(req.query.search)
      
      query = { $or: [
        {name: { $regex: search, $options: 'i' }}, 
        {email: { $regex: search, $options: 'i' }}, 
        {role: { $regex: search, $options: 'i' }}, 
        //sulap-add-query
      ]}
    }

    User
      .find(query)
      .then(users => {
        if (!users.length) {
          res
            .status(200)
            .json({
              message: 'no data of users'
            })
        } else {
          res
            .status(200)
            .json({
              message: 'users found',
              users
            })
        }
      })
  }

  static findOne(req, res, next) {
    const { user } = req;

    res
      .status(200)
      .json({
        message: 'user found',
        user
      })
  }

  static update(req, res, next) {
    const { name, email, role } = req.body;
    const { user } = req;

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    const newDate = new Date();
    user.updated = newDate;
    
    user
      .update({
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
        updated: newDate
      })
      .then(info => {
        res
          .status(200)
          .json({
            message: 'User updated',
            updatedUser: user,
            info
          })
      })
      .catch()
  }
  static resetPassword(req, res, next) {
    const { password } = req.body;
    const { user } = req;

    user.password = password;
    user.updated = new Date();

    user
      .save()
      .then(updatedUser => {
        res
          .status(200)
          .json({
            message: 'User password reset',
            updatedUser
          })
      })
      .catch()
  }

  static delete(req, res, next) {
    const { user } = req;

    user
      .delete()
      .then(deletedUser => {
        res
          .status(200)
          .json({
            message: 'User deleted',
            deletedUser
          })
      })
      .catch()
  }

  static decode(req, res, next) {
    const { decoded } = req;
    res.status(200).json({ message: 'token decoded', decoded });
  }
}

module.exports = AuthController;