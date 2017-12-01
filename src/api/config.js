import axios from 'axios';
import qs from 'qs';
import iView from 'iview';
import router from 'vue-router'

let root = process.env.API_ROOT;
axios.defaults.baseURL = root;

export function ajax(options) {
    axios({
        method: 'post' || options.method,
        url: options.url,
        data: options.postData,
        /*处理request数据*/
        transformRequest: [function (data) {
            if (options.contentType) {
                return JSON.stringify(data);
            } else {
                return qs.stringify(data, {arrayFormat: 'brackets'})
            }
        }],
        headers: {
            'Content-Type': options.contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }).then((res) => {
        if (res.data.code != 0) {
            iView.Message.error(res.data.msg || res.msg);
            if (res.data.code === 10000) {
                window.location.hash = '/'
            }
            if (res.data.code === 5001) {
                options.successFn(res)
            }
            if (options.errorFn) {
                options.errorFn();
            }
            return;
        }
        options.successFn(res)
    }).catch((error) => {
        if (options.errorFn) {
            options.errorFn();
        }
        if (error.response) {
            iView.Message.error(error.response.data.msg)
        } else {
            if (error.message === 'Network Error') {
                window.location.hash = '/'
            }
        }
    })
}
