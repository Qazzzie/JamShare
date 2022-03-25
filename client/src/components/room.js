import React, { useEffect, useState, useRef } from 'react';
import {
  initiateSocket,
  switchRooms,
  disconnectSocket,
  joinChatRoom,
  sendMessage,
  loadInitialChat,
  setSocketName,
} from './Socket';

function Room() {
  const rooms = ['Room 1', 'Room 2', 'Room 3'];
  const [room, setRoom] = useState(rooms[0]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('tempName');
  const [chat, setChat] = useState([]);
  const prevRoomRef = useRef();
  const messageBoxRef = useRef();

  useEffect(() => {
    prevRoomRef.current = room;
  });
  const prevRoom = prevRoomRef.current;

  useEffect(() => {
    setChat([]);
    if (prevRoom && room) {
      switchRooms(prevRoom, room);
    } else if (room) {
      let newName = prompt('Enter Username, can be changed later');
      do {
        if (username === 'tempName') {
          setUsername(newName);
        }
      } while (username === null || username === '');
      initiateSocket(username, room);

      loadInitialChat((err, data) => {
        if (err) {
          console.error('Error on loadInitialChat', err);
          return;
        }
        if (data) {
          setChat(data);
          handleReceieMessage();
        }
      });
    }
  }, [room]);

  useEffect(() => {
    joinChatRoom((err, data) => {
      if (err) {
        return;
      }
      setChat((oldChats) => [data, ...oldChats]);
      handleReceieMessage();
    });
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleReceieMessage = () => {
    try {
      if (messageBoxRef && messageBoxRef.current) {
        messageBoxRef.current.scrollTop =
          messageBoxRef.current.scrollHeight + 200;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Room: {room}</h1>
      {rooms.map((r, i) => (
        <button onClick={() => setRoom(r)} key={i}>
          {r}
        </button>
      ))}
      <h1>Online Chat:</h1>
      <input
        type='text'
        name='username'
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setUsername(username);
          setSocketName(username);
        }}>
        Set
      </button>
      <br></br>
      <input
        type='text'
        name='message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={() => {
          let newMsg = `${username}: ${message}`;
          setChat((oldChats) => [newMsg, ...oldChats]);
          sendMessage(room, message, username);
        }}>
        Send
      </button>
      {chat && chat.map((m, i) => <p key={i}>{m}</p>)}
    </div>
  );
}
export default Room;
