import { useEffect, useState } from 'react';
import axios from 'axios';
import './Chat.css';
import io from 'socket.io-client';

interface Message {
  content: string;
  sender: string;
  recipient: string;
  fecha: Date;
}

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  function callMessages(): void {
    axios.get<Message[]>('http://localhost:3002/messages')
      .then((response) => {
        console.log('Messages loaded successfully!', response.data);
        setChatMessages(response.data);
      })
      .catch(error => {
        console.error('Error loading messages:', error);
        // Handle the error
      });
  }

  function formatDate(date: Date): string {
    const dateString = date?.toString();
    const day = `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`;
    const hour = `${new Date(date).getHours()}:${dateString.substring(14, 16)}`;
    return ` ${day} at ${hour}`;
  }

  const socket = io('http://localhost:3002');

  socket.on('connect', () => console.log('Bidirectional real-time communication established'));

  socket.on('update', (data: Message) => {
    // Here 'data' is the received message, and you can handle it as needed.
    console.log('Received update:', data);
    callMessages(); // Update the message list with new data
  });

  useEffect(() => {
    callMessages();
  }, []);

  return (
    <div className='messagesContainer'>
      {chatMessages?.map(message => (
        <div className='chatBubble' key={message.fecha.toString()}>
          <p className='date'>{formatDate(message.fecha)}</p>
          <p className='interlocutors'><span>From:</span> {message.sender}</p>
          <p className='interlocutors'><span>To:</span> {message.recipient}</p>
          <br />
          <p className='message'>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
