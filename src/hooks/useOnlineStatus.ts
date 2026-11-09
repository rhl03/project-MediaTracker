import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

/** Tells TanStack Query when the phone goes online or offline. */
export function useOnlineStatus(): void {
  useEffect(() => {
    onlineManager.setEventListener(setOnline =>
      NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      }),
    );
  }, []);
}
