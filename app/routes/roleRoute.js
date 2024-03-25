import { Router } from "express";
const roleRouter = Router();
import { checkToken, createTokenFromData } from "../utils/tokens.js";
import * as roleService from '../services/roleService.js'

roleRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allRoles = await roleService.getRoles();
        res.json(allRoles).status(200);
    }
});

roleRouter.get('/find-one/:roleId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let oneRole = await roleService.getRole(req.params.roleId);
        if (!oneRole) {
            res.json('Error: This role id is unknow in database').status(404);
        } else {
            res.json(oneRole).status(200);
        }
    }
});

roleRouter.post('/create', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        if (!req.body.roleName) {
            res.json('Error: roleName key is required').status(404);
        } else {
            let newRole = await roleService.addRole(req.body.roleName);
            res.json(newRole).status(201);
        }
    }
});

roleRouter.put('/update/:roleId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        if (!req.body.roleName) {
            res.json('Error: roleName key is required').status(404);
        } else {
            let checkRoleId = await roleService.getRole(req.params.roleId);
            if (!checkRoleId) {
                res.json('Error: This role id is unknow in database').status(404);
            } else {
                let roleUpdated = await roleService.updateRole(checkRoleId, req.body.roleName);
                res.json(roleUpdated).status(200);
            }
        }
    }
});

roleRouter.delete('delete/:roleId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        let checkRoleId = await roleService.getRole(req.params.roleId);
        if (!checkRoleId) {
            res.json('Error: This role id is unknow in database').status(404);
        } else {
            await roleService.deleteRole(checkRoleId);
            res.json('Role deleted').status(200);
        }
    }
});

export default roleRouter;
