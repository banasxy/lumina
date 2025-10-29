const fs = require('fs');

class Database {
  constructor(file) {
    this.file = file;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify([]));
    }
  }

  getUsers() {
    const data = fs.readFileSync(this.file);
    return JSON.parse(data);
  }

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    fs.writeFileSync(this.file, JSON.stringify(users, null, 2));
  }
}

module.exports = Database;
