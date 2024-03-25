import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import role from "../models/roleModel.js";

export async function getRoles() {
    const allRoles = await role.findAll();
    return allRoles;
} 

export async function getRole(roleId) {
    const oneRole = await role.findByPk(roleId);
    return oneRole;
}

export async function addRole(roleName) {
    const newRole = role.build({
        name: roleName
    })
    newRole.save();
    return true;
}

export async function updateRole(roleObject, roleName) {
    roleObject.name = roleName
    await roleObject.save();
    return roleObject;
}

export async function deleteRole(roleObject) {
    await roleObject.destroy();
    return true;
}
