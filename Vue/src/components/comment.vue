<template>
<div>
    <el-main v-if="firstarr.length">
        <div v-for="ele of firstarr" :key="ele.id">
            <div class="name">{{ele.name}}</div>
            <!-- <div class="time">time</div> -->
            <div class="content">{{ele.content}}</div>
            <el-button @click="open(ele.id)" type="text" class="button" >
                评论回复
            </el-button>  
            <div style="clear:both"></div>
            <div style="margin-left:45px;" v-for="item of secondarr[ele.id]" :key='item.id'>
                <div >{{item.name}}</div>
                <div class="content">{{item.content}}</div>
            </div>  
        </div>
    </el-main>
    <div v-else style="margin:0 40vw">该商品目前没有评论</div>
        <el-drawer
            title="评论回复"
            :visible.sync="drawer"
            :with-header="false"
            direction="btt"
            :before-close="handleClose"
            >
            <div style="width:300px;margin:30px auto">
                <div style="color:#000">请输入评论：</div>
                <textarea v-model="value"></textarea>
                <el-button type="primary" plain size='mini' @click="submit">回复</el-button>
            </div>
        </el-drawer>
</div>
</template>

<script>
export default {
    props:['id'],
    data() {
        return {
            num: 0,          //记录回复的主评论对象id编号
            drawer: false,
            firstarr: [],
            secondarr: {},
            value: ''
        }
    },
    methods: {
        handopen(num){
            this.name[num]
        },
        open(num){
            this.drawer = true;
            this.num = num;
            this.value = '' ;
            console.log(this.num)
        },
        handleClose(done) {
            this.$confirm('编辑不会保留,确认关闭？')
            .then(_ => {
                this.value = '' ;
                done();
            })
            .catch(_ => {});
        },
        submit(){
            if(!this.$store.state.user){
                this.$router.push('/login')
            }else{
            this.axios.post('/product/insertComment',{
                sid: this.num,
                shopid: this.id,
                name: this.$store.state.user,
                content: this.value
            }).then((res)=>{
                if(res.data.code == 200){
                    this.$notify({
                            title: '成功',
                            message: '回复成功！',
                            type: 'success'
                        });
                    this.secondarr[this.num].push({
                        id: Symbol(1),
                        sid: this.num,
                        shopid: this.id,
                        name: this.$store.state.user,
                        content: this.value
                    })
                    this.drawer=false;
                }else{
                    this.$notify({
                            title: '失败',
                            message: '回复失败！',
                            type: 'error'
                        });
                }
            })
            }
        }
    },
    created() {
        this.axios.get('/product/comment',{
            params:{
                id:this.id   //这个id 就是商品编号
            }
        }).then((res)=>{
            console.log(res.data)
            this.firstarr = res.data.firstarr;
            this.secondarr = res.data.secondarr;
        })
    },
}
</script>

<style scoped>
    .el-main{
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: flex-start;
    }
    .el-main >div{
        flex: 0 0 auto;
        width: 40vw;
        position: relative;
        background-color: whitesmoke;
        color: #000;
        border-radius: 5px;
        margin-bottom: 3px;
        padding: 5px 0px 5px 8px;
    }
    
    .name{
        width: 100px;
        height: 20px;
        font-size: 20px;
    }
    .time{
        margin-top:-16px;
        margin-left: 113px;
        width: 100px;
        height: 20px;
        text-align: center;
        
    }
    .content{
        margin-top: 5px;
        margin-left: 30px;
        width: 400px;
        font-size: 13px;
        
        word-wrap: break-word;
    }
    .button{
        float: right;
        margin-right: 15px;
        height: 25px;
        padding-top: 4px;
    }
</style>