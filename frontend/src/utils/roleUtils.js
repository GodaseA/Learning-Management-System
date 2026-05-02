// This is a utility to check user role
export const isStudent = (user) => {
  return user && user.role === 'student';
};

export const isInstructor = (user) => {
  return user && user.role === 'instructor';
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};
