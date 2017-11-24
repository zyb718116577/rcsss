<template>
    <div class="">
        <!--{{$store.state.count}}
        <div>
            <button @click="$store.commit('add')">增加</button>
            <button @click="$store.commit('reduce')">减少</button>
        </div>-->
        <framelist :refresh="refresh" :frame-name="'userInfoList'" :action-buttons="actionButtons"></framelist>
    </div>
</template>

<script type="text/ecmascript-6">
    import framelist from 'components/framelist/framelist'
    import util from 'common/js/util'
    import {ajax} from 'api/config'
    export default {
        data() {
            return {
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
                                        this.show(params.index)
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
                }
            }
        },
        methods: {
            show(params) {
                console.log(params)
            },
            remove(param) {
                let _this = this;
                ajax({
                    url: 'user/method=delUserInfo',
                    postData: {
                        uId: param.row.key0
                    },
                    successFn: (res)=> {
                        _this.$Message.success(res.data.data);
                        _this.refresh = !_this.refresh;
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
