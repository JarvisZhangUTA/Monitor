import request from '@/utils/request'

export function geResponses(params) {
  return request({
    url: '/responses',
    method: 'get',
    params: params
  })
}
