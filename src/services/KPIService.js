import ApiService from "services/axiosInstance";

class KPIServices {
  async getKPIForEmployee(employeeId) {
    return ApiService.get(`/kpi/for-employee/${employeeId}`);
  }
}

export default KPIServices;