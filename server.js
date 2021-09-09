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
};