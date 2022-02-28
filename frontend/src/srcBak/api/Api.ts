import axios, { AxiosResponse, AxiosError } from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

// axios.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (!error?.response) return;
//
//     // Token expired
//     if (
//       error.response.status === 401 &&
//       error.response.data.code === "TokenExpiredError"
//     ) {
//       return axios.get("/auth/identify").then((res) => {
//         const originalRequest = (axios.defaults.headers.common = {
//           Authorization: `Bearer ${res.data.accessToken}`,
//         });
//
//         return axios(originalRequest);
//       });
//     }
//
//     throw new Error(error.response.data.toString());
//   }
// );

export function setBearerToken(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/**
 * Handlers
 */
function responseHandler(response: AxiosResponse) {
  return response.data;
}

function errorHandler(error: AxiosError) {
  throw new Error(error.response?.data?.message || "API Error");
}

/**
 * Calls
 */
export function post(path: string, payload: object, opt?: object) {
  axios.post(path, payload).then(responseHandler).catch(errorHandler);
}

export function get(path: string, opt?: object): Promise<any> {
  return axios.post(path, opt).then(responseHandler).catch(errorHandler);
}
