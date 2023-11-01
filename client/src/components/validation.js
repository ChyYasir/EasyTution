export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{11}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return "Phone Number must be 11 digits.";
  }

  return true;
};
