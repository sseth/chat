import { useContext } from 'react';
import { AppContext } from '../App';

const UserList = ({ active, setActive }) => {
  const { users, setUsers } = useContext(AppContext);

  const openChat = (user) => {
    setActive(user.id);
    if (user.hasNewMessages)
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, hasNewMessages: false } : u
        )
      );
  };

  return (
    <div className="bg-[#3f0e40] text-white h-screen w-[250px] min-w-[100px]">
      <div id="users">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => openChat(user)}
            className={`flex justify-between py-2 pl-2 ${
              user.id === active ? 'bg-blue-500' : ''
            }`}
          >
            <div>
              <div>{`${user.name}${user.isCurrentUser ? ' (you)' : ''}`}</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded mr-2 bg-${user.connected ? 'green-500' : 'red-500'}`}></div>
                <div className="text-gray-400">{user.connected ? 'online' : 'offline'}</div>
              </div>
            </div>
            <div
              className={`self-center mr-5 bg-red-500 w-6 rounded-sm text-center ${
                !user.hasNewMessages ? 'hidden' : ''
              }`}
            >
              !
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
