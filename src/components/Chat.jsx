import { useState, useContext } from 'react';

import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { AppContext } from '../App';

const Chat = () => {
  const { users } = useContext(AppContext);
  const [activeChatID, setActiveChatID] = useState(null);

  if (!users.length) return <div>Loading...</div>;

  return (
    <div className="w-full flex">
      <UserList active={activeChatID} setActive={setActiveChatID} />
      {activeChatID && <ChatWindow active={activeChatID} />}
    </div>
  );
};

export default Chat;
