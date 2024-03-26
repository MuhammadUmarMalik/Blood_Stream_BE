import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
// import Donation from './Donation';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public phone_number: string;

  @column()
  public name: string;

  @column()
  public gender: string;

  @column()
  public blood_group: string;

 
  @column()
  public address: string;

  @column()
  public city: string;
 
  @column()
  public user_status: Boolean;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public donationCount:number;
  @column()
  public profile_picture: string;
  @column()
  public lastDonationDate:Date;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
  // @beforeSave()
  // public static async hashPassword(user: User) {
  //   try {
  //     if (user.$dirty.password) {
  //       user.password = await Hash.make(user.password);
  //     }
  //   } catch (error) {
  //     console.error('Error hashing password:', error);
  //     throw new Error('Failed to hash password');
  //   }
  // }
  
  public async verifyPassword(plainTextPassword: string): Promise<boolean> {
    return Hash.verify(this.password, plainTextPassword)
  }
  //relationship between migrations

  @manyToMany(() => User, {
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "donor_id",
  })
  public donation: ManyToMany<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
