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
const reformSupplierData = (userData) => {
  console.log("Reformatted user data:", userData); // Check all data

  const formData = new FormData();

  // Only append if the data exists to avoid appending undefined or null values
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

  // Append files, checking that they exist and are File objects
  if (userData.nationalIdBack instanceof File) {
    formData.append("nationalIdBack", userData.nationalIdBack);
  }
  if (userData.nationalIdFront instanceof File) {
    formData.append("nationalIdFront", userData.nationalIdFront);
  }
  if (userData.taxCard instanceof File) {
    formData.append("taxCard", userData.taxCard);
  }

  // Confirm the file appending
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]); // This will log each key-value pair in FormData
  }

  return formData;
};

export const registerNewSupplier = async (userData) => {
  try {
    const reformattedData = reformSupplierData(userData); // No need to await here
    console.log(reformattedData); // This will now show each field (including file data)

    const response = await api.post(
      "/auth/register-supplier",
      reformattedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering new supplier:", error);
    throw error; // Rethrow error to handle it where the function is called
  }
};
