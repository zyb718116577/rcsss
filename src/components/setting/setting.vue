<template>
    <div class="">
        <Modal
            @on-visible-change="toggleModal"
            title="个人设置"
            v-model="showModal"
            :closable="true"
            :mask-closable="false">
            <Form ref="formCustom" :model="userInfo" :rules="rules" :label-width="80">
                <FormItem required label="用户名称" prop="title">
                    <Input v-model="userInfo.userInfo && userInfo.userInfo.title" placeholder="用户名称"></Input>
                </FormItem>
                <FormItem required label="用户描述" prop="description">
                    <Input v-model="userInfo.userInfo && userInfo.userInfo.description" type="textarea"
                           :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="用户描述"></Input>
                </FormItem>
                <FormItem required label="登录名" prop="loginName">
                    <Input v-model="userInfo.loginName" placeholder="登录名"></Input>
                </FormItem>
                <FormItem label="新密码">
                    <Input type="password" v-model="passWd" placeholder="新密码"></Input>
                </FormItem>
                <FormItem label="所在地">
                    <Cascader :data="areaDatas" v-model="area"></Cascader>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="text" @click="_cancel('formCustom')">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="_saveUserInfo('formCustom')">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import {ajax} from 'api/config'
    import rule from 'common/js/rules'
    import {bus} from 'common/js/util'
    import areaData from 'common/js/provence'

    const NAME_REPEAT = '名称重复';

    export default {
        props: {
            userInfo: {
                type: Object
            }
        },
        data() {
            const checkRepeat = (rule, value, callBack) => {
                ajax({
                    url: 'user/method=existBoolean',
                    postData: {
                        loginName: value,
                        uId: this.userInfo.uId
                    },
                    successFn: (res) => {
                        if (res.data.msg === NAME_REPEAT) {
                            callBack(new Error('登录名重复!'));
                        } else {
                            callBack()
                        }
                    }
                })
            };
            return {
                area: [],
                areaDatas: areaData,
                formCustom: {},
                showModal: false,
                modal_loading: false,
                passWd: '',
                rules: {
                    loginName: [rule.en_num_20, {validator: checkRepeat, trigger: 'blur'}]
                }
            }
        },
        methods: {
            /*弹窗显示隐藏时触发*/
            toggleModal(val) {
                if (!val) {
                    this._cancel('formCustom')
                }
            },
            /*取消按钮事件*/
            _cancel(name) {
                this.$refs[name].resetFields();
                this.showModal = false;
                this.modal_loading = false;
            },
            /*保存用户信息*/
            _saveUserInfo(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let postData = {
                            title: this.userInfo.userInfo.title,
                            description: this.userInfo.userInfo.description,
                            loginName: this.userInfo.loginName,
                            uId: this.userInfo.uId
                        }
                        if (this.passWd) {
                            postData.loginPwd = this.passWd
                        }
                        ajax({
                            url: 'user/method=modLogonInfo',
                            postData: postData,
                            successFn: (res) => {
                                this.modal_loading = false;
                                this.$Message.success(res.data.data);
                                this.showModal = false;
                            },
                            errorFn: () => {
                                this.showModal = false;
                                this.modal_loading = false;
                            }
                        })
                    }
                })
            }
        },
        mounted() {
            const _this = this;
            // 监听head组件的个人设置按钮点击事件
            bus.$on('showSeting', function (val) {
                _this.showModal = val;
            })
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
