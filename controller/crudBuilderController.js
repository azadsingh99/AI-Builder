const crudBuilderInitialized = require("../library/modelCreation");

const crudBuilder = async(req, res) => {
    try{
        const {modelData} = req.body;
        console.log('Starting with the process of creating the model....')
        const modelCreationResponse = await crudBuilderInitialized(modelData);

        return res.status(200).json(modelCreationResponse);
    }catch(err){
        console.log('ERROR ::: ', err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {
    crudBuilder
}