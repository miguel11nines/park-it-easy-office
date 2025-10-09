import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Bike, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicleType: "car" | "motorcycle";
  userName: string;
}

interface ParkingSlotCardProps {
  slotNumber: number;
  slotType: "car" | "motorcycle-multiple";
  currentBookings: Booking[];
  onBook: () => void;
}

export const ParkingSlotCard = ({ slotNumber, slotType, currentBookings, onBook }: ParkingSlotCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = currentBookings.filter(b => b.date === today);
  
  const getAvailabilityStatus = () => {
    if (todayBookings.length === 0) return "available";
    
    if (slotType === "motorcycle-multiple") {
      return todayBookings.length >= 3 ? "full" : "partial";
    }
    
    const hasFullDay = todayBookings.some(b => b.duration === "full");
    const hasMorning = todayBookings.some(b => b.duration === "morning");
    const hasAfternoon = todayBookings.some(b => b.duration === "afternoon");
    
    if (hasFullDay || (hasMorning && hasAfternoon)) return "full";
    return "partial";
  };

  const status = getAvailabilityStatus();
  
  const statusConfig = {
    available: {
      badge: "Available",
      badgeClass: "bg-success text-success-foreground",
      cardClass: "border-success/50 hover:border-success transition-smooth"
    },
    partial: {
      badge: "Partially Booked",
      badgeClass: "bg-accent text-accent-foreground",
      cardClass: "border-accent/50 hover:border-accent transition-smooth"
    },
    full: {
      badge: "Fully Booked",
      badgeClass: "bg-destructive text-destructive-foreground",
      cardClass: "border-destructive/50"
    }
  };

  return (
    <Card className={cn("transition-smooth hover:shadow-lg", statusConfig[status].cardClass)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {slotType === "car" ? (
              <Car className="h-5 w-5 text-primary" />
            ) : (
              <Bike className="h-5 w-5 text-primary" />
            )}
            Parking Slot {slotNumber}
          </CardTitle>
          <Badge className={statusConfig[status].badgeClass}>
            {statusConfig[status].badge}
          </Badge>
        </div>
        <CardDescription>
          {slotType === "car" ? "Car Only" : "Multiple Motorcycles"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayBookings.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Today's Bookings
            </div>
            {todayBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  {booking.vehicleType === "car" ? (
                    <Car className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Bike className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{booking.userName}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {booking.duration === "full" ? "All Day" : 
                   booking.duration === "morning" ? "Morning" : "Afternoon"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No bookings for today</p>
        )}
        <Button 
          onClick={onBook} 
          className="w-full bg-gradient-primary"
          disabled={status === "full"}
        >
          {status === "full" ? "Fully Booked" : "Book This Slot"}
        </Button>
      </CardContent>
    </Card>
  );
};
