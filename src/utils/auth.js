import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const effectiveTime = 24 * 60 // 小时

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  let expires = new Date(new Date() * 1 + effectiveTime * 60 * 1000)
  return Cookies.set(TokenKey, token, { expires: expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const TokenImg = 'Img-Token'

export function getImgToken() {
  return Cookies.get(TokenImg)
}

export function setImgToken(token) {
  let expires = new Date(new Date() * 1 + effectiveTime * 60 * 1000)
  return Cookies.set(TokenImg, token, { expires: expires })
}

export function removeImgToken() {
  return Cookies.remove(TokenImg)
}