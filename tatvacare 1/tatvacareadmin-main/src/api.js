import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
console.log("API URL:", process.env.REACT_APP_API_URL);
const userData = JSON.parse(localStorage.getItem("Data"));
let authToken = userData?.token;
let api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export const getReq = async (endpoint, query) => {
  try {
    const response = await api.get(endpoint, query);
    return response.data;
  } catch (error) {
    // Handle error or throw an error
    return error.response.data;
  }
};

export const postReq = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const putReq = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteApi = async (endpoint) => {
  if (
    api.defaults.headers.common["Authorization"] === undefined ||
    api.defaults.headers.common["Authorization"] === null
  ) {
    let userRole = localStorage.getItem("userRole");
    let token;
    if (userRole === "company") {
      token = localStorage.getItem("companyToken");
    } else if (userRole === "vendor") {
      authToken = localStorage.getItem("vendorToken");
    } else {
      authToken = localStorage.getItem("userToken");
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await api.delete(endpoint);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
