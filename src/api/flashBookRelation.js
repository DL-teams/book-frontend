import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/flashBookRelation/list',
    method:'get',
    params:params
  })
}
export function createFlashBookRelation(data) {
  return request({
    url:'/flashBookRelation/create',
    method:'post',
    data:data
  })
}
export function deleteFlashBookRelation(id) {
  return request({
    url:'/flashBookRelation/delete/'+id,
    method:'post'
  })
}
export function updateFlashBookRelation(id,data) {
  return request({
    url:'/flashBookRelation/update/'+id,
    method:'post',
    data:data
  })
}
