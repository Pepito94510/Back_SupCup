import request from "supertest";
import createServer from "../app"
import { Sequelize } from "sequelize";

const app = createServer();

const sequelize = new Sequelize('mysql://supcup_user:supcup_password@localhost:3306/supcup_db');

describe('Server API', () => {

    beforeAll(async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection successful');
        }
        catch (error) {
            console.error('Unable to connect', error);
        }
    });

    afterAll(async () => {
        await sequelize.close();
    })

    describe("get all bars informations", () => {
        it("test get all users", async () => {
            const res = await request(app)
                .get('/test')
            expect(res.status).toBe(200)
        })
    })
});
