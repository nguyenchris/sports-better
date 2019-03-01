const express = require('express');
const path = require('path');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = require('./models');

const authRouter = require('./routes/html/auth');
const matchesRouter = require('./routes/html/matches');
const errorController = require('./controllers/error');

const PORT = process.env.PORT || 3000;

const app = express();

app.engine('hbs', expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use(session({
    secret: 'Sports-better-secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: db.sequelize
    })
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => {
            next(err);
        })
});

app.use(matchesRouter);
app.use(authRouter);
app.use(errorController.get404);

db.sequelize
    .sync({
        force: true
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log('Server started at port ' + PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    })