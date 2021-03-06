const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaboratorController');
const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;

router.get('/wikis/:wikiId/collaborators', collaboratorController.edit);
router.post('/wikis/:wikiId/collaborators/add', collaboratorController.add);
router.post('/wikis/:wikiId/collaborators/remove', collaboratorController.remove);

module.exports = router;
