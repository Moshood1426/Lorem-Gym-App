import jwt from "jsonwebtoken";

const createJWT = (payload: { userId: number, email: string }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const verifyJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!)
}

export { createJWT, verifyJWT }
