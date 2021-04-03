<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

            <el-alert
                title="设置了回调的 alert"
                type="warning"
                :closable="false"
                show-icon
                >
            </el-alert>
            <!--选择商品分类区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类</span>

                    <el-cascader
                        v-model="selectedKeys"
                        :options="cateList"
                        :props="cateprop"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <!--tab-->
            <el-tabs v-model="activeName" @tab-click="handleActiveName">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isButtonDisable" @click="addParams">添加参数</el-button>

                <el-table
                    :data="manyTableData"
                    border stripe
                    style="width: 100%">
                    <el-table-column
                        type="expand" >

                        <!--扩展-->
                    <template slot-scope="scope">
                        <!-- <el-tag style="margin:10px" v-for="(item, i) in scope.row.attr_vals" 
                        :key="i">{{item}}</el-tag> -->

                        <!--动态标签-->
                        <el-tag v-for="(item, i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(item)"
                        >
                        {{item}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small"
                         @click="showInput(scope.row)">+ New Tag</el-button>

                        
                    </template>

                    </el-table-column>

                    


                    <el-table-column
                        type="index" prop="index">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        label="参数名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="scope"
                        label="操作"
                        width="">

                        <template slot-scope="scope"> 
                            <el-button type="primary" icon="el-icon-search" @click="del(scope.row.attr_id)">删除</el-button>
                            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isButtonDisable" @click="addParams">静态属性</el-button>
                    <el-table
                    :data="onlyTableData"
                    border stripe
                    style="width: 100%">
                    <el-table-column
                        type="expand" >
                    </el-table-column>
                    <el-table-column
                        type="index" prop="index">
                    </el-table-column>
                    <el-table-column
                        prop="attr_name"
                        label="参数名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="scope"
                        label="操作"
                        width="">

                        <template slot-scope="scope"> 
                            <el-button type="primary" icon="el-icon-search">搜索</el-button>
                            <el-button type="primary" icon="el-icon-edit">编辑</el-button>

                        </template>
                    </el-table-column>  
                    </el-table>
                </el-tab-pane>
                
            </el-tabs>


            <!--添加属性对话框-->

            <el-dialog
                :title="`添加` + dialogText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addParamsClose"
                >
                <el-form :model="addParamsForm" status-icon :rules="rules" ref="addParamsForm" label-width="100px" class="demo-ruleForm"
                >
                    <el-form-item label="属性" prop="attr_name">
                        <el-input type="" v-model="addParamsForm.attr_name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addAttr">确 定</el-button>
                </span>
            </el-dialog>

            <!--修改-->
            <el-dialog
                :title="`修改` + dialogText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editParamsClose"
                >
                <el-form :model="editParamsForm" status-icon :rules="editrules" ref="editParamsForm" label-width="100px" class="demo-ruleForm"
                >
                    <el-form-item label="属性" prop="attr_name">
                        <el-input type="" v-model="editParamsForm.attr_name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editAttr">确 定</el-button>
                </span>
            </el-dialog>

        
        
        </el-card>

    </div>
</template>

<script>
export default {
    data(){
        return {
            //所有商品分类数据
            cateList:[],
            //级联选着框的配置属性
            cateprop:{
                expandTrigger: 'hover',
                value: 'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框绑定的双向数据
            selectedKeys:[],
            //已被激活的页签名称
            activeName:'many',
            //动态参数
            manyTableData: [],
            onlyTableData: [],
            //动态添加框显示
            inputVisible: false,

            inputValue: '',

            //addDialogVisble
            addDialogVisible: false,
            //添加表单的数据对象
            addParamsForm:{
                attr_name: '',
            },
            //验证规则
            rules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            //编辑对话框
            editDialogVisible: false,
            //编辑对话框from属性
            editParamsForm:{
                attr_name:'',
            },
            //编辑对话框雁阵规则
            editrules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            }
        };  
    },

    created(){
        this.getCateList();
        console.log(this.manyTableData,7777)

    },

    methods: {
        //获取所有商品分类
        async getCateList(){
            const {data: res} = await this.$http.get('categories');
            if(res.meta.status !== 200){
                this.$message.error('获取数据失败');
            }
            this.cateList = res.data;
        },
        //级联选择框选中触发数据
        async handleChange(){
            this.getParamsData();
        },
        //处理页签名称
        handleActiveName(tab, event){
            this.getParamsData();
        },

        //获取参数列表数据
        async getParamsData(){
            if(this.selectedKeys.length !== 3){
                this.selectedKeys = [];
                return
            }
            //根据所选分类和昂前的面板，获取对应的参数
            const {data: res} = await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:this.activeName}});
            

            if(res.meta.status !== 200){
                this.$message,error('失败')
            }
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(','): [];
                //控制文本框显示隐藏
                this.inputVisible = false;
                //控制文本框的值
                this.inputValue = ''
            })
            console.log(res.data,44444)
            if(this.activeName === 'many'){
                this.manyTableData = res.data;
            }else{
               this.onlyTableData = res.data;

            }
            console.log(this.manyTableData,7777)

        },
        //添加参数
        addParams(){
            this.addDialogVisible = true;

        },
        //关闭对话框，清空数据
        addParamsClose(){
            this.$refs.addParamsForm.resetFields();
        },
        //添加参数
        addAttr(){
            console.log(11)
            //验证数据
            this.$refs.addParamsForm.validate(async (validate)=>{
                if(!validate) return

                const {data} = await this.$http.post(`categories/${this.catId}/attributes`,{
                    attr_name:this.addParamsForm.attr_name,
                    attr_sel:this.activeName
                });
                console.log(data, 9999)
                if(data.meta.status !== 201){
                    return this.$message.error('添加失败')
                }

                this.$message.success('添加成功');
                this.addDialogVisible = false;
                this.getParamsData();
            })
        },
        //编辑按钮
        async showEditDialog(attr_id){
            console.log(attr_id, 898989)
            //查询当前参数信息
            const {data} = await this.$http.get(`categories/${this.catId}/attrbibutes/${attr_id}`, {params:{attr_sel: this.activeName}});
            console.log(data, 999);
            if(data.meta.status !== 200){
                this.$message.error('获取参数失败');
            }
            this.editParamsForm = {
                attr_name: 'ww',
                attr_sel: 'many',
                attr_id: 3804,
            };

            this.editDialogVisible = true;

        },
        //关闭编辑对话框
        editParamsClose(){
            
            //重置表单
            this.$refs.editParamsForm.resetFields();


        },
        //添加属性方法
        editAttr(){
            console.log(this,333)
            this.$refs.editParamsForm.validate(async valid => {
                if(!valid) return;
                console.log(this.editParamsForm, 1212121212)
                const {data} = await this.$http.put(`categories/${this.catId}/attributes/${this.editParamsForm.attr_id}`,{
                    attr_name:this.editParamsForm.attr_name,
                    attr_sel: this.activeName,
                });
                if(data.meta.status !== 200){
                    return this.$message.error('数据更新错误');
                }

                this.$refs.editParamsForm.resetFields();
                this.editDialogVisible = false;
                return this.$message.success('数据更新成功');
            })        
        },
        async del(attr_id){
            const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            // }).then(() => {

            // this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
            if(confirmRes === 'confirm'){
                const {data} =  await this.$http.delete(`categories/${this.catId}/attributes/${attr_id}`);
                console.log(data, 5555)
                if(data.meta.status !== 200){
                    return this.$message.error('删除失败');
                }
                return this.$message({
                type: 'info',
                message: '已成功'
                });
                this.getParamsData();
            }
            
        },
        //动态框相关函数
        handleClose(tag) {
            this.manyTableData[0].attr_vals.splice(this.manyTableData[0].attr_vals.indexOf(tag), 1);
        },

        showInput(row) {
            this.inputVisible = true;

            this.$nextTick(() => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm(row) {
            if(row.inputValue.trim().length ===0){
                row.inputValue = '';
                row.inputVisible = false;
                return
            }
            let inputValue = this.inputValue;
            if (inputValue) {
            this.dynamicTags.push(inputValue);
            }
            
            this.inputValue = '';
        }
   },

    computed:{
        isButtonDisable(){
            if(this.selectedKeys.length !== 3){
                return true
            }
            return false
        },
        //当前catid
        catId(){
            if(this.selectedKeys.length ===3){
                return this.selectedKeys[2]
            }
            return null
        },
        //计算标题属性
        dialogText(){
            if(this.activeName === 'many') {
                return '动态参数'
            }
                
            return '静态参数'
        }

    }

}
</script>

<style type="less" scoped>

.cat_opt{
    margin: 15px 0;
}

/**
动态标签
 */
 el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>


