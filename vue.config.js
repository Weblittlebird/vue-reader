module.exports = {
    //baseUrl在vue-cli3.3后被废除，使用publicPath 
    publicPath: process.env.NODE_ENV === 'production'
    //              环境变量 NODE_ENV
    ? './'
    : '/'
}