<template>
  <el-container>
    <el-header height='10vh'>
      <el-button type="primary" v-if='!user' style="margin:0.5em 4em" @click="loginClick">
        点击登录
      </el-button>
      <el-dropdown split-button type="success" v-else @command="handleClick" style="margin:0.5em 4em">
        <i class="el-icon-user"> {{user}}</i>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item command='a'>我的详情</el-dropdown-item>
          <el-dropdown-item command='b'>购物车</el-dropdown-item>
          <el-dropdown-item command='c'>机器人</el-dropdown-item>
          <el-dropdown-item command='d'>退出账号</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <el-aside width='18vw'>
        <el-menu
          default-active='1'
          class="el-menu-vertical-demo"
          @select="handleSelect">

          <el-menu-item index="1">
            <span slot="title" style='font-size:20px'>全部商品</span>
          </el-menu-item>

          <el-submenu index="2">
            <template slot="title">
              <span style='font-size:20px'>鱼竿</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="台钓竿">台钓竿</el-menu-item>
              <el-menu-item index="海竿">海竿</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <span style='font-size:20px'>钓箱钓椅</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="钓箱">钓箱</el-menu-item>
              <el-menu-item index="钓椅">钓椅</el-menu-item>
              <el-menu-item index="钓箱钓椅配件">钓箱钓椅配件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <el-row :gutter="1" >

          <el-col :span="6" v-for="o in shop" :key="o.id">
            <el-card style="margin-bottom:1px" :body-style="{ padding: '0px',margin: '0px' }">
              <img :src="`/api/${o.picture}`" class="image">
              <div style="padding: 14px;">
                <div class='span' :title="o.name"> {{ o.name | shopName }} </div>
                <div class="bottom clearfix">
                  <span class="time">&yen; {{ o.price | shopPrice }}</span>
                  <el-button type="text" class="button" @click="goShop(o.id)">查看商品</el-button>
                </div>
              </div>
            </el-card>
          </el-col>

        </el-row>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script>
export default {
    data() {
      return {
        shop:[]
        
      }
    },
    computed: {
      user:{
        get(){
          return this.$store.state.user;
        },
        set(value){
          this.$store.commit('updateUser',value);
        }
      }
    },
    methods: {
      getShop(value=1){
        if(value==1){
          var query = '/product/list'
        }else{
          query = `/product/list?type='${value}'`
        }
        this.axios.get(query).then((res)=>{
          console.log(res.data)
          this.shop = res.data
        })
      },
      handleSelect(key){
        console.log(key);
        this.getShop(key);
      },
      loginClick(){
        this.$router.push('login');
      },
      handleClick(command){
        if(command === 'a'){
          this.$router.push('userDetail');
        }
        if(command === 'b'){
          this.$router.push('shopList');
        }
        if(command === 'c'){
          this.$router.push('socket');
        }
        if(command === 'd'){
          this.$store.commit('updateUser','');
          sessionStorage.removeItem('userName'); 
        }
      },
      goShop(id){
        this.$router.push(`/shopDetail/${id}`);
      }
      
    },
    created() {
      this.getShop();
    },
    mounted() {
      console.log('user:'+this.$store.state.user)
    },
}
</script>
 
<style scoped>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-header {
    background-color: rgba(66, 161, 255,0.8);
    position: fixed;
    width: 100vw;
    height: 10vh;
    top:0px;
    left: 0px;
    z-index: 999;
  }
  
  .el-aside {
    background-color: rgb(64, 158, 255);
    position: fixed;
    left: 0px;
    top:10vh;
    
  }
  
  .el-main {
    color: white;
    margin: 0%;
    padding: 0%;
    overflow-x: hidden;
    position: absolute;
    top:10vh;
    left: 18vw;
  }

  .time {
    font-size: 20px;
    color: red;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 24px;
  }

  .button {
    margin-top: 3px;
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  
  .span {
    height: 60px;
  }
</style>