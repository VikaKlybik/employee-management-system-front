import ApiService from "services/axiosInstance";

class SurveyService {

  async getSurvey(filterParam) {
    return ApiService.get(`/survey`, filterParam);
  }

  async compositeCreateSurvey(data) {
    return ApiService.post("/survey/create/composite", data);
  }

  async getSurveyById(id) {
    return ApiService.get(`/survey/${id}`);
  }

  async setEvaluators(data) {
    return ApiService.post("/survey/evaluators", data);
  }

  async getPassingById(id) {
    return ApiService.get(`/survey/passing/${id}`);
  }

  async passSurvey(data) {
    return ApiService.post(`/survey/pass/as-employee`, data);
  }

  async getSurveyToBePassByEmployee(id) {
    return ApiService.get(`/survey/to-be-pass/employee/${id}`);
  }

  async duplicateSurvey(id) {
    return ApiService.post(`/survey/duplicate/${id}`);
  }

  async closeSurvey(id) {
    return ApiService.post(`/survey/${id}/close`);
  }

  async getAssessments(data) {
    return ApiService.post(`/survey/passing/get/assessment-summary`, data);
  }

  async getUniqueCompetencyForSurveyById(surveyId) {
    return ApiService.get( `/survey/${surveyId}/competency`);
  }

  async getReportForUser(surveyId, userId) {
    return ApiService.getFile( `/survey/${surveyId}/report/for-employee/${userId}`);
  }
}

export default SurveyService;