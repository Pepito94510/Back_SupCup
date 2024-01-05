# Back_SupCup

# Prerequisite: 
- Docker
- Docker-compose

## For run the project
```
docker-compose up  
or 
docker-compose up -d
```

## Differents ports
### Application
```
http://localhost:5001
```

### API DOCS
```
http://localhost:5001/api-docs/
```

### PhpMyAdmin
```
http://localhost:8081
```
Get the credentials into the docker-compose.yml file.
```
MYSQL_USER
and 
MYSQL_PASSWORD
```
### MySQL
```
http://localhost:6033
```


### Tips requests
Get fav sports from id_user
```
SELECT * 
FROM USER u
LEFT JOIN FAV_SPORT f
ON u.id = f.id_user
LEFT JOIN SPORT s
ON f.id_sport = s.id;
```

Get fav teams from id_user
```
SELECT * 
FROM USER u
LEFT JOIN FAV_EQUIPE f
ON u.id = f.id_user
LEFT JOIN EQUIPE e
ON f.id_equipe = e.id;
```