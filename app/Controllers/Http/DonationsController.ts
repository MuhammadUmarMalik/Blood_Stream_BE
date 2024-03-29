import Donation from "App/Models/Donation";
import User from "App/Models/User";
export default class DonationController {
  // get all the donations
  public async index({ response }) {
    try {
      const users = await Donation.all();
      console.log('users--------->',users)
      return response.send(users);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }
  //store the new donation
  public async create({ request, response,params}) {
    try {
      const { user_id, donor_id ,} = request.all();
      const accept =params.accept= true;
      if(accept){
        
        const donation = new Donation();
        donation.user_id = user_id;
        donation.donor_id = donor_id;
        
        await donation.save();
         // Update user records based on donor_id
         const user = await User.findBy('id', donor_id);
         if (user) {
           // Update donation count
           user.donation_count = user.donation_count ? user.donation_count + 1 : 1;
           // Update last donation date
           user.last_donation_date = new Date();
           // Update user status, you need to define the logic for this
           user.user_status = "Disable"; // For example, assuming status needs to be set as 'active'
           await user.save();
           return response.send('Donor accepted your request. User records updated successfully.',user);}
        response.send('donor accept your request',donation,);
        
      }
      else{
        response.send('donor does not reject your request.');
      }
     
    } catch (error) {
      console.error(error);
      return response.send(error);
    }
  }
  

}
