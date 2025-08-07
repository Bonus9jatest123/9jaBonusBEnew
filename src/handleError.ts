



import { removeCookie, removeUserCookie } from "./lib/cookies";

const HandleError = (error: any) => {
  console.error('Error:', error);
  const errorMessage = error?.response?.data?.message;
  console.log('Error message:', errorMessage); 

  if (
    errorMessage?.includes('Access denied. No token provided.') ||
    errorMessage?.includes('User not found') ||
    errorMessage?.includes('Invalid or expired token.Please login again.')
  ) {
    console.error('Logging out due to token/auth issue:', errorMessage);
    removeCookie("token");
    removeUserCookie("user");

    // Prevent repeated redirect
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
      setTimeout(() => {
        window.location.href = "/admin/login";
        
      }, 300);
    }
  }
};

export default HandleError;

