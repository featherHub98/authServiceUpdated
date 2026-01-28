import bcrypt from 'bcrypt';

export const hashPassword = (pwd: string): Promise<string> => {
  return bcrypt.hash(pwd, 10);
};

export const comparePassword = async (
  pwd: string,
  hashedPwd: string
): Promise<boolean> => {
  return await bcrypt.compare(pwd, hashedPwd);
};
