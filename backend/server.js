import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/users", userRoutes);
// logic

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
