<template>
    <div class="login_cintainer">
        <!--头像-->
        <div class="login_box">
            <div class="avt-img">
                <img  src="../assets/logo.png">
            </div>

            <!--表单区域-->
            <div class="login_form">
                <el-form  status-icon  :model="ruleForm" ref="loginForm" :rules="rules" class="demo-ruleForm">
                    <el-form-item prop="username" >
                        <el-input  prefix-icon="el-icon-user-solid" type="text" v-model="ruleForm.username"  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="el-icon-coin" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item class="login_btn">
                        <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                        <el-button @click="resetForm('loginForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

export default ({
  data () {
      return {
        ruleForm: {
          password: '123456',
          username: 'admin',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' }
            // { min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
       submitForm(loginForm) {
        this.$refs[loginForm].validate(async (valid) => {
          if (!valid) return;
          const { data } = await this.$http.post('login',this.ruleForm);
          if(data.meta.status===400)return this.$message.error('登录失败');
          this.$message.success({message:'登录成功',duration:2000});
          const res = window.sessionStorage.setItem("session_token", data.data.token);
          this.$router.push('/home')
        });
      },
      login(){
          this.$refs.loginForm.validate((s)=>{
          })
      },
      resetForm() {
        this.$refs.loginForm.resetFields();
      }
    }
    
})
</script>
<style type="less">
.login_cintainer{
    background-color:#2b4b6b;
    height: 100%;
}
.login_box {
    position:absolute;
    height: 400px;
    width: 500px;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: white;
    border-radius: 3px;
}
.avt-img{
    position: absolute;
    width: 150px;
    height: 150px;
    left: 50%;
    transform: translate(-60%,-50%);
    border-radius: 50%;
    padding: 10px;
}

.avt-img img {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 10px solid white;
    border-radius: 50%;
    background-color: #eee;  
}

.login_form{
    position: absolute;
    top: 50%;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 150px;
    padding: 0 20px;
    box-sizing: border-box;

}
.login_btn{
    display: flex;
    justify-content: flex-end;
}
.login_item{
    font-size: 30px;
}

</style>
