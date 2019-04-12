import time
import datetime
import ctypes
import threading

from binascii import unhexlify

from helpers.command_helper import CommandHelper
from helpers.redis_queue import RedisQueue

class SerialWorker:
    def __init__(self, config):
        self.name = 'SerialWorker'
        self.config = config
        self.result_queue = RedisQueue(self.config.UP_QUEUE_NAME)
        self.command_queue = RedisQueue(self.config.DOWN_QUEUE_NAME)
        self.run()
    
    def run(self):
        print 'Serial Worker Fake Run'
        command_index = 0
        while True:
            command = self.command_queue.get_nowait()
            if not command and len(self.config.COMMANDS) > 0:
                command_index = command_index % len(self.config.COMMANDS)
                command = self.config.COMMANDS[command_index]
                command_index = command_index + 1
            if command:
                self.executeTask(command)
            time.sleep(self.config.SERIAL_CYC)

    def executeTask(self, command):
        print 'write to 485 %s...' % command[0:10]
        result = '02 04 8c 40 34 ff ff ff ff 00 42 01 00 16 05 00 01 01 38 21 73 20 62 53 43 41 36 30 4b 54 4c 2d 44 4f 2f 55 53 2d 34 38 30 00 00 00 5c 10 00 00 00 08 32 00 0d 02 47 01 86 00 0b 04 a6 00 07 00 07 13 5c 13 4d 13 4e 00 13 00 13 00 15 18 56 00 05 03 6b 00 00 03 8a 00 00 02 58 01 b1 01 54 00 00 10 00 20 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 ff ff ff ff ff ff ff ff ff ff 08 07 00 00 0c e4 00 28 00 0c 05 2d'
        if result:
            print 'receive from 485 %s...' % result[0:10]
            self.result_queue.put(result)

if __name__ == "__main__":
    SerialWorker()
    print 'serial worker weak up at %s' % datetime.date.today()
    
