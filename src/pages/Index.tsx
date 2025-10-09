import { useState } from "react";
import { ParkingSpotCard } from "@/components/ParkingSpotCard";
import { BookingDialog } from "@/components/BookingDialog";
import { StatisticsCard } from "@/components/StatisticsCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Booking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicleType: "car" | "motorcycle";
  userName: string;
  spotNumber: number;
}

const Index = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      duration: "morning",
      vehicleType: "car",
      userName: "John Doe",
      spotNumber: 84
    },
    {
      id: "2",
      date: new Date().toISOString().split('T')[0],
      duration: "full",
      vehicleType: "motorcycle",
      userName: "Jane Smith",
      spotNumber: 85
    }
  ]);
  
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookSpot = (spotNumber: number) => {
    setSelectedSpot(spotNumber);
    setDialogOpen(true);
  };

  const handleConfirmBooking = (booking: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };
    setBookings([...bookings, newBooking]);
  };

  const handleUnbook = (bookingId: string) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
    toast.success("Booking cancelled successfully");
  };

  // Filter out expired bookings (past dates)
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b => b.date >= today);

  const spot84Bookings = activeBookings.filter(b => b.spotNumber === 84);
  const spot85Bookings = activeBookings.filter(b => b.spotNumber === 85);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parking at Work</h1>
          <p className="text-lg md:text-xl opacity-90">
            Easy parking spot management for our team
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Statistics Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <StatisticsCard bookings={activeBookings} />
        </section>

        <Separator />

        {/* Parking Spots Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Available Parking Spots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ParkingSpotCard
              spotNumber={84}
              currentBookings={spot84Bookings}
              onBook={() => handleBookSpot(84)}
            />
            <ParkingSpotCard
              spotNumber={85}
              currentBookings={spot85Bookings}
              onBook={() => handleBookSpot(85)}
            />
          </div>
        </section>

        {/* All Bookings Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
          {activeBookings.length > 0 ? (
            <div className="space-y-3">
              {activeBookings
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-card border rounded-lg hover:shadow-md transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-primary">
                          {new Date(booking.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{booking.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          Spot {booking.spotNumber} • {booking.vehicleType === "car" ? "Car" : "Motorcycle"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                        {booking.duration === "full" ? "All Day" : 
                         booking.duration === "morning" ? "Morning" : "Afternoon"}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnbook(booking.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Unbook
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
          )}
        </section>
      </div>

      {/* Booking Dialog */}
      {selectedSpot && (
        <BookingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          spotNumber={selectedSpot}
          existingBookings={activeBookings}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default Index;
