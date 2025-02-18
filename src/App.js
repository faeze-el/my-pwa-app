import axios from "axios";
import { useEffect, useState } from "react";

export default function App() {
  

  // fetch("http://192.168.2.191:80/machine/status")
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


  const [fileContent, setFileContent] = useState("");
  useEffect(() => {
    
    // Define the asynchronous function to fetch data
    const fetchData = async () => {

     
      try {
        // Replace with your API endpoint
        const selectedFile = './pLeftgOutput.gcode';
        const result = await fetch(selectedFile); // Adjust filename if needed
        const text = await result.text();
        setFileContent(text);
        
        // debugger
        const response = await axios.put('http://192.168.2.191:80/machine/file/gcodes/testfzh.gcode', {content: text});
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

    // Call the fetchData function
    fetchData();

    // Optional: Cleanup function (e.g., to cancel the request if the component unmounts)
    return () => {
      //  You can cancel the request here if necessary.
      //  e.g., if using an AbortController
      //  controller.abort(); // If you were using an AbortController
    };
  }, []); // The empty dependency array ensures this effect runs only once (on component mount)

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Serial Port Reader (PWA)</h1>
      {/* <button onClick={connectSerial}>Connect to Serial Port</button> */}
      <button onClick={openPage}>Open page</button>
      <p>Data: {data}</p>
    </div>
  );
}
