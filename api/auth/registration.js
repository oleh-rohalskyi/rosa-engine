let validation = require("../../src/shared/validation");

module.exports = async function post({ params, config, session }, help) {

        let itk = config.auth.id_type_key;
        let itkValue = params[itk];

        let errors = validation.auth.registration(params, itk);
        if (errors) {
            // return {success: false, error: errors};
        }
        let captcha = await session.getCaptcha(params.captcha_id);

        if (params.captcha !== captcha) {
            // return {success: false, error: "WRONG__CAPTCHA"};
        }

        const con = help.cc();

        let user = {
            success: false,
            data: {}
        }

        let query = `INSERT INTO users (${itk}) SELECT ${help.escape(itkValue || "")} `;
        query += `WHERE NOT EXISTS ( SELECT ${itk} FROM users WHERE ${itk}=${help.escape(itkValue || "")} ) LIMIT 1 `;
        let error = null;

        let pr = () => {
            return new Promise(res => {

                con.query(query, (err, result) => {

                    console.log(err, result)
                    if (err) {
                        res({ success: false, error: err.message, data: null, code: err.code });
                        return;
                    }


                    if (result.affectedRows)
                        res({ success: true });
                    else res({ success: false, "error": "EXIST__USER" });
            
                });
            })
        }
        if (error)
            return error;
        else return await pr();

    }
