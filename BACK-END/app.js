//add swagger 
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const bodyParser = require('body-parser');




require('dotenv').config();

const db = require('./models');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const searchRouter= require('./routes/search');
const initRoute = require('./routes/initRoute'); // Ensure correct import
const cartRouter= require('./routes/cart');
const orderRouter= require('./routes/order');
const userRouter= require('./routes/user');
const adminRouter= require('./routes/admin');
const registeredUsersRouter= require('./routes/registeredUsers');
const guestRouter= require('./routes/guest');


const { initDatabase } = require('./initController'); // Import the initDatabase function

const app = express();
const cors= require('cors');

// Enable CORS for all routes


app.use(cors({
    origin: 'http://localhost:5000', //  frontend URL
    credentials: true
}));



db.sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
    
        

    // Automatically populate the database directly
    try {
        await initDatabase();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error during database initialization:', error);
    }

    // Set up routes
    app.use('/init', initRoute); // Ensure correct usage

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    
    //bootstrap and jquery and bootstrap icons 
    app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
    app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
    app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

    

    app.use('/', indexRouter);
    app.use('/auth', authRouter);
    app.use('/products', productsRouter);
    app.use('/category', categoryRouter);
    app.use('/brand', brandRouter);
    app.use('/search', searchRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/registeredUsers', registeredUsersRouter);
    app.use('/guest', guestRouter);


    

    

    

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
});

//bind swagger
app.use(bodyParser.json());
app.use('/doc',swaggerUi.serve,swaggerUi.setup(swaggerFile));

// Enable CORS for all routes





module.exports = app;

