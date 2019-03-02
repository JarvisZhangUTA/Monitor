import request from '@/utils/request'

export function signup(email, password) {
  return request({
    url: '/users/signup',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export function signin(email, password) {
  return request({
    url: '/users/signin',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'post',
    data: { token }
  })
}
