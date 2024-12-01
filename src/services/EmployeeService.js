import ApiService from "services/axiosInstance";

class EmployeeService {
  async getEmployeeById(employeeId) {
    return ApiService.get(`/employee/${employeeId}`);
  }
  async getEmployee(filterParam) {
    return ApiService.get(`/employee`, filterParam);
  }
  async generateDefaultEvaluators(filterParam) {
    return ApiService.get(`/employee/evaluators/generate`, filterParam);
  }
}

export default EmployeeService;