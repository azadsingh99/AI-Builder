const express = require('express');
const router = express.Router();
const { crudBuilder } = require('../controller/crudBuilderController');

router.post('/crud-builder', crudBuilder);
module.exports = router;