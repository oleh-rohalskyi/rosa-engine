const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const conf = require('./db.conf');
const crypto = require('crypto');
const secret = crypto.randomBytes(16).toString('hex');
const session = require('./session.js');

const expiredDays = 30;

module.exports = {
    jwtget(token) {
        if (token)
            return jwt.verify(token, secret);
        return "guest";
    },
    getPages() {
        return new Promise((res,rej)=>{
        
            const con = mysql.createConnection(conf);
           
            con.connect((err) => {

                const sql = `SELECT * FROM pages`;
                
                con.query(sql,(err, result) => {

                    if (err) {
                        rej({success:false,error: err.message, data: null});
                        return;
                    }
                    
                    if (result.length <= 0) {
                        rej({success:false,error: "NO_COINCIDENCE",data: null});
                        return;
                    }

                    function listToTree(data, options) {
                        options = options || {};
                        var ID_KEY = options.idKey || 'id';
                        var PARENT_KEY = options.parentKey || 'parent';
                        var CHILDREN_KEY = options.childrenKey || 'children';
                      
                        var tree = [],
                          childrenOf = {};
                        var item, id, parentId;
                      
                        for (var i = 0, length = data.length; i < length; i++) {
                          item = data[i];
                          id = item[ID_KEY];
                          parentId = item[PARENT_KEY] || 0;
                          // every item may have children
                          childrenOf[id] = childrenOf[id] || [];
                          // init its children
                          item[CHILDREN_KEY] = childrenOf[id];
                          if (parentId != 0) {
                            // init its parent's children object
                            childrenOf[parentId] = childrenOf[parentId] || [];
                            // push it into its parent's children object
                            childrenOf[parentId].push(item);
                          } else {
                            tree.push(item);
                          }
                        };
                      
                        return tree;
                      }

                    res( 
                        listToTree(result, {
                            idKey: 'id',
                            parentKey: 'parent',
                            childrenKey: 'childrens'
                        })
                    );

                });
            });
        })
    },
    getuser({
        login,
        password
    }) {
        return new Promise((res,rej)=>{
        
            const con = mysql.createConnection(conf);
            
            password = crypto.createHash('md5').update(password+"").digest("hex");
           
            con.connect((err) => {

                const sql = `SELECT users.id, users.login, roles.name AS role FROM roles LEFT JOIN users ON users.role=roles.id WHERE password="${password}" AND login="${login}"`;
                
                con.query(sql,(err, result) => {
                    console.log(222,err,result)

                    if (err) {
                        rej({success:false,error: err.message, data: null, code: err.code});
                        return;
                    }
                    
                    if (result.length <= 0) {
                        rej({success:false, code: "NO_COINCIDENCE",data: null});
                        return;
                    }

                    let user = result[0];
                    user.token = jwt.sign(user.role+`-=number=-${user.id}`, secret);
                    user.expired = new Date().getTime() + 86400000 * expiredDays;
                    user.role = null;
                    session.push(user.token);
                    user.id = null;
                    res({success: true, error: null, data: user});

                });
            });
        })
    },
    async signup({
        login,
        password
    }) { return new Promise(async(res,rej)=> {
            
            const con = mysql.createConnection(conf);
            let user = {
                success:false,
                data: {}
            }
            
            try {
                user = await this.getuser(login,password);
            } catch (error) {
                switch (error.code) {
                    case "NO_COINCIDENCE":
                        user = {
                            success:true,
                            data: {}
                        }
                        break;
                    default:
                        rej(error);
                }
            }
            //signup
            con.connect((err) => {

                if (err) rej(err);

                con.query(
                    `INSERT INTO users SET ?`,
                    { 
                        login,
                        password: crypto.createHash('md5').update(password+"").digest("hex")
                    },
                    (err, result) => {

                        if (err) {
                            rej({success: false, error: err});
                        }

                        console.log(result);
                        res({success: true, data: ""});

                    }
                );

            });

        });
    },
    async signin({
        login,
        password
    }) {
        return new Promise(async(res,rej)=>{
            let user = {
                success:false,
                data: {}
            }
            try {
                user = await this.getuser({login,password});
            } catch (error) {
                rej(error)
            }
            res(user);

            
        })
    }
};


  