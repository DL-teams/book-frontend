import request from '@/utils/request'
export function fetchList(cid,params) {
  return request({
    url:'/bookPress/list/'+cid,
    method:'get',
    params:params
  })
}

export function deleteBookPress(data) {
  return request({
    url:'/bookPress/delete',
    method:'post',
    data:data
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
    method:'post',
    data:data
  })
}
export function getBookPress(id) {
  return request({
    url:'/bookPress/'+id,
    method:'get'
  })
}
