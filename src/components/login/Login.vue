<template>
    <div class="ui-contenner">
        <div class="ui-logo"></div>
        <div class="ui-main" style="box-shadow: 0px 0px 10px 10px rgba(0,0,0,.1);">
            <Form class="login-content" ref="formValidate" :model="formValidate" :rules="ruleValidate"
                  :label-width="80">
                <div class="ui-main-logo"></div>
                <FormItem label="账号" prop="loginName">
                    <Input v-model="formValidate.loginName" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="密码" prop="loginPwd">
                    <Input v-model="formValidate.loginPwd" @on-keyup.enter="_handleSubmit('formValidate')" placeholder="Enter your password" type="password"></Input>
                </FormItem>
                <FormItem>
                    <Button class="login-btn" type="primary" @click="_handleSubmit('formValidate')">Submit</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {login} from 'api/login'
    import {setCookie} from 'common/js/cookie'
    export default {
        data() {
            return {
                formValidate: {
                    loginName: '',
                    loginPwd: ''
                },
                ruleValidate: {
                    loginName: [
                        {required: true, message: '用户名不能为空！', trigger: 'blur'}
                    ],
                    loginPwd: [
                        {required: true, message: '密码不能为空！', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            _handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    // 拿到数据对象
                    let params = Object.assign({}, this.$refs[name].model, {
                        _remember_me: true
                    })
                    if (valid) {
                        let _this = this;
                        login({
                            url: '/login',
                            postData: params,
                            successFn: function (res) {
                                _this.$Message.success(res.data.msg);
                                setCookie('RCSSS','LOGINFLAG','/',7);
                                _this.timer = setTimeout(()=>{
                                    _this.$router.push({
                                        name: 'quick-entry'
                                    });
                                },1000)
                            }
                        });
                    }
                })
            }
        },
        deactivated() {
            clearTimeout(this.timer)
        }
    }
</script>

<style>
    body {
        font-size: .80em;
        font-family: "HelveticaNeue", "LucidaGrande", "SegoeUI", Arial, Helvetica, Verdana, sans-serif;
        color: #696969;
        margin: 0 auto;
        padding: 0;
        height: 100%;
    }

    html {
        margin: 0 auto;
        padding: 0;
        height: 100%;
    }

    html, body {
        margin: 0px;
        height: 100%;
    }

    .ui-contenner {
        height: 100%;
        width: 100%;
        background: url("../../../static/img/bcground.jpg");
        background-size: cover;
        position: relative;
    }

    .ui-logo {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 290px;
        height: 30px;
        background: url("../../../static/img/logo.png");
    }

    .ui-main {
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 355px;
        height: 260px;
    }

    .ui-main-logo {
        width: 100%;
        height: 70px;
        background: url(../../../static/img/wenzi.png) no-repeat 90px center;
    }

    .login-btn {
        background: #017cc4;
        width: 100%;
    }

    .ui-error icon {
        vertical-align: middle;
    }

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        　　color: #fff;
    }

    .login-content {
        padding-right: 35px;
    }
</style>
