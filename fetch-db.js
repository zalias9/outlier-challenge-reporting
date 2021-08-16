const fs = require('fs')
const request = require('request')
request('https://outlier-coding-test-data.netlify.app/students.db').pipe(fs.createWriteStream('students.db'))
console.log('Successfully fetched students.db.')
