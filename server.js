const db = require("./db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");
//const fs = require("fs");
//const questions = require("./models/questions");
//const express = require('express');
//const PORT = process.env.PORT || 3001;
//const app = express();

// Why undefined in the response when viewing all departments/roles?
// Display questions again after responding to a question
// Validations
//* Add employee
//* Is the approach right? What if emp Manager is not selected?

// Express middleware
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

const questions = [
  {
    type: "list",
    name: "actions",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role"
    ]
  }
]

function init() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log("answers", answers);
      selectAction(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

function selectAction(data) {
  if (data.actions === "View all departments") {
    showDepartments();
  }
  if (data.actions === "View all roles") {
    showRoles();
  }
  if (data.actions === "View all employees") {
    showEmployees();
  }
  if (data.actions === "Add a department") {
    addDepartment();
  }
  if (data.actions === "Add a role") {
    addRole();
  }
  if (data.actions === "Add an employee") {
    addEmployee();
  }
}

function showDepartments() {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("There was an error fetching departments", err);
      return;
    }
    console.table(rows);
    init();
  });
}

function showRoles() {
  const sql = `SELECT role.*, department.name AS department_name
              FROM role
              LEFT JOIN department ON role.department_id = department.id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("There was an error fetching roles", err);
      return;
    }
    console.table(rows);
    init();
  });
}

function showEmployees() {
  const sql = `SELECT * FROM employee`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("There was an error fetching employees", err);
      return;
    }
    console.table(rows);
    init();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department (name)
      VALUES (?)`;

      const params = answers.deptName;

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Add department error", err);
          return;
        }
        console.log("Added ", answers.deptName, " to the database");
        init();
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

function addRole() {
  console.log('addRole');
  const deptQuery = `SELECT id,name FROM department`;
  console.log('deptQuery',deptQuery);
  db.query(deptQuery, (err, result) => {
    if (err) {
      console.log("Error occured getting all departments", err);
      return;
    }
    console.log('result',result);
    let departments = [result];
    console.log('departments',departments);
    const choices = departments.map(({ id, name }) => ({
      key: name,
      value: id,
    }));
    console.log('choices',choices);
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleName",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "deptId",
          message: "What is the name of the department?",
          choices: choices,
        },
      ])
      .then((answers) => {
        const roleSql = `INSERT INTO role (title,salary,department_id)
        VALUES (?,?,?)`;

        const roleParams = [
          answers.roleName,
          answers.roleSalary,
          answers.deptId,
        ];

        db.query(roleSql, roleParams, (err, result) => {
          if (err) {
            console.log("Add role error", err);
            return;
          }
          console.log("Added ", answers.roleName, " to the database");
          init();
        });
      });
  });
}

function addEmployee() {
  const roleSql = `SELECT id,title FROM role`;
  const empSql = `SELECT id,CONCAT(first_name,' ',last_name) AS full_name FROM employee`;

  db.query(roleSql, (err, rows) => {
    if (err) {
      console.log("Error occured getting all roles", err);
      return;
    }
    let roles = [rows];
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    db.query(empSql, (err, result) => {
      if (err) {
        console.log("Get employees error", err);
        return;
      }
      let employees = [result];
      const empChoices = employees.map(({ id, full_name }) => ({
        name: full_name,
        value: id,
      }));
      inquirer
      .prompt([
        {
          type: "input",
          name: "empFirstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "empLastName",
          message: "What is the employee's last name?",
        },
        {
          type: "input",
          name: "empRole",
          message: "What is the employee's role?",
        },
        {
          type: "input",
          name: "empRoleId",
          message: "What is the employee's role?",
          choices: roleChoices
        },
        {
          type: "input",
          name: "empManagerId",
          message: "Who is the employee's manager?",
          choices: empChoices
        },
      ])
      .then((answers) => {
        const empSql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
        VALUES (?,?,?,?)`;
    
        const empParams = [answers.empFirstName, answers.empLastName, answers.empRoleId, answers.empManagerId];
    
        db.query(empSql, empParams, (err, result) => {
          if (err) {
            console.log("Add department error", err);
            return;
          }
          console.log("Added ", answers.roleName, " to the database");
          init();
        });
    });
  }); 
});
}

// Function call to initialize app
init();


[ 
  [ 
    { id: 1, name: 'Sales' }, 
    { id: 2, name: 'Service' } 
  ] 
]