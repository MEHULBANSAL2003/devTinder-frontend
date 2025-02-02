export const validateLoginData = (email, password) => {
  if (email === "") return "Email is required";
  if (password === "") return "Password is required";

  const isEmailValid = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(
    email
  );

  const isPasswordVlaid =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );

  if (!isEmailValid) return "Email is not valid";
  if (!isPasswordVlaid) return "Password is not valid";

  return null;
};

export const validateSignUpData = (
  firstName,
  lastName,
  username,
  email,
  password,
  age,
  gender
) => {
  if (firstName === "") return "First Name is required";
  if (lastName === "") return "Last Name is required";
  if (username === "") return "Username is required";
  if (age === null) return "Age is required";
  if (age < 18) return "Age must be 18 or more";
  if (gender === "") return "Gender is required";

  if (email === "") return "Email is required";
  if (password === "") return "Password is required";

  const isFirstNameValid = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/.test(firstName);
  const isLastNameValid = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/.test(lastName);

  const isEmailValid = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(
    email
  );

  const isPasswordVlaid =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );

  if (!isFirstNameValid) return "First Name is not valid";
  if (!isLastNameValid) return "Last Name is not valid";
  if (!isEmailValid) return "Email is not valid";
  if (!isPasswordVlaid) return "Password is not valid";

  return null;
};

export const validateProfileEditData = (firstName, lastName, age, about) => {
  if (firstName === "") return "First name is required";
  if (lastName === "") return "Last name is required";
  if (age == null) return "Age is required";
  if (age < 18) return "Age must be greater than or equal to 18 ";
  if (about === "") return "Please describe about yourself";

  return null;
};

export const validateChangePasswordData = (currPass, newPass, rePass) => {
  if (currPass === "") return "Current Password should not be empty";
  if (newPass === "") return "New Password should not be empty";
  if (rePass === "") return "Re-enter Password should not be empty";

  const isPasswordValid =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      newPass
    );

  if (!isPasswordValid) return "New Password must be strong";

  if (newPass !== rePass)
    return "Re-enter password must be same as that of current password";

  return null;
};
