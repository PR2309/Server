const express = require('express');
const registerUser = require('../Controller/registerUser');
const loginUser = require('../Controller/login');
// const Ai = require('../Controller/Ai');



const router = express.Router();

router.post('/signup',registerUser)
// router.post('/ai/ans',Ai);
router.post('/login', loginUser);
module.exports = router;


