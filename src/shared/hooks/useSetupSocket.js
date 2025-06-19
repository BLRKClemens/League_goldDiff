import { useEffect } from "react";
export function useSetupSocket(socket) {
  useEffect(() => {
    const connectAndAddListeners = () => {
      socket.connect();
    };
    connectAndAddListeners();
    return () => socket.disconnect();
  }, []);
}
