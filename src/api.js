export const API_URL = "https://lays-api-vn3q.onrender.com";

export async function getDesigns() {
  const response = await fetch(`${API_URL}/designs`);
  return response.json();
}
