from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from datetime import datetime



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
# people
role_list = ["Jordan", "Charlie", "Principal Vega"]
# Conversation
@app.get("/conversation")
def read_root(character_number, text):
    global background
    global role_list
    character = role_list[int(character_number)]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=background+[
            {"role": "user", "content": f"Now you are {character}, Alex said {text} to you"}
        ],  
        stream=True
    )
    for i in response:
        print(i.choices[0].delta.content, end="", flush=True)

    # return response

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

