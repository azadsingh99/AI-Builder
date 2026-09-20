const path = require('path');
const fs = require('fs/promises');
const generateModel = require('../utility/modelCreation');
const generateRouter = require('../utility/routerCreation');
const generateController = require('../utility/controllerCreation');
const createBaseFile = require('../utility/baseStrctureCreation');
const zipFolder = require('../utility/zipCreation');

function validatePayload(body) {
  if (!body || !Array.isArray(body.modelData) || body.modelData.length === 0) {
    throw new Error('modelData must be a non-empty array');
  }
  for (const model of body.modelData) {
    if (!model || typeof model.name !== 'string' || !model.name.trim()) {
      throw new Error('Each model requires a non-empty name');
    }
    if (!Array.isArray(model.fields)) throw new Error('fields must be an array');
  }
}

const crudBuilder = async (req, res) => {
  try {
    validatePayload(req.body);
    const root = path.join(__dirname, '../crudFolders');
    const zipDir = path.join(__dirname, '../public/zip');
    await fs.rm(root, { recursive: true, force: true });
    await fs.mkdir(zipDir, { recursive: true });

    const options = req.body.options || {};
    await createBaseFile();

    for (const model of req.body.modelData) {
      await generateModel(model.name, model.fields, options);
      await generateController(model.name, model.fields, options);
      await generateRouter(model.name, options);
    }

    const zipPath = path.join(zipDir, 'crudFolders.zip');
    await fs.rm(zipPath, { force: true });
    await zipFolder(root, zipPath);

    const baseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/$/, '');
    res.status(200).json({
      success: true,
      message: 'CRUD project generated successfully',
      models: req.body.modelData.map(m => m.name),
      downloadUrl: `${baseUrl}/public/zip/crudFolders.zip`
    });
  } catch (error) {
    console.error('CRUD Builder error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { crudBuilder };
