module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI"),
        ssl: { rejectUnauthorized: false }
      },
      options: {
        ssl: false,
        authenticationDatabase: "",
        useUnifiedTopology: true,
        pool: {
          min: 0,
          max: 10,
          idleTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          acquireTimeoutMillis: 30000
        }
      },
    },
  },
});