import RPi.GPIO as GPIO
import serial
import time
import datetime
import ctypes
import threading

from binascii import unhexlify

from helpers.command_helper import CommandHelper
from helpers.redis_queue import RedisQueue

GPIO.setmode(GPIO.BCM)

DEFAULT_COMMAND = '01 04 00 00 00 46 71 F8'
DEFAULT_COMMAND2 = '01 04 80 00 00 23 98 13'

class SerialWorker:
    def __init__(self, config):
        self.trigger = False
        self.config = config
        self.result_queue = RedisQueue(self.config.UP_QUEUE_NAME)
        self.command_queue = RedisQueue(self.config.DOWN_QUEUE_NAME)
        self.port = serial.Serial("/dev/ttyS0", 9600, parity = serial.PARITY_NONE, stopbits = serial.STOPBITS_ONE, bytesize = serial.EIGHTBITS, timeout = Config.SERIAL_WAIT)
        self.run()
    
    def run(self):
        while True:
            self.executeTask()
            time.sleep(self.config.SERIAL_CYC)

    def executeTask(self):
        GPIO.output(self.config.EN_485,GPIO.HIGH)

        command = self.command_queue.get_nowait()
        if not command:
            self.trigger = not self.trigger
            if self.trigger:
                command = DEFAULT_COMMAND
            else:
                command = DEFAULT_COMMAND2
        
        print 'write to 485 %s...' % command[0:10]

        command = CommandHelper.toWriteable( command )
        self.port.write(command)

        while self.port.out_waiting > 0:
            time.sleep(0.01)

        GPIO.output(self.config.EN_485,GPIO.LOW)
        result = self.port.readall()

        if result:
            result = CommandHelper.toReadable(result)
            print 'receive from 485 %s...' % result[0:10]
            self.result_queue.put(result)

if __name__ == "__main__":
    SerialWorker()
    print 'serial worker weak up at %s' % datetime.date.today()
    
