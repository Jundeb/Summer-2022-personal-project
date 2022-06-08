const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/accountController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin),accountController.createNewAccount)

module.exports = router;