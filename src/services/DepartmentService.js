import ApiService from "services/axiosInstance";

class DepartmentService {
  async getDepartment() {
    return ApiService.get(`/department`);
  }
}

export default DepartmentService;