#!/bin/bash


# Get all the scripts
# executing all of them

curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/0-init.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/1-schema.sql
curl https://raw.githubusercontent.com/anmho/cs122b-data/main/movie-data.txt -o 2-movie-data.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/3-movie-price.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/4-num-starred-in.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/6-extend-id-length.sql
curl https://github.com/anmho/cs122b-data/raw/main/5-employees.sql -o 5-employees.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/6-extend-id-length.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/7-stored-procedure.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/8-add-indexes.sql
curl https://github.com/UCI-Chenli-teaching/cs122b-s24-team-420/raw/main/fabflix/db/9-full-text-search.sql


mysql -u admin -p < 0-init.sql
mysql -u admin -p < 1-schema.sql
mysql -u admin -p < 3-movie-price.sql
mysql -u admin -p < 4-num-starred-in.sql
mysql -u admin -p < 6-extend-id-length.sql
mysql -u admin -p < 6-extend-id-length.sql
mysql -u admin -p < 7-stored-procedure.sql
mysql -u admin -p < 8-add-indexes.sql
mysql -u admin -p < 9-full-text-search.sql