from typing import Union

from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from openai import OpenAI
from datetime import datetime
from fastapi.responses import HTMLResponse
import json

with open("openai.key","r") as f:
    key = f.read()

with open("background.txt","r") as f:
    background_text = f.read()
client = OpenAI(api_key=key)

app = FastAPI()

# Story
background =[
        {"role": "user", "content":background_text}
    ]
story_process = []

# people
role_list = ["Jordan", "Charlie", "Principal Vega", "Sabat", "Tibaru", "Ou Tsi-Ming", "Goh Hiuh"]
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

    character = role_list[int(character_number)]

    global story_process

    total_story_process = '.'.join(story_process)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=background+[
            {"role": "user", "content": f"Now you are {character}. The previous conversation is {total_story_process}. Now, Alex said {text} to you"}
        ],  
        stream=True
    )

    story_process.append("Alex said {text} to {character}")

    for i in response:
        print(i.choices[0].delta.content, end="", flush=True)
        await websocket.send_text(f"{i.choices[0].delta.content}")
        await asyncio.sleep(0)
    # return response
    story_process.append("{character} said {response.choices[0].message.content} to Alex ")

# Get user inform: time
@app.get("/time")
def read_time():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    
    return current_time

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
            var ws = new WebSocket("ws://127.0.0.1:8000/conversation");
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


@app.get("/web")
async def get():
    return HTMLResponse(html)