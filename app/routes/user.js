var express = require('express');
var router = express.Router();

const user = require('../models/user');

router.get('/', async(req, res) => {
    let users = await user.findAll();
    res.status(200).json(users);
});

router.get('/:userId', async(req, res) => {
    let { userId } = req.params;
    let unUser = await user.findByPk(userId);
    res.status(200).json(unUser);
});

router.post('/create', async(req, res) => {
    console.log(req.body);

    const newUser = user.build({
        Nom: req.body.nom,
        Prenom: req.body.prenom,
        Email: req.body.email,
        Telephone: req.body.telephone,
    });

    await newUser.save();

    res.send("User_created");
});

router.post('/update/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    if (req.body.nom) {
        aUser.Nom = req.body.nom;
    }
    if (req.body.prenom) {
        aUser.Prenom = req.body.prenom;
    }
    if (req.body.email) {
        aUser.Email = req.body.email;
    }
    if (req.body.telephone) {
        aUser.Telephone = req.body.telephone;
    }

    await aUser.save();

    res.send("User_updated");
});

router.post('/delete/:userId', async(req, res) => {
    let { userId } = req.params;
    let aUser = await user.findByPk(userId);

    await aUser.destroy();

    res.send("User_deleted");
});

module.exports = router;