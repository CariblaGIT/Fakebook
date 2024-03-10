import { seederDefaultUsers } from "./entities/user/seeder/seederDefaultUsers.js"
import { randomUsersSeeder } from "./entities/user/seeder/seederRandomUsers.js";

const seeder = async () => {
    await seederDefaultUsers();
    await randomUsersSeeder();
}

seeder();