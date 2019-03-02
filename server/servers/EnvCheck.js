const config = require('../config')
const UserService = require('../services/UserService')

class EnvCheck {
  constructor () {
    this.userService = new UserService()

    this.checkAdminUser()
  }

  async checkAdminUser () {
    console.log('Checking Admin Users')
    let admin = await this.userService.getUserByEmail(config.default_user)
    if (!admin) {
      admin = await this.userService.createUser({
        email: config.default_user,
        password: config.defult_password,
        role: 'admin'
      })

      console.log(`Create default admin user ${config.default_user} with password ${config.defult_password}`)
    }
  }
}

module.exports = EnvCheck