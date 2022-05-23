export const environment = {
  production: true,
  envName: "local",
  keycloak: {
    // Url of the Identity Provider
    issuer:
      "https://intervu.surveymaster.in/auth/",

    // Realm
    realm: "intervu",

    // The SPA's id.
    // The SPA is registerd with this id at the auth-serverß
    clientId: "web-app",
  },
};