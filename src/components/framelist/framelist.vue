<template>
    <div class="">
        <Card>
            <div slot="title" class="list-title">
                <Form ref="formValidate" :model="formItem" inline class="my-css">
                    <FormItem v-for="item in queryHTML"
                              v-if="item.queryType !== 0"
                              :prop="item.fieldName"
                              :key="item.showName"
                              :label="item.showName">
                        <Input type="text"
                               v-model="formItem[item.fieldName]"
                               :placeholder="item.showName"
                               v-if="item.queryType  === 1 || item.queryType === 2">
                        </Input>
                        <div :name="item.fieldName" class="between" v-if="item.queryType === 3">
                            <InputNumber :min="0" placeholder="最小值"></InputNumber>-
                            <InputNumber :min="0" placeholder="最大值"></InputNumber>
                        </div>
                        <DatePicker v-model="formItem[item.fieldName]" :name="item.fieldName" v-if="item.queryType === 4" type="date" placeholder="Select date"></DatePicker>
                        <DatePicker v-model="formItem[item.fieldName]" :name="item.fieldName" v-if="item.queryType === 5" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date"></DatePicker>
                        <Select v-model="formItem[item.fieldName]" :name="item.fieldName" v-if="item.queryType === 6">
                            <Option :value="items.csValue" v-for="items in item.constantInfos" :key="items.csValue">{{items.csName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-if="queryHTML.length > 0">
                        <Button type="primary" @click="_getQueryObj('formValidate')">查询</Button>
                        <Button type="ghost"  style="margin-left: 8px" @click="handleReset('formValidate')">重置</Button>
                        <Button type="primary" style="margin-left: 8px"
                                @click="queryBtnClick"
                                v-if="queryBtn">{{queryBtnTxt}}</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="list-main" style="text-align: center">
                <Table v-if="!showNodata" :loading="loading" :columns="columnsData" :data="tableDate" @on-row-dblclick="showData"></Table>
                <div class="nodata-con" v-if="showNodata" style="text-align: center;width: 100%;height: 300px" >
                    <img src="../../../static/img/nodata.png" alt="" style="height: 100%">
                </div>
            </div>
            <div class="page-con">
                <Page :total="pageData.totalRows" show-total class="page-inner"
                      :page-size="pageData.perRows"
                      show-elevator
                      @on-change="_changePage" ></Page>
            </div>
        </Card>
    </div>
</template>

<script type="text/ecmascript-6">
    import {frameList} from 'api/framelist'

    export default {
        props: {
            frameName: String,
            actionButtons: {
                type: Object
            },
            refresh: Boolean,
            queryBtn: Boolean,
            queryBtnTxt: {
                type: String,
                default () {
                    return '新增'
                }
            },
            queryBtnClick: {
                type: Function
            }
        },
        data() {
            return {
                currentPage: 1,
                queryHTML: [],
                loading: true,
                columnsData: [],
                tableDate: [],
                pageData: {},
                formItem: {},
                queryObj: {},
                showNodata: false
            }
        },
        methods: {
            /*向服务器端拿取数据*/
            _frameList() {
                this.loading = true;
                let _this = this;
                frameList({
                    url: '/frame/get/frameList',
                    postData: {
                        frameName: this.frameName,
                        curPage: this.currentPage,
                        queryObj: JSON.stringify(this.queryObj)
                    },
                    successFn: function (res) {
                        _this._makeData(res.data.data);
                    }
                })
            },

            /*组装数据*/
            _makeData(res) {
                this.queryHTML = res.fieldInfos;
                this.pageData = res.page;
                let tableData = res.fieldDatas;
                if (!tableData.length) {
                    this.showNodata = true
                    return;
                } else {
                    this.showNodata = false
                }
                let tableDatas = [],columnsArr = [];
                tableData.forEach((item,index)=> {
                    let obj = {};
                    item.fieldInfos.forEach((i,m)=>{
                        if (i.showIndex != 0){
                            if (index == 0) {
                                let columns = {
                                    title: i.showName,
                                    key: `key${m}`
                                }
                                columnsArr.push(columns)
                            }
                            if (i.fieldType == 'Date') {
                                i.data = i.data.substring(0,i.data.length - 5);
                            }
                            obj[`key${m}`] = i.data;
                        }
                    })
                    tableDatas.push(obj);
                    this.tableDate = tableDatas;
                    this.columnsData = columnsArr;
                })
                this.columnsData.push(this.actionButtons);
                this.loading = false;
            },
            // 双击显示详情
            showData(value,index) {
                let content = '',count = 0;
                for (let n in value) {
                    content += `${this.columnsData[count].title}: ${value[n]}<br>`;
                    count ++;
                }
                this.$Modal.info({
                    title: 'User Info',
                    content: content
                })
            },
            //改变页码
            _changePage(page) {
                this.currentPage = page;
                this._frameList();
            },
            /*封装搜索obj*/
            _getQueryObj(name) {
                this.queryObj = this.formItem;
                console.log(this.queryObj)
                for (let n in this.queryObj) {
                    if (!this.queryObj[n] || (!this.queryObj[n][0] && !this.queryObj[n][0]) ) {
                        delete this.queryObj[n];
                    }
                }
                this._frameList();
            },
            /*重置*/
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        watch: {
            refresh() {
                this._frameList();
            }
        },
        created() {
            this._frameList()
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
    .my-css .ivu-form-item-content
        display inline-block
    .page-con
        margin 20px 0 0 0
        text-align right


</style>
