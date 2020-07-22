<template>
  <div>
    <div class='kuang'>
      <div class="a" :class="{active:isActive}" @click="login">登录</div>
      <div class="b" :class="{active:!isActive}" @click="regist">注册</div>
    </div>
    <div class="demo-ruleForm">
      <el-form v-if="isActive" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size='medium' key='1'>
        <el-form-item label="登录名" prop="name" >
          <el-input v-model="ruleForm.name" placeholder="请输入手机号登录" list='phoneName'></el-input>
            <datalist id='phoneName' v-if='localPhone'>
              <option v-for='(item,index) of localPhone' :key='index' :value="item"></option>
            </datalist>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-form v-else :model="registForm" :rules="rules" ref="registForm" label-width="100px"  size='medium' key='2'>
        <el-form-item label="注册手机号" prop="name" >
          <el-input v-model="registForm.name" placeholder="请输入手机号作为登录账号"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="registForm.id" placeholder="请输入一个ID作为名称" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="registForm.pwd" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="registForm.checkPass" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReForm('registForm')">注册</el-button>
          <el-button @click="resetForm('registForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        var validatePass1 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入一个用户名'));
          }
          this.axios.get(`/user/checkid?id=${value}`).then((res)=>{
            if(res.data.code==200){
                callback(new Error('用户名已存在！！！'));
              }else{
                callback();
              }
          })
        };

        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registForm.pwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };

        return {
          localPhone: '',
          isActive: true,
          ruleForm: {
            name: '',
            pwd: ''
          },
          registForm: {
            name: '',
            pwd: '',
            id: '',
            checkPass: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { min: 11, max: 11, message: '错误手机号', trigger: 'blur' }
            ],
            pwd: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            checkPass: [
              { required: true, validator: validatePass2, trigger: 'blur' }
            ],
            id: [
              { required: true, validator: validatePass1, trigger: 'blur' }
            ],
          }
        }
    },
    methods: {
      login(){
        this.isActive=true;
      },
      regist(){
        this.isActive=false;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/user/login',{
              phone : this.ruleForm.name,
              pwd : this.ruleForm.pwd
            }).then((res)=>{
              console.log(res.data)
              if(res.data.code==200){
                //登录成功，修改vuex和存入sessionstorage
                this.$store.commit('updateUser',res.data.data[0].name);
                sessionStorage.setItem("userName",res.data.data[0].name);
                //将账号名存入localstorage
                if(localStorage.getItem('PhoneName')){
                  let arr = JSON.parse(localStorage.getItem('PhoneName'));
                  console.log(arr)
                  arr.push(this.ruleForm.name)
                  arr=new Set(arr)
                  console.log(arr)
                  localStorage.setItem('PhoneName',JSON.stringify(arr))
                }else{
                  localStorage.setItem('PhoneName',JSON.stringify([this.ruleForm.name]))
                }
                this.$router.push('/')
              }else{
                alert('账号或者密码错误！！！')
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      submitReForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/user/regist',{
                phone : this.registForm.name,
                pwd : this.registForm.pwd,
                id : this.registForm.id
              }).then((res)=>{
                console.log(res.data)
                if(res.data.code==200){
                  this.$store.commit('updateUser',this.registForm.id);
                  this.$router.push('/')
                }else{
                  alert('注册失败！！！')
                }
              })
          }else {
            return false;
          }
        });
      }
    },
    created() {
      console.log('进入login生命周期')
      if(localStorage.getItem('PhoneName')){
        this.localPhone = JSON.parse(localStorage.getItem('PhoneName'));
      }
    },
    beforeCreate() {
      console.log('进入loginbefore生命周期')
    },
    mounted() {
      console.log('进入loginmounted生命周期')
    },
}
</script>

<style scoped>
  .kuang {
    display: flex;
    justify-content: space-around;
    width: 50vw;
    height: 65px;
    margin:5vh 25vw;
    overflow: hidden;
    position: relative;
  }
  .a{
    padding-top: 15px;
    text-align: left;
    padding-left: 15px;
    font-size: 1.5em;
    width: 200px;
    height: 50px;
    background-color: rgb(64, 158, 255);
    border-radius: 5px;
  }
  .b{
    padding-top: 15px;
    text-align: right;
    padding-right: 15px;
    font-size: 1.5em;
    width: 200px;
    height: 50px;
    border-radius: 5px;
    background-color: rgb(64, 158, 255);
  }
  .kuang::after{
    content: '';
    display: block;
    transform: rotate(45deg);
    background-color:white;
    width: 200px;
    height: 200px;
    position: absolute;
    top: -65px;
    left: 220px;
  }
  .active {
    background-color: #67C23A;
  }
  .demo-ruleForm {
    width: 50vw;
    margin: 5vh 25vw;
    background-color: aliceblue;
    border-radius: 10px;
    padding-right: 10px;
    padding-top: 30px;
    padding-bottom: 5px;
  }
</style>