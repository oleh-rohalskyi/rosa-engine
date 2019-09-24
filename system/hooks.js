//return { action:[stop,continue],payload:{} };

module.exports = {
    api(success,error,payload,key) {
        console.log("hoook fired","request",key);
    }
}