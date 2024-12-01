import ApiService from "services/axiosInstance";

class KPIServices {
  async getKPIForEmployee(employeeId, params) {
    return ApiService.get(`/kpi/for-employee/${employeeId}`, params);
  }

  async getKPIById(id) {
    return ApiService.get(`/kpi/${id}`)
  }

  async addKPIAssessment(data) {
    return ApiService.post(`/kpi/assessment/create`, data)
  }

  async getKPIPeriods() {
    return ApiService.get(`/kpi/kpi-period/all`)
  }

  async getReportForUser(id, params) {
    return ApiService.getFile(`/kpi/for-employee/${id}/report`, params);
  }

  async createKPIs(data) {
    return ApiService.post(`/kpi`, data)
  }
}

export default KPIServices;