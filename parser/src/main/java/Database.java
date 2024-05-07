import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static Database db;
    private Database() {
    }


    public static Database getInstance() {
        if (db == null) {
            db = new Database();
        }
        return db;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
        "jdbc:mysql://localhost:3307/moviedb",
        "admin", "admin");
    }
}
