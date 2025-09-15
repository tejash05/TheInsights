import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: ["/overview/:path*", "/orders/:path*", "/customers/:path*", "/products/:path*", "/settings/:path*"],
};
