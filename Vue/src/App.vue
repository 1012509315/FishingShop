<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if(sessionStorage.getItem('userName')){
      //console.log('查询到有Usersession,存入Vuex中')
      this.$store.commit('updateUser',sessionStorage.getItem('userName'));
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: content-box;
  color: white;
  
}
</style>
