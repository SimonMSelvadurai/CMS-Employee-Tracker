const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");
const view = require("./lib/ActionView");
const del = require("./lib/ActionDelete");
const create = require("./lib/ActionCreate");
const update = require("./lib/ActionUpdate");

// Database Connect and Starter Title
connection.connect((error) => {
  if (error) throw error;
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(``);
  console.log(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(
    `                                                          ` +
      chalk.greenBright.bold("Created By: Simon Selvadurai")
  );
  console.log(``);
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  askUser();
});

function askUser() {
  promptUser()
    .then((userInput) => selectAction(userInput))
    .catch((err) => console.log(err));
}

function promptUser() {
  return inquirer.prompt([
    {
      name: "choices",
      type: "list",
      message: "Please select an option:",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "View All Employees By Department",

        "Update Employee Role",
        "Update Employee Manager",

        "Add Employee",
        "Add Role",
        "Add Department",

        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Exit",
      ],
    },
  ]);
}

function selectAction(answers) {
  const { choices } = answers;
  console.log(choices);

  if (choices === "View All Employees") {
    return view.viewAllEmployees(askUser);
  }

  if (choices === "View All Departments") {
    view.viewAllDepartments(askUser);
  }

  if (choices === "View All Employees By Department") {
    view.viewEmployeesByDepartment(askUser);
  }
  if (choices === "View All Roles") {
    view.viewAllRoles(askUser);
  }
  if (choices === "Add Employee") {
    create.addEmployee(askUser);
  }

  if (choices === "Add Role") {
    create.addRole(askUser);
  }
  if (choices === "Add Department") {
    create.addDepartment(askUser);
  }

  if (choices === "Update Employee Role") {
    update.updateEmployeeRole(askUser);
  }

  if (choices === "Update Employee Manager") {
    update.updateEmployeeManager(askUser);
  }

  if (choices === "Remove Employee") {
    del.removeEmployee(askUser);
  }
  if (choices === "Remove Role") {
    del.removeRole(askUser);
  }

  if (choices === "Remove Department") {
    del.removeDepartment(askUser);
  }
  if (choices === "Exit") {
    connection.end();
  }
}
