<template>
    <div>
        <el-container class="home-container">
            <el-header class="header">
                <!-- <image src="../src/assets/logo.png"> -->
                <span class="title">后台管理系统</span>
                <el-button class="loginout" type="info" @click="loginout">退出</el-button>
            </el-header>

            <el-container>
                <el-aside :width="isCollapse ? '64px' : '200px' ">
                    <div class="toggle-button" @click="toggleCollapse">|||</div>

                    <el-row class="tac" name="test">
                    <el-col :span="24">
                    <el-menu  background-color="#545c64"
                    text-color="#fff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
                    router
                    active-text-color="red"
                    :default-active="savePath"
                    >
                    <el-submenu :index="item.id + ''" v-for="item in menuslist" :key="item.id">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                        </template>
                        
                        <el-menu-item :index="'/' + subitem['path'] " v-for="subitem in item.children" 
                        :key="subitem.id"
                        @click="saveNavState('/' + subitem['path'])"
                        >
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        {{subitem.authName}}
                        </template>
                        <!-- <el-menu-item index="1-4-1">选项1</el-menu-item> -->
                        </el-menu-item>
                    </el-submenu>
                    
                    </el-menu>
                </el-col>
                </el-row>
                </el-aside>
                <el-main class="container">
                    
                    <router-view> </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //左侧菜单数据
            menuslist: [],
            isCollapse: false,
            savePath:''
        }
    },
    created(){
        this.menus();
        this.savePath = window.sessionStorage.getItem('savePath')
    },
    methods: {
        loginout(){
            window.sessionStorage.removeItem('session_token');
            this.$router.push('/')

        },
        //左侧菜单
        async menus(){
            const {data} = await this.$http.get('menus');

            if(data.meta.status !== 200) return this.$message.error('接收数据失败')
            this.menuslist = data.data;
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        //保存路由
        saveNavState(savePath){
            window.sessionStorage.setItem('savePath',savePath);
        }
    }
}
</script>

<style type="less" scoped>
.home-container{
    height: 100vh;
    /* height: 100%; */

}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    align-items: center;

  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
    line-height: 200px;
  }

  .el-col{
      height: 100%;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .header{
      display: flex;
      justify-content: space-between;
  }
  .title{
      margin: 0 20px;
      color: white;
      font-size: 15px;
  }
  .el-menu{
      border-right: none;
      height: 100vh;
  }

  .toggle-button{
      height: 24px;
      background-color:#4A5064;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
  }
  
 
  /* body > .el-container {
    margin-bottom: 40px;
  } */
  
  /* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } */

  
</style>