import json
import os
from dotenv import load_dotenv

import time
import mysql.connector
import requests

load_dotenv()
conn = mysql.connector.connect(
    host="127.0.0.1",
    user="admin",
    password="admin",
    database="moviedb",
    port=3307
)

TMDB_API_KEY = os.environ.get("TMDB_API_KEY")


# update all image url for each movie id

cursor = conn.cursor()

cursor.execute(
"""
SELECT id FROM movies 
ORDER BY id
"""
)
results = cursor.fetchall()




def get_movie_data(imdb_id):
    tmdb_api_url = f"https://api.themoviedb.org/3/find/{imdb_id}?api_key={TMDB_API_KEY}&external_source=imdb_id"
    resp = requests.get(tmdb_api_url)
    resp.raise_for_status()
    return resp.json()


start = 0

if os.path.exists("save.txt"):
    with open("save.txt", "r") as f:
        try:
            start = int(f.read())
        except:
            print("something went wrong")



poster_data = []
no_data = 0
processed = 0

with open("tmdb_data.json", "a") as f:
    # for i, result in enumerate(results):
    for i in range(start, len(results)):
        processed += 1
        imdb_id = results[i][0]
        print(f"** Processed {processed}")
        print(f"** No Data {no_data}")
        print(imdb_id)
        try:
            data = get_movie_data(imdb_id)
            if data["movie_results"]:
                poster_data.append(data)
            else:
                no_data += 1
            print(data)

            entry = {
                imdb_id: data
            }
            
            f.write(f"{json.dumps(entry)}\n")
            with open("save.txt", "w+") as save_file:
                save_file.write(str(i))

            if i % 100 == 0:
                time.sleep(2)
            else:
                time.sleep(0.05)

            print("current index", i)
        except Exception as e:
            print(e)
            print(f"Failed on movie {i} with id {imdb_id}")
            
            








