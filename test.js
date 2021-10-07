const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('GET /student/1 [Student id exists]', async function (t) {
  const url = `${endpoint}/student/1`
  const student1 = {
    "id": 1,
    "first_name": "Scotty",
    "last_name": "Quigley",
    "email": "Scotty79@hotmail.com",
    "is_registered": 1,
    "is_approved": 1,
    "address": "241 Denesik Knolls Apt. 955",
    "city": "Buffalo",
    "state": "ME",
    "zip": "04710",
    "phone": "1-503-560-6954",
    "created": "1628767983203.0",
    "last_login": "1628770445749.0",
    "ip_address": "2.137.18.155"
  }
  try {
    const { data, response } = await jsonist.get(url);
    t.ok(response.statusCode === 200, 'Should have reponse code 200')
    t.deepEqual(data, student1, 'Should return Student ID 1 info')
  } catch (e) {
    t.error(e)
  }
})

tape('GET /student/0 [Student id does not exist]', async function (t) {
  const url = `${endpoint}/student/0`
  const student0 = { "error" : "Student ID doesn't exist" }
  try {
    const { data, response } = await jsonist.get(url);
    t.ok(response.statusCode === 404, 'Should have reponse code 404')
    t.deepEqual(data, student0, 'Should return object with error')
  } catch (e) {
    t.error(e)
  }
})

tape('GET /student/1/grades [Student id exists]', async function (t) {
  const url = `${endpoint}/student/1/grades`
  const student1 = {
    "id": 1,
    "first_name": "Scotty",
    "last_name": "Quigley",
    "email": "Scotty79@hotmail.com",
    "is_registered": 1,
    "is_approved": 1,
    "address": "241 Denesik Knolls Apt. 955",
    "city": "Buffalo",
    "state": "ME",
    "zip": "04710",
    "phone": "1-503-560-6954",
    "created": "1628767983203.0",
    "last_login": "1628770445749.0",
    "ip_address": "2.137.18.155",
    "grades": {
      "Calculus": 50,
      "Microeconomics": 43,
      "Statistics": 50,
      "Astronomy": 63
    }
  }
  try {
    const { data, response } = await jsonist.get(url);
    t.ok(response.statusCode === 200, 'Should have reponse code 200')
    t.deepEqual(data, student1, 'Should return Student id 1 details and grades')
  } catch (e) {
    t.error(e)
  }
})

tape(`GET /student/0/grades [Student id does not exist]`, async function (t) {
  const url = `${endpoint}/student/0/grades`
  const student0 = { "error" : "Student ID doesn't exist" }
  try {
    const { data, response } = await jsonist.get(url);
    t.ok(response.statusCode === 404, 'Should have reponse code 404')
    t.deepEqual(data, student0, 'Should return object with error')
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
