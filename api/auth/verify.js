module.exports = {
    async post(success,error,params) {
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

