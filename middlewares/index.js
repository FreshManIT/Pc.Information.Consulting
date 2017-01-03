module.exports={
    //error handler init.
    errorHandler:function(app,err,req,res,next){
        var errorHandlerModule=require('./errorMiddleWares/errorHandler');
        errorHandlerModule(app);
    },
    //socket server init.
    socketInit:function(http){
        var socketHandlerModule=require('./socketMiddleWares/socketServer');
        socketHandlerModule(http);
    },
};