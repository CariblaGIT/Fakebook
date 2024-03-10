import 'dotenv/config';
import User from "../User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { dbConnection } from "../../../db.js";
import { fakerES as faker } from "@faker-js/faker";

const randomUser = () => {
    let user = {};
    const name = faker.person.fullName()
    user.name = name;
    user.email = (name.replace(/ /g,'')).toLowerCase()+"@gmail.com";
    user.password = bcrypt.hashSync((name.replace(/ /g,''))+"123#", 5);
    return user;
}

export const randomUsersSeeder = async () => {
    try {
        await dbConnection();
        let usersFaker = [];
        for(let i = 0; i < 10; i++){
            const fakeUser = randomUser();
            usersFaker.push(fakeUser)
        }
        await User.create(usersFaker)
    } catch (error) {
        console.log(error.message);
    } finally {
		mongoose.disconnect();
	}
}