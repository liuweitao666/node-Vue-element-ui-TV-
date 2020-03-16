// 用户增删改查，网络请求
import axios from 'axios'

// 引入删除提示包
import { MessageBox } from 'element-ui';
import { Message } from 'element-ui'

axios.defaults.baseURL = 'http://127.0.0.1:3000'
const request = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: '5000',

})
// 验证token是否正确
request.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    // console.log(config.headers)
    config.headers.common['Authorization'] = 'Bearer ' + token;
    return config
})
// 查询数据请求
export let finddata = async (url, params) => {
    const { data: res } = await request({
        url,
        params
    })
    return res
}
// 删除用户数据
export let deleted = (url, params) => {
    // 根据id删除用户
    return new Promise((resolve) => {
        MessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(async () => {
            
            const { data: res } = await axios.delete(url, { params })
           
            if (res.code !== 1) {
                return Message.error({
                    showClose: true,
                    duration: 1500,
                    message: res.msg
                })
            } else if (res.code === 100) return Message.error({
                showClose: true,
                duration: 1500,
                message: res.msg
            })
            Message.success({
                showClose: true,
                duration: 1500,
                message: '删除成功'
            })
            return resolve(res.code)
        }).catch(() => {
            Message.info({
                showClose: true,
                duration: 1500,
                message: '已取消'
            })
        })
    })
}


