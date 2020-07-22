<template>
    <div class="main">
        <h1>订单</h1>
        <div>收货电话:</div><textarea v-model="phone" class="text"></textarea>
        <div>收货地址:</div><textarea v-model="adress" class="text"></textarea>
        <div>购买商品:</div>
            <div class="card" v-for="item of shop_arr" :key = 'item.id'>
                <!-- <div style="width: 20vw">{{name}}</div> -->
                <div style="width: 20vw">{{item.sku1+item.sku2+item.sku3 | skuName}}</div>
                <span class="num">X {{item.number}}</span>
                <div class='pri'>价格:{{item.price}}</div>
                <div style="clear:both"></div>
            </div>
        <div style="margin-top:3px;margin-bottom:3px;">金额总数: <span style="color:red;font-weight:700;font-size: large;">{{snum}}</span></div>
        <el-button @click="dialogVisible = true" >购买</el-button>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>是否确认购买？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="buy">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:['shop'],
    data() {
        return {
            dialogVisible: false,
            shop_arr: [],
            phone: '123',
            adress: '初始值'
        }
    },
    computed: {
        snum(){
            return this.shop_arr.reduce((prev,ele)=>{
                    return prev + Number(ele.price)*Number(ele.number)
                },0)
        }
    },
    methods: {
        buy(){
            let shop = JSON.parse(this.shop);
            console.log(shop)
            this.axios.post("/order/insertOrder",{
                shop,
                name: this.$store.state.user
            }).then((res)=>{
                console.log(res.data)
                if(res.data.code == 200){
                    this.$notify({
                            title: '成功',
                            message: '购买成功，返回主页面',
                            type: 'success'
                        });
                    this.$router.push('/')
                }
            })
            this.dialogVisible = false
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }
    },
    created() {
        let shop = JSON.parse(this.shop);
        console.log(shop)
        if(shop instanceof Array){
        this.axios.post('/order/selectShop',{shop}).then(res=>{
            //console.log(res.data)
            this.shop_arr = res.data;
        })
        }else{
            this.$router.push('/')
        }
        
        console.log(this.$store.state.user)
        if(this.$store.state.user){
        this.axios.get('/user/searchByname',{params:{name: this.$store.state.user}}).then(res=>{
            console.log(res.data)
            this.phone = res.data.data[0].phone;
            this.adress = res.data.data[0].adress;
        })
        }
    },
    beforeCreate() {
        if(!this.$store.state.user){
            this.$router.push('/login')
        }
    },
}
</script>

<style scoped>
    .main{
        width: 40vw;
        margin: 10px auto;
    }
    .text{
        box-sizing: border-box;
        width: 30vw;
        border-radius: 5px;
        margin-left: 8px;
    }
    .text:focus{
        outline: none;
        border: 1px solid cyan;
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