// import bar from '../routes/barRoute';
import request from "supertest";
import app from "express"
import * as barData from "../utils/data/bar.test.data"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo5LCJyb2xlX2lkIjozLCJpYXQiOjE3MDk4ODc3NzR9.QL_YjOS-8SFPZIl1exTgH4w8kcTdWCEvPkiSIWT3kbA"
let barId = " "

// The exact same test using async/await
describe("GET /bar", () => {

    describe("get all bars informations", () => {
        test("should respond with a 200 status code", async () => {
            request(app)
                .get('/bar')
                .expect('Content-Type', /json/)
                .set('token', token)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    return done();
                });
        })

        test("should respond with a 404 status code", async () => {
            request(app)
                .get('/bar')
                .expect(300)
                .end(function (err, res) {
                    if (err) return done(err);
                    return done();
                });
        })
    })
})

describe("POST /bar/create", () => {

    describe("create a bar from informations send", () => {
        test("should respond with a 201 status code", async () => {
            request(app)
                .post('/bar/create')
                .send(barData.createBarData)
                .expect(201, {
                    barName: "Bar test",
                    barAddress: "30 rue du test",
                    barPostCode: "75001",
                    barCity: "Paris",
                    barMail: "bar@test.com",
                    barUserId: "15",
                    barDescription: "This bar is a test"
                })
                .then(({ body }) => {
                    barId = body.data.id
                })
        })
    })

    describe("create a bar from informations send", () => {
        test("should respond with a 404 status code", async () => {
            request(app)
                .post('/bar/create')
                .send(barData.createBarDataError)
                .expect(404);
        })
    })
})

describe("GET /bar/:barId", () => {
    describe("Get one bar from is Id", () => {
        test("should respond with a 200 status code", async () => {
            request(app)
                .get(`/bar/${barId}`)
                .expect(200)
        })
    })
})

describe("PUT /bar/update/barId", () => {
    describe("Update bar informations", () => {
        test("should repond with a 200 status code", async () => {
            request(app)
                .put(`/bar/update/${barId}`)
                .send(barData.updateBarData)
                .expect(200);
        })
    })
})

describe("DELETE /bar/delete/:barId", () => {
    describe("Delete one bar from is id", () => {
        test("should respond with a 200 status code", async () => {
            request(app)
                .delete(`/bar/delete/${barId}`)
                .expect(200);
        })
    })
})

