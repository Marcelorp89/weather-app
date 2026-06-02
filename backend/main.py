
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://weather-app-jade-six-59.vercel.app/"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")

@app.get("/clima/{ciudad}")
def obtener_clima(ciudad: str):
    url= f"https://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={API_KEY}&units=metric&lang=es"
    respuesta = requests.get(url)
    datos = respuesta.json()


    temp = round(datos["main"]["temp"])
    descripcion = datos["weather"][0]["description"]
    humedad = datos["main"]["humidity"]
    viento = datos["wind"]["speed"]

    #Logica de la ropa segun temporada

    if temp >= 25:
        ropa = "Polera y shorts. El cielo invita a poco"
    elif temp >= 15:
        ropa = "Jeans y casaca. Fresco, pero manejable"
    elif temp >= 5:
        ropa = "Chaqueta y bufanda. El viento ya se nota"
    else:
        ropa = "Parka, gorro y guantes. No salgas sin todo"

    return{
        "ciudad": ciudad,
        "temperatura": temp,
        "descripcion": descripcion,
        "humedad": humedad,
        "viento": viento,
        "ropa": ropa
    }