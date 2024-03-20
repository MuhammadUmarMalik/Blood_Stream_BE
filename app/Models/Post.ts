import { DateTime } from 'luxon'
import { BaseModel,hasMany,HasMany,column } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public blood_group:string
  @column()
  public location:string
  @column()
  public time:number
  @column()
  public message:string
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
