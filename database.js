const mongoose = require("mongoose");

// Function for connecting to database using Mongoose
const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((data) => {
            console.log(
                "MongoDB connected with server from",
                data.connection.host
            );
        });
};

module.exports = connectDatabase;
