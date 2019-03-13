const UserModel = require('../models/user.model')

class UserService {

  blurUser (user) {
    if (!user) {
      return user
    }

    if (user.toObject) {
      user = user.toObject()
    }

    if (user.password) {
      delete user.password
    }

    return user
  }

  async getUserList (params) {
    params = Object.assign({
      page: 1,
      per_page: 40,
      email: null,
      role: null,
      can_send_request: null,
      can_upgrade: null,
      sort_by: null,
      sort_order: 'asc'
    }, params)

    const find = {}
    const sort = {}

    if (params.email) {
      find['email'] = { '$regex' : params.email, '$options' : 'i' }
    }
    if (params.role) {
      find['role'] = params.role
    }
    if (params.can_upgrade) {
      find['permission.can_upgrade'] = params.can_upgrade
    }
    if (params.can_send_request) {
      find['permission.can_send_request'] = params.can_send_request
    }
    if (params.sort_by) {
      sort[params.sort_by] = params.sort_order
    }

    let data = await UserModel.find(find).sort(sort).limit(+params.per_page).skip(+params.per_page * (+params.page - 1)).exec();
    let total = await UserModel.find(find).countDocuments().exec();

    return {data, total}
  }

  async getUserById (user_id) {
    let user = await UserModel.findOne({_id: user_id}).exec()
    return this.blurUser(user)
  }

  async getUserByEmail (email) {
    let user = await UserModel.findOne({email: email}).exec()
    return this.blurUser(user)
  }

  async getUserByEmailAndPassword (email, password) {
    let user = await UserModel.findOne({email, password}).exec()
    return this.blurUser(user)
  }

  async createUser (userInfo) {
    if (!userInfo.role) {
      userInfo.role = 'user'
    }

    if (!userInfo.permission) {
      userInfo.permission = {
        can_send_request: false,
        can_upgrade: false
      }
    }

    if (!userInfo.monitors) {
      userInfo.monitors = []
    }

    let user = new UserModel(userInfo)
    await user.save()

    return this.blurUser(user)
  }

  async updateUser (userInfo) {
    let user = null
    if (userInfo._id) {
      user = await UserModel.findOne({_id: userInfo._id}).exec()
      delete userInfo._id
    }
    if (userInfo.email) {
      user = await UserModel.findOne({email: userInfo.email}).exec()
      delete userInfo.email
    }
    if (!user) {
      return null
    }
    await user.update(userInfo).exec()
    return user
  }
}

module.exports = UserService