import request from '@/utils/request'
export function fetchList(cid,params) {
  return request({
    url:'/bookPress/list/',
    method:'get',
    params:params
  })
}

export function deleteBookPress(id) {
  return request({
    url:'/bookPress/delete/'+id,
    method:'delete'
  })
}

export function createBookPress(data) {
  return request({
    url:'/bookPress/create',
    method:'post',
    data:data
  })
}

export function updateBookPress(id,data) {
  return request({
    url:'/bookPress/update/'+id,
    method:'put',
    data:data
  })
}
export function getBookPress(id) {
  return request({
    url:'/bookPress/'+id,
    method:'get'
  })
}

export function updateShowStatus(data) {
  return request({
    url:'/bookPress/update/showStatus',
    method:'put',
    data:data
  })
}
