import ApiService from "services/axiosInstance";

class CompetencyServer {
  async getCompetency() {
    return ApiService.get(`/competency`);
  }
}

export default CompetencyServer;