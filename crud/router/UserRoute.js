
        const express = require('express');
        const router = express.Router();

        router.post('/create/User', UserCreation);
        router.get('/get/User/?', UserGet);
        router.patch('/update/User', UserUpdation);
        router.delete('/delete/User', UserDeletion);
        module.exports = router;
    