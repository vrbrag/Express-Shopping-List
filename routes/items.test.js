process.env.NODE_ENV = "test"

const request = require("supertest")
const app = require("../app")
let items = require("../fakeDB")

let pickles = { name: "pickles", price: 1.25 }
beforeEach(function () {
   items.push(pickles)
})
afterEach(function () {
   items.length = 0
})

// GET items list
describe("GET /items", function () {
   test("Gets a list of items", async function () {
      const resp = await request(app).get('/items')
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual({ items: [pickles] })
   })
})

// POST new item
describe("POST /items", function () {
   test("Post new item to list", async function () {
      const resp = await request(app)
         .post('/items')
         .send({
            name: 'popcorn',
            price: 2.95
         })
      expect(resp.statusCode).toBe(201)
      expect(resp.body).toEqual({ item: { name: 'popcorn', price: 2.95 } })
   })
})

// GET item by name
describe("GET /items/:name", function () {
   test("Get item by name", async function () {
      const resp = await request(app)
         .get(`/items/${pickles.name}`)
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual({ item: pickles })
   })
   test("Invalid item", async function () {
      const resp = await request(app)
         .get('/items/butter')
      expect(resp.statusCode).toBe(404)
   })
})

// PATCH item
describe("PATCH /items/:name", function () {
   test('Update item name', async () => {
      const resp = await request(app)
         .patch(`/items/${pickles.name}`)
         .send({ name: 'pepper' });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
         updated: { name: 'pepper', price: 1.25 },
      });
   });
   test("Patch an item price", async function () {
      const resp = await request(app)
         .patch(`/items/${pickles.name}`)
         .send({ price: 4.25 })
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual({
         updated: { name: 'pepper', price: 4.25 }
      })
   })
   test("Patch an item name and price", async function () {
      const resp = await request(app)
         .patch(`/items/${pickles.name}`)
         .send({ name: 'salt', price: 6.25 })
      expect(resp.statusCode).toBe(200)
      expect(resp.body).toEqual({
         updated: { name: 'salt', price: 6.25 }
      })
   })
   test("Item not found, 404 response", async function () {
      const resp = await request(app)
         .patch('/items/butter')
      expect(resp.statusCode).toBe(404)
   })
})

// DELETE items
describe("DELETE item", function () {
   test("Delete item", async function () {
      const resp = await request(app)
         .delete(`/items/${pickles.name}`)
      expect(resp.statusCode).toBe(200)
   })
})