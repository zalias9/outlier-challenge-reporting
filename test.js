const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data } = await jsonist.get(url)
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
