const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const cors = require("cors");
const verifyToken = require('./middleware/verify_token');

const router = require("./routes/index");
const routers = require("./routes/webadmin");
const db = require("./config/db");
const api = require("./config/api");




var spHome = require('./routes/home');
var spLogin = require('./routes/login');
var spPost = require('./routes/post');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware xử lý verify tokens
app.use(verifyToken);

//thêm liên kết cho trang admin
app.use('/home',spHome);
app.use('/login',spLogin);
app.use('/post', spPost);

// app.use(function(req, res, next) {
//   next(createError(404));
// });

// Kết nối với cơ sở dữ liệu
db.connect();

// API docs
api.docs(app);

//Middleware xử lý core
app.use(cors());



// Cấu hình cho ứng dụng Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middleware ghi log và xử lý JSON
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Gửi yêu cầu phân tích kiểu nội dung application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// router link
router(app);
routers(app);

 

// Start server
app.listen(port, function () {
  console.log("Server listening on port", port);
});

module.exports = app;