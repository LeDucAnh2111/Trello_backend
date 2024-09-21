import bcrypt from "bcrypt";
const saltRounds = 10; // Số vòng băm

const hashPassword = (plainTextPassword) => {
  try {
    const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const comparePassword = (plainTextPassword, hashedPassword) => {
  try {
    const isMatch = bcrypt.compareSync(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

export { hashPassword, comparePassword };
