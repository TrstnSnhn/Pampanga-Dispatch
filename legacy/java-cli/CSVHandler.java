import java.io.FileWriter;
import java.io.IOException;

public class CSVHandler {
    public static void saveToCSV(String fileName, String[] data) {
        try (FileWriter writer = new FileWriter(fileName, true)) {
            for (String field : data) {
                writer.append(field).append(",");
            }
            writer.append("\n");
            writer.flush();
        } catch (IOException e) {
            System.out.println("Error writing to CSV file: " + e.getMessage());
        }
    }
}
