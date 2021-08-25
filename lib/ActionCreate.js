const connection = require("../config/connection");
const inquirer = require("inquirer");
const validate = require("../rules/validate");
const chalk = require("chalk");
const view = require("./ActionView");

// Add a New Employee
addEmployee = (askUserAgain) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const crit = [answer.fistName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection
        .promise()
        .query(roleSql)
        .then(([rows, fields]) => {
          const roles = rows.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql = `SELECT * FROM employee`;
              //  connection.promise().query(managerSql, (error, data) => {
              connection
                .promise()
                .query(managerSql)
                .then(([rows, fields]) => {
                  const managers = rows.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: managers,
                      },
                    ])
                    .then((managerChoice) => {
                      const manager = managerChoice.manager;
                      crit.push(manager);
                      const sql = `INSERT INTO employee (first_name, last_name,role_id,manager_id) VALUES ('${answer.fistName}', '${answer.lastName}',${role},${manager})`;
                      connection
                        .promise()
                        .query(sql)
                        .then(([rows, fields]) => {
                          console.log("Employee has been added!");
                          view.viewAllEmployees(askUserAgain);
                        });
                    });
                });
            });
        });
    });
};

// Add a New Role
addRole = (askUserAgain) => {
  const sql = "SELECT * FROM department";
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let deptNamesArray = [];
      rows.forEach((department) => {
        deptNamesArray.push(department.name);
      });
      deptNamesArray.push("Create Department");
      inquirer
        .prompt([
          {
            name: "departmentName",
            type: "list",
            message: "Which department is this new role in?",
            choices: deptNamesArray,
          },
        ])
        .then((answer) => {
          if (answer.departmentName === "Create Department") {
            this.addDepartment(askUserAgain);
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: "newRole",
              type: "input",
              message: "What is the name of your new role?",
              validate: validate.validateString,
            },
            {
              name: "salary",
              type: "input",
              message: "What is the salary of this new role?",
              validate: validate.validateSalary,
            },
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            rows.forEach((department) => {
              if (departmentData.departmentName === department.name) {
                departmentId = department.id;
              }
            });
            let salary = answer.salary;
            let sql = `INSERT INTO role (title, salary, department_id) VALUES ('${createdRole}', ${salary}, ${departmentId})`;
            let crit = [createdRole, answer.salary, departmentId];
            connection
              .promise()
              .query(sql)
              .then(([rows, crit]) => {
                console.log(
                  chalk.yellow.bold(
                    `====================================================================================`
                  )
                );
                console.log(chalk.greenBright(`Role successfully created!`));
                console.log(
                  chalk.yellow.bold(
                    `====================================================================================`
                  )
                );
                view.viewAllRoles(askUserAgain);
              });
          });
      };
    });
};

// Add a New Department
addDepartment = (askUserAgain) => {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      const name = answer.newDepartment;
      console.log("----------= name===----------" + name);
      let sql = `INSERT INTO department (name) VALUES ('${name}')`;
      connection
        .promise()
        .query(sql)
        .then(([rows, fields]) => {
          console.log(``);
          console.log(
            chalk.greenBright(
              answer.newDepartment + ` Department successfully created!`
            )
          );
          console.log(``);
          view.viewAllDepartments(askUserAgain);
        });
    });
};

module.exports = {
  addEmployee,
  addRole,
  addDepartment,
};
