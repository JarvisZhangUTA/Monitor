import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QListWidgetItem
from ui import Ui_MainWindow
from serial_helper import serial_ports, serial_read, serial_write

class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None):
        super(MainWindow, self).__init__(parent)
        self.setupUi(self)
        self.initContent()
        self.initEvent()
    
    def initContent(self):
        print 'init content'
        # Badu Rate
        self.BaduRateLineEdit.setText('9600')
        # Com Ports
        available_ports = serial_ports()
        self.ComPortComboBox.addItems(available_ports)

    def initEvent(self):
        print 'init event'
        self.TestConnectionButton.clicked.connect(self.testConnection)

    def testConnection(self):
        print 'test connection'
        badu_rate = self.BaduRateLineEdit.text()
        com_port = self.ComPortComboBox.currentText()
        test_command = '01040000004671F8'
        
        if not badu_rate or not com_port:
            self.Statusbar.showMessage('Badu Rate and Com port needed')
        
        write_result = serial_write(com_port, badu_rate, test_command)

        if write_result:
            self.MessageListView.addItem(QListWidgetItem('Test Connection receive: ' + write_result))
        else:
            self.MessageListView.addItem(QListWidgetItem('Test Connection no message received'))
        

# python -m PyQt5.uic.pyuic -x ui.ui -o ui.py
if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
