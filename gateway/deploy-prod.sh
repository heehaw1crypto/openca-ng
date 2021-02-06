#!/bin/bash

# load backend envs
echo "loading .local"
source ./.local

# get unix timestamp
TIMESTAMP=$(date +%s)

# update repos
repos=(
    db-service
)

for i in "${repos[@]}"
do
    cd $i
    echo "updating $i"
    git checkout master
    git pull origin master
    for k in {0..9}
    do
        if test -e data/alters-$k-prod.sql
            then
            echo "upating db from alters-$k-prod.sql"
            mysql -u$DB_USER -p$DB_PASSWORD -P$DB_PORT -h$DB_HOST < data/alters-$k-prod.sql
            mv data/alters-$k-prod.sql data/alters-archive-$TIMESTAMP-$k-prod.sql
            if test -e data/alters-$k-undo.sql
                then
                mv data/alters-$k-undo.sql data/alters-archive-$TIMESTAMP-$k-undo.sql
            fi
            git add .
            git commit -m "update db via alters-$k-prod.sql and change name to alters-archive-$TIMESTAMP-$k-prod.sql"
            git push origin master
        fi
    done
    cd ..
done

# spin down docker
docker-compose -f docker-compose-deploy.yml down

# rebuild containers
docker-compose -f docker-compose-deploy.yml build

# spin docker back up
docker-compose -f docker-compose-deploy.yml up -d 
