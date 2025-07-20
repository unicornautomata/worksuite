import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import java.awt.font.TextAttribute;

public class TodoApp extends JFrame {
    private Connection conn;
    private JPanel taskPanel;
    private JTextField inputField;

    public TodoApp() {
        setTitle("To-Do List");
        setSize(400, 600);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        inputField = new JTextField();
        JButton addButton = new JButton("Add");

        JPanel inputPanel = new JPanel(new BorderLayout());
        inputPanel.add(inputField, BorderLayout.CENTER);
        inputPanel.add(addButton, BorderLayout.EAST);

        taskPanel = new JPanel();
        taskPanel.setLayout(new BoxLayout(taskPanel, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(taskPanel);

        add(inputPanel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);

        try {
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/todo_db", "postgres", "Sm@llF0x789");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Database connection failed: " + e.getMessage());
            System.exit(1);
        }

        loadTasks();

        addButton.addActionListener(e -> addTask());
    }

    private void loadTasks() {
        taskPanel.removeAll();
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM todo");

            while (rs.next()) {
                long id = rs.getLong("id");
                String title = rs.getString("title");
                boolean completed = rs.getBoolean("completed");

               
		JPanel panel = new JPanel(new BorderLayout());
		panel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40)); // Set row height to 40px
		panel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5)); // Optional spacing
                JCheckBox checkBox = new JCheckBox();
                checkBox.setSelected(completed);

                JLabel label = new JLabel(title);
                if (completed) {
                    Map<TextAttribute, Object> attributes = new HashMap<>(label.getFont().getAttributes());
                    attributes.put(TextAttribute.STRIKETHROUGH, TextAttribute.STRIKETHROUGH_ON);
                    label.setFont(label.getFont().deriveFont(attributes));
                }

                checkBox.addActionListener(e -> toggleComplete(id, checkBox.isSelected()));

                JButton deleteBtn = new JButton("X");
                deleteBtn.addActionListener(e -> deleteTask(id));

                panel.add(checkBox, BorderLayout.WEST);
                panel.add(label, BorderLayout.CENTER);
                panel.add(deleteBtn, BorderLayout.EAST);

                taskPanel.add(panel);
            }

            taskPanel.revalidate();
            taskPanel.repaint();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void addTask() {
        String title = inputField.getText().trim();
        if (title.isEmpty()) return;

        try {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO todo (title, completed) VALUES (?, false)");
            ps.setString(1, title);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        inputField.setText("");
        loadTasks();
    }

    private void deleteTask(long id) {
        try {
            PreparedStatement ps = conn.prepareStatement("DELETE FROM todo WHERE id = ?");
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        loadTasks();
    }

    private void toggleComplete(long id, boolean completed) {
        try {
            PreparedStatement ps = conn.prepareStatement("UPDATE todo SET completed = ? WHERE id = ?");
            ps.setBoolean(1, completed);
            ps.setLong(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        loadTasks();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new TodoApp().setVisible(true);
        });
    }
}
