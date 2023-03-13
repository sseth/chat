const Messages = ({ activeChat }) => {
  if (!activeChat.messages || !activeChat.messages.length) return (
    <div>
      No messages
    </div>
  );

  return (
    <div className="mt-5 w-[88%]">
      {activeChat.messages.map((msg) => (
        <div
          key={msg.id}
          className={`ml-5 ${msg.fromSelf ? 'text-right' : 'text-left'}`}
        >
          <div className="font-bold">
            {msg.fromSelf ? '(you)' : activeChat.name}
          </div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
