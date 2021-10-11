const fs = require('fs')
const request = require('request')
const gradesDb = require('./gradesDb')

request('https://outlier-coding-test-data.netlify.app/students.db').pipe(fs.createWriteStream('students.db'))
console.log('Fetching students.db...')
let gradesStream = request('https://outlier-coding-test-data.netlify.app/grades.json')
                    .pipe(fs.createWriteStream('grades.json'))
console.log('Fetching grades.json...')

gradesStream.on('finish', () => {
  console.log('grades.json downloaded successfully')
  gradesDb.schema
    .hasTable('grades')
    .then(createGradesTable)
    .then(populateGradesTable)
    .finally(() => {
      console.log('grades db is setup for use')
      gradesDb.destroy()
    })
    .catch(err => console.log(err));
})

const createGradesTable = async (tableExists) => {
  if(!tableExists) {
    await gradesDb.schema.createTable('grades', (table) => {
      // Row id (Primary Key)
      table.increments('grade_id').primary()
      // Student's id (id from grades.json)
      table.integer('student_id').notNullable()
      // Course Name
      table.string('course').notNullable()
      // Course grade
      table.integer('grade').notNullable()
      table.timestamps(true, true)
      // One student can have one grade for one course
      table.unique(['student_id', 'course', 'grade'])
    })
    .then(() => console.log('grades table created'))
    .catch(err => console.log(err))
  } else {
    console.log('grades table already exists')
  }
}

const populateGradesTable = async () => {
  const gradesList = require('./grades')
  const insertList = gradesList.map(grade => {
    // Change key "id" to "student_id" for db storage 
    const { id, ...rest } = grade
    return { student_id: id, ...rest} 
  })
  const chunkSize = 500 // Chunk size of over 500 produces SQLITE_ERROR
  while (insertList.length > 0) {
    const insertChunk = insertList.splice(0, chunkSize)
    console.log(`Inserting chunk into grades table... ${insertList.length} left... Please wait`)
    await gradesDb
      .insert(insertChunk)
      .into('grades')
      .onConflict(['student_id', 'course', 'grade'])
      .ignore() // or .merge()
      .catch(err => console.log(err))
  }
}
