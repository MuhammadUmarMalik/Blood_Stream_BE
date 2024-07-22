// // start/socket.ts
// import Ws from 'App/Services/Ws'

// Ws.boot()


// Ws.io.on('connection', (socket) => {
//   console.log('Client connected to chat channel:', socket.id)

  
//   socket.emit('news', { hello: 'Umar' })

  
//   socket.on('my other event', (data) => {
//     console.log('Received from my other event:', data)
//   })

  
//   socket.on('message', (data) => {
//     console.log('Received message:', data)
//     Ws.io.emit('message', data)
//   })

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id)
//   })
// })

// export default Ws

import Ws from 'App/Services/Ws'
import Chat from 'App/Models/Chat'
import Inbox from 'App/Models/Inbox'

Ws.boot()

const connectedUsers = new Map()

Ws.io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Store the connected user with their socket ID
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id)
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`)
  })

  socket.on('message', async (data) => {
    console.log('Received message:', data)

    // // Validate the data before saving
    // if (!data.senderId || !data.msg) {
    //   console.error('Invalid message data:', data)
    //   return
    // }

    try {
      // Save the message to the database
      const chat = await Chat.create({
        senderId: data.senderId,
        msg: data.msg,
        file: data.file || null,
        meta: data.meta || null,
        deletedUserId: null
      })

      // Update the inbox for the receiver
      let inbox = await Inbox.query()
        .where('user_id', data.receiverId)
        .andWhere('sender_id', data.senderId)
        .first()

      if (!inbox) {
        inbox = await Inbox.create({
          userId: data.receiverId,
          senderId: data.senderId,
          lastMsg: data.msg,
          seen: false,
          deleted: false,
          unSeenNumbers: 1
        })
      } else {
        inbox.lastMsg = data.msg
        inbox.unSeenNumbers += 1
        await inbox.save()
      }

      // Emit the message to the receiver if connected
      const receiverSocketId = connectedUsers.get(data.receiverId)
      if (receiverSocketId) {
        Ws.io.to(receiverSocketId).emit('message', chat)
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    // Remove the user from the connected users map
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key)
        console.log(`User unregistered: ${key} with socket ID: ${socket.id}`)
      }
    })
  })
})

export default Ws
