const express = require('express');
const router = express.Router();
const transactionsController = require('../../controllers/transactionsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), transactionsController.transferHandler)


module.exports = router;