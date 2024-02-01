import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../util/socket";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const { socket } = useSocket() || {};
  const [emailId, setEmailId] = useState();
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId, roomId });
  };

  return (
    <div>
      <input
        type="Text"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        placeholder="Email"
        id=""
      />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room Id"
        id=""
      />
      <button onClick={handleJoinRoom}>Join</button>
    </div>
  );
}
