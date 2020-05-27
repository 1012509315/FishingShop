<template>
    <el-main >
        <div>
            <input type="checkbox" id="checkall" :checked="check_all" @change="checkall">
            <label for="checkall">全选</label>
        </div>
        
        <template v-for="(item,index) of shop_arr">
            <div :key = 'Symbol(item.id)' class="shopcheck">
                <input type="checkbox" v-model="check_arr[index]" @change="check_quanxuan()"> 
                <shop :data-arr="item" :index='index' @num="num"> 
                </shop>
            </div>
        </template>
        总价格:{{snum}}
        <el-button @click="buy">确定</el-button>
    </el-main>
</template>

<script>
import shop from '@/components/shop'
export default {
    components:{
        shop
    },
    data() {
        return {
            shop_arr: [],
            check_arr: [],
            check_all: false
        }
    },
    watch: {
        shop_arr(){
            
        }
    },
    computed: {
        snum(){
            return this.shop_arr.reduce((prev,ele,index)=>{
                    if(this.check_arr[index]){
                        return prev + Number(ele.price)*Number(ele.num);
                    }else{
                        return prev;
                    }  
                },0)
        }
    },
    methods: {
        num(value,index){
            this.shop_arr[index].num = value
            // let arr = this.shop_arr[index]
            // arr.num = value
            // this.$set(this.shop_arr,index,arr)
        },
        buy(){
            console.log(this.check_arr)
            let shop_buy = [];
            this.check_arr.forEach((ele,index) => {
                if(ele){
                    shop_buy.push({
                        id:Number(this.shop_arr[index].skuid),
                        number:this.shop_arr[index].num
                    })
                }
            });
            this.$router.push({
                name:'buy',
                params:{shop: JSON.stringify(shop_buy)}
            });
        },
        Symbol(i){
            return Symbol(i)
        },
        checkall(){
            this.check_all = !this.check_all
            if(this.check_all){
                this.check_arr = this.check_arr.map(()=>{
                    return true;
                })
                // for(var i in this.check_arr){
                //     console.log(i)
                //     this.check_arr[i] = true
                //}
            }else{
                this.check_arr = this.check_arr.map(()=>{
                    return false;
                })
                // for(var i in this.check_arr){
                //     console.log(i)
                //     this.check_arr[i] = false
                // }
            }
        },
        check_quanxuan(){
            if(this.check_arr.every((el)=>{
                if(el){
                    return true;
                }
                return false;
            })){
                this.check_all = true;
            }else{
                this.check_all = false;
            }
        }
    },
    created() {
        console.log('this.children :>> ', this.$children);
        console.log('this.$options :>> ', this.$options);
        console.log('shopList组件的生命周期')
        this.axios.post('/order/selectShopList',{uname: this.$store.state.user}).then((res)=>{
            this.shop_arr = res.data
            this.check_arr = this.shop_arr.map((ele)=>{
                return false;
            })
        })
    },
    beforeCreate() {
        if(!this.$store.state.user){
            this.$router.push('/login')
        }
    },
    xiaoxiao: 123
}
</script>

<style scoped>
    .el-main{
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: flex-start;
       
    }
    /* .el-main >div{
        flex: 0 0 auto;
        width: 40vw;
        position: relative;
        background-color: whitesmoke;
        color: #000;
        border-radius: 5px;
        margin-bottom: 3px;
        padding: 5px 0px 5px 8px;
    }
     */
    .shopcheck{
        display: flex;
    }
    .shopcheck >input{
        align-self: center;
    }
</style>