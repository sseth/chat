import { v4 as uuid } from 'uuid';
import { useState, useContext } from 'react';

import socket from '../socket';
import Messages from './Messages';
import { AppContext } from '../App';

const ChatWindow = ({ active }) => {
  const [msg, setMsg] = useState('');
  const { users, setUsers } = useContext(AppContext);
  const activeChat = users.find((u) => u.id === active);

  const resetNewMessages = () => {
    if (activeChat.hasNewMessages)
      setUsers(
        users.map((u) =>
          u.id === activeChat.id ? { ...u, hasNewMessages: false } : u
        )
      );
  };

  const sendMessage = () => {
    const id = uuid();
    socket.emit('message', {
      id,
      content: msg,
      to: activeChat.id,
    });
    const message = { id, content: msg, fromSelf: true };
    setUsers(
      users.map((u) =>
        u.id === activeChat.id
          ? { ...u, messages: [...u.messages, message] }
          : u
      )
    );
    setMsg('');
  };

  return activeChat && (
    <div onMouseMove={resetNewMessages} className="w-full">
      <div className="px-7 py-5 flex items-center border-b-[1px]">
        <div className="w-2 h-2 bg-green-500 rounded mr-2"></div>
        <div>{activeChat.name}</div>
      </div>
      <div className="mx-5">
        <Messages activeChat={activeChat} />
        <div className="flex items-center mt-6">
          <textarea
            value={msg}
            placeholder={`Message ${activeChat.name}`}
            onChange={(e) => setMsg(e.target.value)}
            className="rounded border border-black px-2 py-1 resize-none mr-3 w-full"
          />
          <button
            onClick={sendMessage}
            className="border px-1 bg-gray-100 rounded border-gray-400 text-gray-700"
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
