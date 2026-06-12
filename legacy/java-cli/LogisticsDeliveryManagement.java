import java.util.Scanner;

public class LogisticsDeliveryManagement {

    private Scanner scanner = new Scanner(System.in);
    private RideService rideService = new RideService();
    private DeliveryService deliveryService = new DeliveryService();
    private FoodDeliveryService foodDeliveryService = new FoodDeliveryService();

    public void start() {
        System.out.println("Welcome to the Logistics Delivery Management System!");
        while (true) {
            System.out.println("Choose a service:");
            System.out.println("1. Ride");
            System.out.println("2. Delivery");
            System.out.println("3. Food Delivery");
            System.out.println("4. Exit");
            int choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    handleRideService();
                    break;
                case 2:
                    handleDeliveryService();
                    break;
                case 3:
                    handleFoodDeliveryService();
                    break;
                case 4:
                    System.out.println("Exiting...");
                    return;
                default:
                    System.out.println("Invalid option! Please try again.");
            }
        }
    }

    private void handleRideService() {
        System.out.print("Enter number of passengers (1 or 2-5): ");
        int passengers = scanner.nextInt();
        rideService.setNumPassengers(passengers);

        System.out.print("Enter drop-off location: ");
        String dropOffLocation = scanner.next();
        rideService.setDropOffLocation(dropOffLocation);

        rideService.assignDriver();
        String[] rideDetails = {
            String.valueOf(rideService.getDeliveryId()), 
            String.valueOf(rideService.getNumPassengers()), 
            rideService.getDropOffLocation()
        };
        
        // Save data to CSV
        CSVHandler.saveToCSV("ride_service.csv", rideDetails);
        System.out.println("Ride booked successfully!");
    }

    private void handleDeliveryService() {
        System.out.print("Enter pickup location: ");
        String pickupLocation = scanner.next();
        deliveryService.setPickupLocation(pickupLocation);

        System.out.print("Enter drop-off location: ");
        String dropOffLocation = scanner.next();
        deliveryService.setDropOffLocation(dropOffLocation);

        deliveryService.assignDriver();
        String[] deliveryDetails = {
            String.valueOf(deliveryService.getDeliveryId()), 
            deliveryService.getPickupLocation(), 
            deliveryService.getDropOffLocation()
        };
        
        // Save data to CSV
        CSVHandler.saveToCSV("delivery_service.csv", deliveryDetails);
        System.out.println("Delivery booked successfully!");
    }

    private void handleFoodDeliveryService() {
        System.out.print("Choose fast food (1. Jollibee, 2. McDonald's, 3. KFC): ");
        int foodChoice = scanner.nextInt();
        foodDeliveryService.setFoodChoice(foodChoice);

        System.out.print("Enter drop-off location: ");
        String dropOffLocation = scanner.next();
        foodDeliveryService.setDropOffLocation(dropOffLocation);

        foodDeliveryService.assignDriver();
        String[] foodDeliveryDetails = {
            String.valueOf(foodDeliveryService.getDeliveryId()), 
            String.valueOf(foodDeliveryService.getFoodChoice()), 
            foodDeliveryService.getDropOffLocation()
        };

        // Save data to CSV
        CSVHandler.saveToCSV("food_delivery_service.csv", foodDeliveryDetails);
        System.out.println("Food delivery booked successfully!");
    }

    public static void main(String[] args) {
        LogisticsDeliveryManagement app = new LogisticsDeliveryManagement();
        app.start();
    }
}
