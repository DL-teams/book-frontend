import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/home/recommendBook/list',
    method:'get',
    params:params
  })
}

export function updateRecommendStatus(data) {
  return request({
    url:'/home/recommendBook/update/recommendStatus',
    method:'post',
    data:data
  })
}

export function deleteHotBook(data) {
  return request({
    url:'/home/recommendBook/delete',
    method:'post',
    data:data
  })
}

export function createHotBook(data) {
  return request({
    url:'/home/recommendBook/create',
    method:'post',
    data:data
  })
}

export function updateHotBookSort(params) {
  return request({
    url:'/home/recommendBook/update/sort/'+params.id,
    method:'post',
    params:params
  })
}
