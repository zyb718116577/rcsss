<template>
    <div @click="lockScreen" class="lock-screen-btn-con" style="display: inline-block;padding: 0 10px;cursor: pointer">
        <Tooltip content="锁屏" placement="bottom" style="height: 40px">
            <Icon type="locked" :size="20"></Icon>
        </Tooltip>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        methods: {
            lockScreen() {
                this.$router.push({
                    name: 'locking'
                })
            }
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
    .lock-screen-btn-con .ivu-tooltip-rel
        height 40px

</style>
