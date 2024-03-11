import 'dotenv/config';
import request from "supertest";
import { dbTestConnection } from "../db.js";
import app from "../app.js";
import mongoose from "mongoose";

let server;

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
    test("Login in user correctly", async () => {
        const {status, body} = await request(server)
            .post('/api/auth/register')
            .send({
                name: "user",
                email: "user@user.com",
				password: 'User12345#'
            })
        expect(status).toBe(201);
        expect(body.message).toBe("User registered succesfully");
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