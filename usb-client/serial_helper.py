import sys
import glob
import serial

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

def serial_write(port_name, baud_rate, message):
    COM_Port = serial.Serial(port=port_name, baudrate=baud_rate, timeout=3)
    COM_Port.bytesize = 8                  # Number of data bits = 8
    COM_Port.parity   = 'N'                # No parity
    COM_Port.stopbits = 1                  # Number of Stop bits = 1
    COM_Port.setDTR(0) #DTR=0,~DTR=1 so DE = 1,Transmit mode enabled
    COM_Port.setRTS(0) #RTS=0,~RTS=1 (In FT232 RTS and DTR pins are inverted)
    data = bytearray(message)
    NumBytes  = COM_Port.write(data)
    COM_Port.close()
    return serial_read(port_name, baud_rate)

def serial_read(port_name, baud_rate):
    COM_Port = serial.Serial(port=port_name, baudrate=baud_rate, timeout=3)
    COM_Port.bytesize = 8                  # Number of data bits = 8
    COM_Port.parity   = 'N'                # No parity
    COM_Port.stopbits = 1                  # Number of Stop bits = 1
    COM_Port.setRTS(1) #RTS=1,~RTS=0 so ~RE=0,Receive mode enabled for MAX485
    COM_Port.setDTR(1) #DTR=1,~DTR=0 so  DE=0,(In FT232 RTS and DTR pins are inverted)
                       #~RE and DE LED's on USB2SERIAL board will be off
    RxedData = COM_Port.readline()
    COM_Port.close()                       # Close the Serial port
    return RxedData


if __name__ == '__main__':
    print('serial ports: %s' % serial_ports())

