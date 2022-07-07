const db = require("./db/connection");
const cTable = require("console.table");
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
      "Update employee role"
    ]
  }
]

function init() {
  inquirer
    .prompt(questions)
    .then((answers) => {
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
  if (data.actions === "Update employee role") {
    updateEmployee();
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
  const sql = `SELECT employee.*,role.title,role.salary,role.department_id,department.name AS department_name 
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id;`;

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
        validate: nameInput => {
          if (nameInput) {
              return true;    
          } else {
            console.log('Please enter department name');
            return false;
          }
        }
      }
    ])
    .then((answers) => {
      const sql = `INSERT INTO department (name)
      VALUES (?)`;

      const params = answers.deptName;

      db.query(sql, params, (err) => {
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
  const deptQuery = `SELECT id,name FROM department`;

  db.query(deptQuery, (err, result) => {
    if (err) {
      console.log("Error occured getting all departments", err);
      return;
    }

    let departments = result;
    const choices = departments.map(({name, id}) => ({
      name, value: id
     }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleName",
          message: "What is the name of the role?",
          validate: nameInput => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter role name');
              return false;
            }
          }
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary of the role?",
          validate: salaryInput => {
            if (salaryInput) {
                return true;    
            } else {
              console.log('Please enter salary');
              return false;
            }
          }
        },
        {
          type: "list",
          name: "deptId",
          message: "What is the name of the department?",
          choices: choices
        }
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

  db.query(roleSql, (err1, rows) => {
    if (err1) {
      console.log("Error occured getting all roles", err1);
      return;
    }
    const roleChoices = rows.map(({ title,id }) => ({
      name: title, value: id
    }));
    db.query(empSql, (empErr, result) => {
      if (empErr) {
        console.log("Get employees error", empErr);
        return;
      }
      const empChoices = result.map(({ full_name,id }) => ({
        name: full_name, value: id
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
          type: "list",
          name: "empRoleId",
          message: "What is the employee's role?",
          choices: roleChoices
        },
        {
          type: "list",
          name: "empManagerId",
          message: "Who is the employee's manager?",
          choices: empChoices
        },
      ])
      .then((answers) => {
        const empSql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
        VALUES (?,?,?,?)`;
    
        const empParams = [answers.empFirstName, answers.empLastName, answers.empRoleId, answers.empManagerId];
    
        db.query(empSql, empParams, (error) => {
          if (error) {
            console.log("Add department error", error);
            return;
          }
          console.log("Added ", answers.empFirstName, " ",answers.empLastName, " to the database");
          init();
        });
    });
  }); 
});
}

function updateEmployee() {
  const empSql = `SELECT id,CONCAT(first_name,' ',last_name) AS full_name FROM employee`;
  const roleSql = `SELECT id,title FROM role`;

  db.query(roleSql, (err1, rows) => {
    if (err1) {
      console.log("There was an error getting roles", err1);
      return;
    }
    let roles = rows;
    const roleChoices = roles.map(({ title,id }) => ({
      name: title, value: id
    }));
    db.query(empSql, (err2, result) => {
      if (err2) {
        console.log("Get employees error", err2);
        return;
      }
      let employees = result;
      const empChoices = employees.map(({ full_name,id }) => ({
        name: full_name, value: id
      }));
      inquirer
      .prompt([
        {
          type: "list",
          name: "empId",
          message: "Which employee's role do you want to update?",
          choices: empChoices
        },
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to update it to?",
          choices: roleChoices
        },
      ])
      .then((answers) => {
        const empSql = `UPDATE employee SET role_id = ? WHERE id = ?`;    
        const empParams = [answers.roleId,answers.empId];
    
        db.query(empSql, empParams, (err3) => {
          if (err3) {
            console.log("Add department error", err3);
            return;
          }
          console.log("Updated employee role");
          init();
        });
    });
    })
  });

}
// Function call to initialize app
init();


