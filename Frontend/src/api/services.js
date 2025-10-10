import api from "./axiosConfig";

// =================== AUTH ===================
export const syncUser = async (userData) => {
  const response = await api.post("/auth/sync", userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (email, password, name) => {
  const response = await api.post("/auth/register", { email, password, name });
  return response.data;
};

// =================== USER ===================
export const getUserProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData);
  return response.data;
};

export const getUserRelationships = async () => {
  const response = await api.get("/user/relationships");
  return response.data;
};

export const getUserStories = async (limit = 10, skip = 0) => {
  const response = await api.get(`/user/stories?limit=${limit}&skip=${skip}`);
  return response.data;
};

// =================== FAMILY CIRCLE ===================
export const createFamilyCircle = async (name) => {
  const response = await api.post("/family-circles", { name });
  return response.data;
};

export const getFamilyCircle = async (circleId) => {
  const response = await api.get(`/family-circles/${circleId}`);
  return response.data;
};

export const getFamilyMembers = async (circleId) => {
  const response = await api.get(`/family-circles/${circleId}/members`);
  return response.data;
};

export const updateCircleName = async (circleId, name) => {
  const response = await api.put(`/family-circles/${circleId}/name`, { name });
  return response.data;
};

export const inviteMember = async (circleId, email) => {
  const response = await api.post(`/family-circles/${circleId}/invite`, {
    email,
  });
  return response.data;
};

export const removeMember = async (circleId, memberId) => {
  const response = await api.delete(
    `/family-circles/${circleId}/members/${memberId}`
  );
  return response.data;
};

export const getCircleInvitations = async (circleId) => {
  const response = await api.get(`/family-circles/${circleId}/invitations`);
  return response.data;
};

export const acceptInvitation = async (token) => {
  const response = await api.post(`/family-circles/accept-invite/${token}`);
  return response.data;
};

export const cancelInvitation = async (invitationId) => {
  const response = await api.delete(
    `/family-circles/invitations/${invitationId}`
  );
  return response.data;
};

export const leaveFamilyCircle = async (circleId) => {
  const response = await api.post(`/family-circles/${circleId}/leave`);
  return response.data;
};

export const deleteFamilyCircle = async (circleId) => {
  const response = await api.delete(`/family-circles/${circleId}`);
  return response.data;
};

// =================== RELATIONSHIPS ===================
export const sendRelationshipRequest = async (
  recipientId,
  relationshipType
) => {
  const response = await api.post("/relationships", {
    recipientId,
    relationshipType,
  });
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await api.get("/relationships/pending");
  return response.data;
};

export const respondToRequest = async (requestId, action) => {
  const response = await api.put(`/relationships/${requestId}`, {
    action, // should be 'approved' or 'rejected'
  });
  return response.data;
};

export const getApprovedRelationships = async () => {
  const response = await api.get("/relationships/approved");
  return response.data;
};

export const getPendingRelationshipsForAdmin = async () => {
  const response = await api.get("/relationships/admin/pending");
  return response.data;
};

export const adminApproveRelationship = async (requestId, approved) => {
  const response = await api.put(`/relationships/admin/approve/${requestId}`, {
    approved,
  });
  return response.data;
};

// =================== STORIES ===================
export const createStory = async (storyData) => {
  const response = await api.post("/stories", storyData);
  return response.data;
};

// ✅ FIXED: Now accepts familyId parameter to match the route
export const getStoriesForFamily = async (familyId) => {
  const response = await api.get(`/stories/family/${familyId}`);
  return response.data;
};

export const updateStory = async (storyId, storyData) => {
  const response = await api.put(`/stories/${storyId}`, storyData);
  return response.data;
};

export const deleteStory = async (storyId) => {
  const response = await api.delete(`/stories/${storyId}`);
  return response.data;
};

export const getStoryById = async (storyId) => {
  const response = await api.get(`/stories/${storyId}`);
  return response.data;
};

// ✅ Matches route: GET /stories/user
export const getUserOwnStories = async (limit = 10, skip = 0) => {
  const response = await api.get(`/stories/user?limit=${limit}&skip=${skip}`);
  return response.data;
};

// ✅ Matches route: GET /stories/family-circle
export const getFamilyCircleStories = async (limit = 20, skip = 0) => {
  const response = await api.get(
    `/stories/family-circle?limit=${limit}&skip=${skip}`
  );
  return response.data;
};

// =================== MEDIA ===================
export const uploadMedia = async (storyId, file, description = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  const response = await api.post(`/media/upload/${storyId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const searchContent = async (query, filters = {}) => {
  const params = new URLSearchParams();
  params.append("q", query);

  if (filters.type) params.append("type", filters.type);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);

  const response = await api.get(`/search?${params.toString()}`);
  return response.data;
};


export const getFamilyTreeData = async (circleId) => {
  const response = await api.get(`/family-circles/${circleId}/tree`);
  return response.data;
};

export const getRandomPrompt = async () => {
  const response = await api.get('/prompts/random');
  return response.data;
};