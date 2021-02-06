#!/bin/zsh
touch .local

mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD < ./src/services/db-service/data/data-model.sql

echo "start(){ 
        source /workspace/start.sh \"\$1\"
}" >> ~/.bashrc

yarn install

yarn run load-data

. ~/.bashrc


