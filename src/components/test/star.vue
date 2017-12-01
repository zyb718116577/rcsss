<template>
    <div style="color: orange">
        <Icon :size="size" type="ios-star" v-for="(item,index) in star.full" :key="index"></Icon>
        <Icon :size="size" type="ios-star-half" v-if="star.half"></Icon>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            size: {
                type: Number,
                default: 14
            },
            score: {
                type: Number
            }
        },
        computed: {
            star() {
                let fullStar,half = true,fullStarArr = []
                let decimal = this.score % 1;// 小数点后的数字
                if (decimal >= 0.5) {
                    fullStar = Math.ceil(this.score)
                    half = false;
                } else if(decimal == 0) {
                    fullStar = this.score;
                    half = false;
                } else {
                    fullStar = Math.floor(this.score)
                }
                for (let i = 0; i< fullStar;i++){
                    fullStarArr.push('');
                }
                return {
                    full: fullStarArr,
                    half: half
                }
            }
        }
    }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
