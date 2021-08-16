![Outlier.org](https://i.imgur.com/vJowpL1.png)

---

# Outlier Engineering Node.js Reporting Challenge

Our apps need to query and store lots of information. We want to make sure that you have a good understanding of JavaScript and Node.js fundamentals. Can you build a simple API that can read data from multiple sources, aggregate, and report with Node.js while following [Outlier's best practices](https://github.com/outlier-org/onboarding/blob/master/README.md#engineering-onboarding-guide)?

## The Challenge

- Implement the `getStudent` method in `api.js`. This should fetch the student record with `id` passed in from the database and return the information as JSON.

- Implement the `getStudentReport` method in `api.js`. This report should fetch student grade data from the following remote source: https://outlier-coding-test-data.netlify.app/grades.json, where the id in the json data matches the id in the students database. The output should include student details as well as their grades information.

- Implement the `getStudentGradesReport` method in `api.js`. This report should contain the following statistics: highest grade of all students, lowest grade of all students, average grade across all students.

- Create tests relevant for the endpoints.

- You must not block the main thread. Thread blockage will be reported in the console by the server.

- Each endpoint should be performant and respond with complete data in under 500ms.

- `server.js` should not be modified in this challenge.

## Instructions

How to attempt this challenge:

1) Create a new repo in your account and note the git url
2) Clone this repo
3) Run `npm run init-db` to initialize the local SQLite database
4) Solve the challenge
5) Set your new repo as the origin: `git remote set-url origin ${your repo url}`
6) Push your solution to your repo

You must follow these steps for your solution to be accepted -- forks or other methods will not be considered.