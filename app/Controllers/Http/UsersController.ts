import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import { Createvalidations,Updatevalidations } from 'App/Validators/UserValidator';
import Hash from '@ioc:Adonis/Core/Hash'
import axios from 'axios';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UserController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
      return response.send(users);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }

  public async getUsersWithinRadius({ response, selectedHospital, blood_group }) {
    try {
      // Retrieve the coordinates of the selected hospital from its address using OpenStreetMap
      const nominatimResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: selectedHospital,
          format: 'json',
        },
      });
  
      if (!nominatimResponse.data || nominatimResponse.data.length === 0) {
        return response.status(404).send({ error: 'Hospital location not found.' });
      }
  
      const { lat, lon } = nominatimResponse.data[0];
  
      // Create a circular boundary around the hospital with a radius of 3km
      const radius = 3; // in kilometers
      const boundary = `ST_Buffer(ST_GeomFromText('POINT(${lon} ${lat})'), ${radius * 1000})`;
      console.log(boundary)
      // Query the database for users within the boundary and with the specified blood group
      const users = await Database.query()
        .select('*')
        .from('users')
        .whereRaw(`ST_Within(location, ${boundary})`)
        .where('blood_group', blood_group)
        .where('user_status', 'active')
        console.log('user---------->',users)
        if (users.length === 0) {
          return response.status(404).send({ message: 'No users found within 3km radius.' });
        }
      return response.ok(users);
    } catch (error) {
      console.error('error------>',error);
      return response.status(500).send({ error: 'An error occurred while searching for users.' });
    }
  }

  
  public async show({ request, response }: HttpContextContract) {
   
    const { selectedHospital, blood_group } = request.qs();
  await this.getUsersWithinRadius({ response, selectedHospital, blood_group });
  console.log(await this.getUsersWithinRadius({ response, selectedHospital, blood_group }))
  }
// store the new user data in db
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: Createvalidations });
      const userData = request.only([
        'name',
        'geneder',
        'blood_group',
        'phone_number',
        'address',
        'city',
        'last_donation_date',
        'password',
        'user_status',
        'donation_count',
        'latitude',
        'longitude'
      ]);

         // Call the Nominatim API to convert address to coordinates
    const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: userData.address,
        format: 'json',
        limit: 1
      }
    });
    // console.log('nominatimResponse----------',nominatimResponse)

    // Extract latitude and longitude from the Nominatim response
    const { lat, lon } = nominatimResponse.data[0];

    // Add latitude and longitude to the user data 03185888962
    userData.latitude=lat;
    userData.longitude=lon;
    
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
        'geneder',
        'blood_group',
        'phone_number',
        'address',
        'city',
        'last_donation_date',
        'password',
        'user_status',
        'donation_count'
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
