/**
 * @param {Array} routes 用户过滤后的路由
 * @param
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */

export function setDefaultRoute(routes: any[]) {
  routes.forEach((v: any) => {
    if (v.children && v.children.length > 0) {
      v.redirect = { name: v.children[0].name }
      setDefaultRoute(v.children)
    }
  })
}
