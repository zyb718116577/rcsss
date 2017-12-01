const en_num_20 = (rule, value, callback) => {
    if (value === '' || value.length > 20) {
        callback(new Error('长度应该为1-20位!'));
    } else {
        if (!/^[a-z|A-Z|0-9]{1,20}$/.test(value)) {
            // 对第二个密码框单独验证
            callback(new Error('英文或者数字，1到20位!'));
        }
        callback();
    }
};
const pass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码!'));
    } else {
        if (!/^[\S]{6,20}$/.test(value)) {
            // 对第二个密码框单独验证
            callback(new Error('密码必须6到20位，且不能出现空格!'));
        }
        callback();
    }
};
const select = (rule, value, callback) => {
    if (value === '' || value === undefined) {
        callback(new Error('必选项不能为空'));
    } else {
        callback();
    }
};
export default {
    length_20: {required: true,type:'string', min:1,max: 20, message: '长度应该为1-20位!', trigger: 'blur'},
    length_30: {required: true,type:'string', max: 30, message: '长度应该为1-30位!', trigger: 'blur'},
    length_200: {required: true,type:'string', max: 200, message: '长度应该为1-200位!', trigger: 'blur'},
    en_num_20: {validator: en_num_20, trigger: 'blur'},
    pass: {validator: pass, trigger: 'blur'},
    select: {validator: select, trigger: 'change'}
}
