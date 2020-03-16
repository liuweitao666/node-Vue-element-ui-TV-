import Vue from 'vue'
import {
    Icon,
    Container,
    Aside,
    Main,
    Footer,
    Header,
    Col,
    Row,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Avatar,
    Input,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Table,
    TableColumn,
    Message,
    Dialog,
    Form,
    FormItem,
    Pagination,
    Badge,
    MessageBox,
    Tooltip,
    Notification,
    Select,
    Option,
    Alert,
    Carousel,
    CarouselItem,
    DatePicker,
    Tag,
    Progress,
    PageHeader,
    Steps,
    Step,
    Tabs,
    TabPane,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Icon)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Header)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Avatar)
Vue.use(Row)
Vue.use(Input)
Vue.use(Button)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.use(Badge)
Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(DatePicker)
Vue.use(Tag)
Vue.use(Progress)
Vue.use(PageHeader)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
