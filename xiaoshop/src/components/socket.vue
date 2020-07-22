<template>
    <el-container>
        <el-main>
            <template v-for='(item,index) of msgarr'>
                <div :key='index'>
                <p :class="item.type" v-html="item.msg"></p>
                <div style="clear:both"></div>
                </div>
            </template>
            
        </el-main>
        <el-footer>
            <input v-model="msg" type='text'>
            <button @click="send">发送</button>
        </el-footer>
    </el-container>
</template>

<script>
export default {
    
    data() {
        return {
            ws: '',
            msg: '',
            msgarr:[]
        }
    },
    methods: {
        send(){
            console.log("发送消息")
            if(this.msg){
                this.msgarr.push({
                msg: this.msg,
                type: 'user'
                })
                this.ws.send(this.msg)
                this.msg='';
            }
            
        }
    },
    mounted() {
        this.ws = new WebSocket('ws://localhost:3000/socket');
        this.ws.onopen = ()=>{
            console.log('@open');
            //this.ws.send({msg:"w s xx"})
            // this.msgarr.push({
            //     msg:'你好！我是机器人笨笨',
            //     type: 'client'
            // })
        }
        this.ws.onmessage = (e)=>{
            console.log('@message')
            console.log(e.data);
            this.msgarr.push({
                msg:e.data,
                type: 'client'
            })
        }
        this.ws.onclose = ()=>{
            console.log('@close')
        }
        this.ws.onerror = ()=>{
            console.log('@error')
        }
        
    },
    destroyed() {
        this.ws.close();
    },
}
</script>

<style scoped>
    input{
        width: 400px;
        height: 30px;
    }
    
    .el-main{
        width: 60vw;
        height: 80vh;
        background-color: #B3C0D1;
        margin: 0 auto;
        
    }

    .el-footer {
        height: 20vh;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    p{
        margin:8px 0px;
        
        font-size: 20px;
        background: rgb(24, 159, 168);
    }
    .user{
        float: right;
    }

    .client{
        float: flex;
    }
</style>