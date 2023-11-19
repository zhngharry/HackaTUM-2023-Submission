// services/api/user.js
import axios from "axios";
import { time } from "console";

const API_BASE_URL = "http://localhost:3000";

function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export const getListOfCraftsmen = async (postcode: number, page:number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/craftsmen?`, {
      params: {
        postalcode: postcode,
        page: page,
      },
    });

    if (response.status !== 200) {
      throw new Error("Error fetching craftsmen");
    }
    await wait(5);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const patchUser = async (id: number, data: any) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/craftman/${id}`, data);

    if (response.status !== 200) {
      throw new Error("Error updating user");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
