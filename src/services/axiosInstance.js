import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  config.headers['Accept'] = 'application/json';
  config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000/';
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = "/login";
    }
    if (error.response && error.response.status === 404) {
      window.location.href = "/not-found";
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  getFile: (url, params) => axiosInstance.get(url, { params, responseType: 'blob' }),
  get: (url, params) => axiosInstance.get(url, { params }),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
  postPhoto: (url, data) => axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
};

export default ApiService;