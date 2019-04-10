const ResponseModel = require('../models/response.model')

class ResponseService {

  saveResponse (responseInfo) {
    const response = new ResponseModel(responseInfo)
    response.save()
    return response
  }

  async getResponses (params) {
    let find = {}
    let sort = {}
    let page = 1
    let per_page = 40

    if (params.page) { page = params.page }
    if (params.per_page) { per_page = params.per_page }
    if (params.sort_by) { sort[params.sort_by] = params.sort_order }
    if (params.monitor_ids) { find['monitor_id'] = { $in: params.monitor_ids } }

    let data = await ResponseModel.find(find).sort(sort).limit(+per_page).skip(+per_page * (+page - 1)).exec();
    let total = await ResponseModel.find(find).countDocuments().exec();

    return {data, total}
  }
}

module.exports = ResponseService