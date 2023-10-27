const fs = require("fs");
const recipe_data = require("../models/Recipes");
const responses = require("../../config/responses");

const api_url = require("../util/Api_url");
class RecipesController {
  // [GET] Hiển thị tất cả công thức theo id_user 
  async getRecipesByUserId(req, res) {
    const userId = req.params.userId;
    try {
      const recipes = await recipe_data.find({ _id_user: userId });
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
  //[GET] hiển thị tất cả công thức
  async getAllRecipes(req, res) {
    try {
      const recipes = await recipe_data.find();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[GET] Hiển thị chi tiết một công thức
  async getRecipeById(req, res) {
    const recipeId = req.params.id;
    try {
      const recipe = await recipe_data.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[POST] Thêm một công thức mới
  async createRecipe(req, res) {
    try {
      const newRecipeData = req.body
      const newRecipe = new recipe_data(newRecipeData);
      await newRecipe.save();
      return res.status(200).json(responses.success200(newRecipe));

    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[PUT] Cập nhật một công thức
  async updateRecipe(req, res) {
    const recipeId = req.params.id;
    const updatedRecipeData = req.body;
    try {
      const updatedRecipe = await recipe_data.findByIdAndUpdate(
        recipeId,
        updatedRecipeData,
        {
          new: true,
        }
      );
      if (!updatedRecipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }
      res.json(updatedRecipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[DELETE] Xóa một công thức
  async deleteRecipe(req, res) {
    const recipeId = req.params.id;
    try {
      const deletedRecipe = await recipe_data.findByIdAndRemove(recipeId);
      if (!deletedRecipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }
      res.json({ message: "Công thức đã bị xóa" });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
  //[POST] thêm nguyên liệu
  async addIngredient(req, res) {
    const recipeId = req.params.id;
    const newIngredientData = req.body;
    try {
      const recipe = await recipe_data.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }

      recipe.ingredient.push(newIngredientData);
      await recipe.save();
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[PUT] Cập nhật một nguyên liệu cho công thức
  async updateIngredient(req, res, next) {
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;
    const updatedIngredientData = req.body;
    try {
      const recipe = await recipe_data.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }

      const ingredient = recipe.ingredient.id(ingredientId);
      if (!ingredient) {
        return res.status(404).json({ error: "Không tìm thấy nguyên liệu" });
      }

      ingredient.set(updatedIngredientData);
      await recipe.save();
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
  //[DELETE] Xóa một nguyên liệu khỏi công thức
  async deleteIngredient(req, res) {
    const recipeId = req.params.id;
    const ingredientId = req.params.ingredientId;
    try {
      const recipe = await recipe_data.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }

      const ingredient = recipe.ingredient.id(ingredientId);
      if (!ingredient) {
        return res.status(404).json({ error: "Không tìm thấy nguyên liệu" });
      }

      ingredient.remove();
      await recipe.save();
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[POST] Thêm một đánh giá mới cho công thức
  async addReview(req, res) {
    const recipeId = req.params.id;
    const newReviewData = req.body;
    try {
      const recipe = await recipe_data.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }

      recipe.evaluate.push(newReviewData);
      await recipe.save();
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  //[DELETE] Xóa một đánh giá từ công thức
  async deleteReview(req, res) {
    const recipeId = req.params.recipeId;
    const reviewId = req.params.reviewId;

    try {
      // Tìm công thức theo ID
      const recipe = await recipe_data.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ error: "Không tìm thấy công thức" });
      }

      // Tìm và xóa đánh giá theo ID
      const reviewIndex = recipe.evaluate.findIndex(
        (review) => review._id == reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ error: "Không tìm thấy đánh giá" });
      }

      recipe.evaluate.splice(reviewIndex, 1);

      // Lưu công thức sau khi xóa đánh giá
      await recipe.save();

      return res.status(200).json({ message: "Đánh giá đã bị xóa" });
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      return res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
}

// [GET] /recipes
// getall(req, res, next) {
//     recipe_data.find({})
//     .populate('_id_topic', 'name')
//       .then(results  {
//         const data = results.map(result => ({
//           _id:result._id,
//           name_topic:result._id_topic.name,
//           name_food: result.name_food,
//           title: result.title,
//           img_url: result.img_url
//         }));
//         res.send(data);
//       })
//       .catch(error => {
//         // Xử lý lỗi
//       });
//   }
// // [GET] /recipes/:id
// getbyid(req,res,next){
//     const _id = req.params.id;
//     recipe_data.findOne({_id:_id})
//     .then(result=>{
//       res.status(200).send({ message: 'thành công', result });
//     })
// }
// // [POST] /recipes/ealuate/:id
// AddEaluate(req,res,next){
//     const recipeId = req.params.id;
//     const newEvaluation = req.body;

//     recipe_data.findByIdAndUpdate(
//       recipeId,
//       { $push: { evaluate: newEvaluation } },
//       { new: true },
//       (err, updatedRecipe) => {
//         if (err) {
//           console.error('Lỗi khi cập nhật công thức:', err);
//           return res.status(500).json({ error: 'Đã xảy ra lỗi' });
//         }

//         res.json(updatedRecipe);
//       }
//     );
// }

module.exports = new RecipesController();
