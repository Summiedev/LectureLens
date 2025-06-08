const express = require('express');
const router = express.Router();

const authRoutes = require('../routes/authRoutes');
const sessionRoutes = require('../routes/sessionRoutes');   

const userRoutes = require('./userRoutes'); 
 

router.use('/auth', authRoutes);
router.use('/sessions', sessionRoutes); 

router.get('/', (req, res) => {
    res.send('API is working!');
});

module.exports = router;
