import validator from 'validator';

export const validateRegistration = ({ name, phone, email, password }) => {
  if (!name || !phone || !email || !password)
    return 'All fields are required';

  if (!validator.isEmail(email))
    return 'Invalid email format';

  return null;
};