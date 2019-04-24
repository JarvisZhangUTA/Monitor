import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QListWidgetItem
from ui import Ui_MainWindow
from serial_helper import SerialHelper
from command_helper import CommandHelper
from config import config

class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None):
        super(MainWindow, self).__init__(parent)
        self.setupUi(self)
        self.initContent()
        self.initEvent()
        self.serial_helper = None
    
    def initContent(self):
        print 'init content'
        # Badu Rate
        self.BaduRateLineEdit.setText('9600')
        # Com Ports
        available_ports = SerialHelper.serial_ports()
        self.ComPortComboBox.addItems(available_ports)
        # commands
        for key, value in config.commands.items():
            item = QListWidgetItem(key)
            item.setData(1, value)
            self.CommandListView.addItem(item)
        # Invertors
        for addr in range(1, 33):
            self.InvertorComboBox.addItem('%02d' % addr)

    def initEvent(self):
        print 'init event'
        self.TestConnectionButton.clicked.connect(self.testConnection)
        self.CommandListView.currentItemChanged.connect(self.commandSelect)
        self.SendButton.clicked.connect(self.sendCommand)

    def testConnection(self):
        print 'test connection'
        badu_rate = self.BaduRateLineEdit.text()
        com_port = self.ComPortComboBox.currentText()

        if not badu_rate or not com_port:
            self.Statusbar.showMessage('Badu Rate and Com port needed')
        
        serial_helper = SerialHelper()
        serial_helper.connect(com_port, badu_rate)

        connected = False

        for addr in range(1, 2):
            command = '%02d0400000046' % addr
            crc = CommandHelper.crc16(CommandHelper.toWriteable(command))
            write_result = serial_helper.serial_write('%s%s' % (command, crc))
            if write_result:
                self.Statusbar.showMessage('Find Invertor %02d' % addr)
                self.serial_helper = serial_helper
                connected = True
        
        if connected:
            self.MessageListView.addItem(QListWidgetItem('Connection Success'))
        else:
            self.MessageListView.addItem(QListWidgetItem('Connection Fail'))
    
    def commandSelect(self, item):
        data = item.data(1)
        self.CommandLineEdit.setText(data)
    
    def sendCommand(self):
        if not self.serial_helper:
            return self.Statusbar.showMessage('No Connection, test connection first')
        addr = self.InvertorComboBox.currentText()
        if not addr:
            return self.Statusbar.showMessage('No Invertor Selected')
        command = self.CommandLineEdit.text()
        if not command:
            return self.Statusbar.showMessage('Command Required')
        crc = CommandHelper.crc16(CommandHelper.toWriteable('%s%s' % (addr, command)))

        final_command = '%s%s%s' % (addr, command, crc)
        write_result = self.serial_helper.serial_write(final_command)

        self.MessageListView.addItem(QListWidgetItem('Write: %s' % final_command))

        if write_result:
            self.MessageListView.addItem(QListWidgetItem('Received: %s' % write_result))
        else:
            self.MessageListView.addItem(QListWidgetItem('No Message Received'))


# python -m PyQt5.uic.pyuic -x ui.ui -o ui.py
if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
