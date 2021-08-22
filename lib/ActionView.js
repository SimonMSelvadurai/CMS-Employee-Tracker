const connection = require("../config/connection");
const chalk = require("chalk");
const figlet = require("figlet");

// viewAllEmployees111 = (askUserAgain) => {
//   let sql = `SELECT employee.id,
//                     employee.first_name,
//                     employee.last_name,
//                     role.title,
//                     department.name AS 'department',
//                     role.salary
//                     FROM employee, role, department
//                     WHERE department.id = role.department_id
//                     AND role.id = employee.role_id
//                     ORDER BY employee.id ASC`;

//   // const query = sql;
//   connection
//     .promise()
//     .query(sql)
//     .then(([rows, fields]) => {
//       //console.log(rows);
//       console.table(rows);
//       askUserAgain();
//     })
//     .catch((err) => console.log(err));
//   // .then(() => connection.end());
// };

viewAllEmployees = (askUserAgain) => {
  let sql = `SELECT employee.id,
  employee.first_name,
  employee.last_name,
  role.title,
  department.name AS 'department',
  role.salary
  FROM employee, role, department
  WHERE department.id = role.department_id
  AND role.id = employee.role_id
  ORDER BY employee.id ASC`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` + chalk.green.bold(`All Employees:`)
      );
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      askUserAgain();
    })
    .catch((err) => console.log(err));
};

// View all Departments
viewAllDepartments = (askUserAgain) => {
  let sql = `SELECT department.id AS id, name AS department FROM department`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` + chalk.green.bold(`All Departments:`)
      );
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      askUserAgain();
    })
    .catch((err) => console.log(err));
};

viewEmployeesByDepartment = (askUserAgain) => {
  const sql = `SELECT employee.first_name, 
                    employee.last_name, 
                    department.name AS department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.log(
        `                              ` +
          chalk.green.bold(`Employees by Department:`)
      );
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      console.table(rows);
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      askUserAgain();
    })
    .catch((err) => console.log(err));
};

viewAllRoles = (askUserAgain) => {
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(
    `                              ` +
      chalk.green.bold(`Current Employee Roles:`)
  );
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  const sql = `SELECT role.id, role.title, department.name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      rows.forEach((role) => {
        // console.log(role.title);
      });
      console.table(rows);
      console.log(
        chalk.yellow.bold(
          `====================================================================================`
        )
      );
      askUserAgain();
    });
};

// function askUser() {
//   promptUser()
//     .then((userInput) => selectAction(userInput))
//     .catch((err) => console.log(err));
// }
module.exports = {
  //employeeSearch,
  viewAllEmployees,
  viewAllRoles,
  viewAllDepartments,
  viewEmployeesByDepartment,
  //   viewEmployeesByDept,
  //   viewEmployeesByMgr,
  //   viewBudgetByDept,
};
