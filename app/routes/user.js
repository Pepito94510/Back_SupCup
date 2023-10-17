var express = require('express');
var router = express.Router();

const user = require('../models/user');

router.get('/', async(req, res) => {
    let users = await user.findAll();
    res.status(200).json(users);
});

router.get('/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);
    res.status(200).json(aUser);
});

router.post('/create', async(req, res) => {
    let userBDD = await user.findOne({ where: { email: req.body.email } });
    
    if(userBDD) { 
        res.status(200).json('User already created')
        console.log('User already created') 
    } else {
        const newUser = user.build({
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            email: req.body.email,
            telephone: req.body.telephone,
            role_id: req.body.role
        });
        await newUser.save();

        res.json("User created").status(201);
    }   
});

router.put('/update/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    if (req.body.first_name) {
        aUser.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
        aUser.last_name = req.body.last_name;
    }
    if (req.body.email) {
        aUser.email = req.body.email;
    }
    if (req.body.telephone) {
        aUser.telephone = req.body.telephone;
    }
    if (req.body.role) {
        aUser.role_id = req.body.role;
    }
    

    await aUser.save();

    res.json("User updated").status(200);
});

router.delete('/delete/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    await aUser.destroy();

    res.json("User deleted").status(200);
});

module.exports = router;
