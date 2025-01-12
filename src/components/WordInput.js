import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import from React Router
import socket from '../socket';
import { v4 as uuidv4 } from 'uuid';
import './WordInput.css'; // External stylesheet

const WordInput = () => {
  const navigate = useNavigate(); // For programmatic navigation

  // =======================
  //  USER & AUTH CHECK
  // =======================
  // Keep a custom playerId in localStorage
  const [playerId] = useState(() => {
    const savedPlayerId = localStorage.getItem('playerId');
    if (savedPlayerId) return savedPlayerId;
    const newId = uuidv4();
    localStorage.setItem('playerId', newId);
    return newId;
  });

  // NEW: Also keep a playerName in localStorage
  const [playerName] = useState(() => {
    // This must be set during login or guest flow
    // If none found, we store an empty string
    return localStorage.getItem('playerName') || '';
  });

  // On mount, if user doesn’t have a name or ID, we redirect them to /login
  useEffect(() => {
    if (!playerId || !playerName) {
      navigate('/login');
    }
  }, [playerId, playerName, navigate]);

  // =======================
  //  ROOM & SOCKET STATES
  // =======================
  const [availableRooms, setAvailableRooms] = useState([]);
  const [players, setPlayers] = useState([]);

  // Host modal states
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [modalRoomName, setModalRoomName] = useState('');
  const [modalPassword, setModalPassword] = useState('');

  // Join modal states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalRoomName, setJoinModalRoomName] = useState('');
  const [joinModalPassword, setJoinModalPassword] = useState('');

  // =======================
  //  SOCKET CONNECTION
  // =======================
  // On connect, send the server our playerId
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('register_playerId', playerId);
    });
  }, [playerId]);

  // Request room list & set up listeners
  useEffect(() => {
    socket.emit('get_rooms');

    socket.on('update_rooms', (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on('player_joined', (playersList) => {
      setPlayers(playersList);
    });

    socket.on('player_left', (playersList) => {
      setPlayers(playersList);
    });

    socket.on('room_error', (message) => {
      alert(message);
    });

    // Listen for "join_room_success" => navigate to /game/:roomName
    socket.on('join_room_success', ({ roomName }) => {
      navigate(`/game/${roomName}`);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('update_rooms');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('room_error');
      socket.off('join_room_success');
    };
  }, [navigate]);

  // =======================
  // HOST ROOM LOGIC
  // =======================
  const hostRoom = () => {
    if (modalRoomName && modalPassword) {
      socket.emit('host_room', {
        roomName: modalRoomName,
        password: modalPassword,
        playerId: playerId,
      });

      // Optionally store these in localStorage
      localStorage.setItem('roomName', modalRoomName);
      localStorage.setItem('roomPassword', modalPassword);

      // Close modal and reset fields
      setIsHostModalOpen(false);
      setModalRoomName('');
      setModalPassword('');
    }
  };

  // ======================
  // JOIN ROOM LOGIC
  // ======================
  const openJoinModal = (roomName) => {
    // Show the join modal for the selected room
    setJoinModalRoomName(roomName);
    setJoinModalPassword('');
    setIsJoinModalOpen(true);
  };

  const handleJoinRoom = () => {
    if (joinModalRoomName && joinModalPassword) {
      socket.emit('join_room', {
        roomName: joinModalRoomName,
        password: joinModalPassword,
        playerId: playerId,
      });

      // Optionally store them
      localStorage.setItem('roomName', joinModalRoomName);
      localStorage.setItem('roomPassword', joinModalPassword);

      // Close the join modal (navigation occurs on 'join_room_success')
      setIsJoinModalOpen(false);
    }
  };

  // =======================
  // RENDER
  // =======================
  return (
    <div className="word-input-container">
      {/* Greeting the user by name */}
      <h2>Welcome, {playerName}! Let's play our City, Country, River Game 🌍</h2>

      {/* Button that opens the Host Room modal */}
      <button className="btn host-room-button" onClick={() => setIsHostModalOpen(true)}>
        Host a Room
      </button>

      {/* HOST ROOM MODAL */}
      {isHostModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create a New Room</h3>
            <input
              className="modal-input"
              type="text"
              placeholder="Room Name"
              value={modalRoomName}
              onChange={(e) => setModalRoomName(e.target.value)}
            />
            <input
              className="modal-input"
              type="password"
              placeholder="Password"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn" onClick={hostRoom}>
                Create
              </button>
              <button className="btn" onClick={() => setIsHostModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOIN ROOM MODAL */}
      {isJoinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Join Room: {joinModalRoomName}</h3>
            <input
              className="modal-input"
              type="password"
              placeholder="Enter Password"
              value={joinModalPassword}
              onChange={(e) => setJoinModalPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn" onClick={handleJoinRoom}>
                Join
              </button>
              <button className="btn" onClick={() => setIsJoinModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3>Available Rooms</h3>
      <ul className="room-list">
        {availableRooms.map((room, index) => (
          <li key={index} className="room-list-item">
            {room.name} ({room.player_count} players)
            <button className="btn join-room-button" onClick={() => openJoinModal(room.name)}>
              Join
            </button>
          </li>
        ))}
      </ul>

      <h3>Players in Room:</h3>
      <ul className="player-list">
        {players.map((player) => (
          <li key={player} className="player-list-item">
            {player}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordInput;
