const DB = require('../../system/db');

module.exports = class User extends DB {
    constructor(){
        super();
        this.withRole = ({
            login,
            password
        }) => {
            return new Promise((res,rej)=>{
            
                const con = this.dataBase.createConnection(this.conf);
                
                password = this.crypto.createHash('md5').update(password+"").digest("hex");
        
                con.connect((err) => {
        
                    const sql = `SELECT users.id, users.login, roles.name AS role FROM roles LEFT JOIN users ON users.role=roles.id WHERE password="${password}" AND login="${login}"`;
                    
                    con.query(sql,(err, result) => {
        
                        if (err) {
                            rej({success:false,error: err.message, data: null, code: err.code});
                            return;
                        }
                        
                        if (result.length <= 0) {
                            rej({success:false, code: "NO_COINCIDENCE",data: null});
                            return;
                        }
        
                        let user = result[0];
                        user.expired = new Date().getTime() + 86400000 * expiredDays;
                        const token = this.jwtStringify(user);
                        res({success: true, error: null, data: {...user,token}});
        
                    });
                });
            })
        }
    }
}