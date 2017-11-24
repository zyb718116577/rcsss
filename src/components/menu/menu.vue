<template>
    <div>
        <slot name="top"></slot>
        <w-menu v-show="!shrink" :menu-list="menuList"></w-menu>
        <close-menu v-show="shrink" :menu-list="menuList"></close-menu>
    </div>
</template>

<script type="text/ecmascript-6">
    import {menuRouter} from '../../router/index'
    import closeMenu from './components/c-menu'
    import WMenu from './components/w-menu'
    export default {
        props: {
            shrink: {
                type: Boolean
            }
        },
        data() {
            return {
                menuList: menuRouter
            }
        },
        components: {
            closeMenu,
            WMenu
        },
        methods: {
            changeMenu (active) {
                this.$router.push({
                    name: active
                });
            },
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
    .menu
        position fixed
        width 200px !important
        height 100%
        .logo
            width 100%
            height 45px
            padding 10px
            margin 20px 0
            img
                height 100%
                width 100%
</style>
