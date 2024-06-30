
        const express = require('express');
        const router = express.Router();

        router.post('/create/Product', ProductCreation);
        router.get('/get/Product/?', ProductGet);
        router.patch('/update/Product', ProductUpdation);
        router.delete('/delete/Product', ProductDeletion);
        module.exports = router;
    