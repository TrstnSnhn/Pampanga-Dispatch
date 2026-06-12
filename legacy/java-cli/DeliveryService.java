public class DeliveryService {
    private String pickupLocation;
    private String dropOffLocation;
    private int deliveryId = 2;  // Just a placeholder for ID generation

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setDropOffLocation(String dropOffLocation) {
        this.dropOffLocation = dropOffLocation;
    }

    public String getDropOffLocation() {
        return dropOffLocation;
    }

    public int getDeliveryId() {
        return deliveryId;
    }

    public void assignDriver() {
        // Logic to assign a driver
        System.out.println("Driver assigned for Delivery Service.");
    }

    public void saveDeliveryData(String[] data) {
        // Logic to save delivery data, potentially to a CSV or a file
        CSVHandler.saveToCSV("delivery_service.csv", data);
    }
}
