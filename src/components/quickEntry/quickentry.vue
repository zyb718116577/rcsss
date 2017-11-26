<template>
    <Card>
        <Timeline>
            <TimelineItem v-for="item in menuList" :key="item.name">
                <p class="time">{{item.title}}</p>
                <Button @click="_jump(items.name)" type="primary" class="content"
                        v-for="items in item.children" :key="items.name" style="margin-right: 5px;margin-top: 5px">{{items.meta.title}}</Button>
            </TimelineItem>
        </Timeline>
    </Card>
</template>

<script type="text/ecmascript-6">
    import {menuRouter} from '../../router/index'
    export default {
        name: '',
        data() {
            return {
                menuList: menuRouter
            }
        },
        methods: {
            _jump(path) {
                this.$router.push({
                    name: path
                });
            }
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
