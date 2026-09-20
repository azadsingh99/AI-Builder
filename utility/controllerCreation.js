const path = require('path');
const fs = require('fs/promises');

const generateController = async (modelName, fields, options = {}) => {
  const safeModel = String(modelName).trim().replace(/[^a-zA-Z0-9_$]/g, '');
  const fieldNames = fields.map(f => Object.keys(f || {})[0]).filter(Boolean);
  if (!safeModel || !/^[a-zA-Z_$]/.test(safeModel)) throw new Error(`Invalid model name: ${modelName}`);

  const assignments = fieldNames.map(name =>
    `    if (req.body[${JSON.stringify(name)}] !== undefined) data[${JSON.stringify(name)}] = req.body[${JSON.stringify(name)}];`
  ).join('\n');

  const searchFields = fields
    .filter(f => String((f[Object.keys(f)[0]] || {}).type || '').toLowerCase() === 'string')
    .map(f => Object.keys(f)[0]);

  const softDeleteFilter = options.softDelete ? '    filter.deletedAt = null;\n' : '';
  const softDeleteUpdate = options.softDelete
    ? `    const item = await ${safeModel}.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });`
    : `    const item = await ${safeModel}.findByIdAndDelete(req.params.id);`;
  const restore = options.softDelete
    ? `
const restore${safeModel} = async (req, res) => {
  try {
    const item = await ${safeModel}.findByIdAndUpdate(req.params.id, { deletedAt: null }, { new: true });
    if (!item) return res.status(404).json({ message: '${safeModel} not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
`
    : '';

  const code = `const ${safeModel} = require('../model/${safeModel}');

const create${safeModel} = async (req, res) => {
  try {
    const data = {};
${assignments}
    const item = await ${safeModel}.create(data);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const get${safeModel}s = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
${softDeleteFilter}    for (const [key, value] of Object.entries(req.query)) {
      if (!['page', 'limit', 'sort', 'search'].includes(key)) filter[key] = value;
    }

    if (req.query.search && ${JSON.stringify(searchFields)}.length) {
      filter.$or = ${JSON.stringify(searchFields)}.map(field => ({
        [field]: { $regex: String(req.query.search), $options: 'i' }
      }));
    }

    const sort = req.query.sort || '-createdAt';
    const [data, total] = await Promise.all([
      ${safeModel}.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      ${safeModel}.countDocuments(filter)
    ]);

    res.json({
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const get${safeModel}ById = async (req, res) => {
  try {
    const item = await ${safeModel}.findById(req.params.id);
    if (!item${options.softDelete ? ' || item.deletedAt' : ''}) {
      return res.status(404).json({ message: '${safeModel} not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const update${safeModel} = async (req, res) => {
  try {
    const data = {};
${assignments}
    const item = await ${safeModel}.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: '${safeModel} not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete${safeModel} = async (req, res) => {
  try {
${softDeleteUpdate}
    if (!item) return res.status(404).json({ message: '${safeModel} not found' });
    res.json({ message: '${safeModel} deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
${restore}
module.exports = {
  create${safeModel},
  get${safeModel}s,
  get${safeModel}ById,
  update${safeModel},
  delete${safeModel}${options.softDelete ? `, restore${safeModel}` : ''}
};
`;

  const dir = path.join(__dirname, '../crudFolders/controller');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${safeModel}Controller.js`), code);
};

module.exports = generateController;
