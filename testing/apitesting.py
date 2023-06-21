
import json
import requests

AUTH = "http://localhost:8000/auth/"
USERS = json.load(open("users.json", "r"))


def register():

    for user in USERS:


