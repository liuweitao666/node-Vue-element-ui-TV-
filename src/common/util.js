// eslint-disable-next-line no-unused-vars
export function util(callback, formdata, login) {

    // 创建验证规则（正则表达式）
    const regusername = /^[A-Z]\w{5,9}$/
    const regpassword = /^\w{6,16}$/
    const regemail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    const regphone = /^1[3456789]\d{9}$/
    // 验证用户名是否正确
    if (formdata.username || formdata.username.length === 0) {
        if (formdata.username.length === 0) {
            return callback(true, 0)    //0
        } else if (formdata.username.substr(0, 1).toUpperCase() !== formdata.username.substr(0, 1)) {
            callback(true, 2)
            return console.log('首字母需要大写')   //2
        } else if (regusername.test(formdata.username)) {
            callback(true, 1)  //1
        } else {
            return callback && callback(true, 3)  //3
        }
    }
    // 验证密码的正确性
    if (formdata.password || formdata.password.length === 0) {
        if (formdata.password.length === 0) {
            return callback && callback(true, 4)   //4
        } else if (regpassword.test(formdata.password)) {
            return callback && callback(true, 1)
        } else {
            return callback && callback(true, 5)  //5
        }
    }
    if (login) {
        if (formdata.password && formdata.username) {
            callback && callback(false)
            return console.log('success')
        }
    }
    // 验证邮箱的正确性
    if (formdata.email) {
        if (regemail.test(formdata.email)) {
            console.log('邮箱正确')
        } else {
            callback && callback(true)
            return console.log('邮箱格式不正确')
        }
    }
    // 验证手机号的正确性
    if (formdata.phone) {
        if (regphone.test(formdata.phone)) {
            console.log('手机格式正确')
        } else {
            callback && callback(true)
            return console.log('手机格式不正确')
        }
    }
    if (formdata.phone && formdata.email && formdata.password && formdata.username) {
        callback && callback(false)
    }
}

// 验证登录用户名
export function regusername(callback, username) {
    // 验证规则
    const regusername = /^[A-Z]\w{5,11}$/
    // 条件判断
    if (username || username.length === 0) {
        if (username.length === 0) {
            return callback(0)    //0
        } else if (username.substr(0, 1).toUpperCase() !== username.substr(0, 1)) {
            return callback(2) //2
        } else if (regusername.test(username)) {
            callback(1)  //1
        } else {
            const regemail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regemail.test(username)) {
                return callback(1)
            } else if (username.length === 0) {
                return callback(8)
            } else if (!username.includes('@')) {
                return callback(7)  //7
            } else {
                return callback(6)  //6
            }
            // return callback && callback(3)  //3
        }
    }
}

// 验证登录密码
export function regpassword(callback, password) {
    // 验证规则
    const regpassword = /^\w{6,16}$/
    // 条件判断
    if (password || password.length === 0) {
        if (password.length === 0) {
            return callback && callback(4)   //4
        } else if (regpassword.test(password)) {
            return callback && callback(1)
        } else {
            return callback && callback(5)  //5
        }
    }
}

// 确认密码
export function regcompassword(callback, pwd, compwd) {
    console.log(pwd, compwd)
    if (pwd === '') {
        return callback(4)
    } else if (pwd === compwd) {
        return callback(1)
    } else {
        return callback(10)
    }
}
// 验证邮箱是否正确
export function regemail(callback, email) {
    const regemail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (regemail.test(email)) {
        return callback(1)
    } else if (email.length === 0) {
        return callback(8)
    } else if (!email.includes('@')) {
        return callback(7)  //7
    } else {
        return callback(6)  //6
    }


}
// 验证手机号是否正确
export function regphone(callback, phone) {
    const regphone = /^1[3456789]\d{9}$/

    if (regphone.test(phone)) {
        return callback(1)
    } else if (phone.length === 0) {
        return callback(8)
    } else {
        return callback(9)
    }


}