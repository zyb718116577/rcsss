<template>
    <div :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" style="background-color: rgb(73, 80, 96)"
             :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <my-menu :shrink="shrink">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" src=../../../static/img/logo.png  alt="">
                    <img v-show="shrink" src=../../../static/img/logo-min.png  alt="">
                </div>
            </my-menu>
        </div>

        <div class="main" :style="{'padding-left':shrink? '60px' :'200px'}">
            <m-header :data="userInfo" :shrink="shrink" @on-change="changeMenu"></m-header>
            <div class="main-con">
                <keep-alive>
                    <router-view :user-info="userInfo"></router-view>
                </keep-alive>
            </div>
        </div>
        <setting :user-info="userInfo"></setting>
    </div>

</template>
<script>
    import MHeader from 'components/m-header/m-header'
    import MyMenu from 'components/menu/menu'
    import {getCurrentInfo} from 'api/user'
    import setting from 'components/setting/setting'
    import star from 'components/test/star'

    export default {
        data() {
            return {
                theme2: 'light',
                shrink: false,
                userInfo: {}
            }
        },
        methods: {
            changeMenu(val){
                this.shrink = val;
            },
            _myinit() {
                let _this = this;
                getCurrentInfo({
                    url: '/user/method=getCurrentLogonInfo',
                    successFn: function (res) {
                        _this.userInfo = res.data.data;
                    }
                });
            }
        },
        created() {
            this._myinit();
        },
        components: {
            MHeader,
            MyMenu,
            setting,
            star
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
    .sidebar-menu-con
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 21;
        transition: width .3s;
        .logo-con
            width 100%
            height 45px
            padding 10px
            margin 20px 0
            img
                height 100%
                width 100%
                transition: all .3s;
    .main
        position absolute
        left 0
        width 100%
        height: auto;
        min-height: 100%;
        background #ccc
        transition: padding .3s;
        .main-con
            margin 10px
</style>
