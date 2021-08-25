const connection = require("../config/connection");
const inquirer = require("inquirer");
const validate = require("../rules/validate");
const chalk = require("chalk");
const view = require("./ActionView");

// Update an Employee's Role
updateEmployeeRole = (askUserAgain) => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let employeeNamesArray = [];
      rows.forEach((employee) => {
        employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
      });

      let sql = `SELECT role.id, role.title FROM role`;
      connection
        .promise()
        .query(sql)
        .then(([rows, fields]) => {
          let rolesArray = [];
          rows.forEach((role) => {
            rolesArray.push(role.title);
          });
          let fullName, firstName, lastName;
          inquirer
            .prompt([
              {
                name: "chosenEmployee",
                type: "list",
                message: "Which employee has a new role?",
                choices: employeeNamesArray,
              },
              {
                name: "chosenRole",
                type: "list",
                message: "What is their new role?",
                choices: rolesArray,
              },
            ])
            .then((answer) => {
              rows.forEach((employee) => {
                console.log(`\n`);
                fullName = answer.chosenEmployee.split(" ");
                firstName = fullName[0];
                lastName = fullName[1];
              });

              let newTitleId, employeeId;

              rows.forEach((role) => {
                if (answer.chosenRole === role.title) {
                  newTitleId = role.id;
                }
              });

              let sqls = `UPDATE employee SET employee.role_id = ${newTitleId}   WHERE employee.first_name =  '${firstName}' AND employee.last_name =  '${lastName}'`;
              connection
                .promise()
                .query(sqls)
                .then(([rows, fields]) => {
                  console.log(
                    chalk.greenBright.bold(
                      `====================================================================================`
                    )
                  );
                  console.log(chalk.greenBright(`Employee Role Updated`));
                  console.log(
                    chalk.greenBright.bold(
                      `====================================================================================`
                    )
                  );
                  askUserAgain();
                })
                .catch((err) => console.log(err));
            });
        });
    });
};

// Update an Employee's Manager
updateEmployeeManager = (askUserAgain) => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                      FROM employee`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let employeeNamesArray = [];
      rows.forEach((employee) => {
        employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new manager?",
            choices: employeeNamesArray,
          },
          {
            name: "newManager",
            type: "list",
            message: "Who is their manager?",
            choices: employeeNamesArray,
          },
        ])
        .then((answer) => {
          let employeeId, managerId;
          rows.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }

            if (
              answer.newManager ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              managerId = employee.id;
            }
          });

          if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
            console.log(
              chalk.redBright.bold(
                `====================================================================================`
              )
            );
            console.log(chalk.redBright(`Invalid Manager Selection`));
            console.log(
              chalk.redBright.bold(
                `====================================================================================`
              )
            );
            askUserAgain();
          } else {
            let sql = `UPDATE employee SET employee.manager_id = ${managerId} 
              WHERE employee.id = ${employeeId}`;

            connection
              .promise()
              .query(sql)
              .then(([managerId, employeeId]) => {
                console.log(
                  chalk.greenBright.bold(
                    `====================================================================================`
                  )
                );
                console.log(chalk.greenBright(`Employee Manager Updated`));
                view.viewEmployeesByDepartment;
                console.log(
                  chalk.greenBright.bold(
                    `====================================================================================`
                  )
                );
                askUserAgain();
              })
              .catch((err) => console.log(err));
          }
        });
    });
};
module.exports = {
  updateEmployeeRole,
  updateEmployeeManager,
};
