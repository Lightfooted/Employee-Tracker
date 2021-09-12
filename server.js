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
				'add a department',
				'add a role',
				'add an employee',
				'update employee role',
				'goodbye!'
			]
		}])
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

			if (options === 'goodbye!') {
				connection.end();
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
	const sql = `SELECT role.id, 
                      role.title, 
                      department.name AS department
                      FROM role
                      INNER JOIN department ON role.department_id = department.id`;

	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		userSelections();
	});
};

//Show all employees
const viewEmployees = () => {
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

			connection.query(sql, [addedDepartment.addNewDepartment], (err, res) => {
				if (err) throw err;
				console.table(res);
				viewDepartments();
			});
		});
};

//Create role with salary
const addRole = () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'assignedRole',
			message: 'What is the name of the new role? (Required!)',
			validate: roleInput => {
				if (roleInput) {
					return true;
				} else {
					console.log('You must provide the role title!');
					return false;
				}
			}
    },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the new role? (Required!)',
        validate: salaryInput => {
          if (salaryInput) {
            return true;
          } else {
            console.log('You must provide the roles salary!');
            return false;
          }
        }
      },
	  {
        type: 'number',
        name: 'departmentID',
        message: 'What is the department ID? (Required!)',
        validate: departInput => {
          if (departInput) {
            return true;
          } else {
            console.log('This department must have an ID!');
            return false;
          }
        }
      }
    ])
		.then((newRole) => {
			const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

			connection.query(sql, [newRole.assignedRole, newRole.salary, newRole.departmentID], (err, res) => {
				if (err) throw err;
				console.table(res);
				viewRoles();
			});
		});
};

//Create employee
const addEmployee = () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'firstName',
			message: 'What is the employees first name? (Required!)',
			validate: nameInput => {
				if (nameInput) {
					return true;
				} else {
					console.log('The employee needs a first name!');
					return false;
				}
			}
    },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the employees last name? (Required!)',
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log('The employee needs a last name!');
            return false;
          }
        }
      },
	  {
        type: 'number',
        name: 'roleID',
        message: 'What is the role ID for this employee? (Required!)',
        validate: idRoleInput => {
          if (idRoleInput) {
            return true;
          } else {
            console.log('You must provide the employees role ID!');
            return false;
          }
        }
      },
      {
        type: 'number',
        name: 'managerID',
        message: 'What is the managers ID for this employee? (Required!)',
        validate: managerInput => {
          if (managerInput) {
            return true;
          } else {
            console.log('You must provide the managers ID for this employee!');
            return false;
          }
        }
      }
    ])
		.then((newEmployee) => {
			const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

			connection.query(sql, [newEmployee.firstName, newEmployee.lastName, newEmployee.roleID, newEmployee.managerID], (err, res) => {
				if (err) throw err;
				console.table(res);
				viewEmployees();
			});
		});
};

//Updating employee role (Need an easier way to do this one. Too many steps for the user. May use a list type in the future if I ever go back.)
const updateRole = () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'firstName',
			message: 'What is the first name of the employee? (Required!)',
			validate: nameInput => {
				if (nameInput) {
					return true;
				} else {
					console.log('The employee must have a first name!');
					return false;
        }
      }
    },
    {
			type: 'input',
			name: 'lastName',
			message: 'What is the last name of the employee? (Required!)',
			validate: nameInput => {
				if (nameInput) {
					return true;
				} else {
					console.log('The employee must have a last name!');
					return false;
        }
      }
    },
    {
			type: 'number',
			name: 'roleID',
			message: 'What is the NEW role ID of the employee? (Required!)',
			validate: idRoleInput => {
				if (idRoleInput) {
					return true;
				} else {
					console.log('You must provide an ID for the NEW role of the employee!');
					return false;
        }
      }
    }
  ])
  .then((updateEmpRole) => {
    const sql = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;

    connection.query(sql, [updateEmpRole.roleID, updateEmpRole.firstName, updateEmpRole.lastName], (err, res) => {
      if (err) throw err;
      console.table(res);
      viewEmployees();
    });
  });
};