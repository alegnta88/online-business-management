import validator from 'validator';

export const validateRegistration = ({ name, phone, email, password }) => {
  if (!name || !phone || !email || !password)
    return 'All fields are required';

  if (!validator.isEmail(email))
    return 'Invalid email format';

  if (!validator.isStrongPassword(password, {
    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  }))
    return 'Password must be strong (8+ chars, upper/lower/number/symbol)';

  return null;
};