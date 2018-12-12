<!-- 1.模板：html结构 -->
<template>
<!--有且仅能有一个根标签-->
  <div id="app">
    <!--
    <img src="./assets/logo.png">
    <router-view/>
    -->
    <query></query>
    <visualization></visualization>
  </div>
</template>

<!-- 2.行为：处理逻辑 -->
<script>

//局部注册组件

import Query from './components/Query/Query.vue'
import Visualization from './components/Visualization/Visualization.vue'
import axios from 'axios'

export default {
  name: 'App',
  components:{
    "query": Query,
    "visualization": Visualization,
  },
  created () {
    // axios.post('http://127.0.0.1:5000/aaaa', { id: 12345, nodes: [1,2,3,4,5,6,7,8,9], contraints: '123445' })
    //   .then((d) =>{
    //     console.log(d.data)
    //   })
    // axios.post('http://127.0.0.1:5000/bbbb', { id: 12345, nodes: [1,2,3,4,5,6,7,8,9], contraints: '123445' })
    //   .then((d) =>{
    //     console.log(d.data)
    //   })
  }
}
</script>

<!-- 3.样式：解决样式 -->
<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

body {
  margin: 0px;
  overflow: hidden;
}

</style>
