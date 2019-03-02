const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  email: state => state.user.email,
  role: state => state.user.role
}
export default getters
