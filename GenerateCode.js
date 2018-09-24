'use strict';

function GenerateCode() {
    this.source = '0123456789abcdefghijklmnopqrstuvwxyz';
}

/**
 * 生产一个不重复的36位数
 */
GenerateCode.prototype.noRepeatStr = function (num) {
    let source = 'ZXCVBNMASDFGHJKLQWERTYUIOP0123456789zxcvbnmasdfghjklqwertyuiop';
    let length = source.length;
    source = source.split('');
    let str = '';
    for (let i = 0; i < num; i++) {
        const index = Math.random() * length | 0;
        str += source[index];
        source.splice(index, 1);
        length--;
    }
    return str;
};
// var randomStr = 'DJosIOVYlEmahcr6Mf4dSCBqzNX1bPwteyGL';

/**
 *  进制转换，num源数据，M表示num的进制，n表示目标进制 ，例如decimal('zjf', 36, 10) 比zjf 36进制转换成10进制
 */
function decimal(num, m, n) {
    const s = num + '';
    const result = parseInt(s, m).toString(n);
    return result;
}

/**
 * 给一个numstr字符串7位
 */
GenerateCode.prototype.validate = function (numstr, cipher) {
    const vs = numstr.substring(numstr.length - 1, numstr.length);
    numstr = numstr.substring(0, numstr.length - 1);
    const str = transform(numstr, cipher, this.source);
    const num = parseInt(decimal(str, cipher.length, 10)); //根据cipher长度定义进制，范围2-36
    const v = num % cipher.length; //求余数
    return cipher.charAt(v) == vs;
};

/**
 * 转换密码串
 */
function transform(numstr, source, cipher) {
    cipher = cipher + '';//强制转换字符串
    source = source + '';
    const array = numstr.split('');
    const length = array.length;
    let res = '';
    for (let i = 0; i < length; i++) {
        const index = source.indexOf(array[i]);
        res += cipher.charAt(index);
    }
    return res;
}

/**
 * 生产码
 * cipher 密码串36位
 * start 起始数，建议从100-1000 随机开始
 * number 生产总数
 */
GenerateCode.prototype.generate = function (cipher, start, number) {
    const array = new Array();
    number = number || 500;
    for (let i = 0; i < number; i++) {
        start = start + 1;
        //左边补8个0，当start=9的时候， 也就是900000000- 9亿小于36的6次方（也就是10亿7千万）。
        let str = '00000000' + start + '';
        str = str.split('').reverse().join(''); //反转
        str = str.substring(0, 9); //截取9位，也就是start最多也就是9位-9亿，否则丢失。
        // console.info(str);
        const num = parseInt(str);
        let numstr = decimal(num, 10, cipher.length); //根据cipher长度定义进制，范围2-36
        const length = numstr.length;
        numstr = '00000' + numstr; //补0，防止出现3，4位数的numstr；因为当start等于299999999 的时候会需要补0
        numstr = numstr.substring(length - 1, numstr.length);
        const res = transform(numstr, this.source, cipher) + cipher.charAt(num % cipher.length);//加上校验码
        // console.info(res, start);
        array.push(res);
    }
    return array;
};

module.exports = new GenerateCode();
var test = new GenerateCode();
console.info(test.noRepeatStr(36));
test.generate('DJosIOVYlEmahcr6Mf4dSCBqzNX1bPwteyGL', 123);
