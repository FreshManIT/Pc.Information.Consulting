var crypto=require("crypto");

/**
 * 默认配置项，提供aes192加密解密算法。
 */
var Defaults={
        encoding:{
            input:"utf8",
            output:"hex"
        },
        algorithms:'aes192'
};

/**
 * 构造方法
 */
function AESHelper(options){
    if(typeof options=='string'){
        Defaults.key=options;
        options=Defaults;
    }
    //定义属性
    this.key=options.key;
    this.inputEncoding=options.encoding.input;
    this.outputEncoding=options.encoding.output;
    this.algorithms=options.algorithms;

    /**
     * 添加加密原型方法
     */
    this.AesEnCoding=function(plaintext){
            var cipher=crypto.createCipher(this.algorithms,this.key);
            return cipher.update(plaintext,this.inputEncoding,this.outputEncoding)+cipher.final(this.outputEncoding);
    };

    /**
     * 添加解密原型方法
     */
    this.AesDeCoding=function(crypted){
        try{
            var decipher=crypto.createDecipher(this.algorithms,this.key);
            return decipher.update(crypted,this.outputEncoding,this.inputEncoding)+decipher.final(this.inputEncoding);
        }catch(e){
            return "";
        }
    };
};

/**
 * 抛出方法
 */
module.exports=AESHelper;