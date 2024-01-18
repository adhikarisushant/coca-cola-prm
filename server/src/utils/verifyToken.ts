import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

const verifyToken = (token: string): any => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  return decoded;
};

export default verifyToken;
