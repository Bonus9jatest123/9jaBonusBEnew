import { RootState } from '@/redux/store';

export const hasPermission = (permission: string, state: RootState): boolean => {
  const user = state.userPermissionState.currentUser;
  if (!user) return false;

  // Admin role (1) has access to everything
  if (user.role === 1) return true;

  // Otherwise, check if permission is in user's list
  return user.permission?.includes(permission) || false;
};
