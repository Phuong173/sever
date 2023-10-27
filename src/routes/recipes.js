const express = require('express');
const router = express.Router();
const recipesController = require('../app/controller/RecipesController');

// Lấy tất cả công thức theo người dùng
router.get('/user/:userId', recipesController.getRecipesByUserId);

// Lấy tất cả công thức
router.get('/', recipesController.getAllRecipes);

// Lấy chi tiết công thức
router.get('/:id', recipesController.getRecipeById);

// Tạo một công thức mới
router.post('/', recipesController.createRecipe);

// Cập nhật một công thức
router.put('/:id', recipesController.updateRecipe);

// Xóa một công thức
router.delete('/:id', recipesController.deleteRecipe);

// Thêm một nguyên liệu cho công thức
router.post('/:id/ingredient', recipesController.addIngredient);

// Cập nhật một nguyên liệu cho công thức
router.put('/:id/ingredient/:ingredientId', recipesController.updateIngredient);

// Xóa một nguyên liệu khỏi công thức
router.delete('/:id/ingredient/:ingredientId', recipesController.deleteIngredient);

// Thêm một đánh giá cho công thức
router.post('/:id/review', recipesController.addReview);

// Xóa một đánh giá từ công thức
router.delete('/:id/review/:reviewId', recipesController.deleteReview);

module.exports = router;