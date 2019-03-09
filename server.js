const express = require('express');
const path = require('path');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const db = require('./models');

const authHtmlRouter = require('./routes/html/auth');
const authApiRouter = require('./routes/api/auth');
const matchesHtmlRouter = require('./routes/html/matches');
const matchesApiRouter = require('./routes/api/matches');
const betsApiRouter = require('./routes/api/bets');

const errorController = require('./controllers/error');

const app = express();

app.engine(
    'hbs',
    expressHbs({
        layoutsDir: 'views/layouts/',
        defaultLayout: 'main-layout',
        extname: 'hbs'
    })
);
app.set('view engine', 'hbs');

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PUT, PATCH, DELETE'
//     );
//     next();
// });

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({
            db: db.sequelize,
            expiration: 3 * 60 * 60 * 1000
        })
    })
);

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) {
        return next();
    }
    db.User.findByPk(req.session.user.id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            next(err);
        });
});

app.use('/api', authApiRouter);
app.use(matchesHtmlRouter);
app.use('/api', matchesApiRouter);
app.use('/api', betsApiRouter);
app.use(authHtmlRouter);
app.use(errorController.get404);

db.sequelize
    .sync() // Add {force: true} if need to reset DB tables
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server started at port ' + PORT);
        });
    })
    .catch(err => {
        console.log(err);
    });
