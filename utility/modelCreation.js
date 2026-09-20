const path = require('path');
const fs = require('fs/promises');

const TYPES = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
  objectid: 'mongoose.Schema.Types.ObjectId',
  mixed: 'mongoose.Schema.Types.Mixed'
};

function normalizeModelName(name) {
  const clean = String(name).trim().replace(/[^a-zA-Z0-9_$]/g, '');
  if (!clean || !/^[a-zA-Z_$]/.test(clean)) throw new Error(`Invalid model name: ${name}`);
  return clean;
}

function normalizeFieldName(name) {
  const clean = String(name).trim().replace(/[^a-zA-Z0-9_$]/g, '');
  if (!clean || !/^[a-zA-Z_$]/.test(clean)) throw new Error(`Invalid field name: ${name}`);
  return clean;
}

function schemaValue(value) {
  return JSON.stringify(value);
}

async function generateModel(modelName, fields, options = {}) {
  const name = normalizeModelName(modelName);
  if (!Array.isArray(fields)) throw new Error(`fields must be an array for ${name}`);

  const definitions = [];
  for (const field of fields) {
    if (!field || typeof field !== 'object') throw new Error('Each field must be an object');
    const rawName = Object.keys(field)[0];
    const fieldName = normalizeFieldName(rawName || '');
    const cfg = field[rawName] || {};
    const type = String(cfg.type || 'string').toLowerCase();

    if (type === 'array') {
      const item = TYPES[String(cfg.itemType || 'string').toLowerCase()] || 'String';
      definitions.push(`  ${JSON.stringify(fieldName)}: { type: [${item}] }`);
      continue;
    }

    const mapped = TYPES[type] || 'String';
    const props = [`type: ${mapped}`];
    if (cfg.required) props.push('required: true');
    if (cfg.unique) props.push('unique: true');
    if (cfg.index) props.push('index: true');
    if (cfg.default !== undefined) props.push(`default: ${schemaValue(cfg.default)}`);
    if (Array.isArray(cfg.enum)) props.push(`enum: ${JSON.stringify(cfg.enum)}`);
    if (cfg.min !== undefined) props.push(`min: ${Number(cfg.min)}`);
    if (cfg.max !== undefined) props.push(`max: ${Number(cfg.max)}`);
    if (cfg.minLength !== undefined) props.push(`minlength: ${Number(cfg.minLength)}`);
    if (cfg.maxLength !== undefined) props.push(`maxlength: ${Number(cfg.maxLength)}`);
    definitions.push(`  ${JSON.stringify(fieldName)}: { ${props.join(', ')} }`);
  }

  const schemaOptions = options.timestamps === false ? '' : '{ timestamps: true }';
  const code = `const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
${definitions.join(',\n')}
}, ${schemaOptions || '{}'.replace('{}', '{}')});

module.exports = mongoose.model(${JSON.stringify(name)}, ${name}Schema);
`;

  const dir = path.join(__dirname, '../crudFolders/model');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${name}.js`), code);
  return name;
}

module.exports = generateModel;
module.exports.normalizeModelName = normalizeModelName;
