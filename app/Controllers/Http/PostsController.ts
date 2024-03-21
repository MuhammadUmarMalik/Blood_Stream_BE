import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import Database from '@ioc:Adonis/Lucid/Database';
import Post from 'App/Models/Post';

export default class PostController {
  public async index({ response }: HttpContextContract) {
    try {
      const posts = await Post.all();
      return response.send(posts);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      // const user = await User.find(params.blood_group);
      const post= await Post.query().from('posts').where('id',params.id)
      // console.log("user-======>",user)
      return response.send(post);
    } catch (error) {
      console.log(error)
      return response.send({error});
    }
  }
// store the new user data in db
  public async store({ request, response }: HttpContextContract) {
    try {
    //   await request.validate({ schema: Createvalidations });
      const userData = request.only([
        'blood_group',
        'location',
        'time',
        'message',
      ]);
      console.log('user------->',request)
      const post = await Post.create(userData);
      return response.created(post);
    } catch (error) {
      return response.send(error);
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
    //   await request.validate({ schema: Updatevalidations });
      const post = await Post.findOrFail(params.id);
      const userData = request.only([ 
        'blood_group',
        'location',
        'time',
        'message',
      ]);
      const updateData= post.merge(userData);
      await updateData.save();
      return response.send(updateData);
    } catch (error) {
      return response.send(error);
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await post.delete();
      return response.send('user is deleted');
    } catch (error) {
      return response.send({ error: 'User not found or delete failed.' });
    }
  }
}
