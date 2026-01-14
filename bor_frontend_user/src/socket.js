import { io } from "socket.io-client";

// A backend portja (8080 vagy 3000 a www fájlod alapján)
const socket = io("http://localhost:8080", {
  withCredentials: true,
  autoConnect: false
});

export default socket;