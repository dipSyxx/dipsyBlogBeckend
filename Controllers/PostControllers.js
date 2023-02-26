import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    // відповідь після створеного документа
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося створити статю",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати теги",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // .populate("user").exec() підключаєм зв'язок між юзером і цією функцією щоб отримати масив юзер
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося завантажити статі",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // витягаєм динамічний параметр id звідси app.get("/posts/:id", checkAuth, PostControllers.getOne);
    const postId = req.params.id;

    // по динамічному id знаходим пост і зразу же обновляєм його тим самим обновляєм щьотчик переглядів
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Не вдалося повернути статю",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статя не знайдена",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося завантажити статі",
    });
  }
};

export const remove = async (req, res) => {
  try {
    // витягаєм динамічний параметр id звідси app.delete("/posts/:id", checkAuth, PostControllers.remove);
    const postId = req.params.id;

    // по динамічному id знаходим пост і зразу же видаляєм його
    PostModel.findOneAndDelete(
      {
        // 1 параметр знаходження _id
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Не вдалося видалити статю",
          });
        }

        // якщо пост був не знайдений
        if (!doc) {
          return res.status(404).json({
            message: "Статя не знайдена",
          });
        }

        // якщо все добре і все пройшло перевірку
        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося завантажити статі",
    });
  }
};

export const update = async (req, res) => {
  try {
    // витягаєм динамічний параметр id звідси app.update("/posts/:id", checkAuth, PostControllers.update);
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        // 2 параметром передаєм що ми хочемо обновити
        //! req.body - це інформація яка надходить нам від корисутвача
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(","),
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося оновити статю",
    });
  }
};
