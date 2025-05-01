import ApiService from "services/axiosInstance";

class DepartmentService {
  async getDepartment() {
    return ApiService.get(`/department`);
  }

  async createDepartment(data) {
    return ApiService.post("/department", data)
  }

  async deleteDepartment(id) {
    return ApiService.delete(`/department/${id}`)
  }

  async getDepartmentById(id) {
    return ApiService.get(`/department/${id}`)
  }
}

export default DepartmentService;