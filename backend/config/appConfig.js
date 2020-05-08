let appConfig = {};

appConfig.port  = 3000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb://127.0.0.1:27017/scheduler'
    //url:'mongodb+srv://deep:Es1ezC9hM58HLWqr@blogdb-nuv0i.mongodb.net/scheduler?retryWrites=true&w=majority'
}
appConfig.apiVersion = '/api/v1';

module.exports = {
    port:appConfig.port,
    allowedCorsOrigin : appConfig.allowedCorsOrigin,
    env : appConfig.env,
    db : appConfig.db,
    apiVersion : appConfig.apiVersion
};