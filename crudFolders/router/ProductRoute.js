
        const express = require('express');
        const router = express.Router();
        const { ProductCreation, ProductUpdation, ProductgetAll, getProductById, Productdeletion } = require('../controller/ProductController');

        router.post('/create', ProductCreation);
        router.get('/', ProductgetAll);
        router.get('/:id', getProductById);
        router.patch('/:id', ProductUpdation);
        router.delete('/:id', Productdeletion);

        module.exports = router;
    