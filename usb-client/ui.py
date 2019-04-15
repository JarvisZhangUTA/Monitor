# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'ui.ui'
#
# Created by: PyQt5 UI code generator 5.10.1
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(640, 516)
        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.MessageListView = QtWidgets.QListWidget(self.centralwidget)
        self.MessageListView.setGeometry(QtCore.QRect(10, 40, 471, 421))
        self.MessageListView.setFlow(QtWidgets.QListView.LeftToRight)
        self.MessageListView.setProperty("isWrapping", True)
        self.MessageListView.setWordWrap(True)
        self.MessageListView.setObjectName("MessageListView")
        self.horizontalLayoutWidget = QtWidgets.QWidget(self.centralwidget)
        self.horizontalLayoutWidget.setGeometry(QtCore.QRect(10, 0, 471, 38))
        self.horizontalLayoutWidget.setObjectName("horizontalLayoutWidget")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalLayoutWidget)
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.BaduRateLineEdit = QtWidgets.QLineEdit(self.horizontalLayoutWidget)
        self.BaduRateLineEdit.setText("")
        self.BaduRateLineEdit.setObjectName("BaduRateLineEdit")
        self.horizontalLayout.addWidget(self.BaduRateLineEdit)
        self.ComPortComboBox = QtWidgets.QComboBox(self.horizontalLayoutWidget)
        self.ComPortComboBox.setObjectName("ComPortComboBox")
        self.horizontalLayout.addWidget(self.ComPortComboBox)
        self.TestConnectionButton = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.TestConnectionButton.setObjectName("TestConnectionButton")
        self.horizontalLayout.addWidget(self.TestConnectionButton)
        self.CommandListView = QtWidgets.QListWidget(self.centralwidget)
        self.CommandListView.setGeometry(QtCore.QRect(490, 41, 141, 421))
        self.CommandListView.setObjectName("CommandListView")
        self.InvertorComboBox = QtWidgets.QComboBox(self.centralwidget)
        self.InvertorComboBox.setGeometry(QtCore.QRect(4, 460, 120, 32))
        self.InvertorComboBox.setObjectName("InvertorComboBox")
        self.CommandLineEdit = QtWidgets.QLineEdit(self.centralwidget)
        self.CommandLineEdit.setGeometry(QtCore.QRect(120, 465, 361, 21))
        self.CommandLineEdit.setObjectName("CommandLineEdit")
        self.SendButton = QtWidgets.QPushButton(self.centralwidget)
        self.SendButton.setGeometry(QtCore.QRect(484, 460, 153, 32))
        self.SendButton.setObjectName("SendButton")
        MainWindow.setCentralWidget(self.centralwidget)
        self.Statusbar = QtWidgets.QStatusBar(MainWindow)
        self.Statusbar.setObjectName("Statusbar")
        MainWindow.setStatusBar(self.Statusbar)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.BaduRateLineEdit.setPlaceholderText(_translate("MainWindow", "BADU RATE"))
        self.TestConnectionButton.setText(_translate("MainWindow", "Test Connection"))
        self.SendButton.setText(_translate("MainWindow", "Send"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())

