const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:4000';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGetLearningPaths(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.creatorId) queryParams.append('creatorId', filters.creatorId);
  if (filters.targetAudience) queryParams.append('targetAudience', filters.targetAudience);

  const url = `${API_BASE_URL}/api/learning-paths${queryParams.toString() ? `?${queryParams}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao buscar trilhas');
  return data;
}

export async function apiGetLearningPathById(id) {
  const res = await fetch(`${API_BASE_URL}/api/learning-paths/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao buscar trilha');
  return data;
}

export async function apiCreateLearningPath(pathData) {
  const res = await fetch(`${API_BASE_URL}/api/learning-paths`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pathData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao criar trilha');
  return data;
}

export async function apiUpdateLearningPath(id, pathData) {
  const res = await fetch(`${API_BASE_URL}/api/learning-paths/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(pathData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao atualizar trilha');
  return data;
}

export async function apiDeleteLearningPath(id) {
  const res = await fetch(`${API_BASE_URL}/api/learning-paths/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erro ao deletar trilha');
  return data;
}

