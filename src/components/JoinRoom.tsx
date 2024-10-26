import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JoinRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/room/${roomId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Join Room</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-md hover:from-yellow-500 hover:to-pink-600 transition duration-300 ease-in-out"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
