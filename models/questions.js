const inquirer = require("inquirer");

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
    },
    {
      type: "input",
      name: "deptName",
      message: "What is the name of the department?",
      when: ({ actions }) => {
        if (actions === "Add a department") {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role?",
      when: ({ actions }) => {
        if (actions === "Add a role") {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of the role?",
      when: ({ roleName }) => {
        if (roleName) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "roleDept",
      message: "Which department does the role belong to?",
      when: ({ roleSalary }) => {
        if (roleSalary) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "empFirstName",
      message: "What is the employee's first name?",
      when: ({ actions }) => {
        if (actions === "Add an employee") {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "empLastName",
      message: "What is the employee's last name?",
      when: ({ empFirstName }) => {
        if (empFirstName) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "empRole",
      message: "What is the employee's role?",
      when: ({ empLastName }) => {
        if (empLastName) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "empManager",
      message: "Who is the employee's manager?",
      when: ({ empRole }) => {
        if (empRole) {
          return true;
        } else {
          return false;
        }
      }
    }
]

module.exports = questions;
