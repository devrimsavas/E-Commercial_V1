// appTest.js
//this module is quite copy of app.js with some changes for testing purposes
//this is used for jest tests. 
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
const searchRouter = require('./routes/search');
const initRoute = require('./routes/initRoute');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const registeredUsersRouter = require('./routes/registeredUsers');
const guestRouter = require('./routes/guest');

const { initDatabase } = require('./initController');

const app = express();

async function initializeApp() {
    try {
        await db.sequelize.sync({ force: true });
        console.log('Database synced');
        await initDatabase();
        console.log('Database initialized successfully');

        app.use('/init', initRoute);

        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
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

        app.use(function (req, res, next) {
            next(createError(404));
        });

        app.use(function (err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });

        app.use(bodyParser.json());
        app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    } catch (err) {
        console.error('Unable to sync database:', err);
    }
}

if (process.env.NODE_ENV !== 'test') {
    initializeApp();
}

module.exports = { app, initializeApp, db };
