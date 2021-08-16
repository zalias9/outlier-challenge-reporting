const blocked = require('blocked-at')
const express = require('express')

blocked((time, stack) => {
  console.error(`Blocked for ${time}ms, operation started here:`, stack)
})

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(express.json())

app.get('/health', api.getHealth)
app.get('/student/:id', api.getStudent)
app.get('/student-report/:id', api.getStudentReport)
app.get('/student-grades-report', api.getStudentGradesReport)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
