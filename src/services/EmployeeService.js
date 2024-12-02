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
  async createEmployee(data) {
    return ApiService.post('/user', data);
  }
  async uploadPhoto(id, photo) {
    return ApiService.postPhoto(`/user/upload/${id}`, photo);
  }
  async updateEmployee(id, data) {
    return ApiService.put(`/user/${id}`, data)
  }
}

export default EmployeeService;