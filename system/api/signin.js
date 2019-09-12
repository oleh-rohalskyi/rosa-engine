module.exports = async function(success,error,{data}) {
    let result = {
        success: false,
        data: {}
    }
    try {
        result = await this.getUser({login:data.login,password: data.password});
    } catch (e) {
        error(e)
    }
    success(result);
}