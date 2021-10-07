const knex = require('./db')
const gradesList = require('./grades')

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
      const studentGrades = gradesList.filter(grade => grade.id === student.id)
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
  new Promise((resolve, reject) => {
    try {
      let courseReport = {}
      gradesList.forEach(gradeData => {
        if (!courseReport[gradeData.course]){
          courseReport[gradeData.course] = {
            "highestGrade": 0, // Assuming lowest grade is 0
            "lowestGrade": 100, // Assuming highest grade is 100
            "averageGrade": 0,
            "studentCount": 0
          }
        }
        if (gradeData.grade > courseReport[gradeData.course]["highestGrade"]) {
          courseReport[gradeData.course]["highestGrade"] = gradeData.grade
        }
        if (gradeData.grade < courseReport[gradeData.course]["lowestGrade"]) {
          courseReport[gradeData.course]["lowestGrade"] = gradeData.grade
        }
        // Temporarily hold the total, Average is calculated later
        courseReport[gradeData.course]["averageGrade"] += gradeData.grade
        courseReport[gradeData.course]["studentCount"] += 1
      })
      for (const course in courseReport) {
        // Calculate average here and delete studentCount
        courseReport[course].averageGrade /= courseReport[course].studentCount
        delete courseReport[course].studentCount
      }
      resolve(courseReport)
    } catch (e) { reject(e) }
  })
  .then((report) => res.status(200).json(report).send())
  .catch((e) => {
    console.log(e)
    res.status(500).end()
  })
}
