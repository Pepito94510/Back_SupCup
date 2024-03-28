import request from "supertest";
import app from "../app"

describe('Server API', () => {

    describe("get all bars informations", () => {
        it("test get all users",async()=>{
            const res = await request(app)
                        .get('/test')
            expect(res.status).toBe(200)
        })
    })
});
