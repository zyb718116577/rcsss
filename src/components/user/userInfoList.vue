<template>
    <div class="">
        <framelist
            :refresh="refresh"
            :frame-name="'userInfoList'"
            :action-buttons="actionButtons"
            :queryBtn=true
            :queryBtnClick="queryBtnClick">
        </framelist>
        <Modal
            @on-visible-change="toggleModal"
            title="新增用户"
            v-model="addmodal"
            :closable="true"
            :mask-closable="false">
            <Form ref="formCustom" :model="formCustom" :rules="rules" :label-width="80" >
                <FormItem required label="用户名称" prop="title">
                    <Input v-model="formCustom.title" placeholder="用户名称"></Input>
                </FormItem>
                <FormItem required label="用户描述" prop="description">
                    <Input v-model="formCustom.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="用户描述"></Input>
                </FormItem>
                <FormItem required label="登录名" prop="loginName">
                    <Input v-model="formCustom.loginName" placeholder="登录名"></Input>
                </FormItem>
                <FormItem :required="addOrEdit" label="登录密码" :prop='addOrEdit?"loginPwd":""'>
                    <Input type="password" v-model="formCustom.loginPwd" placeholder="登录密码"></Input>
                </FormItem>
                <FormItem :required="addOrEdit" label="重复密码" :prop="addOrEdit?'repass':''">
                    <Input type="password" v-model="formCustom.repass" placeholder="重复密码"></Input>
                </FormItem>
                <FormItem required label="角色选择" prop="roleId">
                    <CheckboxGroup v-model="formCustom.roleId">
                        <Checkbox :label="item.roleId" v-for="item in allRoles" :key="item.roleId">{{item.roleName}}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem required label="分组名称" >
                    <Select v-model="formCustom.groupId">
                        <Option :label="item.groupName" :value="item.groupId" :key="item.groupId"
                                v-for="item in allGroupInfos"></Option>
                    </Select>
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
    import framelist from 'components/framelist/framelist'
    import util from 'common/js/util'
    import {ajax} from 'api/config'
    import rule from 'common/js/rules'

    const NAME_REPEAT = '名称重复';

    export default {
        props: {
            userInfo: {
                type: Object
            }
        },
        data() {
            const valideRePassword = (rule, value, callback) => {
                if (value !== this.formCustom.loginPwd) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            const checkRepeat = (rule, value, callBack) => {
                ajax({
                    url: 'user/method=existBoolean',
                    postData: {
                        loginName: value,
                        uId: this.formCustom.uId
                    },
                    successFn: (res)=>{
                        if (res.data.msg === NAME_REPEAT) {
                            callBack(new Error('登录名重复!'));
                        } else {
                            callBack()
                        }
                    }
                })
            };
            return {
                addOrEdit: true,//新增为true，编辑为false
                refresh: false,
                actionButtons: {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editUsers(params.row.key0)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                },
                addmodal: false,
                modal_loading: false,
                allGroupInfos: [],
                allRoles: [],
                formCustom: {},
                rules: {
                    title: [rule.length_20],
                    description: [rule.length_200],
                    loginName: [rule.en_num_20, {validator: checkRepeat, trigger: 'blur'}],
                    loginPwd: [rule.pass],
                    repass: [{required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: valideRePassword, trigger: 'blur'}],
                    roleId: [{required: true, type: 'array', min: 1, message: '至少选择一个角色!', trigger: 'change'}],
                    groupId: [rule.select]
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
                this.addmodal = false;
                this.modal_loading = false;
            },
            /*编辑用户信息*/
            editUsers(params) {
                this.addOrEdit = false;
                this._getAllGroupInfo();
                this._getAllRoles();
                ajax({
                    url: 'user/method=getLogonInfo',
                    postData: {uId: params},
                    successFn: (res)=> {
                        this._makeformCustom(JSON.parse(res.data.data));
                    }
                })
            },
            /*编辑时候拿取用户信息组装成为formCustom*/
            _makeformCustom(data) {
                this.formCustom = {
                    title: data.logonInfo.userInfo.title,
                    description: data.logonInfo.userInfo.description,
                    loginName: data.logonInfo.loginName,
                    roleId: ((data)=>{
                        let arr = [];
                        data.sysRolesList.forEach((item)=>{
                            arr.push(item.roleId)
                        })
                        return arr
                    })(data),
                    loginPwd: '',
                    repass: '',
                    groupId: data.userGroup.groupId,
                    uId: data.logonInfo.uId
                };
                this.addmodal = true;
            },
            /*删除用户*/
            remove(param) {
                this.$Modal.confirm({
                    content: '确认删除吗？',
                    onOk: () => {
                        ajax({
                            url: 'user/method=delUserInfo',
                            postData: {uId: param.row.key0},
                            successFn: (res) => {
                                this.$Message.success(res.data.data);
                                this.refresh = !this.refresh;
                            }
                        })
                    }
                });
            },
            /*新增用户*/
            queryBtnClick() {
                this.formCustom ={
                    title: '',
                    description: '',
                    loginName: '',
                    roleId: [],
                    loginPwd: '',
                    repass: '',
                    groupId: '',
                    uId: 0
                };
                this._getAllGroupInfo();
                this._getAllRoles();
                this.addmodal = true;
                this.addOrEdit = true;
            },
            /*获取分组信息*/
            _getAllGroupInfo() {
                ajax({
                    url: 'group/method=getGroupInfos',
                    successFn: (res) => {
                        this.allGroupInfos = res.data.data;
                    }
                })
            },
            /*获取所有角色*/
            _getAllRoles() {
                ajax({
                    url: 'sysRole/get/sysRoleList',
                    successFn: (res) => {
                        this.allRoles = res.data.data;
                    }
                })
            },

            /*保存用户信息*/
            _saveUserInfo(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.modal_loading = true;
                        let postData = this.formCustom;
                        postData.roleId = postData.roleId.toString();
                        ajax({
                            url: 'user/method=addOrModUserInfo',
                            postData: postData,
                            successFn: (res) => {
                                util.handleReset(this, 'formCustom')
                                this.modal_loading = false;
                                this.$Message.success(res.data.data);
                                this.addmodal = false;
                                this.refresh = !this.refresh;
                            },
                            errorFn: ()=>{
                                this.addmodal = false;
                                this.modal_loading = false;
                            }
                        })
                    }
                })
            }
        },
        components: {
            framelist
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
