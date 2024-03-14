import 'dotenv/config';
import app from "../app.js";
import bcrypt from "bcrypt";
import request from "supertest";
import mongoose from "mongoose";
import { dbConnection } from "../db.js";

let server;
let superAdminToken;
let notSuperAdminToken;
let userCreatedInTestsId;
let postCreatedInTestsId;
let commentCreatedInTestId;
const userFromSeederId = "65ed7d2f6fa9305f1c424410";
const superAdminFromSeederId = "65ed7d2f6fa9305f1c42440d";

beforeAll(async () => {
    await dbConnection()
    server = app.listen(4000)
})

describe("Healthy API endpoint" , () => {
    test("Checking server is up", async () => {
        const {status, body} = await request(server)
            .get('/api/healthy')
        expect(status).toBe(200)
        expect(body.message).toBe("Server is healthy :D")
    })
})

describe("Auth API endpoints" , () => {
    test("Register user bad => Not giving params", async () => {
    const {status, body} = await request(server)
        .post('/api/auth/register')
        .send({
            name: "userTest",
            password: 'UserTest12345#'
        })
    expect(status).toBe(400)
    expect(body.message).toBe("Needed to have an email, a password and a name")
    })

    test("Register user bad => Not giving correct email", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "12345",
                password: 'UserTest12345#'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("Format email invalid")
        })
    
    test("Register user bad => Not giving correct password", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "usertest@usertest.com",
                password: 'user random password'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("Format password invalid")
    })

    test("Register user correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "usertest@usertest.com",
				password: 'UserTest12345#'
            })
        expect(status).toBe(201)
        expect(body.message).toBe("User registered succesfully")
    })

    test("Login user bad => Not giving params", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
				password: 'UserTest12345#'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("Needed to have an email and a password")
    })

    test("Login user bad => Not giving correct email", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "Not An Email",
				password: 'UserTest12345#'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("Format email invalid")
    })

    test("Login user bad => Not users created params", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "baduser@baduser.com",
				password: 'UserNotPassword#12345'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("No user exists, try again")
    })

    test("Login user bad => Not correct password", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "usertest@usertest.com",
				password: 'UserNotPassword#12345'
            })
        expect(status).toBe(400)
        expect(body.message).toBe("Email or password invalids")
    })

    test("Login user correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "usertest@usertest.com",
				password: 'UserTest12345#'
            })
        notSuperAdminToken = body.token
        expect(status).toBe(200)
        expect(body.message).toBe("User logged successfully")
    })

    test("Login superAdmin correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "superadmin@superadmin.com",
				password: 'superAdmin123#'
            })
        superAdminToken = body.token
        expect(status).toBe(200)
        expect(body.message).toBe("User logged successfully")
    })
})

describe ("Users API endpoints" , () => {
    test("Getting user by email bad => Not superAdmin role", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=notauseremail@notauseremail.com")
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(401)
        expect(body.message).toBe("Unauthorized")
    })

    test("Getting user by email bad => Not giving an user email", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=notauseremail@notauseremail.com")
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(404)
        expect(body.message).toBe("You cant find a user with that email")
    })

    test("Getting user by email correctly", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=usertest@usertest.com")
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("User retrieved succesfully")
    })

    test("Getting all user correctly", async () => {
        const {status, body} = await request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Users retrieved succesfully")
        expect(body.data.length).toBe(15)
    })

    test("Getting user by token correctly", async () => {
        const {status, body} = await request(server)
            .get("/api/users/profile")
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        userCreatedInTestsId = body.data._id
        expect(status).toBe(200)
        expect(body.message).toBe("User profile retrieved succesfully")
        expect(body.data.name = "userTest")
    })

    test("Getting posts from user bad => No posts", async () => {
        const {status, body} = await request(server)
            .get(`/api/users/posts/${superAdminFromSeederId}`)
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(404)
        expect(body.message).toBe("No posts from that user have been found")
    })

    test("Getting posts from user correctly", async () => {
        const {status, body} = await request(server)
            .get(`/api/users/posts/${userFromSeederId}`)
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Posts retrieved succesfully")
        expect(body.data.length = 1)
    })

    test("Modifying user bad => Not giving data", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Need to bring data to update a user")
    })

    test("Modifying user name by token correctly", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .send({
                name: "UserTestChanged"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("User profile updated succesfully")
        expect(body.data.name = "UserTestChanged")
    })

    test("Modifying user email by token bad => Wrong email format", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .send({
                email: "bademailinsert"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Email format invalid")
    })

    test("Modifying user email by token correctly", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .send({
                email: "usertestchanged@usertestchanged.com"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("User profile updated succesfully")
        expect(body.data.email = "usertestchanged@usertestchanged.com")
    })

    test("Modifying user password by token bad => Wrong password format", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .send({
                password: "potatoe"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Format password invalid")
    })

    test("Modifying user password by token correctly", async () => {
        const {status, body} = await request(server)
            .put("/api/users/profile")
            .send({
                password: "UserTestChangedPassword123#"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("User profile updated succesfully")
        expect(body.data.password = bcrypt.hashSync("UserTestChangedPassword123#", 5))
    })

    test("Modifying user role bad => Not giving params", async () => {
        const {status, body} = await request(server)
            .put(`/api/users/${userFromSeederId}/role`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Need a role to update a user role")
    })

    test("Modifying user role bad => Not giving correct role", async () => {
        const {status, body} = await request(server)
            .put(`/api/users/${userFromSeederId}/role`)
            .send({
                role: "not_a_role_from_db"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Not valid role")
    })

    test("Modifying user role correctly", async () => {
        const {status, body} = await request(server)
            .put(`/api/users/${userFromSeederId}/role`)
            .send({
                role: "admin"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Changed role succesfully")
        expect(body.data.role = "admin")
    })

    test("Deleting user correctly", async () => {
        const {status, body} = await request(server)
            .delete(`/api/users/${userCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("User deleted succesfully")
    })
})

describe ("Posts API endpoints" , () => {
    test("Posting by token bad => No given minimum text", async () => {
        const {status, body} = await request(server)
            .post('/api/posts/')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("Needed to have a text to create a post")
    })

    test("Posting by token correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/posts/')
            .send({
                text: "Today has been a great day for uploading a comment on Fakebook"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        postCreatedInTestsId = body.data._id
        expect(status).toBe(201)
        expect(body.message).toBe("Post uploaded succesfully")
        expect(body.data.owner = superAdminFromSeederId)
        expect(body.data.text = "Today has been a great day for uploading a comment on Fakebook")
    })

    test("Getting posts correctly", async () => {
        const {status, body} = await request(server)
            .get('/api/posts/')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Posts retrieved succesfully")
        expect(body.data.length = 3)
    })

    test("Getting own posts bad => No posts from user", async () => {
        const {status, body} = await request(server)
            .get('/api/posts/own')
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(404)
        expect(body.message).toBe("No posts from that user have been found")
    })

    test("Getting own posts correctly", async () => {
        const {status, body} = await request(server)
            .get('/api/posts/own')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Posts retrieved succesfully")
        expect(body.data.length = 1)
    })

    test("Getting post by id bad => Not existed post", async () => {
        const {status, body} = await request(server)
            .get('/api/posts/1')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(500)
    })

    test("Getting post by id correctly", async () => {
        const {status, body} = await request(server)
            .get(`/api/posts/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Post retrieved succesfully")
        expect(body.data.text = "Today has been a great day for uploading a comment on Fakebook")
    })

    test("Updating post text bad => No giving postId", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                content: "https://www.twiiter.com/logo.png"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("No introduced post reference")
    })

    test("Updating post text bad => No giving content to update", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                postId: postCreatedInTestsId
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("No introduced data to update the post")
    })

    test("Updating post text bad => Not users post", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                postId: postCreatedInTestsId,
                content: "https://www.twiiter.com/logo.png"
            })
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(401)
        expect(body.message).toBe("Unauthorized to change that post")
    })

    test("Updating post text bad => Not existing postId", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                postId: 1,
                content: "https://www.twiiter.com/logo.png"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(500)
    })

    test("Updating post text correctly", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                postId: postCreatedInTestsId,
                content: "https://www.twiiter.com/logo.png"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Post updated succesfully")
        expect(body.data.content = "https://www.twiiter.com/logo.png")
    })

    test("Updating post text correctly", async () => {
        const {status, body} = await request(server)
            .put('/api/posts/')
            .send({
                postId: postCreatedInTestsId,
                text: "It was a wonderful day to post here on Fakebook, but now no :("
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Post updated succesfully")
        expect(body.data.text = "It was a wonderful day to post here on Fakebook, but now no :(")
    })

    test("Giving like to post correctly", async () => {
        const {status, body} = await request(server)
            .put(`/api/posts/like/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Giving or removing like to post done succesfully")
        expect(body.data.likes.length = 1)
    })

    test("Removing like to post correctly", async () => {
        const {status, body} = await request(server)
            .put(`/api/posts/like/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Giving or removing like to post done succesfully")
        expect(body.data.likes.length = 0)
    })

    test("Commenting to post bad => Not giving comment text", async () => {
        const {status, body} = await request(server)
            .put(`/api/posts/comment/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(400)
        expect(body.message).toBe("No comment text introduced")
    })

    test("Commenting to post bad => Not existing comment", async () => {
        const {status, body} = await request(server)
            .put(`/api/posts/comment/1`)
            .send({
                comment: "Great comment test"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(500)
    })

    test("Commenting to post correctly", async () => {
        const {status, body} = await request(server)
            .put(`/api/posts/comment/${postCreatedInTestsId}`)
            .send({
                comment: "Great comment test"
            })
            .set('Authorization', `Bearer ${superAdminToken}`)

        commentCreatedInTestId = body.data.comments[0]._id;
        expect(status).toBe(200)
        expect(body.message).toBe("Comment into post done succesfully")
        expect(body.data.comments.length = 1)
    })

    test("Delete comment from post correctly", async () => {
        const {status, body} = await request(server)
            .delete(`/api/posts/${postCreatedInTestsId}/comment/${commentCreatedInTestId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)
            
        expect(status).toBe(200)
        expect(body.message).toBe("Comment into post removed succesfully")
        expect(body.data.comments.length = 0)
    })

    test("Deleting post bad => Not user post", async () => {
        const {status, body} = await request(server)
            .delete(`/api/posts/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(401)
        expect(body.message).toBe("Unauthorized to delete that post")
    })

    test("Deleting post bad => Not post", async () => {
        const {status, body} = await request(server)
            .delete('/api/posts/1')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(500)
    })

    test("Deleting post correctly", async () => {
        const {status, body} = await request(server)
            .delete(`/api/posts/${postCreatedInTestsId}`)
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200)
        expect(body.message).toBe("Post deleted succesfully")
    })
})

afterAll(async () => {
    try {
        if (server) {
            await server.close();
            console.log('Server closed');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error closing server and destroying database connection:', error);
        throw error;
    }
})