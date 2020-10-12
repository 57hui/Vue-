// 引入二次封装的axios
import request from '@/utils/request'
// 当前api接口中相同的地址
const API_NAME = '/admin/product/baseTrademark'

export default {
  /* 
  根据用户名和密码请求登陆
  */
  login(username, password) {
    return request({
      url: `${API_NAME}/login`,
      method: 'post',
      data: {
        username,
        password
      }
    })
  },
  //   根据id获取某个品牌信息的数据对象
  getTrademarkById(id) {
    return request({
      url: `${API_NAME}/get/${id}`,
      method: 'GET'
    })
    //   也可以用这种写法
    //   return request.get(`${API_NAME}/get/${id}`)
  },

  //   获取品牌信息数据列表
  getTrademarks() {
    return request({
      url: `${API_NAME}/getTrademarkList`,
      method: 'GET'
    })
    // return request.get(`${API_NAME}/getTrademarkList`)
  },
  //   根据id删除某个品牌数据信息对象
  deleteTrademark(id) {
    return request({
      url: `${API_NAME}/remove/${id}`,
      method: 'DELETE'
    })
    // return request.delete(`${API_NAME}/remove/${id}`)
  },
  //   增加品牌信息对象
  addTrademark(trademark) {
    return request({
      url: `${API_NAME}/save`,
      method: 'POST',
      data: trademark
    })
    // return request.post(`${API_NAME}/save`,trademark)
  },
  // 根据id修改品牌数据信息对象
  updateTrademark(trademark) {
    return request({
      url: `${API_NAME}/update`,
      method: 'PUT',
      data: trademark
    })
    // return request.post(`${API_NAME}/update`,trademark)
  },
  //   根据页码和每页条数获取品牌信息数据列表
  getTrademarkList(page, limit) {
    return request({
      url: `${API_NAME}/${page}/${limit}`,
      method: 'GET',
    })
    // return request.post(`${API_NAME}/${page}/${limit}`)
  }
}



// {default: {}}
