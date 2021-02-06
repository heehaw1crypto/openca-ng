#!/bin/bash

# start(){
#         source /workspace/start.sh "$1"
# }

cd /workspace

case "$1" in
    gateway)
        echo "gateway"
        pm2 delete all
        yarn install
        yarn run pm2

        sleep 5 # wait for backend service to hook up

        yarn test
        ;;
    reinit)
        echo "Not implemented"
        ;;
    frontend)
        echo "Not implemented"
        ;;
    *)
esac




