import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/bookAttribute/category/list',
    method:'get',
    params:params
  })
}

export function createBookAttrCate(data) {
  return request({
    url:'/bookAttribute/category/create',
    method:'post',
    data:data
  })
}

export function deleteBookAttrCate(id) {
  return request({
    url:'/bookAttribute/category/delete/'+id,
    method:'get'
  })
}

export function updateBookAttrCate(id,data) {
  return request({
    url:'/bookAttribute/category/update/'+id,
    method:'post',
    data:data
  })
}
export function fetchListWithAttr() {
  return request({
    url:'/bookAttribute/category/list/withAttr',
    method:'get'
  })
}
