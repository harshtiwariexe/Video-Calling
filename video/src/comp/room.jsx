import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../util/socket";
import { usePeer } from "../util/peer";
import ReactPlayer from "react-player";

function Room() {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendMedia,
    remoteStream,
  } = usePeer() || {};
  const [myMedia, setMyMedia] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState();
  //   const [remoteMedia, setRemoteMedia] = useState(null);

  const getUserMediaStream = useCallback(async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyMedia(media);
  }, []);

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log(`Incoming call from ${from}`);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmail(from);
    },
    [socket, createAnswer]
  );

  const handleNewUser = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("new user joined", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmail(emailId);
    },
    [socket, createOffer]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("call got accepted", ans);
      await setRemoteAns(ans);
      //   sendMedia(myMedia);
    },
    [setRemoteAns]
  );
  const handleNegotiation = useCallback(() => {
    const localOffer = peer.localDescription;
    socket.emit("call-user", { emailId: remoteEmail, offer: localOffer });
  }, [peer.localDescription, remoteEmail, socket]);

  useEffect(() => {
    socket.on("user-joined", handleNewUser);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
  }, [socket, handleNewUser, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
  }, [peer, handleNegotiation]);

  useEffect(() => {
    getUserMediaStream();
  }, []);

  return (
    <>
      <h1>{`you are connected to ${remoteEmail}`}</h1>
      <button onClick={(e) => sendMedia(myMedia)}>Send</button>
      <ReactPlayer url={myMedia} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </>
  );
}

export default Room;
