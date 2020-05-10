const util = require('./util.js')

let URL, imgUrl, imagePath, fileUrl,
    // envVersion = 'trial';
    envVersion = 'release';
//开发版 develop 体验版 trial 正式版 release
switch (envVersion) {
    case 'develop': {
        URL = "https://wx.onechuan.com/api_test/";
        imgUrl = "https://wx.onechuan.com/file_test/";
        imagePath = "https://wx.onechuan.com/api_test/images/wx/";
        fileUrl = 'https://wx.onechuan.com/file_test/download/';
        break;
    }
    case 'trial': {
        URL = "https://wx.onechuan.com/api_test/";
        imgUrl = "https://wx.onechuan.com/file_test/";
        imagePath = "https://wx.onechuan.com/api_test/images/wx/";
        fileUrl = 'https://wx.onechuan.com/file_test/download/';
        break;
    }
    case 'release': {
        URL = "https://wx.onechuan.com/api/";
        imgUrl = "https://wx.onechuan.com/file/";
        imagePath = "https://wx.onechuan.com/api/images/wx/";
        fileUrl = 'https://wx.onechuan.com/file/download/';
        break;
    }
}

// URL = "http://192.168.31.115:8110/";

/*
 测试 47.98.232.13:8088 
 本地 192.168.31.115:8088 
 服务器 192.168.1.17:8088
 正式版 https: //wx.onechuan.com/api/
 */

// 发送请求 无网络状态跳到登录
let lock = true;

function req(url, data = {}, method = 'get') {
    if (url.indexOf('api') != -1 && util.isLogin()) {
        data.access_token = util.getLocal("Login").inin.access_token;
    }

    if (url.indexOf('http') != -1)
        url = url;
    else
        url = URL + url;

    return new Promise((resolve, reject) => {
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: (data), //toUTF8(data)
            method: method,
            header: {
                'content-type': 'application/x-www-form-urlencoded;utf-8',
                signature: sha1(data),
                Authorization: "Basic d2VpeGluX2FwcGxldF9rZXk6d2VpeGluX2FwcGxldF9zZWNyZXQ=" //window.btoa("weixin_applet_key:weixin_applet_secret")
            },
            success(res) {
                if (res.data.msg == "token无效") {
                    util.clearLocal("Login")
                    // 重新获取token
                    getToken().then(success => {
                        // 重新发送请求
                        req(url, data, method).then((res) => {
                            resolve(res.data)
                        }).catch(error => {
                            reject(error)
                        })
                    }).catch(error => {
                        reject(error)
                    });
                } else {
                    resolve(res.data)
                }
            },
            fail(err) {
                reject(err)
                //console.log('err----' + err)
                wx.getNetworkType({
                    success(res) {
                        //console.log('未登录' + res);
                        if (res.networkType == "none" && lock) {
                            lock = false;
                            wx.navigateTo({
                                url: "/pages/home/login/login"
                            });
                            setTimeout(() => {
                                lock = true;
                            }, 15000);
                        }
                    }
                });
            }
        })
    })
}

function getToken() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: loginRes => {
                if (loginRes.code) {
                    wx.getUserInfo({
                        success: userRes => {
                            //console.log(userRes);
                            let data = {
                                code: loginRes.code,
                                encryptedData: userRes.encryptedData,
                                iv: userRes.iv
                            };
                            wx.request({
                                url: URL + 'login/weixin/code',
                                data: data,
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;utf-8',
                                    signature: sha1(data)
                                },
                                success: res => {
                                    //console.log('success: ', res.data)
                                    if (res.data.code == 0) {
                                        wx.setStorageSync("Login", res.data.data);
                                        resolve(res.data);
                                    } else {
                                        // 无手机号时 res.data.code == 40005
                                        util.clearLocal("Login")
                                        reject(res.data)
                                    }
                                },
                                fail: err => {
                                    //console.log('fail: ', err)
                                    reject(err)
                                }
                            })
                        }
                    });
                } else {
                    wx.showToast({
                        title: '登录失败！' + res.errMsg,
                        icon: 'none',
                        duration: 1500
                    });
                }
            }
        });
    })
}
// 刷新token
function refreshToken() {
    req(
            "/login/auto", {
                grant_type: "refresh_token",
                refresh_token: util.getLocal("Login").inin.refresh_token
            },
            "post"
        )
        .then(res => {
            if (res.code == 0) {
                util.setLocal("Login", res.data);
            }
        });
}

function toUTF8(data = {}) {
    for (let i of Object.keys(data)) {
        data[i] = encodeURI(encodeURI(data[i]))
    }
    return data;
}

function sha1(value = {}) {
    // keys 返回一个对象k的数组  ， includes判断数组里有没有响应的值
    if (!Object.keys(value).includes("client_id")) value.client_id = 'weixin_applet_key';
    if (!Object.keys(value).includes("nonce")) value.nonce = Math.random().toString().slice(2, 3);
    if (!Object.keys(value).includes("timestamp")) value.timestamp = new Date().getTime();
    let keys = Object.keys(value),
        str = '';
    keys.sort();
    for (let i of keys) {
        str = str + i + '=' + value[i] + '&'
    }
    str += 'weixin_applet_secret'
    return SHA1_(str); //
}

// 判断登录绑定公司
function hasCompanyName() {
    // 判断是否已绑定公司
    req("api/user/init-status", {}, "post").then((res) => {
        if (res.data.savedUserCard) {
            // 记录公司绑定
            util.setLocal("companyName", true)
            // 已绑定公司
        } else {
            wx.reLaunch({
                url: "/pages/home/companyName/companyName"
            });
        }
    }).catch(() => {
        wx.reLaunch({
            url: "/pages/home/companyName/companyName"
        });
    })
}

// SHA1_

function encodeUTF8(s) {
    var i, r = [],
        c, x;
    for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
            c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
    return r;
};

// 字符串加密成 hex 字符串
function SHA1_(s) {
    var data = new Uint8Array(encodeUTF8(s))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16,
        s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [],
        f = [
            function () {
                return m[1] & m[2] | ~m[1] & m[3];
            },
            function () {
                return m[1] ^ m[2] ^ m[3];
            },
            function () {
                return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
            },
            function () {
                return m[1] ^ m[2] ^ m[3];
            }
        ],
        rol = function (n, c) {
            return n << c | n >>> (32 - c);
        },
        k = [1518500249, 1859775393, -1894007588, -899497514],
        m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
        var o = m.slice(0);
        for (j = 0; j < 80; j++)
            w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
            t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
            m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
        for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
        return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");

    return hex;
};
module.exports = {
    // clearLocal: clearLocal,
    hasCompanyName: hasCompanyName,
    refreshToken: refreshToken,
    req: req,
    getToken: getToken,
    sha1: sha1,
    imgUrl: imgUrl,
    fileUrl: fileUrl,
    imagePath: imagePath
}