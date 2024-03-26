import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { Createvalidations,Updatevalidations } from 'App/Validators/UserValidator';
import Hash from '@ioc:Adonis/Core/Hash'
// import { DateTime } from 'luxon';
import axios from 'axios';


export default class UserController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
      return response.send(users);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }

  public async show({ request, response }: HttpContextContract) {
    // try {
    //   // const user = await User.find(params.blood_group);
    //   const user= await User.query().from('users').where('blood_group',params.blood_group)
    //   console.log("user-======>",user)
    //   return response.send(user);
    // } catch (error) {
    //   console.log(error)
    //   return response.send({error});
    // }
    try {
      const { location, bloodGroup } = request.only(['location', 'bloodGroup']);

      // Convert location text to latitude and longitude using Nominatim API
      const locationResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: location,
          format: 'json',
          limit: 1,
        },
      });

      if (locationResponse.data.length === 0) {
        return response.status(404).json({ error: 'Location not found' });
      }

      const { lat, lon } = locationResponse.data[0];

      // Query users within 3km radius using Overpass API
      const overpassResponse = await axios.get('https://lz4.overpass-api.de/api/interpreter', {
        params: {
          data: `[out:json];
                  (
                    node(around:${lat},${lon},3000)["blood_group"="${bloodGroup}"];
                    way(around:${lat},${lon},3000)["blood_group"="${bloodGroup}"];
                    rel(around:${lat},${lon},3000)["blood_group"="${bloodGroup}"];
                  );
                  out;`,
        },
      });

      const users = overpassResponse.data.elements.map(element => ({
        id: element.id,
        latitude: element.lat,
        longitude: element.lon,
        bloodGroup: element.tags.blood_group,
      }));

      return response.json(users);
    } catch (error) {
      console.error('Error occurred while finding users:', error);
      return response.status(500).json({ error: 'Internal server error' });
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
        'donation_date',
        'password',
        'user_status',
      ]);
      
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
