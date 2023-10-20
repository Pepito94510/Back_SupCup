var express = require('express');
var router = express.Router();

const role = require('../models/role');

router.get('/', async(req, res) => {
    let roles = await role.findAll();
    res.status(200).json(roles);
});

router.get('/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);
    res.status(200).json(aRole);
});

router.post('/create', async(req, res) => {
    console.log(req.body);

    const newRole = role.build({
        Name: req.body.name,
    });

    await newRole.save();

    res.send("Role_created");
});

router.post('/update/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);

    if (req.body.name) {
        aRole.Name = req.body.name;
    }

    await aRole.save();

    res.send("Role_updated");
});

router.post('/delete/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);

    await aRole.destroy();

    res.send("Role_deleted");
});

module.exports = router;
