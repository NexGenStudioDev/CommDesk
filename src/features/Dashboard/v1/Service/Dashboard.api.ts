import axios from "axios";

export const getTasks = async () => {
  const response = await axios.get("/api/tasks?assignedTo=me");
  return response.data;
};