const express = require('express');
const { crudBuilder } = require('../controller/crudBuilderController');

const router = express.Router();
router.post('/crud-builder', crudBuilder);

module.exports = router;
