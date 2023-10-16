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
    console.log(req.body);

    const newUser = user.build({
        FirstName: req.body.first_name,
        LastName: req.body.last_name,
        Email: req.body.email,
        Telephone: req.body.telephone,
    });

    await newUser.save();

    res.send("User_created");
});

router.post('/update/:userId', async(req, res) => {
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
