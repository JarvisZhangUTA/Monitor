import sys
import glob
import serial
import time

from command_helper import CommandHelper

class SerialHelper:

    def connect(self, port_name, baud_rate):
        self.COM_Port = serial.Serial(port=port_name, baudrate=baud_rate, timeout=0)
        self.COM_Port.bytesize = 8                  # Number of data bits = 8
        self.COM_Port.parity   = 'N'                # No parity
        self.COM_Port.stopbits = 1                  # Number of Stop bits = 1

    def serial_write(self, message):
        print 'Serial write message %s' % message
        message = CommandHelper.toWriteable(message)

        self.COM_Port.setDTR(0) #DTR=0,~DTR=1 so DE = 1,Transmit mode enabled
        self.COM_Port.setRTS(0) #RTS=0,~RTS=1 (In FT232 RTS and DTR pins are inverted)

        NumBytes  = self.COM_Port.write(message)

        return self.serial_read()
    
    def serial_read(self):
        self.COM_Port.setRTS(1) #RTS=1,~RTS=0 so ~RE=0,Receive mode enabled for MAX485
        self.COM_Port.setDTR(1) #DTR=1,~DTR=0 so  DE=0,(In FT232 RTS and DTR pins are inverted)
                        #~RE and DE LED's on USB2SERIAL board will be off

        WaitTime = 5
        RxedData = self.COM_Port.read(1)
        while not RxedData and WaitTime > 0:
            time.sleep(0.01)
            WaitTime = WaitTime - 0.01
            RxedData = self.COM_Port.read(1)
        
        AppendData = self.COM_Port.read(1)
        while AppendData:
            time.sleep(0.01)
            RxedData = RxedData + AppendData
            AppendData = self.COM_Port.read(1)
        
        RxedData = CommandHelper.toReadable(RxedData)
        return RxedData

    @staticmethod
    def serial_ports():
        """ Lists serial port names

            :raises EnvironmentError:
                On unsupported or unknown platforms
            :returns:
                A list of the serial ports available on the system
        """
        if sys.platform.startswith('win'):
            ports = ['COM%s' % (i + 1) for i in range(256)]
        elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
            # this excludes your current terminal "/dev/tty"
            ports = glob.glob('/dev/tty[A-Za-z]*')
        elif sys.platform.startswith('darwin'):
            ports = glob.glob('/dev/tty.*')
        else:
            raise EnvironmentError('Unsupported platform')

        result = []
        for port in ports:
            try:
                s = serial.Serial(port)
                s.close()
                result.append(port)
            except (OSError, serial.SerialException):
                pass
        return result
