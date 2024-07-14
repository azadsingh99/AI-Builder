const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const generateModelIndividually = (modelName, fields) => {
    try {
        const schemaDefinition = {};
        fields.forEach(field => {
            const fieldName = Object.keys(field)[0];
            const fieldProperties = field[fieldName];
            let fieldType;

            switch (fieldProperties.type.toLowerCase()) {
                case 'string':
                    fieldType = String;
                    break;
                case 'number':
                    fieldType = Number;
                    break;
                case 'boolean':
                    fieldType = Boolean;
                    break;
                case 'date':
                    fieldType = Date;
                    break;
                case 'array':
                    fieldType = [fieldProperties.itemType || String];
                    break;
                default:
                    fieldType = String;
            }

            schemaDefinition[fieldName] = {
                type: fieldType,
                required: fieldProperties.required || false,
                unique: fieldProperties.unique || false
            };
        });

        const schema = new mongoose.Schema(schemaDefinition);
        const modelCode = `
            const mongoose = require('mongoose');
            const ${modelName}Schema = new mongoose.Schema(${JSON.stringify(schemaDefinition, null, 2)});
            module.exports = mongoose.model('${modelName}', ${modelName}Schema);
        `;
        const folderPath = path.join(__dirname, '../crudFolders/model');

        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, `${modelName}.js`);
        fs.writeFileSync(filePath, modelCode);

        return (`Model ${modelName} created at ${filePath}`);
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports = generateModelIndividually;