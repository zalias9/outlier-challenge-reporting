const knex = require('./db')
const gradesDb = require('./gradesDb')

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
  try {
    let student = await knex('students').where('id', req.params.id).first()
    if(!student) {
      res.status(404).json({"error" : "Student ID doesn't exist"})
    } else {
      // Assuming you don't want to send password_hash with the object
      delete student.password_hash
      const studentGrades = await gradesDb('grades')
                                    .select('course', 'grade')
                                    .where('student_id', student.id)
      student['grades'] = {}
      for (const gradeObj of studentGrades) {
        student['grades'][gradeObj.course] = gradeObj.grade
      }
      res.status(200).json(student).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    let report = await gradesDb('grades')
                        .select('course')
                        .max('grade', { as: 'highestGrade'})
                        .min('grade', { as: 'lowestGrade'})
                        .avg('grade', { as: 'averageGrade'})
                        .groupBy('course')
    const result = {}
    // Make course names the Keys and stats object the Value
    for ( const courseData of report) {
      const { course, ...stats } = courseData
      result[course] = {...stats}
    }
    res.status(200).json(result).send()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}
