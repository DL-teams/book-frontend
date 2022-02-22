import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/home/newBook/list',
    method:'get',
    params:params
  })
}

export function updateRecommendStatus(data) {
  return request({
    url:'/home/newBook/update/recommendStatus',
    method:'post',
    data:data
  })
}

export function deleteNewBook(data) {
  return request({
    url:'/home/newBook/delete',
    method:'post',
    data:data
  })
}

export function createNewBook(data) {
  return request({
    url:'/home/newBook/create',
    method:'post',
    data:data
  })
}

export function updateNewBookSort(params) {
  return request({
    url:'/home/newBook/update/sort/'+params.id,
    method:'post',
    params:params
  })
}
