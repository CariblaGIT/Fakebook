import 'dotenv/config';
import request from "supertest";
import { dbTestConnection } from "../db.js";
import app from "../app.js";
import mongoose from "mongoose";

let server;
let token;
const user1Id = "65ed7d2f6fa9305f1c42440e"

beforeAll(async () => {
    await dbTestConnection();
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
				password: 'UserTest12345#',
                _id: new mongoose.Types.ObjectId("65ed7d2f6fa9305f1c42440e")
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

        token = body.token;
        expect(status).toBe(200);
        expect(body.message).toBe("User logged successfully");
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