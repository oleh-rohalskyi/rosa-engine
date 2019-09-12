module.exports = async function(success,error,{data}) {
        
    const con = mysql.createConnection(this.conf);

    let user = {
        success:false,
        data: {}
    }
    
    try {
        user = await this.checkUser(data.login,data.password);
    } catch (e) {
        switch (e.code) {
            case "NO_COINCIDENCE":
                user = {
                    success:true,
                    data: {}
                }
                break;
            default:
                error(e);
        }
    }
    //signup
    con.connect((err) => {

        if (err) error(err);

        con.query(
            `INSERT INTO users SET ?`,
            { 
                login,
                password: crypto.createHash('md5').update(data.password+"").digest("hex")
            },
            (err) => {

                if (err) {
                    error({success: false, error: err});
                }

                success({success: true, data: ""});

            }
        );

    });
}