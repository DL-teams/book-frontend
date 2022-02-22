import request from '@/utils/request'
export function fetchList(parentId,params) {
  return request({
    url:'/bookCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
export function deleteBookCate(id) {
  return request({
    url:'/bookCategory/delete/'+id,
    method:'delete'
  })
}

export function createBookCate(data) {
  return request({
    url:'/bookCategory/create',
    method:'post',
    data:data
  })
}

export function updateBookCate(id,data) {
  return request({
    url:'/bookCategory/update/'+id,
    method:'put',
    data:data
  })
}

export function getBookCate(id) {
  return request({
    url:'/bookCategory/'+id,
    method:'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url:'/bookCategory/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateNavStatus(data) {
  return request({
    url:'/bookCategory/update/navStatus',
    method:'post',
    data:data
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/bookCategory/list/withChildren',
    method:'get'
  })
}
