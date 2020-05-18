import Mock from 'mockjs'

Mock.mock(/\/api\/expense/,'get',function(option){
    const reg =/\/api\/expense\/(\w+)/gi    
    const username =  reg.exec(option.url)
    console.log()
    return Mock.mock({
        status:200,
        message:'查询成功！',
        data:{
            'id|+1':1,
            name:username[1],
            price:'@natural(1, 1000)'
        }
    })
})

let address = Mock.mock({
    'addressList|10': [{
        'id|+1': 1,
        'region': '@region', //生成一个大区
        'province': '@province', //生成一个省份
        'city': '@city', //生成一个市
        'zip': '@zip', //邮政编码
    }]
})
Mock.mock('/api/region','get',address)