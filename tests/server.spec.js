const { expect, describe, it } = require('@jest/globals')
const request = require('supertest')
const serverApp = require('../index')
const cafes = require('../cafes.json')

describe('Operaciones CRUD de cafes', () => {
  it('Response status code 200 and is array data type with at least 1 object', async () => {
    const response = await request(serverApp).get('/cafes').send()
    const status = response.statusCode

    expect(status).toEqual(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
  })

  it('Response status code 404 if coffe Id does not exist', async () => {
    const nonExistentId = 11
    const fakeToken = 'fake_token'
    const response = await request(serverApp)
      .delete(`/cafes/${nonExistentId}`)
      .set('Authorization', `Bearer ${fakeToken}`)

    const status = response.statusCode

    expect(status).toEqual(404)
    expect(response.body).toEqual({ message: 'No se encontró ningún cafe con ese id' })
  })

  it('It should response status code 201 and adding new coffe', async () => {
    const newCoffee = {
      id: 9,
      name: 'Café Nuevo'
    }
    const response = await request(serverApp)
      .post('/cafes')
      .send(newCoffee)

    expect(response.statusCode).toBe(201)

    const addedCoffee = cafes.find(c => c.id === newCoffee.id)

    expect(addedCoffee).toEqual(newCoffee)
  })

  it('It should response status code 400 if ID param does not match to request body ID', async () => {
    const coffeIdParam = 3
    const coffeeIdBody = 4
    const updatedCoffee = {
      id: coffeeIdBody,
      name: 'Updated Coffee'
    }

    const response = await request(serverApp)
      .put(`/cafes/${coffeIdParam}`)
      .send(updatedCoffee)

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      message: 'El id del parámetro no coincide con el id del café recibido'
    })
  })
})
