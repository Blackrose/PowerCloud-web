import request from '@/utils/request'

let isLocal = /-local$/.test(process.env.NODE_ENV);

export function login(username, password) {
  return request({
    url: isLocal ? '/userlogin.json' : '/user/login?account='+username+'&password='+password,
    method: isLocal? 'get' : 'post',
    /*data: {
      username,
      password
    }*/
  })
}

export function getInfo(token) {
  return request({
    url: isLocal ? '/userinfo.json' : '/user/getUserInfo',
    // url: '/userinfo.json',
    method: isLocal? 'get' : 'post',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: isLocal? 'get' : 'post',
  })
}
