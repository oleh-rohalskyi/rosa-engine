module.exports = {
    data() {
        return
    },
    prepareResult (result) {
        if (result.success) {
            result.data = result.data
        } else {
            result.error = result.error
        }
        return result
    },
    signup( response , result ) {

        result = this.prepareResult(result);

        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8;"
        });
        console.log(result)
        response.write(JSON.stringify(result));

        response.end();
        
    },
    signin( response ) {

        let result = {
            error: "",
            success: true,
            auth: {
                token: "1",
                refresh_token: "2"
            }
        }

        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8;"
        });

        response.write(JSON.stringify(result));

        response.end();
        
    }
}