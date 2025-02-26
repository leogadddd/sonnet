export default {
  providers: [
    {
      domain:
        process.env.NODE_ENV === "production"
          ? "https://clerk.sonnet.leogadil.com"
          : "https://teaching-mink-95.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
