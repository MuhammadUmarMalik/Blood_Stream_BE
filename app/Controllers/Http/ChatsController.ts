import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'

export default class ChatController {
  public async getMessages({ request, response }: HttpContextContract) {
    const { senderId, receiverId } = request.qs()

    const messages = await Chat.query()
      .where('sender_id', senderId)
      .andWhere('receiver_id', receiverId)
      .orWhere('sender_id', receiverId)
      .andWhere('receiver_id', senderId)
      .orderBy('created_at', 'asc')

    return response.json(messages)
  }
}
