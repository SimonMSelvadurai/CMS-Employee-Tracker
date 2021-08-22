const connection = require("../config/connection");
const inquirer = require("inquirer");
const validate = require("../rules/validate");
const chalk = require("chalk");
const view = require("./ActionView");

// ------------------------------------------------- UPDATE -------------------------------------------------------------------------

// Update an Employee's Role
updateEmployeeRole = (askUserAgain) => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  //connection.promise().query(sql, (error, response) => {
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      //       if (error) throw error;
      let employeeNamesArray = [];
      rows.forEach((employee) => {
        employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
        // console.log(
        //   "employee.first_name           : " +
        //     employee.first_name +
        //     "          : employee.last_name          : " +
        //     employee.last_name
        // );
        console.log(
          chalk.redBright.bold(
            `====================================================================================`
          )
        );
      });

      let sql = `SELECT role.id, role.title FROM role`;
      //connection.promise().query(sql, (error, response) => {
      connection
        .promise()
        .query(sql)
        .then(([rows, fields]) => {
          //if (error) throw error;
          let rolesArray = [];
          rows.forEach((role) => {
            rolesArray.push(role.title);
            //console.log(role.title);
            // console.log("role.title" + role.title);
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
                //console.log("employee *******  :-" + answer.value);
                fullName = answer.chosenEmployee.split(" ");
                firstName = fullName[0];
                lastName = fullName[1];
                console.log("firstName    : " + firstName);
                console.log("lastName    : " + lastName);
              });
              // console.log("firstName   11 : " + firstName);
              // console.log("lastName   11 : " + lastName);

              let newTitleId, employeeId;

              rows.forEach((role) => {
                // console.log(
                //   "<==>answer -------- answer role  :  " + answer.role
                // );
                if (answer.chosenRole === role.title) {
                  newTitleId = role.id;
                  console.log("newTitleId -------->  :  " + newTitleId);
                  // console.log(
                  //   "-------- answer.chosenRole   :  " + answer.chosenRole
                  // );
                  // console.log("-------- role.title   :  " + role.title);
                  // console.log(
                  //   "------------ answer.chosenEmployee   :  " +
                  //     answer.chosenEmployee
                  // );
                }
              });

              // let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
              //let sqls = `UPDATE employee SET employee.role_id = ${newTitleId} WHERE id = ${employeeId}`;
              let sqls = `UPDATE employee SET employee.role_id = ${newTitleId}   WHERE employee.first_name =  '${firstName}' AND employee.last_name =  '${lastName}'`;
              connection
                .promise()
                .query(sqls)
                //, [newTitleId, employeeId], (error) => {
                .then(([rows, fields]) => {
                  //   connection
                  //     .promise()
                  //     .query(sqls)
                  //     .then(([rows, fields]) => {
                  //if (error) throw error;
                  console.log(sqls);
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
  //connection.promise().query(sql, (error, response) => {
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

            //let sqls = `UPDATE employee SET employee.role_id = ${newTitleId}   WHERE employee.first_name =  ' ${firstName} ' AND employee.last_name =  ' ${lastName}'`;

            //connection.query(sql, [managerId, employeeId], (error) => {
            connection
              .promise()
              .query(sql)
              .then(([managerId, employeeId]) => {
                //if (error) throw error;
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
