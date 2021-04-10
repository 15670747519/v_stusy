<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card>
            <el-alert
                title="消息提示的文案"
                type="info"
                center
                :closable=false
                show-icon>
            </el-alert>
            <!--步骤条-->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center @tab-click="tabClick">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
            </el-steps>
            <!--标签页-->
            <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
                <el-radio-button label="top">top</el-radio-button>
                <el-radio-button label="right">right</el-radio-button>
                <el-radio-button label="bottom">bottom</el-radio-button>
                <el-radio-button label="left">left</el-radio-button>
            </el-radio-group> -->
        <el-form ref="addform" :model="addform" :rules="rules" label-width="80px" label-position="top">

            <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 200px;" @tab-click="tabClick" :before-leave="beforeTabLeave">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" required prop="goods_name">
                        <el-input v-model="addform.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" required prop="goods_price">
                        <el-input v-model.number="addform.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" required prop="goods_weight">
                        <el-input v-model="addform.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" required prop="goods_number">
                        <el-input v-model.number="addform.goods_number"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <span class="demonstration">hover 触发子菜单</span>
                        <el-cascader
                            expandTrigger:hover
                            v-model="addform.goods_cat"
                            :options="catelist"
                            :props="cateProp"
                            @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals" >
                            <el-checkbox v-for="(cb, i) in item.attr_vals" 
                            :key="i" :label="cb" border></el-checkbox>
                            
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>

                    </el-form-item>
                    
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                    class="upload-demo uploadimg"
                    :action="uploadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :headers="headerObj"
                    list-type="picture"
                    :on-success="handleSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="addform.goods_introduce">

                    </quill-editor>

                    <el-button type="primary" class="btnadd" @click="add">添加</el-button>
                    
                </el-tab-pane>
                <el-tab-pane label="完成" name="5">完成</el-tab-pane>

            </el-tabs>
        
        </el-form>
            
        </el-card>

        <!--preview--->
        <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%"
        >
        <img :src="previewPath" class="previewImg">
        
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash';

export default {
    data(){
        return {
            activeIndex:0,
            tabPosition: 'left',
            //数据对象
            addform:{
                goods_name:'',
                goods_price: '',
                goods_weight: 0,
                goods_number: 0,
                //商品所属分类数组
                goods_cat:[],
                //图片数据
                pics:[],
                //商品描述
                goods_introduce:'',
                attrs:[],
            },
            //preview
            previewVisible:false,
            //图片预览地址
            previewPath:'',
            //数据验证对象
            rules:{
                goods_name:[
                    {required: true,message:'请输入商品名称', trigger:'blur' }
                ],
                goods_price:[{
                    required: true,message:'请输入商品价格', trigger:'blur', type: 'number'
                }],
                goods_weight:[{
                    required: true,message:'请输入商品重量', trigger:'blur', type: 'number'
                }],
                goods_number:[{
                    required: true,message:'请输入商品数量', trigger:'blur', type: 'number'
                }],
                goods_desc:[{
                    required: true,message:'请输入商品内容', trigger:'blur', 
                }],
            },
            //分类列表数据
            catelist: [],
            cateProp:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
            },
            //动态参数数据
            manyTableData: [],
            //动态参数属性数据
            manyAttrData:[],
            //静态属性值
            onlyTableData:[],
            //复选框值
            checkList:[],
            //file
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            //uploadurl
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload/',
            //header
            headerObj:{
                Authorization:
                window.sessionStorage.getItem('session_token')
            }
        }
    },
    created(){
        this.getCateList();

    },
    methods:{
        tabClick(e){
            const currentNameValue = e.name;
            this.activeIndex = currentNameValue;
        },
        //获取所有商品分类数据
        async getCateList(){
            const {data: res} = await this.$http.get(`categories`);
            if(res.meta.status !== 200){
                return this.$message.error('获取数据失误');
            };
            this.catelist = res.data;
        },
        //级联选择器触发函数
        handleChange(){
            if(this.addform.goods_cat.length !== 3){
                this.addform.goods_cat = [];
            }
        },
        beforeTabLeave(activeName,oldName){
            if(oldName === '0' && this.addform.goods_cat.length !== 3){
                this.$message.error('请选择分类');
                return false;
            }
        },
        //点击tabs切换处理函数
        async tabClick(){
            if(this.activeIndex === '1'){
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态数据失败');
                }
                this.manyTableData = res.data;
                // this.manyAttrData = this.manyTableData[0].attr_vals.split(',');
                // console.log(this.manyAttrData,66666)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(','): [];
                });
            }else if(this.activeIndex === '2'){
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态数据失败');
                }
                this.onlyTableData = res.data;
            }
        },
        //upload 预览
        handlePreview(file){
            console.log(file.response.data.url, 666666);
            this.previewPath = file.response.data.url;
            this.previewVisible = true;

        },
        handleRemove(file){
            const filePath = file.response.data.tmp_path;
            //对应索引值
            const i = this.addform.pics.find(x=>{
                x.pic === filePath
            })
            this.addform.pics.splice(i,1);
        },
        handleSuccess(response){
            console.log(response, 9999)
            const picinfo = {pic:response.data.tmp_path}
            this.addform.pics.push(picinfo);

        },
        // 添加商品
        add(){
            console.log(this.form, 999999999)
            console.log()
            console.log(this.addform,555)

            this.$refs.addform.validate( async valid=>{
                console.log(valid,555)
                if(!valid){
                    return this.$message.error('请填写必要的表单验证')
                }

            console.log(this.addform,555)
            const form  = _.cloneDeep(this.addform);

            form.goods_cat = form.goods_cat.join(',');
            //处理动态参数
            console.log(this.manyTableData, 33333)

            this.manyTableData.forEach(item=>{
                 console.log(item,777777)

                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals.join('')
                };
                this.addform.attrs.push(newInfo)
            })

            //处理静态属性
            this.onlyTableData.forEach(item=>{
                console.log(item,6666)
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };
                this.addform.attrs.push(newInfo)
            })
            
            form.attrs = this.addform.attrs;
                        console.log(form, 999999999)

            //发起请求
            const{data: res} = await this.$http.post('goods',form);
            console.log(res, 232323)
            if(res.meta.status !== 201){
                return this.$message.error('发起请求错误')
            }

            this.$message.success('添加成功');
            this.$router.push('/goods');

            });
            
            

            

            
            // 待验证bug
            // this.addform.goods_cat = this.addform.goods_cat.join(',')

        }
    },

    computed:{
        cateId(){
            if(this.addform.goods_cat.length === 3){
                return this.addform.goods_cat[2];
            }
            return null;
        }

    },
}
</script>

<style type="less" scoped>
.el-steps{
    margin: 15px 0;
}
.el-step__title{
    font-size: 13px;
}
.el-tabs{
    height:100% !important;
}
.el-checkbox{
    margin: 0 5px !important;
}
.uploadimg{
    width: 50% !important;
}
.previewImg{
    width: 100%;
}
.btnadd{
    margin-top: 15px;
}

</style>