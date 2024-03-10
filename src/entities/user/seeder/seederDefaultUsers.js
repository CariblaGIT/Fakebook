import 'dotenv/config';
import User from "../User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { dbConnection } from "../../../db.js"

export const seederDefaultUsers = async () => {
    try {
		await dbConnection();
		await User.create([
			{
                name: "superAdmin",
				email: "auperadmin@superadmin.com",
                password: bcrypt.hashSync('superAdmin123#', 5),
                role: "super_admin"
			},
			{
                name: "admin",
				email: "admin@admin.com",
				password: bcrypt.hashSync('Admin1234#', 5),
                role: "admin"
			},
            {
                name: "user",
                email: "user@user.com",
				password: bcrypt.hashSync('User12345#', 5),
                role: "user"
            },
            {
                name: "user2",
                email: "user2@user2.com",
				password: bcrypt.hashSync('User12345#', 5),
                role: "user"
            }
		]);
		console.log("User created");
	} catch (error) {
		console.log(error);
	} finally {
		mongoose.disconnect();
	}
}