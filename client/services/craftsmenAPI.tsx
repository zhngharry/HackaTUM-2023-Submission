// services/api/user.js
import axios from "axios";
import { time } from "console";

const API_BASE_URL = "http://localhost:8080";

function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export const getListOfCraftsmen = async (postcode: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mock`);
    await wait(5);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
