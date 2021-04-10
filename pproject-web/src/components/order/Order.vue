<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>

            <el-table :data="orderlist" border stripe>
                <el-table-column class="tableColumn"
                        type="index"
                        label="#"
                        width="80">
                    </el-table-column>
                <el-table-column
                        prop="order_number"
                        label="订单编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="order_price"
                        label="订单价格"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="pay_status"
                        label="是否付款">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.pay_status === '0' ">否</el-tag>
                            <el-tag v-else>是</el-tag>

                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        prop="is_send"
                        label="是否发货">
                    </el-table-column>
                    <el-table-column
                        prop="create_time"
                        label="下单时间">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)" class="el-icon-edit"></el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleLocation(scope.$index, scope.row)" icon="el-icon-position"></el-button>
                        </template>
                    </el-table-column>

            </el-table>

            <!---分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentpage"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!--对话框-->
            <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <!--表单-->
            <el-form :model="addreddForm" status-icon :rules="rules" ref="addressForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="县市区" prop="address1">
                    <!-- <el-input type="" v-model="addreddForm.address1" autocomplete="off">
                    </el-input> -->
                    <!-- <el-cascader
                    v-model="value"
                    :options="options"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"></el-cascader> -->
                </el-form-item>
                <el-form-item label="详细地址" prop="addressdetail">
                    <el-input type="" v-model="addreddForm.addressdetail" autocomplete="off">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

           <!--物流对话框-->
           <el-dialog
            title="物流进度"
            :visible.sync="locationVisible"
            width="50%"
            :before-close="progressClose">

            <el-timeline :reverse="reverse">
                <el-timeline-item
                v-for="(activity, index) in timedata"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>

            <span slot="footer" class="dialog-footer">
                <el-button @click="locationVisible = false">取 消</el-button>
                <el-button type="primary" @click="locationVisible = false">确 定</el-button>
            </span>
            </el-dialog>




        </div>
        
        </el-card>







    </div>
</template>

<script>
export default {
    data(){
        return{
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10,

            },
            //数据列表
            orderlist: [],
            //数据总数
            total:0,
            //当前页码
            currentpage:1,
            //对话框
            dialogVisible:false,
            //物流进程
            locationVisible: false,
            //物理数据
            processinfo:[],
            //表单数据
            addreddForm:{
                address1:[],
                addressdetail:'',

            },
            //表单验证规则
            rules:{
                address1:[
                    { required: true, message: '请输入县市区', trigger: 'blur' },
                ],
                addressdetail:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            },
            //时间线
            reverse: true,
            activities: [{
            content: '活动按期开始',
            timestamp: '2018-04-15'
            }, {
            content: '通过审核',
            timestamp: '2018-04-13'
            }, {
            content: '创建成功',
            timestamp: '2018-04-11'
            }],

            timedata: [
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ],


        }
    },

    created(){
        this.getorderlist();

    },

    methods:{
        async getorderlist(){
            const {data: res} = await this.$http.get('orders',{params: this.queryinfo});
            console.log(res, 87878);
            if(res.meta.status !== 200){
                return this.$message.error('数据请求失败');
            }
            this.orderlist = res.data.goods;
            this.total = res.data.total; 
            console.log(this.total, 888)
        },
        handleSizeChange(val){
            console.log(val, 333);
            this.queryinfo.pagesize = val;
            this.getorderlist();
        },
        handleCurrentChange(val){
            this.queryinfo.pagenum = val;
            this.getorderlist();
        },
        //关闭对话框
        handleClose(){

        },
        //编辑订单
        handleEdit(){
            this.dialogVisible = true;
        },
        //物流对话
        async handleLocation(){
            // const {data: res} = await this.$http.get('/kuaidi/1106975712662',{type:'yuantong'});
            // if(res.meta.status !== 200){
            //     return this.$message.error('数据请求失败');
            // };
            // this.progessinfo = res.data;

            this.locationVisible = true;
        },
        //物流进程关闭按钮
        progressClose(){
            this.locationVisible = false;
        }
    },
}
</script>

<style scoped>

.el-input {
    width: 30%;
}
.el-table td, .el-table th{
    text-align: center !important;
}
.tableColumn{
    text-align: center;
}

</style>