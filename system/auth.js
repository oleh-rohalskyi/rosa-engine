var redis = require("redis"),
    client = redis.createClient();


const auth = {
    token: {
        get(user) {
           return "abc"+"|"+user.role+"|"+user.id+"|"+"def";
        },
        isTheSame(token) {
            return false;
        },
        isExpired() {
            return Date.now();
        },
        remove() {
            return true;
        }
    },
    refresh_token: {
        get() {

        },
        isTheSame() {
            return false;
        },
        expireDate() {
            return "";
        },
        remove() {
            return true;
        }
    }
}