module.exports = function(app) {
    var routes = require('./login');
    var users = require('./users');
    var chat = require('./chat');
    var detail = require('./detail');
    var set = require('./set');
    var activation = require('./activation');

    app.use('/', routes); // 即为为路径 / 设置路由
    app.use('/users', users); // 即为为路径 /users 设置路由
    app.use('/login', routes); // 即为为路径 /login 设置路由
    app.use('/register', routes); // 即为为路径 /register 设置路由
    app.use('/home', routes); // 即为为路径 /home 设置路由
    app.use("/logout", routes); // 即为为路径 /logout 设置路由
    app.use('/chat', chat); //chat route
    app.use('/detail', detail); //detail page
    app.use('/set', set); //set page
    app.use('/activation', activation); //activation page
}