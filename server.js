const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./database");

// Uncaught Exception Error
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Server is shutting down due to Uncaught Exception.");

    process.exit(1);
});

// configuration
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT;
const host = process.env.HOST;
const uri = `http://${host}:${port}`;

// connect to database
connectDatabase();

// server
const server = app.listen(port, host, () => {
    console.log("server is breathing on", `${uri}`);
});

// Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    server.close(() => process.exit(1));
});
