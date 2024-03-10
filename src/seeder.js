import { seederDefaultPosts } from "./entities/post/seeder/seederDefaultPosts.js";
import { seederDefaultUsers } from "./entities/user/seeder/seederDefaultUsers.js"
import { randomUsersSeeder } from "./entities/user/seeder/seederRandomUsers.js";

const seeder = async () => {
    await seederDefaultUsers();
    await randomUsersSeeder();
    await seederDefaultPosts();
}

seeder();