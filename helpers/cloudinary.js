require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "dcc0y2avr",
    api_key: "622862937796633",
    api_secret: "H52zqD28SKusfDxKWZxdND9kul4",
});

module.exports = cloudinary;
