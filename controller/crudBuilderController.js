const crudControllerCreation = require("../utility/controllerCreation");
const generateModelIndividually = require("../utility/modelCreation");
const generateCrudRouter = require("../utility/routerCreation");
const zipFolder = require("../utility/zipCreation");

const path = require('path');
const fs = require('fs'); 

const crudBuilder = async(req, res) => {
    try{
        await createBaseFile();
        for (let model of req.body.modelData) {
            const name = model.name;
            const fields = model.fields;

            console.log('Model Creation Initialized......');
            await generateModelIndividually(name, fields);
            console.log('Router Creation Initialized......');
            await generateCrudRouter(name);
            await crudControllerCreation(name, fields);
        }

        const crudFolderPath = path.join(__dirname, '../crudFolders');
        const zipFolderPath = path.join(__dirname, '../public/zip');
        const zipFilePath = path.join(zipFolderPath, 'crudFolders.zip');
        await zipFolder(crudFolderPath, zipFilePath);

        // Return the URL or path to the zip file
        const modelCreationResponse =  `http://localhost:3001/public/zip/${path.basename(zipFilePath)}`;
        return res.status(200).json(modelCreationResponse);
    }catch(err){
        console.log('ERROR ::: ', err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    crudBuilder
}