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
GPIO.setup(4, GPIO.OUT)
GPIO.output(4, GPIO.HIGH)

test_response = '02 04 8c 40 34 ff ff ff ff 00 42 01 00 16 05 00 01 01 38 21 73 20 62 53 43 41 36 30 4b 54 4c 2d 44 4f 2f 55 53 2d 34 38 30 00 00 00 5c 10 00 00 00 08 32 00 0d 02 47 01 86 00 0b 04 a6 00 07 00 07 13 5c 13 4d 13 4e 00 13 00 13 00 15 18 56 00 05 03 6b 00 00 03 8a 00 00 02 58 01 b1 01 54 00 00 10 00 20 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 ff ff ff ff ff ff ff ff ff ff 08 07 00 00 0c e4 00 28 00 0c 05 2d'

class ReceiveWorker:
    def __init__(self):
        self.port = serial.Serial(
            "/dev/ttyS0", 
            9600,
            parity = serial.PARITY_NONE,
            stopbits = serial.STOPBITS_ONE,
            bytesize = serial.EIGHTBITS,
            timeout = 2
        )
        self.run()
    
    def run(self):
        print 'Receive Worker Run'
        while True:
            GPIO.output(4,GPIO.LOW)
            result = self.port.readall()
            if result:
                result = CommandHelper.toReadable(result)
                print 'receive from 485 %s...' % result[0:10]
                GPIO.output(4,GPIO.HIGH)
                print 'write to 485 %s...' % test_response[0:10]
                command = CommandHelper.toWriteable( test_response )
                self.port.write(command)
                max_write_wait = 5
                while self.port.out_waiting > 0:
                    time.sleep(0.01)
                    max_write_wait = max_write_wait - 0.01

if __name__ == "__main__":
    ReceiveWorker()
    print 'receive worker weak up at %s' % datetime.date.today()
    
