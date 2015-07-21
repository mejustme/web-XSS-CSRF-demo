var sanitizer = require('sanitizer');
module.exports = function (str){
    var safeStr = sanitizer.sanitize(str) //移除不安全的属性与标签 如 href="alert(1)"
        safeStr = sanitizer.escape(safeStr) //将特色HTML标签转义为HTML实体标签
    return safeStr;
};