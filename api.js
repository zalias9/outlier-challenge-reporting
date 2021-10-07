const knex = require('./db')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const student = await knex('students').where('id', req.params.id).first()
    if (student) {
      // Assuming you don't want to send password_hash with the object
      delete student.password_hash
      res.status(200).json(student).send()
    } else {
      res.status(404).json({"error" : "Student ID doesn't exist"}).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
