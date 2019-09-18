const getters = {
  // language: state => state.app.language,
  token: state => state.user.token,
  userId: state => state.user.id,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  browserHeaderTitle: state => state.user.browserHeaderTitle,
  sidebar: state => state.menu.sidebar,
  device: state => state.menu.device,
  menu_routers: state => state.menu.routers,
  website: state => state.common.website,
  constType: state => state.common.constType,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  options: state => state.tagsView.options
}
export default getters
