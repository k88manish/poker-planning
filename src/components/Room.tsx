import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

type Card = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '?';

interface User {
  id: string;
  name: string;
  vote: Card | null;
}

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [name, setName] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const cards: Card[] = ['0', '1', '2', '3', '5', '8', '13', '21', '?'];
  const navigate = useNavigate();

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userName = params.get('name') || localStorage.getItem('userName') || '';
    
    if (!userName) {
      navigate(`/join/${roomId}`);
      return;
    }

    setName(userName);
    localStorage.setItem('userName', userName);

    const newSocket = io(socketUrl);
    setSocket(newSocket);

    if (roomId) {
      newSocket.emit('join-room', { roomId, name: userName });
    }

    newSocket.on('update-users', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    newSocket.on('votes-revealed', () => {
      setRevealed(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [location, roomId, navigate]);

  const selectCard = (card: Card) => {
    setSelectedCard(card);
    socket?.emit('vote', { roomId, vote: card });
  };

  const revealVotes = () => {
    socket?.emit('reveal-votes', roomId);
  };

  const resetVotes = () => {
    socket?.emit('reset-votes', roomId);
    setSelectedCard(null);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
          Room: {roomId}
        </h2>
        <p className="text-center mb-8 text-xl">Welcome, {name}!</p>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Select Your Card</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {cards.map((card) => (
              <button
                key={card}
                onClick={() => selectCard(card)}
                className={`p-4 text-xl font-bold rounded-md transition duration-300 ease-in-out ${
                  selectedCard === card
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white transform scale-105'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                {card}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Users in Room</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between bg-white bg-opacity-20 rounded-md p-3">
                <span>{user.name}</span>
                <span className="font-semibold">
                  {revealed ? user.vote || 'No vote' : user.vote ? 'Voted' : 'Not voted'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={revealVotes}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-md hover:from-green-500 hover:to-blue-600 transition duration-300 ease-in-out"
          >
            Reveal Votes
          </button>
          <button
            onClick={resetVotes}
            className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-md hover:from-red-500 hover:to-pink-600 transition duration-300 ease-in-out"
          >
            Reset Votes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
