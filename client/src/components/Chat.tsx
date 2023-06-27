import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Chat.css';
import io from 'socket.io-client';

interface Message {
  content: string;
  sender: string;
  recipient: string;
  createdAt: Date;
}

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  function formatDate(date: Date): string {
    const dateString = date?.toString();
    const day = `${dateString.substring(8, 10)}/${dateString.substring(5, 7)}`
    const hour = `${new Date(date).getHours()}:${dateString.substring(14, 16)}`

    return ` ${day} at ${hour}`;
  }

  const socket = io('http://localhost:3002');
  socket.on('update', (data: Message) => {
    axios.get('http://localhost:3002/messages')
      .then((response) => {
        console.log('Message sent successfully!', response.data);
        setChatMessages(response.data)
      })
      .catch(error => {
        console.error('Error sending message:', error);
        // Aquí puedes manejar el error de envío de mensaje
      })

  });

  useEffect(() => {
    axios.get('http://localhost:3002/messages')
      .then((response) => {
        console.log('Message sent successfully!', response.data);
        setChatMessages(response.data)
      })
      .catch(error => {
        console.error('Error sending message:', error);
        // Aquí puedes manejar el error de envío de mensaje
      })


  }, []);




  return (
    <div className='messagesContainer'>
      {
        chatMessages?.map(message => (
          <div className='chatBubble'>
            <p className='date'>{formatDate(message.createdAt)}</p>
            <p className='interlocutors'><span>From:</span> {message.sender}</p>
            <p className='interlocutors'><span>To:</span> {message.recipient}</p>
            <br />
            <p className='message'>{message.content}</p>




          </div>
        ))
      }
    </div>
  );
};

export default Chat

