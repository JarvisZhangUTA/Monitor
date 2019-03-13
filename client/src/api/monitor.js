import request from '@/utils/request'

export function geAllMonitorList(params) {
  return request({
    url: '/monitors/all',
    method: 'get',
    params: params
  })
}

export function createMonitor(params) {
  return request({
    url: '/monitors',
    method: 'post',
    data: params
  })
}

export function getMonitorList(params) {
  return request({
    url: '/monitors',
    method: 'get',
    params: params
  })
}

export function updateMonitor(id, params) {
  return request({
    url: '/monitors/' + id,
    method: 'put',
    data: params
  })
}
