import { api } from "./axiosInstance";

export const registerNewUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const confirmAccount = async (userData) => {
  const response = await api.post("/auth/confirm-email", userData);
  return response.data;
};

export const loginUserFn = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getUserDataFn = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
// ---------------------------------------
export const checkUserExistance = async (email , phoneNumber) => {

  const {data} = await api.post("/auth/validate-data", {
    email: email,
    phoneNumber: phoneNumber,
  });
  console.log(data.data);
  const {emailRegisterd, phoneRegisterd} = data.data;
  if (emailRegisterd || phoneRegisterd) {
    // console.log("User already exists");
    return true;
  }else {
    // console.log("User does not exist");
    return false;
  }
};

const reformSupplierData = (userData) => {
  // console.log("Reformatted user data:", userData); 

  const formData = new FormData();

  if (userData.businessName)
    formData.append("businessName", userData.businessName);
  if (userData.email) formData.append("email", userData.email);
  if (userData.fullName) formData.append("fullName", userData.fullName);
  if (userData.password) formData.append("password", userData.password);
  if (userData.phoneNumber)
    formData.append("phoneNumber", userData.phoneNumber);
  if (userData.storeName) formData.append("storeName", userData.storeName);
  if (userData.taxNumber) formData.append("taxNumber", userData.taxNumber);
  if (userData.nationalId) formData.append("nationalId", userData.nationalId);

  if (userData.nationalIdBack instanceof File) {
    formData.append("nationalIdBack", userData.nationalIdBack);
  }
  if (userData.nationalIdFront instanceof File) {
    formData.append("nationalIdFront", userData.nationalIdFront);
  }
  if (userData.taxCard instanceof File) {
    formData.append("taxCard", userData.taxCard);
  }


  // for (let pair of formData.entries()) {
  //   console.log(pair[0] + ": " + pair[1]); 
  // }

  return formData;
};

export const registerNewSupplier = async (userData) => {
  try {
    const reformattedData = reformSupplierData(userData); 
    // console.log(reformattedData); 

    const response = await api.post(
      "/auth/register-supplier",
      reformattedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Registration response:", response);
    return response;
  } catch (error) {
    console.log("Error registering new supplier:", error);
    throw error;
  }
};
