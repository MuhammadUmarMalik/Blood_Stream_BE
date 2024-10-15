import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User"; // Make sure to import User model

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public blood_group: string;

  @column()
  public location: string;

  @column()
  public time: number;

  @column()
  public message: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // Define the belongsTo relationship with User
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
