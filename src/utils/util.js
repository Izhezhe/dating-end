/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}
/**
 * 设置浏览器头部标题
 */
export const setTitle = function(title) {
  title = title ? `${title}` : 'saas'
  window.document.title = title + '-业务管理'
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
export const openUrl = function (url) { 
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'zzadmin-menu-link')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('zzadmin-menu-link'))
}

