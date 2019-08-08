const getters = {
  // language: state => state.app.language,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.id,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  browserHeaderTitle: state => state.user.browserHeaderTitle,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  website: state => state.common.website,
  constType: state => state.common.constType,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  options: state => state.tagsView.options
}
export default getters
