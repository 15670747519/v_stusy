<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card class="box-card">
            <el-button type="primary" @click="addCateDialog">卡片分类 </el-button>

            <tree-table class="treetable" :data="catelist" :columns="columns" :selection-type="false"
            :show-index="true" :expand-type="false" index-text="#" border :show-row-hover="false"
            >
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.cat_level === 0"> 一级</el-tag>
                    <el-tag type="error" v-if="scope.row.cat_level === 1"> 二级</el-tag>
                    <el-tag type="warning" v-if="scope.row. cat_level === 2"> 三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="success" icon="el-icon-edit"> 编辑</el-button>
                    <el-button type="error" icon="el-icon-delete"> 删除</el-button>
                </template>
            </tree-table>


            <span class="demonstration">显示总数</span>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryinfo.pagenum"
            :page-size="queryinfo.pagesize"
            layout="total, prev, pager, next"
            :total="total">
            </el-pagination>
        
        </el-card>


        <el-dialog
        title="提示"
        :visible.sync="addCateDialogVisable"
        width="50%"
        >

        <el-form :model="addCateForm" :rules="rules" ref="addCateForm" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:" >

            <el-cascader
                v-model="selectedKeys"
                :options="cateparentlist"
                :props="options"
                @change="handleChange"
                change-on-select
                clearable
                >
            </el-cascader>

        </el-form-item>
        </el-form>


        <span slot="footer" class="dialog-footer">
            <el-button @click="addCatClose">取 消</el-button>
            <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //表单
            addCateForm: {
            cat_name: '',
            cat_pid: 0,
            cat_level: 0,
            },

            rules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
            },

            //商品分类
            catelist:[],
            //级联父级分类
            selectedKeys: [],
            options: 
                {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                }
            ,

            cateparentlist: [],
            children:[],
            queryinfo:{
                type:3,
                pagenum: 1,
                pagesize:5
            },
            //总数据条数
            total: 0,

            addCateDialogVisable: false,

            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },{
                    label:'是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label:'排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label:'操作',
                    type: 'template',
                    template: 'opt',
                }
            ]

        }
    },

    created(){
        this.getcatelist()
    },

    methods:{
        async getcatelist(){
            const {data} = await this.$http.get('categories',{params: this.queryinfo});
            console.log(data)
            if(data.meta.status !== 200){
                return this.$message.error('获取数据失败');
            }

            this.catelist = data.data.result;
            this.total = data.data.total
        },

        handleSizeChange(newSize){
            this.queryinfo.pagesize =newSize;
            this.getcatelist();
        },

        handleCurrentChange(newpage){
            this.queryinfo.pagenum = newpage;
            this.getcatelist();
        },
        addCateDialog(){
            this.getparentcateist();
            this.addCateDialogVisable = true;
        },
        async getparentcateist(){
            const {data} = await this.$http.get('categories',{params:{
                type: 2,
            }});
            if(data.meta.status !== 200){
                return this.$message.error('获取父及分类失败')
            };
            this.cateparentlist = data.data;
        },
        //监听级联选择器函数
        handleChange(){
            console.log(this.selectedKeys,1111)
            if(this.selectedKeys.length > 0){
                //父级分类
                this.addCateForm.cat_pid =  this.selectedKeys[
                    this.selectedKeys - 1
                ]
                //为当前分类等级复制
                this.addCateForm.cat_level = this.selectedKeys.length;
            }else{
                this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0;
            }
        },

        addCat(){
            console.log(this.addCateForm,1111)
            this.$refs.addCateForm.validate(async valid=>{
                if(!valid) return
                const {data: res} = await this.$http.post('categories',this.addCateForm);
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败');
                }
                this.$message.success('添加分类成功');
                this.getcatelist();
                this.addCateDialogVisable = false;

            })
        },

        addCatClose(){
            console.log(this,222);
            this.$refs.addCateForm.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
            this.addCateDialogVisable = false;
        }
    },
}
</script>

<style scoped>
.treetable{
    margin: 15px 0;
}

.el-cascader{
    width: 100%;
}

</style>