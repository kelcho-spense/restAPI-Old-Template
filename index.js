const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/users');
const adminRoute = require('./routes/admin');



//middlewares
dotenv.config();
app.use(express.json()); //app is able to send JSON requests
app.use(cors());//using path lib to acCess images in folders



//connect to mongodb
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connected to mongodb"))
    .catch((err) => console.log(err));

//define my routes
app.use("/api", userRoute);
app.use("/api", adminRoute);

app.get("/", (req, res) => {
    res.send("Hello😁 Welcome to my REST-API-OLD!");
})

//server running port
app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running port ${process.env.PORT}`);
});
