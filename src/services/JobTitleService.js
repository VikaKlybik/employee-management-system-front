import ApiService from "services/axiosInstance";

class JobTitleService {

  async updateJobTitle(id, data){
    return ApiService.put(`/job-title/${id}`, data)
  }

  async deleteById(id) {
    return ApiService.delete(`/job-title/${id}`)
  }

  async create(data) {
    return ApiService.post(`/job-title`, data)
  }
}

export default JobTitleService;