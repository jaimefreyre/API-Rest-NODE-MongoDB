API REST HTTP Node - MONGODB 

Deployment procedure
1. Download repository
2. RUN npm install
3. Config .env, access database, example, Mongo Atlas integrated
4. RUN npm run dev


Warning
The projects connected to MongoDB Atlas have filters by blacklist ip, so it is recommended to test configure it from .ENV to your own database

INFO
Each of the entities in the database are assigned the different HTTP verbs, for tasks of registration, modification, filtering and elimination.

/auth (Verbose : GET- POST- PATCH, DELETE)
/api/users (Verbose : GET- POST- PATCH, DELETE)
/api/actors' (Verbose : GET- POST- PATCH, DELETE)
/api/directors (Verbose : GET- POST- PATCH, DELETE)
/api/peliculas (Verbose : GET- POST- PATCH, DELETE)
/api/episodios (Verbose : GET- POST- PATCH, DELETE)
/api/series (Verbose : GET- POST- PATCH, DELETE)

Episodes organized in a Join by season and api series/episodios/episodiosxseriesytemporada
In the different files of the router folder all endpoints are loaded, organized by entity and function

