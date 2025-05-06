export const getCurrentUser = () => localStorage.getItem("userId");
export const setCurrentUser = (userId: string) =>
  localStorage.setItem("userId", userId);
