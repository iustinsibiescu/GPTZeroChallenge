import axios from "axios";
import { backendUrl } from "./constants";

export const getPromptResponse = async (prompt) => {
  try {
    const response = await axios.post(backendUrl, {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
