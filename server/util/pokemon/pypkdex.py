import json
import os
import pypokedex
import time

os.chdir(r"C:\Users\thefl\OneDrive\Desktop\PokemonOnline\server\data\pokedex") 

with open('pokedex.json',"r",encoding='utf-8') as f:
  pokedex = json.load(f)

for pokemon in pokedex:
  if pokedex[pokemon]["id"] < 100:
    if "experienceYield" in pokedex[pokemon]:
      print("Skipping " + pokedex[pokemon]["id"])
      continue
    pokedex[pokemon]["experienceYield"] = pypokedex.get(dex = pokedex[pokemon]["id"]).base_experience

with open('pokedex.json', 'w') as outfile:
  json.dump(pokedex, outfile)