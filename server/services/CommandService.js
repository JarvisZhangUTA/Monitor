const CommandModel = require('../models/command.model')

class CommandService {
  async getCommandsByUserId(user_id) {
    let commands = await CommandModel.find({user_id: user_id}).exec()
    return commands
  }

  async getCommandById (id) {
    let command = await CommandModel.findOne({_id: id}).exec()
    return command
  } 

  async createCommand(commandInfo) {
    let command = new CommandModel(commandInfo)
    await command.save()
    return command
  }

  async deleteCommand(id) {
    return CommandModel.deleteOne({ _id: id }).exec()
  }
}

module.exports = CommandService