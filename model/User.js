/**
 * Created by leiyao on 16/12/9.
 */

class User {
    constructor(username, password, displayName, phone, userId, email) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.phoneNumber = phone;
        this.userId = userId;
        this.email = email;
    }
}

module.exports = User;