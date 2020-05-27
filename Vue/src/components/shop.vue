<template>
    <div class="card"> 
        <div style="width: 20vw">{{shop.sname}}</div>
        <div style="width: 20vw">规格： {{sku | skuName}}</div>
        <!-- <span class="num">X {{shop.num}}</span> -->
        <div class="number">
            <div class="i">
            <i class="el-icon-minus" @click="numShop(-1)"></i>
            </div>
            {{shop.num}}
            <div class="i">
            <i class="el-icon-plus" @click="numShop(1)"></i>
            </div>
        </div>
        <div class='pri'>价格:{{shop.price*shop.num}}</div>
        <div style="clear:both"></div>
    </div>
</template>

<script>
export default {
    props:['dataArr','index'],
    data() {
        return {
            shop: this.dataArr,
            sku : ''
        }
    },
    methods: {
        numShop(value){
            this.shop.num = this.shop.num + value;
            if(this.shop.num <0) this.shop.num = 0;
            this.$emit('num',this.shop.num,this.index)
        }
    },
    beforeMount() {
        console.log('this.$parent :>> ', this.$parent);
        this.axios.post('/product/skuName',{skuid: this.shop.skuid}).then((res)=>{
            
            this.sku = res.data[0].sku1 + res.data[0].sku2 + res.data[0].sku3 ;
        })
    },
}
</script>

<style scoped>
    .i{
        transition: 0.5s
    }
    .i:hover{
        background-color: rgba(0, 255, 255,0.8);
        border-radius: 7px
    }
    .number {
        font-size: 30px;
        width: 250px;
        margin-top: 3%;
        margin-left: 6vw;
        
        display: flex;
        justify-content: space-around;
    }
    .card{
        box-sizing: border-box;
        background-color: whitesmoke;
        color: #1b2947;
        width: 30vw;
        border-radius: 5px;
        margin-left: 8px;
        margin-top: 3px;
        margin-bottom: 3px;
        padding: 5px 10px;
    }
    .num{
        float: right;
        margin-top: -20px;
        margin-right: 30px;
        font-weight: 700;
        font-size: large;
    }
    .pri{
        clear: right;
        font-weight: 700;
        font-size: large;
        float: right;
        margin-right: 10px;
    }
</style>