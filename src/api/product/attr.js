// 引入二次封装的axios
import request from '@/utils/request'
// 当前api接口中相同的地址
const API_NAME = '/admin/product'

export default {
  // 根据一级、二级、三级id查询平台属性
  getAttrList(category1Id, category2Id, category3Id) {
    return request({
      url: `${API_NAME}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'GET'
    })
  },
  // 根据平台属性id删除对应的平台属性数据信息
  deleteAttrById(attrId) {
    return request({
      url: `${API_NAME}/deleteAttr/${attrId}`,
      method: 'DELETE'
    })
  },
  // 根据平台属性id获取对应的所有的平台属性值数据
  getAttrValueList(attrId) {
    return request({
      url: `${API_NAME}/getAttrValueList/${attrId}`,
      method: 'GET'
    })
  },
  // 增加或修改平台属性数据
  saveOrUpdateAttr(attr) {
    return request({
      url: `${API_NAME}/saveAttrInfo`,
      method: 'POST',
      data: attr
    })
  }
}
