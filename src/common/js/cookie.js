export function delCookie(name,path) {//删除cookies
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";path="+path+";expires="
            + exp.toGMTString();
}
export function getCookie(c_name) {//获取cookie
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
export function setCookie(c_name, value,path,expiredays) {//设置cookie
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name
        + "="
        + escape(value)+';'
        + 'path='
        + escape(path)+';'
        + ((expiredays == null) ? "" : ";expires="
            + exdate.toGMTString());
}
