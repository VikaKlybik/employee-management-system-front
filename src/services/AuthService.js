import ApiService from "services/axiosInstance";

class AuthService {
  async login(email, password) {
    return ApiService.post("/auth/enter", {
      email: email,
      password: password
    });
  }
  async updatePassword(email, password) {
    return ApiService.post("/auth/update-password", {
      email: email,
      newPassword: password
    });
  }
}
export default AuthService;