const path = require('path');
const fs = require('fs/promises');

const generateRouter = async (modelName, options = {}) => {
  const safe = String(modelName).trim().replace(/[^a-zA-Z0-9_$]/g, '');
  const restore = options.softDelete
    ? `router.patch('/${safe}/:id/restore', controller.restore${safe});\n`
    : '';
  const code = `const express = require('express');
const controller = require('../controller/${safe}Controller');

const router = express.Router();

router.post('/${safe}', controller.create${safe});
router.get('/${safe}', controller.get${safe}s);
router.get('/${safe}/:id', controller.get${safe}ById);
router.patch('/${safe}/:id', controller.update${safe});
router.delete('/${safe}/:id', controller.delete${safe});
${restore}
module.exports = router;
`;

  const dir = path.join(__dirname, '../crudFolders/route');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${safe}Route.js`), code);
};

module.exports = generateRouter;
