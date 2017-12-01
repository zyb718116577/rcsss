import Vue from 'vue'
let util = {

};

util.title = (title)=> {
    title = title || 'rcsss';
    document.title = title;
};
util.handleSubmit = (vue,name)=> {
    let result;
    vue.$refs[name].validate((valid) => {
        if (valid) {
            result = true;
        } else {
            result = false;
        }
        return result;
    })
};
util.handleReset = (vue,name)=> {
    vue.$refs[name].resetFields();
}
export const bus = new Vue()
export default util;

