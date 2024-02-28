const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // on client also deletes the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204); // no content to delete
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    // is refreshToken in DB?
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }
    //delete refreshToken in DB
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    userDB.setUsers([...otherUsers, foundUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'user.json' ),
        JSON.stringify(userDB.users)
    );
    res.clearCookie('jwt', {httpOnly: true});
    res.sendStatus(204);

}

module.exports = {handleLogout}