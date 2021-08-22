const connection = require("../config/connection");
const inquirer = require("inquirer");
const chalk = require("chalk");
const view = require("./ActionView");

// Delete an Employee
removeEmployee = (askUserAgain) => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

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
            message: "Which employee would you like to remove?",
            choices: employeeNamesArray,
          },
        ])
        .then((answer) => {
          let employeeId;

          rows.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ${employeeId}`;
          connection
            .promise()
            .query(sql)
            .then(([rows, fields]) => {
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.redBright(`Employee Successfully Removed`));
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              view.viewAllEmployees(askUserAgain);
            })
            .catch((err) => console.log(err));
        });
    });
};

// Delete a Role
removeRole = (askUserAgain) => {
  let sql = `SELECT role.id, role.title FROM role`;

  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let roleNamesArray = [];
      rows.forEach((role) => {
        roleNamesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenRole",
            type: "list",
            message: "Which role would you like to remove?",
            choices: roleNamesArray,
          },
        ])
        .then((answer) => {
          let roleId;

          rows.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let sql = `DELETE FROM role WHERE role.id = ${roleId}`;
          connection
            .promise()
            .query(sql)
            .then(([roleId, fields]) => {
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.greenBright(`Role Successfully Removed`));
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              view.viewAllRoles(askUserAgain);
            })
            .catch((err) => console.log(err));
        });
    });
};

// Delete a Department
removeDepartment = (askUserAgain) => {
  let sql = `SELECT department.id, department.name FROM department`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let departmentNamesArray = [];
      rows.forEach((department) => {
        departmentNamesArray.push(department.name);
      });

      inquirer
        .prompt([
          {
            name: "chosenDept",
            type: "list",
            message: "Which department would you like to remove?",
            choices: departmentNamesArray,
          },
        ])
        .then((answer) => {
          let departmentId;

          rows.forEach((department) => {
            if (answer.chosenDept === department.name) {
              departmentId = department.id;
            }
          });

          let sql = `DELETE FROM department WHERE department.id = ${departmentId}`;
          connection
            .promise()
            .query(sql)
            .then(([departmentId, fields]) => {
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.redBright(`Department Successfully Removed`));
              console.log(
                chalk.redBright.bold(
                  `====================================================================================`
                )
              );
              view.viewAllDepartments(askUserAgain);
            })
            .catch((err) => console.log(err));
        });
    });
};
module.exports = {
  removeEmployee,
  removeDepartment,
  removeRole,
};
