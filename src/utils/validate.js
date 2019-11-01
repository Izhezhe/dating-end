/**
 * Created by lizz on 18/11/19.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor', 'creator']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

/**
 * 判断手机号码是否正确
 */
export function isValidateMobile(val) {
  const list = []
  let result = true
  let msg = ''
  var isReg = /^1[34578][0-9]\d{8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  // const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
  if (!validatenull(val)) {
    if (val.length == 11) {
      if (!isReg.test(val)) {
        msg = '手机号码格式不正确'
      } else {
        result = false
      }
    } else {
      msg = '手机号码长度不为11位'
    }
  } else {
    msg = '手机号码不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断身份证号
 */
export function isValidateCode(val) {
  const list = []
  let result = true
  let msg = ''
  var isReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  if (!validatenull(val)) {
    if (val.length == 18) {
      if (!isReg.test(val)) {
        msg = '身份证号格式不正确'
      } else {
        result = false
      }
    } else {
      msg = '身份证号长度不为18位'
    }
  } else {
    msg = '身份证号不能为空'
  }

  // if(regIdCard.test(idCard)){
  //   if(idCard.length === 18){
  //     let idCardWi = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
  //     let idCardY = new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 );
  //     let idCardWiSum = 0
  //     for(let i=0;i<17;i++){
  //       idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
  //     }
  //     let idCardMod=idCardWiSum%11
  //     let idCardLast=idCard.substring(17)
  //     if(idCardMod === 2){
  //       if(idCardLast === "X"||idCardLast === "x"){
  //         result = false
  //       }else{
  //         msg = '身份证号码错误!，请重新输入'
  //       }
  //     }else{
  //       if(idCardLast === idCardY[idCardMod]){
  //         result = false
  //       }else{
  //         msg = '身份证号码错误!，请重新输入'
  //       }
  //     }
  //   }
  // }else{
  //   msg = '身份证号码错误!，请重新输入'
  // }
  list.push(result)
  list.push(msg)
  return list
}

/**
 * 判断邮箱
 */
export function isValidateEmail(val) {
  const list = []
  let result = true
  let msg = ''
  var isReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!validatenull(val)) {
    if (!isReg.test(val)) {
      msg = '邮箱格式不正确'
    } else {
      result = false
    }
  } else {
    msg = '邮箱不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}

