import ApiService from "services/axiosInstance";

class DevelopmentPlanService {

  async getDevelopmentPlansForEmployee(data) {
    return ApiService.post(`/development-plan/for-employee`, data)
  }

  async addDevelopmentPlan(data) {
    return ApiService.post(`/development-plan`, data)
  }
  async updateStatus(data) {
    return ApiService.put(`/development-plan/update-status`, data)
  }

}

export default DevelopmentPlanService;