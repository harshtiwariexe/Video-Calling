import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./comp/homepage";
import Room from "./comp/room";
import SocketP from "./util/socket";
import { PeerProvider } from "./util/peer";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <SocketP>
          <PeerProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Routes>
          </PeerProvider>
        </SocketP>
      </BrowserRouter>
    </>
  );
}
