// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import less from 'less'

import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import { Button, Select, Form, FormItem, Input, Message,Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Alert,
  Tag,
  Tree,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Option,
  Cascader,
  Tabs,
  TabPane,
  Step,
  Steps,
  RadioGroup,
  RadioButton,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Header.name, Header)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Container.name, Container)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.component(Card.name, Card)
Vue.component(Input.name, Input)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Switch.name, Switch)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Pagination.name, Pagination)
Vue.component(Dialog.name, Dialog)
Vue.component(Tag.name, Tag)
Vue.component(Tree.name, Tree)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(Option.name, Option)
Vue.component(Cascader.name, Cascader)
Vue.component(Alert.name, Alert)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(RadioButton.name, RadioButton)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Upload.name, Upload)
Vue.component(Timeline.name, Timeline)
Vue.component(TimelineItem.name,TimelineItem)






Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', function (originval) {
  const dt = new Date(originval)
  const y = dt.getDay()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})












Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;



import './assets/css/global.css'

Vue.use(less)

Vue.config.productionTip = false

/**配置asiox请求 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('session_token');
  return config;
})

Vue.prototype.$http = axios;
//富文本编辑器
Vue.use(VueQuillEditor);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
