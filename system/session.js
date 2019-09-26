
var redis = require("redis");

module.exports = class Session {
    constructor(onError) {
        this.onError = onError;
        this.client = redis.createClient();
        this.client.on("error",onError);
        this.client.on("subscribe",()=>{
            console.log(1);
        });
    }
}