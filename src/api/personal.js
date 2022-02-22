import request from '@/utils/request'
export function searchData(parentId,params) {
  return request({
    url:'/bookCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
