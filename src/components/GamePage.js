import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket'; // Adjust if needed

function GamePage() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]); // Will store { name, score } objects

  useEffect(() => {
    // Listen for the full list of players in this room (with name & score)
    socket.on('players_in_room', (playersList) => {
      setPlayers(playersList);
      console.log('Players in room:', playersList);
    });

    // Request the current room's players from the server
    socket.emit('get_room_players', { roomName });

    // Listen for "player_joined" & "player_left" updates from the server
    socket.on('player_joined', (playersList) => {
      setPlayers(playersList);
    });

    socket.on('player_left', (playersList) => {
      setPlayers(playersList);
    });

    // Warn if user refreshes/closes the page
    window.onbeforeunload = (e) => {
      e.preventDefault();
      e.returnValue =
        'If you refresh this page, you will automatically leave the room. Continue?';
    };

    // Cleanup on unmount
    return () => {
      socket.off('players_in_room');
      socket.off('player_joined');
      socket.off('player_left');
      window.onbeforeunload = null;
    };
  }, [roomName]);

  // Leave room on button click
  const handleLeaveRoom = () => {
    const playerId = localStorage.getItem('playerId');
    socket.emit('leave_room', { roomName, playerId });
    navigate('/'); // Go back to main lobby (WordInput)
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Game Page for Room: {roomName}</h2>
      <p>Players in this room:</p>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <tr key={idx}>
              <td>{player.name}</td> {/* Render the 'name' property */}
              <td>{player.score}</td> {/* Render the 'score' property */}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLeaveRoom}>Leave Room</button>
    </div>
  );
}

export default GamePage;
