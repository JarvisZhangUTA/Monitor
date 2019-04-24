#! /bin/sh -e
exec 2> /home/lijian/Code/RS485Python/logs/rc.local.log 
exec 1>&2
set -x

while ! nc -z 127.0.0.1 6379; do   
  sleep 0.1
  echo "waiting for redis ..."
done

while ! echo exit | nc 206.189.166.192 3000; do 
  sleep 10
done

echo 'config set stop-writes-on-bgsave-error no' | redis-cli

# ps aux | grep -ie nohup | awk '{print $2}' | xargs kill -9

exec nohup /usr/bin/python2.7 -u /home/lijian/Monitor/gateway/src/main.py > /home/lijian/log 2>&1 &

echo "exit"

exit 0
