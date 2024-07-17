import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hospital extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public Address:string
  @column()
  public Latitude:number
  @column()
  public Longitude:number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
