public class FoodDeliveryService {
    private int foodChoice;
    private String dropOffLocation;
    private int deliveryId = 3;  // Just a placeholder for ID generation

    public void setFoodChoice(int foodChoice) {
        this.foodChoice = foodChoice;
    }

    public int getFoodChoice() {
        return foodChoice;
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
        // Logic to assign a driver (usually a motorcycle)
        System.out.println("Driver assigned for Food Delivery Service.");
    }

    public void saveDeliveryData(String[] data) {
        // Logic to save food delivery data, potentially to a CSV or a file
        CSVHandler.saveToCSV("food_delivery_service.csv", data);
    }
}
