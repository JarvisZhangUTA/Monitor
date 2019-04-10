import websocket
import thread
import time
import ctypes
import datetime
import json

from helpers.redis_queue import RedisQueue

websocket.enableTrace(False)

class SocketWorker:
    def __init__(self, config):
        self.config = config
        self.command_queue = RedisQueue(self.config.DOWN_QUEUE_NAME)
        self.result_queue = RedisQueue(self.config.UP_QUEUE_NAME)
        self.run()

    def run(self):
        print 'Socket Worker Run'
        self.socket = websocket.WebSocketApp( 
            self.config.SOCKET_HOST, 
            on_open = self.on_open,
            on_message = self.on_message,
            on_error = self.on_error,
            on_close = self.on_close
        )

        while True:
            try:
                self.socket.run_forever(ping_interval=100)
            except:
                pass
            time.sleep(5)

    def on_open(self):
        print 'socket connected'
        self.socket.send(json.dumps({'type':'verify','data':'device', 'token': self.config.TOKEN}))
        thread.start_new_thread(self.start, ())

    def on_error(self, error):
        print 'socket error %s' % error


    def on_message(self, message):
        print 'socket get message %s' % message
        try:
            message = json.loads(message)
            self.handle_message(message)
        except Exception as e:
            print e
            print 'message parse fail'

    def handle_message(self, message):
        if message['type'] == 'message':
            self.command_queue.put(message['data'])
        elif message['type'] == 'unverified':
            self.socket.send(json.dumps({'type':'verify','data':'device', 'token': self.config.TOKEN}))

    def on_close(self):
        print 'socket close'
    
    def start(self):
        while True:
            self.execTask()
            time.sleep(0.5)
    
    def execTask(self):
        result = self.result_queue.get_nowait()
        if result:
            print 'socket send result %s...' % result[0:10]
            self.socket.send(json.dumps({'type':'response','response':result}))
    
    def getSerial(self):
        cpuserial = "0000000000000000"
        try:
            f = open('/proc/cpuinfo','r')
            for line in f:
                if line[0:6]=='Serial':
                    cpuserial = line[10:26]
            f.close()
        except:
            cpuserial = "ERROR000000000"

        return cpuserial
        

if __name__ == "__main__":
    SocketWorker()
    print 'socket worker weak up at %s' % datetime.date.today()
    