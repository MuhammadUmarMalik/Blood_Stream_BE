import Donation from "App/Models/Donation";
export default class DonationController {
  // get all the donations
  public async index({ response }) {
    try {
      const users = await Donation.all();
      return response.send(users);
    } catch (error) {
      return response.send({ error: 'An error occurred while fetching users.' });
    }
  }
  //store the new donation
  public async create({ request, response,params}) {
    try {
      const { user_id, donor_id } = request.all();
      const accept =params.accept= true
      if(accept){
        
        const donation = new Donation();
        donation.user_id = user_id;
        donation.donor_id = donor_id;
        await donation.save();
        response.send('donor accept your request',donation);
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
