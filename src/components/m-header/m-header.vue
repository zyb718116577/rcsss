<template>
    <div class="main-header">
        <Row>
            <Col span="18">
                <div class="navicon-con" @click="_toggleMenu">
                    <button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="button" class="ivu-btn ivu-btn-text">
                        <Icon type="navicon" size="32"></Icon>
                    </button>
                </div>
                <div class="m-title" style="display: inline-block">
                    <Breadcrumb>
                        <BreadcrumbItem :key="item.name" :to="item.path" v-for="item in $store.state.currentPath">{{item.title}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </Col>
            <Col span="6" style="text-align: right" class="right">
                <Dropdown style="margin-left: 20px;text-align: center">
                    <a href="javascript:void(0)" v-if="data.loginName">
                        {{data.loginName}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem>个人设置</DropdownItem>
                        <DropdownItem>快速入口</DropdownItem>
                        <DropdownItem>注销/切换用户</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <span class="ivu-avatar ivu-avatar-circle ivu-avatar-default ivu-avatar-image"
                      style="background: rgb(97, 159, 231); margin-left: 10px;">
                    <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&amp;fm=27&amp;gp=0.jpg">
                </span>
            </Col>
        </Row>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            data: {
                type: Object
            },
            shrink: {
                type: Boolean
            }
        },
        data() {
            return {
                myShrink: this.shrink
            }
        },
        watch: {
            shrink(val) {
                this.myShrink = val;
            },
            myShrink(val) {
                this.$emit('on-change', this.myShrink);
            }
        },
        methods: {
            _toggleMenu() {
                this.myShrink = !this.myShrink
            }
        },
        created() {

        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
    .main-header
        height: 60px;
        background: #fff;
        box-shadow: 0 2px 1px 1px hsla(0, 0%, 39%, .1);
        position: relative;
        z-index: 11;
        .navicon-con
            margin: 6px;
            display: inline-block;
        .right
            height 100%
            line-height 60px
            .ivu-avatar
                margin-right 20px
</style>
