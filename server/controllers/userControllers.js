const { Teacher, Student } = require('../models');
const { signToken } = require('../utils/auth');
const paramsConfig = require('../utils/params-config');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const obj = {
  student: Student,
  teacher: Teacher,
};

module.exports = {
  async createUser(req, res) {
    try {
      const user = await obj[req.params.userRole].create(req.body);
      const token = signToken(user);
      res.cookie('token', token, { httpOnly: true }).json({ message: `Successfully created ${req.params.userRole}!`, user });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async uploadImage(req, res) {
    const s3Params = paramsConfig(req.file);
    try {
      const imageData = await s3.upload(s3Params).promise();
      res.status(200).json(imageData);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  async loginUser(req, res) {
    try {
      const user = await obj[req.params.userRole].findOne({ email: req.body.email });

      if (!user) {
        return res.status(401).json({ message: 'No user found!' });
      }

      const correctPw = await user.isCorrectPassword(req.body.password);

      if (!correctPw) {
        return res.status(401).json({ message: 'Incorrect credentials' });
      }

      const token = signToken(user);
      res.cookie('token', token, { httpOnly: true }).json({ message: 'Succesfully logged in!', id: user._id });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getAllUsers(req, res) {
    const shouldPopulateStudents = req.params.userRole === 'teacher' ? 'students' : '';
    try {
      const users = await obj[req.params.userRole].find().populate(shouldPopulateStudents).select('-__v');
      if (!users) {
        return res.status(401).json({ message: 'No user found!' });
      }

      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getUserById(req, res) {
    const shouldPopulateStudents = req.params.userRole === 'teacher' ? 'students' : '';
    try {
      const user = await obj[req.params.userRole].findById(req.params.id).populate(shouldPopulateStudents).select('-__v');
      if (!user) {
        return res.status(401).json({ message: 'No user found!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
