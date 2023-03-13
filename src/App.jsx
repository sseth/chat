import { useEffect, useState, createContext } from 'react';

import socket from './socket';
import Chat from './components/Chat';
import SelectUser from './components/SelectUser';

const AppContext = createContext(null);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  const compareUsers = (a, b) => {
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;

    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  };

  const logIn = (username) => {
    setLoggedIn(true);
    socket.auth = { username };
    socket.connect();
  };

  socket.on('users', (userList) => {
    userList = userList.map((user) => ({
      ...user,
      connected: true,
      isCurrentUser: user.id === socket.id,
      messages: [],
      hasNewMessages: false,
    }));
    setUsers(userList.sort(compareUsers));
  });

  socket.on('connect', () => {
    setUsers(
      users.map((u) => (u.isCurrentUser ? { ...u, connected: true } : u))
    );
  });

  socket.on('user_connected', (newUser) => {
    setUsers(
      [
        ...users,
        {
          ...newUser,
          connected: true,
          isCurrentUser: false,
          messages: [],
          hasNewMessages: false,
        },
      ].sort(compareUsers)
    );
  });

  socket.on('disconnect', () => {
    setUsers(
      users.map((u) => (u.isCurrentUser ? { ...u, connected: false } : u))
    );
  });

  socket.on('user_disconnected', (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, connected: false } : u)));
  });

  socket.on('message', ({ id, content, from }) => {
    const message = { id, content, fromSelf: false };
    setUsers(
      users.map((u) =>
        from === u.id
          ? { ...u, hasNewMessages: true, messages: [...u.messages, message] }
          : u
      )
    );
  });

  socket.on('connect_error', (err) => {
    if (err.message === 'invalid username') {
      console.error(err.message);
    }
  });

  useEffect(() => {
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users');
      socket.off('user_connected');
      socket.off('user_disconnected');
      socket.off('message');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className="w-screen h-screen">
      <AppContext.Provider value={{ users, setUsers }}>
        {loggedIn ? <Chat /> : <SelectUser logIn={logIn} />}
      </AppContext.Provider>
    </div>
  );
}

export { AppContext };
