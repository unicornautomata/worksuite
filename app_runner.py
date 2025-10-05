import sys 
import subprocess
import psutil
import json
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QPushButton, QButtonGroup,
    QTableWidget, QTableWidgetItem, QHBoxLayout, QFileDialog, QRadioButton,
    QLineEdit, QDialog, QDialogButtonBox, QLabel, QTextEdit, QSplitter,
    QToolBar, QMainWindow, QToolButton, QTabWidget, QComboBox, QMessageBox
)
from PyQt6.QtCore import QThread, pyqtSignal, Qt
from PyQt6.QtGui import QFont
from PyQt6.QtGui import QTextCursor, QTextCharFormat, QColor

class ProcessWorker(QThread):
    output = pyqtSignal(str)
    started_process = pyqtSignal(int)
    finished_process = pyqtSignal(int)

    def __init__(self, row, directory, command):
        super().__init__()
        self.row = row
        self.directory = directory
        self.command = command
        self.process = None

    def run(self):
        try:
            self.process = subprocess.Popen(
                self.command,
                cwd=self.directory,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            self.started_process.emit(self.process.pid)
            for line in self.process.stdout:
                self.output.emit(line.strip())
            self.process.wait()
        except Exception as e:
            self.output.emit(f"Error: {e}")
        finally:
            self.finished_process.emit(self.row)

    def kill(self):
        if self.process:
            try:
                proc = psutil.Process(self.process.pid)
                for child in proc.children(recursive=True):
                    child.kill()
                proc.kill()
            except Exception as e:
                print(f"Failed to kill process: {e}")


class AddDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Add New Task")
        layout = QVBoxLayout()

        self.dir_input = QLineEdit()
        self.cmd_input = QLineEdit()

        browse_btn = QPushButton("Browse...")
        browse_btn.clicked.connect(self.browse_dir)

        dir_layout = QHBoxLayout()
        dir_layout.addWidget(QLabel("Directory:"))
        dir_layout.addWidget(self.dir_input)
        dir_layout.addWidget(browse_btn)

        cmd_layout = QHBoxLayout()
        cmd_layout.addWidget(QLabel("Command:"))
        cmd_layout.addWidget(self.cmd_input)

        layout.addLayout(dir_layout)
        layout.addLayout(cmd_layout)

        buttons = QDialogButtonBox(
            QDialogButtonBox.StandardButton.Ok | QDialogButtonBox.StandardButton.Cancel
        )
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons)

        self.setLayout(layout)

    def browse_dir(self):
        directory = QFileDialog.getExistingDirectory(self, "Select Directory")
        if directory:
            self.dir_input.setText(directory)

    def get_data(self):
        return self.dir_input.text(), self.cmd_input.text()


class TodoApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("WorkSuite Automation")
        self.resize(1200, 600)

        self.tabs = QTabWidget()
        self.setCentralWidget(self.tabs)

        # Tab 1: Run Apps
        self.run_apps_tab = QWidget()
        self.tabs.addTab(self.run_apps_tab, "Run Apps")
        self.setup_run_apps_tab()

        # Tab 2: Test API
        self.test_api_tab = QWidget()
        self.tabs.addTab(self.test_api_tab, "Test API")
        self.setup_test_api_tab()

        # Tab 3: Redis
        self.test_redis_tab = QWidget()
        self.tabs.addTab(self.test_redis_tab, "Redis")
        self.setup_test_redis_tab()

        # Tab 4: Kafka
        self.test_kafka_tab = QWidget()
        self.tabs.addTab(self.test_kafka_tab, "Kafka")
        self.setup_test_kafka_tab()
    # ----------------- Kafka Tab -----------------
    def setup_test_kafka_tab(self):
        self.button_group_tmp = QButtonGroup(self)
        main_layout = QVBoxLayout(self.test_kafka_tab)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        main_layout.addWidget(splitter)
        
        # Left Side
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)

        # ComboBox for predefined kafka commands
        self.kafka_selector = QComboBox()
        self.kafka_selector.addItems([
            "Select Command...",
            "Check Redis service logs",
            "Check if Redis is running",
            "Start Redis",
            "Stop Redis",
            "Restart Redis",
            "Connect to Redis CLI",
            "Check keys",
            "Flush keys"
        ])
        left_layout.addWidget(self.kafka_selector)
        self.kafka_input = QTextEdit()
        self.kafka_input.setPlaceholderText("Enter kafka command here...")
        left_layout.addWidget(self.kafka_input)

        # ComboBox for predefined kafka commands
        self.kafka_selector1 = QComboBox()
        self.kafka_selector1.addItems([
            "Select Command...",
            "Check Redis service logs",
            "Check if Redis is running",
            "Start Redis",
            "Stop Redis",
            "Restart Redis",
            "Connect to Redis CLI",
            "Check keys",
            "Flush keys"
        ])
        left_layout.addWidget(self.kafka_selector1)
        self.kafka_output = QTextEdit()
        #self.kafka_output.setReadOnly(True)
        self.kafka_output.setPlaceholderText("Enter kafka command here...")
        left_layout.addWidget(self.kafka_output)

        splitter.addWidget(left_widget)

        # Right Side
        # Left Side
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        
        self.kafka_log_output = QTextEdit()
        self.kafka_log_output.setReadOnly(True)
        self.kafka_log_output.setPlaceholderText("Logs will appear here...")
        right_layout.addWidget(self.kafka_log_output)
        
        self.kafka_log_output1 = QTextEdit()
        self.kafka_log_output1.setReadOnly(True)
        self.kafka_log_output1.setPlaceholderText("Logs will appear here...")
        right_layout.addWidget(self.kafka_log_output1)
        splitter.addWidget(right_widget)
        # Buttons
        btn_layout = QHBoxLayout()
        self.run_kafka_btn = QPushButton("Run Kafka Command")
        self.clear_kafka_btn = QPushButton("Clear Logs")
        btn_layout.addWidget(self.run_kafka_btn)
        btn_layout.addWidget(self.clear_kafka_btn)

        main_layout.addLayout(btn_layout)

        
    # ----------------- Redis Tab -----------------
    def setup_test_redis_tab(self):
        main_layout = QVBoxLayout(self.test_redis_tab)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        main_layout.addWidget(splitter)
        # Left Side
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        

        # ComboBox for predefined redis commands
        self.redis_selector = QComboBox()
        self.redis_selector.addItems([
            "Select Command...",
            "Check Redis service logs",
            "Check if Redis is running",
            "Start Redis",
            "Stop Redis",
            "Restart Redis",
            "Connect to Redis CLI",
            "Check keys",
            "Flush keys"
        ])
        #self.redis_selector.currentIndexChanged.connect(self.set_curl_command)
        left_layout.addWidget(self.redis_selector)

        self.redis_input = QTextEdit()
        self.redis_input.setPlaceholderText("Enter redis command here...")
        left_layout.addWidget(self.redis_input)

        self.redis_output = QTextEdit()
        self.redis_output.setReadOnly(True)
        self.redis_output.setPlaceholderText("Captured token will appear here...")
        left_layout.addWidget(self.redis_output)

        splitter.addWidget(left_widget)

        # Right Side
        self.redis_log_output = QTextEdit()
        self.redis_log_output.setReadOnly(True)
        self.redis_log_output.setPlaceholderText("Logs will appear here...")
        splitter.addWidget(self.redis_log_output)

        # Buttons
        btn_layout = QHBoxLayout()
        self.run_redis_btn = QPushButton("Run Redis Command")
        self.clear_redis_btn = QPushButton("Clear Logs")
        btn_layout.addWidget(self.run_redis_btn)
        btn_layout.addWidget(self.clear_redis_btn)

        main_layout.addLayout(btn_layout)

        #self.run_curl_btn.clicked.connect(self.run_curl_command)
        #self.clear_api_btn.clicked.connect(self.clear_api_logs)
        
    # ----------------- Run Apps Tab -----------------
    def setup_run_apps_tab(self):
        main_layout = QVBoxLayout(self.run_apps_tab)

        toolbar = QToolBar("Options")
        self.addToolBar(Qt.ToolBarArea.TopToolBarArea, toolbar)

        self.clear_log_toggle = QToolButton()
        self.clear_log_toggle.setText("Clear Log on Start")
        
        self.clear_log_toggle.setCheckable(True)
        
        toolbar.addWidget(self.clear_log_toggle)

        self.sequential_toggle = QToolButton()
        self.sequential_toggle.setText("Sequential Run")
        self.sequential_toggle.setCheckable(True)
        toolbar.addWidget(self.sequential_toggle)

        splitter = QSplitter(Qt.Orientation.Horizontal)
        main_layout.addWidget(splitter)

        self.table = QTableWidget(0, 5)
        self.table.setHorizontalHeaderLabels(["Service", "Directory", "Command", "PID", "Status"])
        self.table.setFixedWidth(350)        
        self.table.setColumnWidth(0, int(0.20 * 350))
        self.table.setColumnWidth(1, int(0.20 * 350))
        self.table.setColumnWidth(2, int(0.20 * 350))
        self.table.setColumnWidth(3, int(0.20 * 350))
        self.table.setColumnWidth(4, int(0.20 * 350))
        splitter.addWidget(self.table)

        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setFont(QFont("Consolas", 12))
        splitter.addWidget(self.log_output)

        btn_layout = QHBoxLayout()
        add_btn = QPushButton("Add")
        remove_btn = QPushButton("Remove")
        start_btn = QPushButton("Start Selected")
        stop_btn = QPushButton("Stop Selected")
        clear_log_btn = QPushButton("Clear Log")

        add_btn.clicked.connect(self.add_entry)
        remove_btn.clicked.connect(self.remove_entry)
        start_btn.clicked.connect(self.start_selected)
        stop_btn.clicked.connect(self.stop_selected)
        clear_log_btn.clicked.connect(self.clear_log)

        btn_layout.addWidget(add_btn)
        btn_layout.addWidget(remove_btn)
        btn_layout.addWidget(start_btn)
        btn_layout.addWidget(stop_btn)
        btn_layout.addWidget(clear_log_btn)
        main_layout.addLayout(btn_layout)

        self.workers = {}
        self.process_pids = {}
        self.queue = []
        self.running_row = None

        self.add_entry("backend", "c:\\todo_app_dev\\backend", "mvnw spring-boot:run")
        self.add_entry("avatar", "c:\\todo_app_dev\\avatar", "mvnw spring-boot:run")
        self.add_entry("frontend", "c:\\todo_app_dev\\frontend", "npm start")
        self.add_entry("task", "c:\\todo_app_dev\\task_management", "mvnw spring-boot:run")
        self.add_entry("blog", "c:\\todo_app_dev\\blog", "mvnw spring-boot:run -DskipTests -e -X")
        self.add_entry("kafka", "c:\\kafka", ".\\bin\\windows\\kafka-server-start.bat .\\config\\server.properties")
        self.add_entry("redis", "c:\\redis", "wsl -d Ubuntu-20.04 sh -c \"sudo service redis-server start && exec bash\"")
        self.add_entry("prometheus", "c:\\todo_app_dev\\prometheus\\prometheus", "prometheus --config.file=prometheus.yml")
        

    # ----------------- Test API Tab -----------------
    def setup_test_api_tab(self):
        layout = QVBoxLayout(self.test_api_tab)

        splitter = QSplitter(Qt.Orientation.Horizontal)
        layout.addWidget(splitter)

        # Left Side
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)

        # ComboBox for predefined curl commands
        self.curl_selector = QComboBox()
        self.curl_selector.addItems([
            "Select Command...",
            "Login",
            "Create Todo",
            "Signup",
            "Update Profile",
            "Display Blog",
            "Post Create Blog Post"
        ])
        self.curl_selector.currentIndexChanged.connect(self.set_curl_command)
        left_layout.addWidget(self.curl_selector)

        self.curl_input = QTextEdit()
        self.curl_input.setPlaceholderText("Enter curl command here...")
        left_layout.addWidget(self.curl_input)

        self.token_output = QTextEdit()
        self.token_output.setReadOnly(True)
        self.token_output.setPlaceholderText("Captured token will appear here...")
        left_layout.addWidget(self.token_output)

        splitter.addWidget(left_widget)

        # Right Side
        self.api_log_output = QTextEdit()
        self.api_log_output.setReadOnly(True)
        self.api_log_output.setPlaceholderText("Logs will appear here...")
        splitter.addWidget(self.api_log_output)

        # Buttons
        btn_layout = QHBoxLayout()
        self.run_curl_btn = QPushButton("Run Curl Command")
        self.clear_api_btn = QPushButton("Clear Logs & Token")
        btn_layout.addWidget(self.run_curl_btn)
        btn_layout.addWidget(self.clear_api_btn)

        layout.addLayout(btn_layout)

        self.run_curl_btn.clicked.connect(self.run_curl_command)
        self.clear_api_btn.clicked.connect(self.clear_api_logs)

    def set_curl_command(self, index):
        commands = {
            1: 'curl -X POST -u user1:xblaster -H "Content-Type: application/json"   http://localhost:8081/api/auth/login',
            2: 'curl -X POST -u user1:xblaster -H "Content-Type: application/json" -d "{\\"title\\":\\"Write blog post\\"}" http://localhost:8081/api/todos',
            3: 'curl -X POST -H "Content-Type: application/json"  -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass123\\",\\"email\\":\\"blaslomibao@yahoo.com\\"}"  http://localhost:8081/api/auth/signup',
            4: 'curl -X POST -H "Content-Type: application/json"  -d "{\\"username\\":\\"user1\\",\\"password\\":\\"xblaster\\",\\"fullname\\":\\"Blas\\",\\"address\\":\\"Basista\\",\\"email\\":\\"blaslomibao@yahoo.com\\"}"  http://localhost:8080/api/auth/updateprofile',
            5: 'curl -X GET http://localhost:8082/api/blog/display',
            6: 'curl -X POST -H "Content-Type: application/json" -d "{\\"title\\":\\"My First Blog\\",\\"content\\":\\"Hello World\\"}" http://localhost:8082/api/blog/create'
        }
        if index in commands:
            self.curl_input.setText(commands[index])

    def run_curl_command(self):
        command = self.curl_input.toPlainText().strip()
        if not command:
            QMessageBox.warning(self, "Warning", "Please enter a curl command")
            return

        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            output = result.stdout if result.stdout else result.stderr
            self.api_log_output.append(f"$ {command}\n{output}\n")

            # Try to capture token if JSON
            try:
                data = json.loads(output)
                if "token" in data:
                    self.token_output.setText(data["token"])
            except Exception:
                pass
        except Exception as e:
            self.api_log_output.append(f"Error running curl: {e}")

    def clear_api_logs(self):
        self.api_log_output.clear()
        #self.token_output.clear()

    # ----------------- Run Apps Functions -----------------
    def clear_log(self):
        self.log_output.clear()
        #self.append_log(-1, "=== Log cleared ===")

    def add_entry(self, service=None, directory=None, command=None):
        if directory is None and command is None:
            dialog = AddDialog()
            if dialog.exec():
                directory, command = dialog.get_data()
            else:
                return

        row = self.table.rowCount()
        self.table.insertRow(row)
        self.table.setItem(row, 0, QTableWidgetItem(service))
        self.table.setItem(row, 1, QTableWidgetItem(directory))
        self.table.setItem(row, 2, QTableWidgetItem(command))
        self.table.setItem(row, 3, QTableWidgetItem(""))
        self.table.setItem(row, 4, QTableWidgetItem("Stopped"))

    def remove_entry(self):
        selected = self.table.currentRow()
        if selected >= 0:
            self.table.removeRow(selected)

    def start_selected(self):
        row = self.table.currentRow()
        if row < 0:
            return
        if self.clear_log_toggle.isChecked():
            self.clear_log()
        directory = self.table.item(row, 1).text()
        command = self.table.item(row, 2).text()

        worker = ProcessWorker(row, directory, command)
        worker.output.connect(lambda line: self.append_log(row, line))
        worker.started_process.connect(lambda pid: self.set_pid(row, pid))
        worker.finished_process.connect(lambda r: self.mark_finished(r))

        self.workers[row] = worker
        self.table.setItem(row, 4, QTableWidgetItem("Running"))
        worker.start()

    def stop_selected(self):
        row = self.table.currentRow()
        if row in self.workers:
            self.workers[row].kill()
            self.table.setItem(row, 3, QTableWidgetItem("Stopped"))

    def append_log(self, row, text):
        cursor = self.log_output.textCursor()
        cursor.movePosition(QTextCursor.MoveOperation.End)

        fmt = QTextCharFormat()
        if "[ERROR]" in text:  # 🔴 highlight error lines
            fmt.setForeground(QColor("red"))
            #print("[ERROR]")
        elif "[DEBUG POINT]" in text:  
            fmt.setForeground(QColor("blue"))
            #print("[DEBUG POINT]")
        elif "[SYSTEM OUT]" in text:
            fmt.setForeground(QColor("orange"))
        else:
            fmt.setForeground(QColor("black"))

        cursor.insertText(f"[Row {row + 1}] {text}\n", fmt)
        self.log_output.setTextCursor(cursor)
        self.log_output.ensureCursorVisible()

    def set_pid(self, row, pid):
        self.table.setItem(row, 3, QTableWidgetItem(str(pid)))

    def mark_finished(self, row):
        self.table.setItem(row, 4, QTableWidgetItem("Stopped"))
    # ✅ Add this method
    def closeEvent(self, event):
        """Called when the window is closing"""
        for row, worker in self.workers.items():
            if worker.isRunning():
                worker.kill()
        event.accept()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TodoApp()
    window.show()
    sys.exit(app.exec())
