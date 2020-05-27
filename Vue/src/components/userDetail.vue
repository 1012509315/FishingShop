<template>
    <div >
        
        <el-tabs v-model="activeName" @tab-click="handleClick" tab-position='left' style='color:red;background-color:white;'>
            <el-tab-pane label="用户管理" name="first">
                <div class="card" >      <!-- :class="{ animation:anim }" -->
                    <!-- <transition name = 'fade'  mode="out-in"> -->
                    <div v-if="!anim" class="xinxi" key='save'>
                        <div>欢迎 {{name}} 渔友</div>
                        <div>手机号: {{phone}}</div>
                        <div>地址: {{adress}}</div>
                        <el-button style="width:5em" plain @click="updata">修改</el-button>
                    </div>
                    <div v-else class="xinxi" key='updata'>
                        <div>欢迎 {{name}} 渔友</div>
                        <div>手机号: {{phone}}</div>
                        <div>密码: <el-input type="password" v-model="pwd" placeholder="请修改密码"></el-input></div>
                        <div>地址: <el-input v-model="adress" placeholder="请输入内容"></el-input></div>
                        <div>
                        <el-button style="width:5em" plain @click="confirm(1)">确认</el-button>
                        <el-button style="width:5em" plain @click="confirm">取消</el-button>
                        </div>
                    </div>
                    <!-- </transition> -->
                </div>
            </el-tab-pane>
            
        </el-tabs>
    </div>

</template>

<script>
export default {
    data() {
        return {
            name: '',
            phone: '',
            adress: '',
            pwd:'',
            anim: false,
            activeName: 'first'
        }
    },
    methods: {
        updata(){
            this.anim = true;
            this.pwd = '';
        },
        confirm(num){
            if(num==1){
                if(!this.pwd){
                    this.$notify({
                            title: '警告',
                            message: '密码不要为空！',
                            type: 'warning'
                        });
                    return ;
                }
                this.axios.post('/user/updateUser',{
                    password: this.pwd,
                    adress: this.adress,
                    name: this.name
                }).then((res)=>{
                    if(res.data.code == 200){
                        this.$notify({
                            title: '成功',
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.anim = false;
                        return ;
                    }
                })
            }
            this.anim = false;
        },
        handleClick(tab, event) {
        console.log(tab, event);
      }
        
    },
    created() {
        console.log('userDetail组件进入创建')
        this.axios.get(`/user/searchByname?name=${this.$store.state.user}`).then((res)=>{
            if(res.data.code === 200){
                this.name = res.data.data[0].name;
                this.phone = res.data.data[0].phone;
                this.adress = res.data.data[0].adress;//||'未填写地址';
            }
        })
    },
    beforeCreate() {
        console.log('userDetail组件',this.$store.state.user)
        if(!this.$store.state.user){
            this.$router.push('/login')
            //this.$destroy()
        }
        
    },
    destroyed() {
        console.log('userDetail组件已经销毁！')
    },
    mounted() {
        console.log('userDetail组件已经加载！')
    },
}
</script>

<style scoped>
    .el-tabs{
        position: absolute;
        top:0;
        left: 25vw;
        right: 25vw;
        bottom: 0;
        /* margin: 0 auto;
        width: 60vw; */
        border-radius: 10px;
        transition: 2s;
    }

    .card{
        position: relative;
        width: 38vw;
        height: 80vh;
        background-color: aliceblue;
        /* margin: 0 auto; */
        border-radius: 15px;
        color: black;
        transition: 2s;
    }
    .animation{
        transform: rotate3d(0,1,0,360deg)
    }

    .xinxi{
        position: absolute;
        top: 8%;
        left: 10%;
        font-size: 20px;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }   
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    
</style>