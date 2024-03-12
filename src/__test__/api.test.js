import 'dotenv/config';
import request from "supertest";
import { dbConnection } from "../db.js";
import app from "../app.js";
import mongoose from "mongoose";

let server;
let superAdminToken;
let notSuperAdminToken;
const userFromSeederId = "65ed7d2f6fa9305f1c424410";
const adminFromSeederId = "65ed7d2f6fa9305f1c42440e";

beforeAll(async () => {
    await dbConnection();
    server = app.listen(4000);
})

describe("Healthy API endpoint" , () => {
    test("Checking server is up", async () => {
        const {status, body} = await request(server)
            .get('/api/healthy')
        expect(status).toBe(200);
        expect(body.message).toBe("Server is healthy :D");
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
    expect(status).toBe(400);
    expect(body.message).toBe("Needed to have an email, a password and a name");
    })

    test("Register user bad => Not giving correct email", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "12345",
                password: 'UserTest12345#'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("Format email invalid");
        })
    
    test("Register user bad => Not giving correct password", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "usertest@usertest.com",
                password: 'user random password'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("Format password invalid");
    })

    test("Register user correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "userTest",
                email: "usertest@usertest.com",
				password: 'UserTest12345#'
            })
        expect(status).toBe(201);
        expect(body.message).toBe("User registered succesfully");
    })

    test("Login user bad => Not giving params", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
				password: 'UserTest12345#'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("Needed to have an email and a password");
    })

    test("Login user bad => Not giving correct email", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "Not An Email",
				password: 'UserTest12345#'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("Format email invalid");
    })

    test("Login user bad => Not users created params", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "baduser@baduser.com",
				password: 'UserNotPassword#12345'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("No user exists, try again");
    })

    test("Login user bad => Not correct password", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "usertest@usertest.com",
				password: 'UserNotPassword#12345'
            })
        expect(status).toBe(400);
        expect(body.message).toBe("Email or password invalids");
    })

    test("Login user correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "usertest@usertest.com",
				password: 'UserTest12345#'
            })
        notSuperAdminToken = body.token;
        expect(status).toBe(200);
        expect(body.message).toBe("User logged successfully");
    })

    test("Login superAdmin correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/login')
            .send({
                email: "superadmin@superadmin.com",
				password: 'superAdmin123#'
            })
        superAdminToken = body.token;
        expect(status).toBe(200);
        expect(body.message).toBe("User logged successfully");
    })
})

describe ("Users API endpoints" , () => {
    test("Getting user by email bad => Not superAdmin role", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=notauseremail@notauseremail.com")
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(401);
        expect(body.message).toBe("Unauthorized");
    })

    test("Getting user by email bad => Not giving an user email", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=notauseremail@notauseremail.com")
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(404);
        expect(body.message).toBe("You cant find a user with that email");
    })

    test("Getting user by email correctly", async () => {
        const {status, body} = await request(server)
            .get("/api/users?email=usertest@usertest.com")
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200);
        expect(body.message).toBe("User retrieved succesfully");
    })

    test("Getting all user correctly", async () => {
        const {status, body} = await request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${superAdminToken}`)

        expect(status).toBe(200);
        expect(body.message).toBe("Users retrieved succesfully");
        expect(body.data.length).toBe(15);
    })

    test("Getting user by token correctly", async () => {
        const {status, body} = await request(server)
            .get("/api/users/profile")
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200);
        expect(body.message).toBe("User profile retrieved succesfully")
        expect(body.data.name = "userTest");
    })

    test("Getting posts from user bad => No posts", async () => {
        const {status, body} = await request(server)
            .get(`/api/users/posts/${adminFromSeederId}`)
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(404);
        expect(body.message).toBe("No posts from that user have been found")
    })

    test("Getting posts from user correctly", async () => {
        const {status, body} = await request(server)
            .get(`/api/users/posts/${userFromSeederId}`)
            .set('Authorization', `Bearer ${notSuperAdminToken}`)

        expect(status).toBe(200);
        expect(body.message).toBe("Posts retrieved succesfully")
        expect(body.data.length = 1);
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