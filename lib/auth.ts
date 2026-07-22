import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_ADMIN_AUTH_URL ||
    "http://localhost:3001/v1/admin-auth",
  user: {
    additionalFields: {
      phone: {
        type: "string",
        input: true,
      },
    },
  },
});
