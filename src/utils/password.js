import bcrypt from "bcrypt";

import env from "../config/env.js";

async function hashPassword(password) {
  return bcrypt.hash(password, env.bcryptSaltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export {
  hashPassword,
  comparePassword,
};
