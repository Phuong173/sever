const userRouter = require('./user');
const recipes = require('./recipes');
const topicRouter = require('./topic');
const postRouter = require('./post');

const router = app => {
    app.use('/users', userRouter);
    app.use('/post', postRouter);
    app.use('/topics', topicRouter);
    app.use('/recipes',recipes);
    app.get('/', (req, res) => {
        res.send("Deploy successfully!");
    })
}

module.exports = router;
