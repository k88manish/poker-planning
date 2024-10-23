import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  const joinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Planning Poker</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        className="px-4 py-2 border rounded-md mb-4 w-64"
      />
      <div className="flex space-x-4 mb-4">
        <button
          onClick={createRoom}
          disabled={!name}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Create Room
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
            className="px-4 py-2 border rounded-md w-48 mr-2"
          />
          <button
            onClick={joinRoom}
            disabled={!name || !roomId}
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-300"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
