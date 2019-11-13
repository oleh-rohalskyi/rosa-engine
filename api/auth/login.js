module.exports = {
    async post(req) {
        console.log(req.params)
        let result = {
            success: false,
            data: {}
        }
        try {
            result = await this.user.withRole({login:params.login, password: params.password});
        } catch (e) {
            error(e)
        }
        success(result);
    }
}

