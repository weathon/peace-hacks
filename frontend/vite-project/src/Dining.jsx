import { BlurFilter, EventSystem, Matrix } from 'pixi.js';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Dining = (props) => {
    const blurFilter = useMemo(() => new BlurFilter(4), []);
    const [background, setBGI] = useState("/dining.png")
    const [x, setX] = useState(0)
    const [y, setY] = useState(432)
    const [hidden, setHidden] = useState("visable");
    const [conversation, setConversation] = useState("")
    const [newToken, setNewToken] = useState("")
    const [systemMsg, setSystemMsg] = useState("")
    const conversationDid = useRef(false)
    const typing = useRef(false)
    const res = useRef(null)
    const talkTo = useRef(null);

    useEffect(() => {
        setConversation(conversation + newToken)
        var textarea = document.getElementById('area');
        textarea.scrollTop = textarea.scrollHeight;
    }, [newToken])
    const send = (e) => {
        setConversation(conversation + "\nAlex: " + res.current.value + "\n")
        var textarea = document.getElementById('area');
        textarea.scrollTop = textarea.scrollHeight;
        var ws = new WebSocket("ws://127.0.0.1:8000/conversation");
        ws.onopen = () => ws.send(`[${talkTo.current}, "${res.current.value}"]`);
        ws.onmessage = function (event) {
            res.current.value = ""

            console.log(event.data)
            if (event.data != "None") {
                setNewToken(event.data)
            }
        };
    }
    const checkKeyPress = useCallback((e) => {
        const { key, keyCode } = e;
        if (typing.current) return
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
        // else if (key === "c") {
        //   setHidden(hidden == "visible" ? "hidden" : "visible")
        //   console.log(hidden)
        // }
        console.log(x, y)
        if (Math.max(Math.abs(x - 0), Math.abs(y - 612)) <= 40) {
            props.setCUrrentRoom("map")
        }
        if (Math.max(Math.abs(x - 300), Math.abs(y - 300)) <= 100 & !conversationDid.current) {
            conversationDid.current = true;
            var ws = new WebSocket("ws://127.0.0.1:8000/conversation");
            ws.onopen = () => ws.send('[6, "Hi"]');
            talkTo.current = 6;

            ws.onmessage = function (event) {
                console.log(event.data)
                if (event.data != "None") {
                    setNewToken(event.data)
                }
            };
        }
        if (Math.max(Math.abs(x + 110), Math.abs(y - 500)) <= 100 & !conversationDid.current) {
            conversationDid.current = true;
            var ws = new WebSocket("ws://127.0.0.1:8000/conversation");
            ws.onopen = () => ws.send('[1, "Hi"]');
            talkTo.current = 1;

            ws.onmessage = function (event) {
                console.log(event.data)
                if (event.data != "None") {
                    setNewToken(event.data)
                }
            };
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

                <div style={{ transform: `translate(300px, 300px)`, textAlign: "center" }}>
                    <b style={{ color: "black" }}>Goh Hiuh</b><br />
                    <img style={{ height: "100px" }} src="/Goh.png" />
                </div>

                <div style={{ transform: `translate(-110px, 500px)`, textAlign: "center" }}>
                    <b style={{ color: "black" }}>Charlie</b><br />
                    <img style={{ height: "100px" }} src="/Charlie.png" />
                </div>
                <div style={{ transform: `translate(${x}px, ${y}px)`, textAlign: "center" }}>
                    <b>Alex</b><br /> <img style={{ width: "50px", height: "100px" }} src="/alex_sad.png" /></div>
            </div>
            <div style={{ visibility: hidden, top: "50px", left: "1100px", position: "absolute" }}>
                <div style={{ height: "512px", width: "1024px", background: 'url("/popup.jpg")', backgroundSize: "contain", backgroundRepeat: "no-repeat" }}>
                    {/* <p style={{ padding: "80px", color: "black" }}>
              {conversation}
            </p> */}
                    <Form.Control as="textarea" id="area" value={conversation} style={{ color: "black", fontSize: "30px", background: "white", position: "absolute", top: "60px", left: "60px", height: "370px", width: "647px" }}></Form.Control>
                </div>

                <Form.Control type="text" ref={res} style={{ width: "780px" }} placeholder="Enter Your Response And..." onFocus={() => { typing.current = true }} onBlur={() => { typing.current = false }}></Form.Control>
                <Button style={{ width: "780px" }} onClick={send}>Send</Button>
                <h2 style={{ width: "780px" }}>{systemMsg}</h2>
            </div>
        </>
    );
};

export default Dining