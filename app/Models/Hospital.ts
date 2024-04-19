import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hospital extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public address:string
  @column()
  public latitude:number
  @column()
  public longitude:number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
