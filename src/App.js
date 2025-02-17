import { useState } from "react";

export default function App() {
  const [data, setData] = useState("");

  const connectSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        setData((prevData) => prevData + new TextDecoder().decode(value));
      }
    } catch (error) {
      console.error("Serial Port Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Serial Port Reader (PWA)</h1>
      <button onClick={connectSerial}>Connect to Serial Port</button>
      <p>Data: {data}</p>
    </div>
  );
}
