import React, {
  useMemo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const peerContext = React.createContext(null);

export const usePeer = () => React.useContext(peerContext);

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(() => {
    // Return the RTCPeerConnection instance
    return new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    });
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };
  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
  };
  const sendMedia = async (media) => {
    const tracks = media.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, media);
    }
  };
  const handleRemoteStream = useCallback((e) => {
    const med = e.streams;
    setRemoteStream(med[0]);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleRemoteStream);
  }, [handleRemoteStream, peer]);

  return (
    <peerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendMedia,
        remoteStream,
      }}
    >
      {props.children}
    </peerContext.Provider>
  );
};
