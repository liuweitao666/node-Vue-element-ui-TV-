import Axios from 'axios'

export function request(url){
  const request =  Axios.create({
        baseURL:'https://tianqiapi.com/api',
        timeout:'5000'
    })
  return request(url)  
}
export function request2(url,params){
  const config = Axios.create({
    baseURL:'/api',
    timeout:'5000',
    
  })
  return config({url,params})
}
export function mockapi(method,params){
  const config =  Axios.create({
    baseURL:'',
    timeout:'5000',
    methods: method,
    params
  })
return config(method,params)
}