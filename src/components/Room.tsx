import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userName = params.get('name') || '';
    setName(userName);

    const newSocket = io('http://localhost:3001');
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
  }, [location, roomId]);

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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
      <p className="mb-4">Welcome, {name}!</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <button
            key={card}
            onClick={() => selectCard(card)}
            className={`p-4 text-xl font-bold rounded-md ${
              selectedCard === card
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {card}
          </button>
        ))}
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Users in Room:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}: {revealed ? user.vote || 'No vote' : user.vote ? 'Voted' : 'Not voted'}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={revealVotes}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Reveal Votes
        </button>
        <button
          onClick={resetVotes}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Reset Votes
        </button>
      </div>
    </div>
  );
}

export default Room;
