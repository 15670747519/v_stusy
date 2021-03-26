<template>
    <div>
        <div class="breadcrumb">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="card">
            <el-card class="box-card">
                <!-- <div slot="header" class="clearfix">
                    <span>卡片名称</span>
                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div> -->
                <!-- <div class="table"> -->
                    <el-table
                        :data="rightsList"
                        height="250"
                        border
                        style="width: 100%">
                        
                        <el-table-column
                        type="index"
                        label="#"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="authName"
                        label="权限名称"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="path"
                        label="路径"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="level"
                        label="权限等级"
                        >
                        <template slot-scope="scope">
                            <el-tag  v-if="scope.row.level==='0' ">一级</el-tag>
                            <el-tag type="success" v-if="scope.row.level==='1' ">二级</el-tag>
                            <el-tag type="error" v-if="scope.row.level==='2' ">三级</el-tag>
                        </template>
                        
                        </el-table-column>
                    </el-table>
                <!-- </div> -->
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            rightsList:[],
        }
    },
    created(){
        this.getRightsList();
    },
    methods:{
        async getRightsList(){
            const {data}  = await this.$http.get('rights/list');
            console.log(data.data, 9999)
            if(data.meta.status !== 200) {
                return this.$message.error('获取数据失败')
            }
            this.rightsList = data.data
        }
    }
    
}
</script>

<style  type="less" scoped>
/**
卡片内容
 */
 .card{
     margin: 40px 0;
    height: 100%;

 }
 

  
</style>