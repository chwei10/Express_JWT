const data = {
    employees: require("../model/employee.json"),
    setEmployee: function (data){this.employees = data}
};


const getEmployees = (req, res) => {
    res.json(data.employees);
}

const createEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees.length + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({"message": "first and last name are needed"});
    }
    data.setEmployee([...data.employees, newEmployee]);
    res.status(201).json(data.employees);

}

const updateEmployee = (req, res) => {
    const employee = data.employees.find((emp => emp.id == parseInt(req.body.id)));
    if(!employee){
        return res.status(400).json({"message": `employee id ${req.body.id} not found`});
    }
    if(req.body.firstname)employee.firstname = req.body.firstname;
    if(req.body.lastname)employee.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployee(unsortedArray.sort((a, b) => a.id - b.id ));
    res.json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find((emp => emp.id == parseInt(req.body.id)));
    if(!employee){
        return res.status(400).json({"message": `employee id ${req.body.id} not found`});
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployee([...filteredArray]);
    res.json(data.employees);
}

const getEmployee = (req, res) =>{
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if(!employee){
        return res.status(400).json({"message": `no id:${req.params.id} employee`});
    }
    res.json(employee);
}

module.exports = {
    getEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    createEmployee
};