import axios from "axios";
import { useState } from "react";

export default function App() {
  

  // fetch("http://192.168.2.198:80/machine/status")
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error("Error:", error));

  const openPage = async()=>{
    window.location.href = 'http://192.168.2.191:80/';
  };

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

  const proxyUrl = "http://localhost:5000/by-pass-api";

  const fetchData = async () => {
    try {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "http://192.168.2.198:80/machine/status" }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const websocketConnect = async()=>{
    const socket = new WebSocket('ws://192.168.2.198:80/');
    socket.onopen = function () {
      console.log("Connected to Duet Web Server");
      socket.send("/machine/status"); // Send G-code command
  };
  
  socket.onmessage = function (event) {
      console.log("Received:", event.data);
  };
  
  socket.onerror = function (error) {
      console.error("WebSocket Error:", error);
  };
  };
  const [jsonData, setJsonData] = useState(null);
  const ConnectPrinter = async () => {
    try {
      // Replace with your API endpoint
      // const selectedFile = './pLeftgOutput.gcode';
      // const result = await fetch(selectedFile); // Adjust filename if needed
      // const text = await result.text();
      // setFileContent(text);
      
      // debugger
      // const response = await axios.put('http://192.168.2.198:80/machine/file/gcodes/testfzh.gcode', {content: text});
      // const response = await axios.put('http://192.168.2.198:80/tsoles/queue?filename=0:/gcodes/', {content: text});
      const response = await axios.get('http://192.168.2.198:80/machine/status');
      setJsonData(JSON.stringify(response.data, null, 2));
      console.log(response);

      // Handle successful response
      // setData(response.data); // Assuming the API returns JSON data
      // setLoading(false);
    } catch (err) {
      // Handle errors
      // setError(err);
      // setLoading(false);
    }
  };
  
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Serial Port Reader (PWA)</h1>
      {/* <button onClick={connectSerial}>Connect to Serial Port</button> */}
      {/* <button onClick={openPage}>Open page</button> */}
      <button onClick={ConnectPrinter}>Connect to 3D printer</button>
      {/* <p>Data: {data}</p> */}
      <textarea rows = '20' cols='50' value={jsonData || ''} readOnly style={{ marginTop: '10px' }}></textarea>
    </div>
  );
}
