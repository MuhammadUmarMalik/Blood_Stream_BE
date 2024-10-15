import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";

export default class PostController {
  public async index({ response }: HttpContextContract) {
    try {
      const posts = await Post.query().preload("user");
      const postsWithUsernames = posts.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        username: post.user?.name,
        blood_group: post.blood_group,
        location: post.location,
        time: post.time,
        message: post.message,
      }));

      console.log(postsWithUsernames);
      return response.send(postsWithUsernames);
    } catch (error) {
      console.error("Error fetching posts:", error); // Log the error for debugging
      return response.status(500).send({
        error: "An error occurred while fetching posts.",
        details: error.message, // Include error details if needed
      });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const post = await Post.query()
        .preload("user")
        .where("id", params.id)
        .firstOrFail();
      const postWithUsername = {
        id: post.id,
        user_id: post.user_id,
        username: post.user?.name,
        blood_group: post.blood_group,
        location: post.location,
        time: post.time,
        message: post.message,
      };

      return response.send(postWithUsername);
    } catch (error) {
      console.error("Post not found:", error); // Log the error for debugging
      return response.status(404).send({ error: "Post not found." });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const userData = request.all();
      console.log("user------->", userData);
      const post = await Post.create(userData);
      return response.created(post);
    } catch (error) {
      console.error("Error creating post:", error); // Log the error for debugging
      return response
        .status(400)
        .send({ error: "Failed to create post.", details: error.message });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      const userData = request.only([
        "user_id",
        "blood_group",
        "location",
        "time",
        "message",
      ]);
      post.merge(userData);
      await post.save();
      return response.send(post);
    } catch (error) {
      console.error("Error updating post:", error); // Log the error for debugging
      return response
        .status(400)
        .send({ error: "Failed to update post.", details: error.message });
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await post.delete();
      return response.send({ message: "Post deleted successfully." });
    } catch (error) {
      console.error("Error deleting post:", error); // Log the error for debugging
      return response
        .status(404)
        .send({ error: "Post not found or delete failed." });
    }
  }
}
