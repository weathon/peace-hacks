import { BlurFilter, EventSystem, Matrix } from 'pixi.js';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';

const App = () => {
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const [background, setBGI] = useState("/lab.png")
  const [x, setX] = useState(0)
  const [y, setY] = useState(512)
  const [hidden, setHidden] = useState("hidden");
  const [conversation, setConversation] = useState("")
  const [newToken, setNewToken] = useState("")
  const conversationInSection = useRef(false)
  useEffect(()=>{
    setConversation(conversation+newToken)
  }, [newToken])
  const checkKeyPress = useCallback((e) => {
    const { key, keyCode } = e;
    if (key === 'w') {
      setY(y - 20)
    }
    else if (key === 's') {
      setY(y + 20)
    }
    else if (key === 'a') {
      setX(x - 20)
    }
    else if (key === 'd') {
      setX(x + 20)
    }
    else if(key === "c")
    {
      setHidden(hidden=="visible" ? "hidden" : "visible")
      console.log(hidden)
    }
    console.log(Math.max(x - 100, y - 100) <= 100)
    if (Math.max(x - 100, y - 100) <= 100 & !conversationInSection.current) {
      setHidden("visible")
      conversationInSection.current = true;
      var ws = new WebSocket("ws://127.0.0.1:8000/conversation");
      ws.onopen = () => ws.send('[1, "hi"]');
      ws.onmessage = function (event) {
        console.log(event.data)
        if(event.data!="None")
        {
          setNewToken(event.data)
        }
        else{
          conversationInSection.current = False
        }
      };
    }
    if (Math.max(x - 100, y - 100) >= 100 & !conversationInSection.current) {
      setHidden("hidden")
    }
  }, [x, y, hidden]);

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, [checkKeyPress]);

  return (
    <>
      <div style={{ background: `url('${background}')`, backgroundRepeat: "no-repeat", width: "1024px", height: "1024px", left: "0px", top: "0px", position: "absolute" }}>
        <div style={{ transform: `translate(100px, 280px)`, textAlign: "center" }}>
          <img style={{ width: "60px", height: "60px" }} src="/npc1.png" />
        </div>
        <div style={{ transform: `translate(${x}px, ${y}px)`, textAlign: "center" }}>
          <b>Alex</b><br /> <img style={{ width: "50px", height: "100px" }} src="/alex_sad.png" /></div>
      </div>
      <div style={{ visibility: hidden, top: "50px", left: "1100px", position: "absolute" }}>
        <div style={{ height: "512px", width: "1024px", background: 'url("/popup.jpg")', backgroundSize: "contain", backgroundRepeat: "no-repeat" }}>
          {/* <p style={{ padding: "80px", color: "black" }}>
            {conversation}
          </p> */}
          <textarea value={conversation} style={{color:"black", fontSize:"30px",background: "white",position:"absolute", top:"60px", left:"60px", height:"376px", width: "647px"}}></textarea>
        </div>
      </div>
    </>
  );
};

export default App;