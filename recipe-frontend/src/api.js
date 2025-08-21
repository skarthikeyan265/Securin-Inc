import axios from "axios";

const API_BASE = "http://localhost:5000"; // only host + port

export const fetchRecipes = async () => {
  const res = await axios.get(`${API_BASE}/recipes`);
  return res.data;
};

export const fetchRecipesPaginated = async (page, limit) => {
  const res = await axios.get(`${API_BASE}/recipes?page=${page}&limit=${limit}`);
  return res.data;
};

export const searchRecipes = async (query) => {
  const res = await axios.get(`${API_BASE}/recipes/search`, {
    params: { q: query },
  });
  return res.data;
};
export const fetchRecipeById = async (id) => {
  const res = await axios.get(`${API_BASE}/recipes/${id}`);
  return res.data;
} 
 