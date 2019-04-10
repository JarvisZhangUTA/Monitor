import sys
import time
import ctypes
import thread
import uuid
import requests 
import json

from config.config import Config
from test.serial_worker import SerialWorker
from workers.socket_worker import SocketWorker

response = requests.post(url = '%s/api/monitors/signin' % Config.HTTP_HOST, json = {'monitor_id': Config.ID, 'mac': uuid.getnode()})

if response.status_code is not 200:
    print response.text
    exit()

response = json.loads(response.text)

if 'token' in response.keys():
    Config.TOKEN = response['token']
if 'config' in response.keys():
    if 'COMMANDS' in response['config'].keys() and len(response['config']['COMMANDS']) > 0:
        Config.COMMANDS = response['config']['COMMANDS']
    if 'BAUD_RATE' in response['config'].keys():
        Config.BAUD_RATE = response['config']['BAUD_RATE']
    if 'SERIAL_CYC' in response['config'].keys():
        Config.SERIAL_CYC = response['config']['SERIAL_CYC']
    if 'SERIAL_WAIT' in response['config'].keys():
        Config.SERIAL_WAIT = response['config']['SERIAL_WAIT']

thread1 = thread.start_new_thread( SerialWorker, (Config, ) )
thread2 = thread.start_new_thread( SocketWorker, (Config, ) )

while True:
    try:
        _ = 1
    except KeyboardInterrupt:
        thread1.exit()
        thread2.exit()