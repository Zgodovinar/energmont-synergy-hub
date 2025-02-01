export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

export const validateWorkerForm = (data: {
  name: string;
  role: string;
  email: string;
  password: string;
}) => {
  if (!data.name || !data.role || !data.email || !data.password) {
    return "Name, role, email, and password are required";
  }
  return validatePassword(data.password);
};