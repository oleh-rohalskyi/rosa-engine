module.exports = {
    error( response, error ) {

        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8;"
        });

        response.write(JSON.stringify({
            error,
            success: false,
        }));

        response.end();

    },
    signup( response ) {

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
        
    },
    signup( response ) {

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