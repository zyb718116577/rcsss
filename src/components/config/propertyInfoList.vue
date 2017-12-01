<template>
    <div class="">
        <framelist
            :refresh="refresh"
            :frame-name="'propertyInfoList'"
            :action-buttons="actionButtons"
            :queryBtn=true
            :queryBtnClick="queryBtnClick">
        </framelist>
        <Modal
            @on-visible-change="toggleModal"
            title="新增属性"
            v-model="addmodal"
            :closable="true"
            :mask-closable="false">
            <Form ref="formCustom" :model="formCustom" :rules="rules" :label-width="95">
                <FormItem required label="属性中文名" prop="propertyNameCn">
                    <Input v-model="formCustom.propertyNameCn" placeholder="属性中文名"></Input>
                </FormItem>
                <FormItem required label="属性英文名" prop="propertyNameCn">
                    <Input v-model="formCustom.propertyNameEn" placeholder="属性英文名"></Input>
                </FormItem>
                <FormItem label="属性标签名">
                    <Input v-model="formCustom.tagType" placeholder="属性标签名"></Input>
                </FormItem>
                <FormItem required label="属性默认值" prop="">
                    <Input v-model="formCustom.defaultValue" placeholder="属性默认值"></Input>
                </FormItem>
                <FormItem required label="显示优先级" prop="groupName">
                    <Input v-model="formCustom.displayOrder" placeholder="显示优先级"></Input>
                </FormItem>
                <FormItem required label="属性描述" prop="content">
                    <Input v-model="formCustom.propertyDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="属性描述"></Input>
                </FormItem>
                <FormItem required label="是否公共配置" prop="controlFlag">
                    <RadioGroup v-model="formCustom.globalFlag">
                        <Radio label="0">
                            <span>私有配置</span>
                        </Radio>
                        <Radio label="1">
                            <span>公共配置</span>
                        </Radio>
                        <Radio label="2">
                            <span>都是</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem required label="用户自定义" prop="controlFlag">
                    <RadioGroup v-model="formCustom.customizeFlag">
                        <Radio label="0">
                            <span>不能</span>
                        </Radio>
                        <Radio label="1">
                            <span>能</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem required label="使用标志" prop="controlFlag">
                    <RadioGroup v-model="formCustom.disableFlag">
                        <Radio label="0">
                            <span>失效</span>
                        </Radio>
                        <Radio label="1">
                            <span>生效</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem required label="属性展示类型" prop="controlFlag">
                    <RadioGroup v-model="formCustom.htmlType">
                        <Radio label="2">
                            <span>下拉框</span>
                        </Radio>
                        <Radio label="3">
                            <span>多选</span>
                        </Radio>
                        <Radio label="4">
                            <span>文本</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <Card v-for="(item,index) in formCustom.propertyExtends"
                      :key="index"
                      v-if="formCustom.propertyExtends.length > 0"
                      style="height: 65px"  >
                    <FormItem required label="扩展属性名" prop="propertyNameCn" class="extend-property">
                        <Input v-model="item.showName" placeholder="扩展属性名"></Input>
                    </FormItem>
                    <FormItem required label="扩展属性值" prop="propertyNameCn" class="extend-property">
                        <Input v-model="item.showValue" placeholder="扩展属性值"></Input>
                    </FormItem>
                    <Button type="text" v-if="index === 0">
                        <Icon :size="20" type="ios-plus-outline"></Icon>
                    </Button>
                    <Button type="text" v-if="index > 0">
                        <Icon :size="20" type="ios-trash-outline"></Icon>
                    </Button>
                </Card>
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
                formCustom: {
                    customizeFlag:"0",
                    defaultValue:"value1",
                    disableFlag:"1",
                    displayOrder:"1",
                    fieldId:0,
                    globalFlag:"0",
                    htmlType:"2",
                    propertyDesc:"描述1",
                    propertyExtends:[{propertyId: 0, recId: 0, showName: "扩展1", showValue: "value1"},{
                        "propertyId":2,
                        "recId":4,
                        "showName":"扩展2",
                        "showValue":"value2"
                    }],
                    propertyId:0,
                    propertyNameCn:"属性1",
                    propertyNameEn:"en1",
                    tagType:"标签1",
                },
                rules: {
                    propertyNameCn: [rule.length_20],
                    content: [rule.length_200],
                    controlFlag: [rule.select]
                }
            }
        },
        watch: {
            /*观察整个对象的变化*/
            /*formCustom: {
                handler(newValue, oldValue) {
                    console.log(newValue)
                },
                deep: true
            },*/
            /*观察对象内指定属性*/
            ['formCustom.htmlType'](val) {
                if (val == 4) {
                    this.formCustom.propertyExtends = [];
                } else if(val == 2 || val == 3) {
                    this.formCustom.propertyExtends = [{propertyId: 0, recId: 0, showName: "扩展1", showValue: "value1"}];
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
    .extend-property
        display inline-block;
        width 43%
</style>
