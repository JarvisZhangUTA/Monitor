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

class SerialWorker:
    def __init__(self, config):
        self.config = config
        self.result_queue = RedisQueue(self.config.UP_QUEUE_NAME)
        self.command_queue = RedisQueue(self.config.DOWN_QUEUE_NAME)
        self.port = serial.Serial(
            "/dev/ttyS0", 
            self.config.BAUD_RATE,
            parity = serial.PARITY_NONE,
            stopbits = serial.STOPBITS_ONE,
            bytesize = serial.EIGHTBITS,
            timeout = self.config.SERIAL_WAIT
        )
        self.run()
    
    def run(self):
        print 'Serial Worker Run'
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
        GPIO.output(self.config.EN_485,GPIO.HIGH)
        
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
    
