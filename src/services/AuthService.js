import ApiService from "services/axiosInstance";

class AuthService {
  async login(email, password) {
    return ApiService.post("/auth/enter", {
      email: email,
      password: password
    });
  }
}
export default AuthService;