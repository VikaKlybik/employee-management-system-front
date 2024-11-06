import ApiService from "services/axiosInstance";

class EmployeeService {
  async getEmployeeById(employeeId) {
    return ApiService.get(`/employee/${employeeId}`);
  }
  async getEmployee(filterParam) {
    return ApiService.get(`/employee`, filterParam);
  }
}

export default EmployeeService;