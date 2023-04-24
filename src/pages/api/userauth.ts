// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type Data = {
  data: Info | null;
  success: boolean;
};

type Info = {
  email: string;
  name: string;
  id: number;
  token: string;
  expiresIn: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (
    req.body.email === "testuser@test.com" &&
    req.body.password === "Testuser@123"
  ) {
    let jwtToken = jwt.sign(
      { email: req.body.email, name: "Test User", id: 1 },
      "my-jwt-test-secret"
    );
    return res.status(200).json({
      data: {
        email: req.body.email,
        name: "Test User",
        id: 1,
        token: jwtToken,
        expiresIn: getExpDate(),
      },
      success: true,
    });
  } else {
    return res.status(401).json({
      data: null,
      success: false,
    });
  }
}

const getExpDate = () => {
  // Get the current time
  const currentTime = new Date().getTime();

  // Calculate the expiration time by adding 1 hour in milliseconds
  const expirationTime = currentTime + 24 * 60 * 60 * 1000; // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds

  // Create a new Date object using the expiration time
  const expirationDate = new Date(expirationTime);

  return expirationDate;
};
