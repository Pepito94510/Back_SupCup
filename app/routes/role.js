var express = require('express');
var router = express.Router();

const role = require('../models/role');

/**
 * @swagger
 * 
 *  components:
 *      schema:
 *          role:
 *              type: object
 *              properties: 
 *                  name:
 *                      type: string
 */

router.get('/', async(req, res) => {
    let roles = await role.findAll();
    res.status(200).json(roles);
});

/**
 * @swagger
 * /role/{roleId}:
 *  get:
 *      tags: 
 *          - Role
 *      description: Retourne les informations d'un role en fonction de son id
 *      parameters: 
 *          - in: path
 *            name: roleId
 *            description: id du role
 *      responses: 
 *          200:
 *              description: Retourne les informations d'un role
 *          404:
 *              description: L'id role saisie n'est pas connu ne base de données
 */
router.get('/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);
    res.status(200).json(aRole);
});

/**
 * @swagger
 * /role/create/{roleId}:
 *  post:
 *      tags: 
 *          - Role
 *      description: Retourne les informations d'un role en fonction de son id
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/role'
 *      parameters: 
 *          - in: path
 *            name: roleId
 *            description: id du role
 *      responses: 
 *          200:
 *              description: Retourne les informations d'un role
 *          404:
 *              description: L'id role saisie n'est pas connu ne base de données
 */
router.post('/create', async(req, res) => {
    console.log(req.body);

    const newRole = role.build({
        Name: req.body.name,
    });

    await newRole.save();

    res.send("Role_created");
});

/**
 * @swagger
 * /role/update/{roleId}:
 *  put:
 *      tags: 
 *          - Role
 *      description: Modifie les informations d'un role en fonction de son id
 *      requestBody: 
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/role'
 *      parameters: 
 *          - in: path
 *            name: roleId
 *            description: id du role
 *      responses: 
 *          200:
 *              description: Modifie les informations d'un role
 *          404:
 *              description: L'id role saisie n'est pas connu ne base de données
 */
router.put('/update/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);

    if (req.body.name) {
        aRole.Name = req.body.name;
    }

    await aRole.save();

    res.send("Role_updated");
});

/**
 * @swagger
 * /role/delete/{roleId}:
 *  delete:
 *      tags: 
 *          - Role
 *      description: Supprime un role en fonction de son id
 *      parameters: 
 *          - in: path
 *            name: roleId
 *            description: id du role
 *      responses: 
 *          200:
 *              description: Supprime un role
 *          404:
 *              description: L'id role saisie n'est pas connu ne base de données
 */
router.delete('/delete/:roleId', async(req, res) => {
    let { roleId } = req.params;
    let aRole = await role.findByPk(roleId);

    await aRole.destroy();

    res.send("Role_deleted");
});

module.exports = router;
