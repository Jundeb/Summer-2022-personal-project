const express = require('express');
const router = express.Router();
const personalInfoController = require('../../controllers/personalInfoController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(personalInfoController.updateInfo)

module.exports = router;