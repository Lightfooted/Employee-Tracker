const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tachikoma8',
    database: 'employees'
  });

  connection.connect(function(err){
    if (err) throw err;
    userSelections();
});

//After connection the user is given a list of options to choose from
const userSelections = () => {
    return inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'Welcome to Employee Tracker! What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update employee role'
        ]
    }
 ])
 .then((userInput) => {
    const { options } = userInput; 

    if (options === 'view all departments') {
      viewDepartments();
    }

    if (options === 'view all roles') {
      viewRoles();
    }

    if (options === 'view all employees') {
      viewEmployees();
    }

    if (options === 'add a department') {
      addDepartment();
    }

    if (options === 'add a role') {
      addRole();
    }

    if (options === 'add an employee') {
      addEmployee();
    }

    if (options === 'update employee role') {
      updateRole();
    }
  });
};

//Show all departments
viewDepartments = () => {
  const sql = `SELECT * FROM department`; 

  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    userSelections();
  });
};

//Show all roles
viewRoles = () => {
  const sql = `SELECT * FROM role`;
  
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    userSelections();
  });
};

//Show all employees
viewEmployees = () => {
  const sql = `SELECT * FROM employee`;
  
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    userSelections();
  });
};