from typing import Union

from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from openai import OpenAI
from datetime import datetime
from fastapi.responses import HTMLResponse
import json
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
with open("openai.key","r") as f:
    key = f.read()

with open("background.txt","r") as f:
    background_text = f.read()
client = OpenAI(api_key=key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Story
background =[
        {"role": "system", "content":background_text}
    ]
story_process = []

# people    
role_list = ["Lisa", "Charlie", "Principal Vega", "Sabat", "Tibaru", "Ou Tsi-Ming", "Goh Hiuh","System"]
# Conversation
import time, asyncio
@app.websocket("/conversation")
async def websocket_endpoint(websocket: WebSocket):
    global background
    global role_list
    await websocket.accept()

    data = await websocket.receive_text()
    # for i in range(10):
    #     await websocket.send_text(data)
    #     time.sleep(1)
    #     await asyncio.sleep(0) #https://stackoverflow.com/questions/72851320/websocket-messages-appears-at-once-rather-than-individual-messages
    character_number, text = json.loads(data)
    print(data)
    character = role_list[int(character_number)]

    global story_process


    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=background+story_process+[
            {"role": "user", "content": f"Now you are {character}. Now, Alex said {text} to you, you should response."}
        ],  
        stream=True
    )

    story_process.append({"role":"user","content":f"{text}"})
    msg = ""
    for i in response:
        print(i.choices[0].delta.content, end="", flush=True)
        msg += f"{i.choices[0].delta.content}"
        await websocket.send_text(f"{i.choices[0].delta.content}")
        await asyncio.sleep(0.1)
    # return response
    story_process.append({"role":"assistant","content":f"{msg}"})
    print(story_process)

# Get user inform: time
@app.get("/time")
def read_time():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    
    return current_time

@app.post("/clearChat")
def read_time():
    global story_process
    story_process = []
# Score change
current_score = 0.0

@app.get("/score_change")
def change_score(score_change:float): 
    global initial_score
    current_score += score_change
    
    return current_score

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://file.weasoft.com:8000/conversation");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                console.log(event.data)
                messages.innerText+=event.data
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

app.mount("/", StaticFiles(directory="dist"), name="dist")

@app.get("/history")
def history():
    return story_process

async def not_found(request, exc):
    with open("dist/index.html","r") as f:
        html = f.read()
    return HTMLResponse(content=html, status_code=exc.status_code)


exceptions = {
    404: not_found,
}

app = FastAPI(exception_handlers=exceptions)
