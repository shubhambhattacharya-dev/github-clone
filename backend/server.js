import express from 'express';
import userRouter from './routes/user.route.js';
import dotenv from 'dotenv';

const app = express();


dotenv.config();

app.get('/', (req, res) => {
    res.send('server is ready');
    });

   

    app.use('/api/users', userRouter);

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
    });