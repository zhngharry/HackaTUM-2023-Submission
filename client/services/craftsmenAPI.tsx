// services/api/user.js
import axios from "axios";


function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export const getListOfCraftsmen = async (postcode: number, page:number) => {
  try {
    // Simulate an asynchronous operation
    await wait(3); // Adjust the wait time as needed

    // Mock data from the local JSON file
    const mockData = require("../public/craftsmen.json"); // Adjust the path based on your project structure

    return mockData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
