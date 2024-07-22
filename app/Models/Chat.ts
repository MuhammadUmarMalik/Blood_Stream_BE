import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public senderId: number

  @column()
  public msg: string

  @column()
  public file: string | null

  @column()
  public meta: string | null

  @column()
  public deletedUserId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  public sender: BelongsTo<typeof User>
}
