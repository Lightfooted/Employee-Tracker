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

connection.connect((err) => {
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
				'view all information',
				'add a department',
				'add a role',
				'add an employee',
				'update employee role'
			]
		}])
		.then((userInput) => {
			const {
				options
			} = userInput;

			if (options === 'view all departments') {
				viewDepartments();
			}

			if (options === 'view all roles') {
				viewRoles();
			}

			if (options === 'view all employees') {
				viewEmployees();
			}

			if (options === 'view all information') {
				viewFullTables();
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
const viewDepartments = () => {
	const sql = `SELECT * FROM department`;

	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		userSelections();
	});
};

//Show all roles
const viewRoles = () => {
	const sql = `SELECT * FROM role`;

	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		userSelections();
	});
};

//Show all employees
const viewEmployees = () => {
	const sql = `SELECT * FROM employee`;

	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		userSelections();
	});
};

//Show all information
const viewFullTables = () => {
	const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, ' ', manager.last_name) AS manager
                      FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id
                      GROUP BY employee.id`;

	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		userSelections();
	});
};

//Create and add departments
const addDepartment = () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'addNewDepartment',
			message: 'What is the name of the new department? (Required!)',
			validate: nameInput => {
				if (nameInput) {
					return true;
				} else {
					console.log('This new department must have a name!');
					return false;
				}
			}
		}])
		.then((addedDepartment) => {
			const sql = `INSERT INTO department (name) VALUES (?)`;
			connection.query(sql, addedDepartment.addNewDepartment, (err, res) => {
				if (err) throw err;
				console.table(res);
				viewDepartments();
			});
		});
};