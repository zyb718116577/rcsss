<template>
    <Menu :theme="'dark'" :active-name="$route.name" :open-names="openNames" mode="vertical" @on-select="changeMenu" style="width: 200px">
        <template>
        <MenuItem :name="item.name" v-for="item in menuList" :key="item.path" v-if="item.children.length==1 && item.name === item.children[0].name">
            <Icon :type="item.icon"></Icon>
            {{item.title}}
        </MenuItem>
        <Submenu v-for="item in menuList" :key="item.path" :name="item.name" v-if="item.children.length > 1 || item.name !== item.children[0].name">
            <template slot="title">
                <Icon :type="item.icon"></Icon>
                {{item.title}}
            </template>
            <MenuItem v-for="items in item.children" :name="items.name" :key="items.path">
                <Icon :type="items.icon" :key="items.name"></Icon>
                <span class="layout-text" :key="items.name">{{items.meta.title}}</span>
            </MenuItem>
        </Submenu>
        </template>
    </Menu>

</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            menuList: {
                type: Array
            }
        },
        data() {
            return {
                openNames: this.$store.state.openedSubmenuArr
            }
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

</style>
