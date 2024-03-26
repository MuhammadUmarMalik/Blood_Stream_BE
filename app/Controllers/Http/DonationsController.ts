import Donation from "App/Models/Donation";
// import User from "App/Models/User";
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
         // Update donor's donation count in the users table
        //  const id= donor_id;
         
        //  const donor = await User.findOrFail(id);
        //   // Increment donation count
        //   donor.donationCount +=1;
        //  donor.lastDonationDate=new Date();
        //  donor.user_status=false;
        //  donor.merge(request.only(donor.donationCount,donor.lastDonationDate,donor.user_status)).save();
        //  console.log(donor.save());
        // donor.save();
        // await Database.from('users').where('id',donor_id).update({ User.donationCount, lastDonationDate,user_status });
        // await User.query().where('id',donor_id).update({donationCount:'donationCount+1'})

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
