import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params: params
  })
}

export function updateUser(id, params) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: params
  })
}
