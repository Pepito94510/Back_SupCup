const supertest = require('supertest');
const bar = require('../routes/bar');


// The exact same test using async/await
describe("POST /bar", () => {

  describe("given a bar name and description", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(bar).post('/bar').send({
        name: "name",
        description: "description"
      })
      expect(response.statusCode).toBe(200)
    })
  })

  describe("not given a bar name and description", () => {

  })  
})