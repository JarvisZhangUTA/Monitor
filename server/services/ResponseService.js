const ResponseModel = require('../models/response.model')

class ResponseService {

  saveResponse (response) {
    const response = new ResponseModel(response)
    response.save()
    return response
  }

}

module.exports = ResponseService