const User = require("../models/user");
const responses = require("../../config/responses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const security = require('../../config/security');
const api_url = require("../util/Api_url");
const fs = require("fs");

class SettingController {
  // [GET] /users
  async getAllUser(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(responses.success200(users));
    } catch (err) {
      res.status(500).json(responses.error500(err, null));
    }
  }

  // [GET] /users/:id
  async getOneUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).lean();
      if (!user) {
        return res.status(404).json(responses.error404("user not found"));
      }
      res.status(200).json(responses.success200(user));
    } catch (err) {
      res.status(500).json(responses.error500(err, null));
    }
  }

  // [DELETE] /users/:id
  async delete(req, res) {
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json(responses.error404("user not found"));
      }
      return res.status(204).end();
    } catch (err) {
      return res.status(500).json(responses.error500(err, null));
    }
  }

  async update(req, res, next) {
    const _id = req.params.id;
    console.log(req.body);
    // return;
    if (req.file === undefined) {
      const data = {
        name: req.body.name,
        date: req.body.date,
        phone: req.body.phone,
        avatar: "https://cook-book-app.vercel.app/uploads/avatar_url.png",
      };
      User.updateOne({ _id: _id }, { $set: data }).then(() =>
        res.status(200).send({ message: "thành công" })
      );
    } else {
      fs.rename(
        req.file.path,
        "uploads/" + req.file.originalname,
        function (err) {
          const link = "/uploads/" + req.file.originalname;
          const url = api_url.API_URL + link;
          const data = {
            name: req.body.name,
            date: req.body.date,
            phone: req.body.phone,
            avatar: url,
          };
          User.updateOne({ _id: _id }, { $set: data }).then(() =>
            res.status(200).send({ message: "thành công" })
          );
        }
      );
    }
  }

  edit(req, res, next) {
    const _id = req.params.id;
    console.log(req.body);
    if (req.file === undefined) {
      const data = {
        name: req.body.name,
        date: req.body.date,
        phone: req.body.phone,
        avatar: "https://cook-book-app.vercel.app/uploads/avatar_url.png",
      };
      User.updateOne({ _id: _id }, { $set: data }).then(() =>
        res.status(200).send({ message: "thành công" })
      );
    } else {
      fs.rename(
        req.file.path,
        "uploads/" + req.file.originalname,
        function (err) {
          const link = "/uploads/" + req.file.originalname;
          const url = api_url.API_URL + link;
          const data = {
            name: req.body.name,
            date: req.body.date,
            phone: req.body.phone,
            avatar: url,
          };
          User.updateOne({ _id: _id }, { $set: data }).then(() =>
            res.status(200).send({ message: "thành công" })
          );
        }
      );
    }
  }

  async register(req, res) {
    try {
      // Tạo một người dùng mới và mã hóa mật khẩu
      const saltRounds = 10; // Số lần lặp để tạo muối
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword, // Sử dụng mật khẩu đã mã hóa
        date: req.body.date,
        phone: req.body.phone,
        avatar: "https://cook-book-app.vercel.app/uploads/avatar_url.png",
      });
      await newUser.save();

      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Đăng ký không thành công", details: error.message });
    }
  }

  async login(req, res) {
    try {
      // Tìm người dùng theo tên
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }

      // So sánh mật khẩu
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Mật khẩu không chính xác" });
      }

      const tokenPayload = {
        userId: user._id,
        name: user.name,
        email: user.email,
      };
      // Tạo và gửi mã thông báo JWT
      const token = jwt.sign(tokenPayload, security.secretKey, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra", details: error.message });
    }
  }
}

module.exports = new SettingController();
