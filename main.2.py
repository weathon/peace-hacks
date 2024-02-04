from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/add")
def add(a, b):
    return a+b

#conversation
#get user info: time, score, etc
#list NPCs
#get the room senen 
#generate image
