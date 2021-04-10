<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片试图去-->
        <el-card>
            <el-row :gutter='20'>
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select" clearable @clear="goodsListData">
                <el-button slot="append" icon="el-icon-search" @click="goodsListData"></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addGoods">添加商品</el-button>
            </el-col>
            </el-row>
            <!--商品列表-->
            <el-table margin-top="20"
            :data="goodslistdata"
            height="250"
            border
            style="width: 100%">
            <el-table-column type="index" >
            </el-table-column>
            <el-table-column
            prop="goods_name"
            label="商品名称"
            width="280">
            </el-table-column>
            <el-table-column
            prop="goods_price"
            label="商品价格"
            width="180">
            </el-table-column>
            <el-table-column
            prop="goods_weight"
            label="商品重量">
            </el-table-column>
            <el-table-column
            prop="add_time"
            label="商品创建时间">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
            </el-table-column>
            <el-table-column
            label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeId(scope.row.goods_id)">删除</el-button>
                <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
            </template>
            
            </el-table-column>
        </el-table>
        <!--分页-->
        <span class="demonstration">完整功能</span>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,20]"
        :page-size="this.queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
        </el-pagination>

        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:20,
            },
            //总条数
            total:0,
            //商品数据
            goodslistdata:[],

            currentPage: 1

        }

    },
    created(){
        this.goodsListData();
    },
    methods:{
        //商品列表数据
        async goodsListData(){
            const {data} = await this.$http.get('goods',{params: this.queryinfo});
            console.log(data,9999);
            if(data.meta.status !== 200){
                return this.$message.error('获取数据失败');
            };
            // data.data.goods.forEach(element => {
            //     console.log(element,66)
            //     element.add_time = 22
            // });
            this.$message.success('获取数据成功');
            this.goodslistdata = data.data.goods;
            this.total = data.data.total;

        },
        //分页处理
        handleSizeChange(val) {
            this.queryinfo.pagesize = val;
            this.goodsListData();

        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.queryinfo.pagenum = val;
            this.goodsListData();

            console.log(`当前页: ${val}`);
        },
        //删除
        async removeId(id){
            const res =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })

            if(res === 'confirm'){
                const {data: res} = await this.$http.delete(`goods/${id}`);
                if(res.meta.status !== 200){
                    this.$message.error('数据删除失败');
                }
                this.$message.success('数据删除成功');
                this.goodsListData();

            }else{
                this.$message.info('已取消删除')
            }
        },
        addGoods(){
            this.$router.push('/goods/add');
        }
    },
}
</script>
<style type="less" scoped>

</style>