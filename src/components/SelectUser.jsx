import { useState, useRef, useEffect } from 'react';

const SelectUser = ({ logIn }) => {
  const [username, setUsername] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    if (!username) return;
    console.log(username);
    logIn(username);
  };

  const enterToSubmit = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="relative top-1/3 flex justify-center">
      <input
        type="text"
        ref={inputRef}
        value={username}
        placeholder="Username"
        onChange={handleChange}
        onKeyDown={enterToSubmit}
        className="border border-gray-400 rounded mr-3 px-1"
      />
      <button
        onClick={handleSubmit}
        className="border px-1 bg-gray-100 rounded border-gray-400 text-gray-700"
      >
        submit
      </button>
    </div>
  );
};

export default SelectUser;
