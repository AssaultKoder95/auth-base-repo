const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');

const userRouter = require('./routes/userRoutes');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env'});

connectDB();

const app = express();


// MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
});


// ROUTES
app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${process.env.PORT}`.yellow.bold));