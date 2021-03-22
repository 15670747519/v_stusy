<template>
    <div>
        <!-- <div class="breadcrumb"> -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        <!-- </div> -->
        <!-- <div class="card"> -->
            <el-card >
                    <el-input placeholder="请输入内容"  class="input-with-select search-input" v-model="queryInfo.query"
                    clearable   @clear="clearable"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                    <el-button type="primary" @click="dialogVisible = true" >添加用户</el-button>


                       <!-- </div> -->
                        <div class="usertable">
                            <el-table 
                            border stripe
                                :data="userlist"
                                style="width: 100%">
                                <el-table-column type="index" label="#">
                                </el-table-column>
                                <el-table-column
                                    prop="create_time"
                                    label="日期"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="role_name"
                                    label="姓名"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="email"
                                    label="邮箱">
                                </el-table-column>
                                <el-table-column
                                    prop="mobile"
                                    label="电话">
                                </el-table-column>
                                <el-table-column
                                    label="状态">
                                    <template slot-scope="scope">
                                        <el-switch
                                        @change="changestate(scope.row)"
                                        v-model="scope.row.mg_state"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                        </el-switch>                 
                                    </template>
                                </el-table-column>
                                <!-- @click="handleClick(scope.row)"  -->

                                <el-table-column 
                                    prop="email"
                                    label="操作" width="300px">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                        <el-button type="primary" icon="el-icon-edit" 
                                        @click="modifyDialog(scope.row)"
                                        size="small"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除"  placement="top">
                                        <el-button type="error"  icon="el-icon-delete"  size="small" @click="remove(scope.row.id)"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                        <el-button type="warning" icon="el-icon-setting"  size="small"></el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <div class="block">
                            <!-- <span class="demonstration">调整每页显示条数</span> -->
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[1,2,5]"
                            :page-size="2"
                            :page-count="pages"
                            layout="sizes, prev, pager, next, jumper"
                            :total="total">
                            </el-pagination>
                        </div>    
            </el-card>
     

        <div class="dialog">
            <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                :before-close="handleClose">

                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="70px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态" prop="mg_state">
                    <el-input v-model="addForm.mg_state"></el-input>
                </el-form-item> -->
                </el-form>

                <span slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('addForm')">取 消</el-button>
                        <el-button type="primary" @click="add('addForm')">确 定</el-button>
                </span>
            </el-dialog>                  
        </div>

        <div class="modify_dialog">
            <el-dialog
                title="提示"
                :visible.sync="modifyDialogVisible"
                width="30%"
                center>
                <el-form :model="editForm" status-icon :rules="editFormRules" ref="edituser" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input :disabled="true"  v-model="editForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item> -->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeEdit" >取 消</el-button>
                    <el-button type="primary" @click="edifyUser()">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        var checkmobile = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入电话'));
                } else {
                if (this.addForm.checkPass !== '') {
                    this.$refs.addForm.validateField('checkPass');
                }
                callback();
                }
            };
        return {
            queryInfo:{
                query:'',
                //当前页数
                pagenum:1,
                pagesize:2,
            },
            userlist:[],
            total:0,
            pages: 0,
            dialogVisible: false,

            modifyDialogVisible: false,

            addForm: {
                name: '',
                email:'',
                mg_state:'',
                mobile: '',
            },

            editForm: {
                
            },

            editFormRules: {
                email: [
                    { type:'email', required: true, message: '请输入邮箱', trigger: 'blur'},
                    { min: 3, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                mobile: [
                { required: true, trigger: 'blur' }
                ],
            },
        

            rules: {
            name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            email: [
                { type:'email', required: true, message: '请输入邮箱', trigger: 'blur'},
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            // mg_state: [
            //     { type:'', required: true, message: '请输入名称', trigger: 'blur' },
            //     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            // ],
            mobile: [
            { required: true, validator: checkmobile, trigger: 'blur' }
            ],
            },

        }
    },
    created(){
        this.getUserList();

    },
    methods:{
        async getUserList(){
            let res = await this.$http.get('users',{params: this.queryInfo})
            if(res.data.meta.status !== 200) return this.$message.error('获取用户数据失败')
            this.userlist = res.data.data.users;
            this.total = res.data.data.total;
            this.pages = this.total/this.queryInfo.pagesize;
        },
        //查看详情
        handleClick(){

        },
        //页码
        handleSizeChange(val) {
        this.queryInfo.pagesize = val;
        this.getUserList();

        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val;
            console.log(`当前页: ${val}`);
            this.getUserList();
        },
        //改变状态
        async changestate(event){
            const uid = event.id;
            const state = event.mg_state;

            const res = await this.$http.put(`users/${uid}/state/${state}`);
            if(res.data.meta.status !== 200){
                event.mg_state = !event.mg_state;
                return this.$message.error('修改用户数据失败')
            }
            if(res.data.meta.status == 200) return this.$message.success('修改用户数据成功')
        },
        //clear
        clearable(){
            this.getUserList()
        },
        // close dialog
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        //重置添加表单
        resetForm(event){
            this.$refs[event].resetFields();
            this.dialogVisible = false
        },
        //添加验证
        add(cb){
            this.$refs.addForm.validate(async(valid)=>{
                console.log
            if (valid) {
                const res = await this.$http.post('users',this.addForm);
                console.log(res, 333)
                if(res.status !== 200){
                    this.$message.error('添加用户失败')
                }else{
                    this.$message.error('添加用户成功')
                    this.dialogVisible = false;
                    this.getUserList();
                }
            } else {
                return false;
                    }
            });

        },
        //修改
        async modifyDialog(userinfo){
            const id = userinfo.id;

            const res = await this.$http.get('users/' + id);
            if(res.status !== 200 ){
                return this.message.error('查询用户数据失败')
            };
            this.editForm = res.data.data;
            this.modifyDialogVisible = true
        },
        //编辑用户信息
        edifyUser(userinfo){
            console.log(this,28228828)
            const {id,mobile,email} = this.editForm;

            this.$refs.edituser.validate(async(valid) => {
                if(!valid) return
                //发起请求
                const {data} = await this.$http.put('users/'+ this.editForm.id, {email: this.editForm.email,
                mobile: this.editForm.mobile
                });

                if(data.meta.status !== 200){
                    this.$message.error('更新用户失败')
                }

                this.modifyDialogVisible = false

                this.getUserList();
                this.$message.success('数据更新成功')
            });
        },
        //关闭用户信息
        closeEdit(){
            this.$refs.edituser.resetFields();
            // this.$refs[event].resetFields();
            this.modifyDialogVisible = false
        },
        //删除
        async remove(id) {
            console.log(222);
            const confirmres = await this.$confirm('要删除吗？', {
            confirmButtonText: '确定',
            type:'warning',
            }).then(async() => {
                console.log(id,99999)
                const {data} = await this.$http.delete('users/' + id);
                if(data.status !== 200){
                    this.message({
                        type: 'error',
                        message: '删除失败!'
                    })
                }else{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getUserList();
                }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    

    }
    
}
</script>

<style type="less" scoped>
 /**面包屑 */
  .el-breadcrumb{
      height: 30px;
      margin: 5px auto;
  }

  .el-card{
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }

  /**搜索框 */
  .search-input{
    width: 30% !important;

     margin: 0 0;
  }
  .el-main{
      text-align:justify !important;
  }

  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {

    width: 130px;
    background-color: #fff;
  }


  .usertable{
      margin: 10px 0px;
      text-align: center;
      border: 1px solid #909399;
  }

.block{
    margin: 15px 0;
}

/**
对话框
 */
.el-dialog{
    width: 70%;
}


</style>