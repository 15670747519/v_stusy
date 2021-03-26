<template>
    <div>
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
        <el-button  type="primary" >添加角色</el-button>
        <el-table
            :data="rolelist"
            border
            style="width: 100%">
            <el-table-column
            type="expand"
            label=">"
            width="100">
            <template slot-scope="scope">
                <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                    <!--一级渲染-->
                    <el-col :span="5">
                        <el-tag closable>{{item1.authName}}</el-tag> <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                        <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                            <el-col :span="6">
                            <el-tag closable type="success">{{item2.authName}}</el-tag> <i class="el-icon-caret-right"></i>
                            </el-col>

                            <el-col :span="18">
                                <el-tag closable @close="handleClose(scope.row, item3.id)" v-for="(item3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag> <i class="el-icon-caret-right"></i>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            <!-- <pre>
                {{scope.row}}
            </pre> -->
            </template>
            
            </el-table-column>

            <el-table-column
            prop="id"
            label="#"
            width="100">
            </el-table-column>
            <el-table-column
            prop="roleName"
            label="角色"
            width="180">
            </el-table-column>
            <el-table-column
            prop="roleDesc"
            label="描述"
            width="180">
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" >编辑</el-button>
                <el-button type="error" icon="el-icon-delete" >删除</el-button>
                <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
            </el-table-column>
            
        </el-table>
        </el-card>

        <el-dialog
        title="分配权限"
        :visible.sync="dialogRight"
        width="50%"
        @close="closedialog"
        >
        
        <el-tree
        ref="treeRef"
        :data="rolerightdata"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="this.defaultKeys"
        default-expand-all>
        </el-tree>

        <span slot="footer" class="dialog-footer">
            <el-button @click="closedialog">取 消</el-button>
            <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
      return {
          rolelist:[],

          dialogRight: false,

          rolerightdata: [], //权限数据

          defaultKeys: [],

          defaultProps: {
          children: 'children',
          label: 'authName',
          roleid: '', //角色id
        }
        
      }
    },

    created(){
        this.getrolelist();

    },

    methods:{
        async getrolelist(){
            const res = await this.$http.get('roles');
            if(res.status !==200){
                return this.$message.error('获取数据失败')
            }
            this.rolelist = res.data.data;
            this.$message.success('获取数据成功')
        },
        async handleClose(roleid,rightid) {
            const confirm = await this.$confirm('确定删除吗',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(error=>error);
            if(confirm !== 'confirm') {
                return this.$message.info('取消了')
            }
            const {data: res} = await this.$http.delete(`roles/${roleid}/rights/${rightid}`)
            if(res.status !== 200){
                return this.$message.error('取消失败')
            }
            this.getrolelist();
        // this.item2.children.splice(this.item2.children.indexOf(tag), 1);
        },
        async showSetRightDialog(node){
            this.roleid = node.id;
            const {data: res} = await this.$http.get('rights/tree');
            if(res.meta.status !== 200){
                this.$message.error('获取用户权限失败')
            }
            this.rolerightdata = res.data;

            //获取三级节点
            this.getLeftKeys(node, this.defaultKeys)
            this.dialogRight = true;
        },

        //通过递归获取三级节点
        getLeftKeys(node, arr){
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach(element => {
                this.getLeftKeys(element, arr)
            });
        },
        //清空数据bug
        closedialog(){
            this.defaultKeys=[];
            this.dialogRight = false;
        },
        async setRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = keys.join(',');

            const {data: res} = await this.$http.post(`roles/${this.roleid}/rights`,{rids:idStr});
            if(res.meta.status !== 200){
                this.$message.error('失败');
            }
            this.$message.success('成功');
            this.getrolelist();
            this.dialogRight= false;

        }
    }
}
</script>

<style type="less" scoped>
.text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    margin: 20px 0;
    width: 100%;
  }
  .el-tag{
      margin: 7px;
  }
  .bdtop{
      border-top: 1px solid gray;
  }
  .bdbottom{
      border-bottom: 1px solid gray;
  }
  .vcenter{
      display: flex;
      align-items: center;
  }
</style>