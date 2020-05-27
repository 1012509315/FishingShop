<template>
    <el-container>
        <el-header >
            <div @click="goBack" class="page">
                <i class="el-icon-back" ></i>
                <span >返回</span>
            </div>
        </el-header>
        <el-main>
            <el-image :src="picture" :preview-src-list="picarr">
            </el-image>
            <div style="width: 50vw;">
                <div class="name">{{ name }}</div>
                <div class="price">&yen; {{price | shopPrice}}</div>
                
                <div class="sku">
                    <div>商品规格1：</div>
                    <template v-for="(item,index) of sku1">
                        <el-radio border v-model='radio1' @change="updataSku1" :label="index" :key='index' :disabled='sku1true[item]'>
                            <span style="color: white">{{item}}</span>
                        </el-radio>
                    </template>
                    <div style="margin-top: 2%;" v-if="sku2[0]">商品规格2：<br>
                        <template v-for="( item,index ) of sku2">
                            <el-radio border v-model="radio2" @change="updataSku2" :label="index" :key='index' :disabled='sku2true[item]'>
                                <span style="color: white">{{ item }}</span>
                            </el-radio>
                        </template>
                    </div>
                    <div style="margin-top: 2%;" v-if=" sku3[0] ">商品规格3：<br>
                        <template v-for="( item,index ) of sku3">
                            <el-radio border v-model="radio3" @change="updataSku3" :label="index" :key='index' :disabled='sku3true[item]'>
                                <span style="color: white">{{ item }}</span>
                            </el-radio>
                        </template>
                    </div>
                </div>
                <div class="number">
                    <div class="i">
                    <i class="el-icon-minus" @click="numShop(-1)"></i>
                    </div>
                    {{number}}
                    <div class="i">
                    <i class="el-icon-plus" @click="numShop(1)"></i>
                    </div>
                </div>
                <div class="btn"> 
                <el-button type="primary" plain @click="buy">购买</el-button>
                <el-button type="primary" plain @click="shoplist">加入购物车</el-button>
                </div>
            </div>
        </el-main>
        <el-footer >
            <router-link :to="{ name: 'comment', params: { id: this.$route.params.id }}" tag="el-button">查看评论</router-link>
            <comment :id='this.$route.params.id'></comment>
        </el-footer>
    </el-container>
    
</template>

<script>
import comment from './comment'
export default {
    data() {
        return {
            name: '',
            price: '',
            picture: '',
            picarr: [],
            sku1: [],     //单选框内容数组
            sku1true:[],  //单选框的禁选数组
            sku2: [],
            sku2true:[],
            sku3: [],
            sku3true:[],
            stock0: [],
            number: 0,
            radio1: -1,
            radio2: -1,
            radio3: -1,
            sid:-1        //sku编号
        }
    },
    components:{
        comment
    },
    methods: {
        buy(){
            if(!this.$store.state.user){
            this.$router.push('/login')
            }else{
            if(this.sid !== -1 && this.number !== 0){
                let shop=[{id:this.sid,number:this.number}];
                this.$router.push({name:'buy',params:{shop: JSON.stringify(shop)}});
            }}
        },
        shoplist(){
            if(!this.$store.state.user){
            this.$router.push('/login')
            }else{
            if(this.sid !== -1 && this.number !== 0){
                this.axios.post('/order/insertList',{
                    sid: this.sid,
                    num: this.number,
                    sname: this.name,
                    uname: this.$store.state.user
                }).then((res)=>{
                    if(res.data.code === 200){
                        this.$notify({
                            title: '成功',
                            message: '加入购物车成功，请到购物车查看！',
                            type: 'success'
                        });
                    }
                })
            }else{
                this.$notify({
                        title: '失败',
                        message: '请务必选上规格和数量！',
                        type: 'warning'
                    });
            }}
        },
        selectPrice(){
            this.axios.post('/product/price',{
                sid: this.$route.params.id,
                sku1: this.sku1[this.radio1],
                sku2: this.sku2[this.radio2],
                sku3: this.sku3[this.radio3]
            }).then((res)=>{
                this.price = res.data[0].price;
                this.sid = res.data[0].id;
            })
        },
        numShop(value){
            this.number = this.number + value;
            if(this.number <0) this.number = 0;
        },
        goBack() {
            this.$router.go(-1)
        },
        updataSku1(label){
            let arr1=[]
            let arr2=[]
            for(let i=0;i < this.stock0.length;i++){
                if(this.sku1[label] === this.stock0[i][0]){
                    arr1[this.stock0[i][1]] = true;
                    arr2[this.stock0[i][2]] = true;
                }
            }
            this.sku2true = arr1
            this.sku3true = arr2
            if(this.sku3[0]){
                if(this.radio2 !== -1 && this.radio3 !== -1){
                    this.selectPrice()
                }
            }else if(this.sku2[0]){
                if(this.radio2 !== -1){
                    this.selectPrice()
                }
            }else{
                this.selectPrice()
            }
        },
        updataSku2(label){
            let arr0=[]
            let arr2=[]
            for(let i=0;i < this.stock0.length;i++){
                if(this.sku2[label] === this.stock0[i][1]){
                    arr0[this.stock0[i][0]] = true;
                    arr2[this.stock0[i][2]] = true;
                }
            }
            this.sku1true = arr0
            this.sku3true = arr2
            if(this.sku3[0]){
                if(this.radio1 !== -1 && this.radio3 !== -1){
                    this.selectPrice()
                }
            }else{
                if(this.radio1 !== -1){
                    this.selectPrice()
                }
            }
        },
        updataSku3(label){
            let arr0=[]
            let arr1=[]
            for(let i=0;i < this.stock0.length;i++){
                if(this.sku1[label] === this.stock0[i][0]){
                    arr0[this.stock0[i][0]] = true;
                    arr1[this.stock0[i][1]] = true;
                }
            }
            this.sku2true = arr0
            this.sku3true = arr1
            if(this.radio1 !== -1 && this.radio2 !== -1){
                    this.selectPrice()
                }
        }
    },
    created() {
        this.axios.get(`/product/shopSku?id=${this.$route.params.id}`).then((res)=>{
            console.log(res.data)
            this.sku1 = res.data.sku1
            this.sku2 = res.data.sku2
            this.sku3 = res.data.sku3
            this.stock0 = res.data.stock0
            this.name = res.data.shop[0].name
            this.price = res.data.shop[0].price
            this.picture = '/api/' + res.data.shop[0].picture
            this.picarr.push(this.picture)
        })
    },
}
</script>

<style scoped>
    
    .btn{
        margin-top: 3%;
        margin-left: 8vw;
        
    }
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
    .sku {
        margin-top: 1%;
        font-size: 18px;
    }

    .price{
        color: red;
        font-size: 30px;
        font-weight: 600;
        margin-top: 3%;
        /* margin-left: 10px; */
    }
    .name{
        font-size: 25px;
        font-weight: 600;
        /* margin-left: 10px; */
    }

    .el-header{
       
        padding-top: 10px
    }
    .page{
        position: relative;
        margin-left: 20px;
        font-size: 30px;
        width: 110px;
        transition: 0.25s;
    }
    .page:hover{
        background-color: rgba(66, 161, 255,0.5);
        border-radius: 40px;
        cursor: pointer;
    }
    
    .el-main{
        display: flex;
        justify-content: space-around;
    }
    .el-image{
        width: 40vw;
        height: 70vh;
    }
    .el-footer{
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: flex-start;
    }
    /*
    .el-footer>div{
        flex: 0 0 auto;
        width: 50vw;
        height: 100px;
    } */
</style>