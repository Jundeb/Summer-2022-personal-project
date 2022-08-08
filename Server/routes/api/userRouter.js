const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User) ,userController.getOneUser);

module.exports = router;