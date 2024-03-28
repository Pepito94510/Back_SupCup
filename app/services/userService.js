import { QueryTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import user from "../models/userModel.js";
// import { genSaltSync, hash, compare } from 'bcrypt';

export async function getUsers() {
    let users = await user.findAll();
    return users;
}

export async function getUser(userId) {
    let oneUser = await user.findByPk(userId);
    return oneUser;
}

export async function findUserByMail(email) {
    let oneUser = await user.findOne({ where: { email: email } });
    return oneUser;
}

export async function createUser(userObject) {
    const salt = genSaltSync(10);
    const hashedPass = await hash(userObject.password, salt);

    const newUser = user.build({
        last_name: userObject.last_name,
        first_name: userObject.first_name,
        email: userObject.email,
        telephone: userObject.telephone,
        password: hashedPass,
        role_id: 1
    });
    await newUser.save();
    return newUser;
}

export async function upadteUser(userId, first_name, last_name, email, telephone, role_id) {
    let userObject = await getUser(userId);
    userObject.first_name = first_name;
    userObject.last_name = last_name;
    userObject.email = email;
    userObject.telephone = telephone;
    userObject.role_id = role_id;

    await userObject.save();
    return userObject;
}

export async function deleteUser(userId) {
    let userObject = await getUser(userId);
    await userObject.destroy();
    return 'User deleted';
}

export async function checkPassword(bodyPassword, userPassword) {
    let check = await compare(bodyPassword, userPassword);
    return check;
}
