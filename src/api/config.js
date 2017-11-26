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
        transformRequest: [function (data) {
            return qs.stringify(data, {arrayFormat: 'brackets'})
        }],
        headers: {
            'Content-Type': options.contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }).then((res) => {
        if (res.data.code != 0) {
            iView.Message.error(res.data.msg || res.msg);
            console.log(this)
            if (res.data.code === 10000) {
                window.location.hash = '/'
            }
            return;
        }
        options.successFn(res)
    }).catch((error) => {
        if (error.response) {
            iView.Message.error(error.response.data.msg)
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    })
}
