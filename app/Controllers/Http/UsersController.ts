import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { Createvalidations,Updatevalidations } from 'App/Validators/UserValidator';
import Hash from '@ioc:Adonis/Core/Hash'

export default class UserController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
      return response.send(users);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      // const user = await User.find(params.blood_group);
      const user= await User.query().from('users').where('blood_group',params.blood_group)
      // console.log("user-======>",user)
      return response.send(user);
    } catch (error) {
      console.log(error)
      return response.send({error});
    }
  }
// store the new user data in db
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const userData = request.only([
        'name',
        'blood_group',
        'phone_number',
        'address',
        'city',
        'enable_request',
        'donation_date',
        'password'
      ]);
      console.log('user------->',request)
      const user = await User.create(userData);
      return response.created(user);
    } catch (error) {
      return response.send(error);
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Updatevalidations });
      const user = await User.findOrFail(params.id);
      const userData = request.only([ 
        'name',
        'email',
        'gender',
        'blood_group',
        'phone_number',
        'address',
        'city',
        'enable_request',
        
      ]);
      const updateData= user.merge(userData);
      await updateData.save();
      return response.send(updateData);
    } catch (error) {
      return response.send(error);
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id);
      await user.delete();
      return response.send('user is deleted');
    } catch (error) {
      return response.send({ error: 'User not found or delete failed.' });
    }
  }
  // login function
    public async login({ request, response, auth }: HttpContextContract) {
      const phone_number = request.input('phone_number')
      const password = request.input('password')
  
      try {
        // Find the user by phone number
        const user = await User.findBy('phone_number', phone_number)
        console.log('users--------',user)
        // Check if user exists and verify password
        if (!user || !(await Hash.verify(user.password, password))) {
          return response.status(401).json({ message: 'Invalid credentials' })
        }
  
        // Generate JWT token
        const token = await auth.use('api').attempt(phone_number, password, {
          expiresIn: '5 days',
        })
  
        // Send token in response
        return response.send(token)
      } catch (error) {
        // Handle errors
        console.error('Login error:', error.message)
        return response.status(500).json({ error: { message: 'Internal server error' } })
      }
    }
    //   logout function
    public async logout({ auth, response }: HttpContextContract) {
      await auth.logout()
      return response.status(200)
    }
}
