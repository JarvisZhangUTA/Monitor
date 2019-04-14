import request from '@/utils/request'

export function getCommands(params) {
  return request({
    url: '/commands',
    method: 'get',
    params: params
  })
}

export function createCommand(params) {
  return request({
    url: '/commands',
    method: 'post',
    data: params
  })
}

export function deleteCommand(id) {
  return request({
    url: '/commands/' + id,
    method: 'delete'
  })
}
