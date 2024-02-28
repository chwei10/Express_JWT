const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd){ 
        return res.status(400).json({"message": "username or password incomplete"});
    }
    const duplicate = userDB.users.find(person => person.username == user);
    if(duplicate) return res.status(409).json({"message": "duplicate user"});
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username": user,
            "roles": {
                "User":2001,
            },
            "password": hashedPwd
        };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users);
        res.status(201).json({"success": `new user: ${user}`});
    } catch (error) {
        res.status(500).json({"message": error.message});
    }

}

module.exports = {handleNewUser};