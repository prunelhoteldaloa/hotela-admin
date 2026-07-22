import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001/v1/auth",
  user: {
    additionalFields: {
      phone: {
        type: "string",
        input: true,
      },
    },
  },
});
