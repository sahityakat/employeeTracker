const db = require('../db/connection');
const cTable = require('console.table');
const express = require('express');

// Show all departments
const showDepartments = () => {
  console.log('showDepartments');
  const sql = `SELECT * FROM department`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Show all departments",err);
      return;
    }
    console.log(console.table(rows));
  });
}


// Get all departments
app.get('/api/department', (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


// GET a single department
app.get('/api/department/:id', (req, res) => {
  const sql = `SELECT * FROM department WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a department
app.post('/api/department', ({ body }, res) => {
  const errors = inputCheck(body, 'name');
  if (errors) {
  res.status(400).json({ error: errors });
  return;
  } 
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: body
      });
  });

});


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


function renderTable(data) {
  var tableName;
 /* if(data.actions === "View all departments") {
    console.log("Show all departments");
    const sql = `SELECT * FROM department`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        console.log("Show all departments",err);
        return;
      }
      console.log("Show all departments",console.table(rows));
    });
  } */
  if(data.actions === "View all departments") {
    tableName = 'department';
  }else if(data.actions === "View all roles") {
    tableName = 'role';
  }else if(data.actions === "View all employees") {
    tableName = 'employee';
  } else if(data.actions === "Add a department") {
   // renderQuestions(addDeptQuestions);
  } else if(data.actions === "Add a role") {

  } else if(data.actions === "Add an employee") {

  }

  if(tableName != null) {
    const sql = `SELECT * FROM ` + tableName;
  
    db.query(sql, (err, rows) => {
      if (err) {
        console.log("Show all records",err);
        return;
      }
      console.log(console.table(rows));
    });
  } 
}

function renderQuestions(questionList) {
inquirer
  .prompt(questionList)
  .then((answers) => {
    console.log(answers);

    if(questionList[0].name == "deptName") {
      const sql = `INSERT INTO department (name)
      VALUES (?)`;
    }

    const params = answers;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log("Add department error",err);
            return;
        }
        console.log("Added a department",body);
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

  

module.exports = showDepartments;