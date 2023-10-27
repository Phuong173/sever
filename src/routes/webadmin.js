const express = require("express");
const app = express();

const homeRouter = require('./home');
const loginRouter = require('./login');
const postRouter = require('./postwed');

const router = app => {
    app.use('/login', loginRouter);
    app.use('/home', homeRouter);
    app.use('/post', postRouter);
}

// Xử lý lỗi 404
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // Xử lý lỗi
  app.use(function(err, req, res, next) {
    // Thiết lập các biến locals để hiển thị thông báo lỗi trong chế độ phát triển
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // Render trang lỗi
    res.status(err.status || 500);
    res.render('error');
  });


module.exports = router;
