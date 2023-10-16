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
    let userBDD = await user.findOne({ where: { Email: req.body.email } });
    
    if(userBDD) { 
        res.status(200).json('User already created')
        console.log('User already created') 
    } else {
        const newUser = user.build({
            Nom: req.body.nom,
            Prenom: req.body.prenom,
            Email: req.body.email,
            Telephone: req.body.telephone,
            Role_id: req.body.role
        });
        await newUser.save();

        res.send("User created").status(201);
    }   
});

router.put('/update/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    if (req.body.first_name) {
        aUser.FirstName = req.body.first_name;
    }
    if (req.body.last_name) {
        aUser.LastName = req.body.last_name;
    }
    if (req.body.email) {
        aUser.Email = req.body.email;
    }
    if (req.body.telephone) {
        aUser.Telephone = req.body.telephone;
    }
    if (req.body.role) {
        aUser.Role_id = req.body.role;
    }
    

    await aUser.save();

    res.send("User updated").status(200);
});

router.delete('/delete/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    await aUser.destroy();

    res.send("User deleted").status(200);
});

module.exports = router;
