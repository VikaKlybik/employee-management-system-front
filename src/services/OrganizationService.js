import ApiService from "services/axiosInstance";

class OrganizationService {
  async getOrganizationStructure() {
    return ApiService.get(`/organization`);
  }
}

export default OrganizationService;