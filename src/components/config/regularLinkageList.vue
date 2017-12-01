<template>
    <div class="">
        <framelist
            :refresh="refresh"
            :frame-name="'regularLinkageList'"
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
            <Form ref="formCustom" :model="formCustom" :rules="rules" :label-width="80">
                <FormItem required label="分组名称" prop="groupName">
                    <Input v-model="formCustom.groupName" placeholder="分组名称"></Input>
                </FormItem>
                <FormItem required label="分组可见规则" prop="controlFlag">
                    <RadioGroup v-model="formCustom.controlFlag">
                        <Radio label="allPersonSee">
                            <span>所有人可见</span>
                        </Radio>
                        <Radio label="allPersonNoSee">
                            <span>所有人不可见</span>
                        </Radio>
                        <Radio label="sameGroupRecursion">
                            <span>同组可见递归下级</span>
                        </Radio>
                        <Radio label="sameGroupNoRecursion">
                            <span>同组可见不递归下级</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem required label="分组上级名称" prop="fGroupId">
                    <Select @on-change="_change" v-model="item.choose" style="display: inline-block;width: 30%"
                            v-for="(item,index) in fGroupArr" :key="index">
                        <Option v-for="per in item.data" :label="per.groupName" :value="per.groupId"
                                :key="per.groupId"></Option>
                    </Select>
                    <Button :loading="findLoading" type="primary" icon="ios-plus-outline" @click="_findNext">查找下级</Button>
                </FormItem>
                <FormItem required label="分组说明" prop="content">
                    <Input v-model="formCustom.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="分组说明"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="_cancel('formCustom')">取消</Button>
                <Button type="primary" :loading="modal_loading" @click="_save('formCustom')">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import framelist from 'components/framelist/framelist'
    import util from 'common/js/util'
    import {ajax} from 'api/config'
    import rule from 'common/js/rules'
    import Vue from 'vue'

    const NAME_REPEAT = '名称重复';

    export default {
        props: {
            userInfo: {
                type: Object
            }
        },
        data() {
            return {
                addOrEdit: true,//新增为true，编辑为false
                findLoading: false,//查找下级按钮的loading
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
                                        this.edit(params.row.key0)
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
                fGroupArr: [{choose: 0, data: [{groupId: 0, groupName: '中国'}]}],
                formCustom: {},
                rules: {
                    groupName: [rule.length_20],
                    content: [rule.length_200],
                    controlFlag: [rule.select]
                }
            }
        },
        methods: {
            // 查找下级按钮的事件以及select改变之后改变对应下级的事件
            _findNext() {
                this.findLoading = true;
                let groupId = this.fGroupArr[this.fGroupArr.length - 1].choose;
                if (typeof groupId == 'string') {
                    this.$Message.error('请先选择上级!');
                    return;
                }
                ajax({
                    url: 'group/method=getGroupInfoBygroupId',
                    postData: {groupId: groupId},
                    successFn: (res) => {
                        if (res.data.data.length === 0) {
                            this.$Message.error('没有下级了!');
                            this.findLoading = false;
                            return;
                        }
                        let obj = {data: res.data.data}
                        Vue.set(obj, 'choose', res.data.data[0].groupId);
                        this.fGroupArr.push(obj);
                        this.findLoading = false;
                    }
                })
            },
            /*弹窗显示隐藏时触发*/
            toggleModal(val) {
                if (!val) {
                    this._cancel('formCustom')
                }
            },
            /*取消按钮事件*/
            _cancel(name) {
                this.$refs[name].resetFields();
                this.modal_loading = false;
                this.fGroupArr = [{choose: 0, data: [{groupId: 0, groupName: '中国'}]}];
                this.addmodal = false;
            },
            /*编辑信息*/
            edit(params) {
                this.addOrEdit = false;
                ajax({
                    url: '/group/method=getGroupInfo',
                    postData: {groupId: params},
                    successFn: (res) => {
                        this.formCustom = res.data.data;
                        this._getAllParent(res.data.data.fGroupId)
                    }
                })
            },
            /*拿取所有父节点*/
            _getAllParent(fGroupId) {
                ajax({
                    url: 'group/method=getGroupInfoByFgroupId',
                    postData: {fGroupId: fGroupId},
                    successFn: (res) => {
                        let all = res.data.data;
                        for (let n = all.length - 1; n >= 0; n--) {
                            ajax({
                                url: 'group/method=getGroupInfoBygroupId',
                                postData: {groupId: all[n].fGroupId},
                                successFn: (response) => {
                                    if (response.data.data.length === 0) {
                                        return;
                                    }
                                    let obj = {data: response.data.data}
                                    Vue.set(obj, 'choose', all[n].groupId);
                                    this.fGroupArr.push(obj)
                                }
                            })
                        }
                        this.addmodal = true;
                    }
                })
            },
            /*编辑时候拿取用户信息组装成为formCustom*/
            _change(choose) {
                for (let i = 0; i < this.fGroupArr.length; i++) {
                    if (this.fGroupArr[i].choose === choose) {
                        this.fGroupArr = this.fGroupArr.slice(0, i + 1);
                        return;
                    }
                }
            },
            /*删除*/
            remove(param) {
                this.$Modal.confirm({
                    content: '确认删除吗？',
                    onOk: () => {
                        ajax({
                            url: 'group/method=delGroupInfo',
                            postData: {groupId: param.row.key0},
                            successFn: (res) => {
                                this.$Message.success(res.data.data);
                                this.refresh = !this.refresh;
                            }
                        })
                    }
                });
            },
            /*新增分组*/
            queryBtnClick() {
                this.formCustom.groupId = 0;
                this.addmodal = true;
                this.addOrEdit = true;
            },

            /*保存用户信息*/
            _save(name) {
                this.$refs[name].validate((valid) => {
                    this.formCustom.fGroupId = this.fGroupArr[this.fGroupArr.length - 1].choose;
                    if (valid) {
                        this.modal_loading = true;
                        ajax({
                            url: 'group/method=addOrModGroupInfo',
                            postData: this.formCustom,
                            contentType: 'application/json',
                            successFn: (res) => {
                                util.handleReset(this, 'formCustom')
                                this.modal_loading = false;
                                this.$Message.success(res.data.data);
                                this.addmodal = false;
                                this.refresh = !this.refresh;
                            },
                            errorFn: () => {
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
