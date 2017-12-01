<template>
    <div class="">
        <framelist
            :refresh="refresh"
            :frame-name="'updateConfigList'"
            :action-buttons="actionButtons"
            :queryBtn=true
            queryBtnTxt="上传更新"
            :queryBtnClick="queryBtnClick">
        </framelist>
        <Modal
            @on-visible-change="toggleModal"
            title="上传更新"
            v-model="addmodal"
            :closable="true"
            :mask-closable="false">
            <Form ref="formCustom" :model="formCustom" :rules="rules" :label-width="120">
                <FormItem required label="是否强制更新" prop="forceType">
                    <RadioGroup v-model="formCustom.forceType">
                        <Radio label="0">
                            <span>不强制更新</span>
                        </Radio>
                        <Radio label="1">
                            <span>强制更新</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="文件命名规则" prop="groupName">
                    客户端类型_系统类型_版本号_.zip 例：hclient_xp_1001.zip
                </FormItem>
                <FormItem required label="选择文件" prop="groupName">
                    <Upload
                        ref="upload"
                        :on-success="uploadsuccess"
                        :show-upload-list="true"
                        :before-upload="beforeupload"
                        :action="uploadUrl"
                        :data="formCustom"
                        :format="['zip']"
                        :on-format-error="handleFormatError">
                        <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
                    </Upload>
                </FormItem>
            </Form>
            <div slot="footer">

            </div>
            <!--<Spin fix v-show="showuploading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>上传中，请稍后。</div>
            </Spin>-->
        </Modal>
    </div>
</template>

<script type="text/ecmascript-6">
    import framelist from 'components/framelist/framelist'
    import util from 'common/js/util'
    import {ajax} from 'api/config'
    import rule from 'common/js/rules'
    const root = process.env.API_ROOT;
    export default {
        data() {
            return {
                uploadUrl: root + 'file/method=upload',
                refresh: false,
                actionButtons: {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'android-download'
                                },
                                on: {
                                    click: () => {
                                        this.edit(params)
                                    }
                                }
                            }, '下载')
                        ]);
                    }
                },
                addmodal: false,
                modal_loading: false,
                formCustom: {forceType:0},
                showuploading: false,
                rules: {
                    forceType: [rule.select]
                }
            }
        },
        methods: {
            /*下载更新*/
            edit(params) {
                window.location.href = `${root}/file/method=download?fileName=${params.row.key2}`;
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
                this.addmodal = true;
                this.addOrEdit = true;
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
                this.addmodal = false;
                this.$refs['upload'].clearFiles();
                this.refresh = !this.refresh;
            },
            /*上传之前*/
            beforeupload() {
                this.showuploading = true;
            },
            /*上传成功*/
            uploadsuccess(response,file) {
                this.showuploading = false;
                this.$Notice.success({
                    title: '文件上传成功',
                    desc: '文件 ' + file.name + ' 上传成功。'
                });
                this._cancel('formCustom')
            },
            /*选择文件错误*/
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择zip压缩文件。'
                });
            }
        },
        components: {
            framelist
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
