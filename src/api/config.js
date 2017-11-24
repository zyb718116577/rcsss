import axios from 'axios';
import qs from 'qs';
import iView from 'iview';

let root = process.env.API_ROOT;
axios.defaults.baseURL = root;

export function ajax(options) {

    /*拦截响应数据*/
    axios.interceptors.response.use((response) => {
        //const data = response.data
        return response;
    },(err)=>{
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)' ; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
        iView.Message.error(err.message)
        return
    })

    axios({
        method: 'post' || options.method,
        url: options.url,
        data: options.postData,
        transformRequest: [function (data) {
            return qs.stringify(data, {arrayFormat: 'brackets'})
        }],
        headers: {
            'Content-Type': options.contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }).then((res) => {
        if (res.data.code != 0) {
            iView.Message.error(res.data.msg || res.msg);
            return;
        }
        options.successFn(res)
    }).catch((err) => {
        console.log(err)
    })
}
