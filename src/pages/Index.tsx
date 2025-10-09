import { useState } from "react";
import { ParkingSlotCard } from "@/components/ParkingSlotCard";
import { BookingDialog } from "@/components/BookingDialog";
import { StatisticsCard } from "@/components/StatisticsCard";
import { Separator } from "@/components/ui/separator";

interface Booking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicleType: "car" | "motorcycle";
  userName: string;
  slotNumber: number;
}

const Index = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      duration: "morning",
      vehicleType: "car",
      userName: "John Doe",
      slotNumber: 1
    },
    {
      id: "2",
      date: new Date().toISOString().split('T')[0],
      duration: "full",
      vehicleType: "motorcycle",
      userName: "Jane Smith",
      slotNumber: 2
    }
  ]);
  
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookSlot = (slotNumber: number) => {
    setSelectedSlot(slotNumber);
    setDialogOpen(true);
  };

  const handleConfirmBooking = (booking: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };
    setBookings([...bookings, newBooking]);
  };

  const slot1Bookings = bookings.filter(b => b.slotNumber === 1);
  const slot2Bookings = bookings.filter(b => b.slotNumber === 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parking at Work</h1>
          <p className="text-lg md:text-xl opacity-90">
            Easy parking slot management for our team
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Statistics Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <StatisticsCard bookings={bookings} />
        </section>

        <Separator />

        {/* Parking Slots Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Available Parking Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ParkingSlotCard
              slotNumber={1}
              slotType="car"
              currentBookings={slot1Bookings}
              onBook={() => handleBookSlot(1)}
            />
            <ParkingSlotCard
              slotNumber={2}
              slotType="motorcycle-multiple"
              currentBookings={slot2Bookings}
              onBook={() => handleBookSlot(2)}
            />
          </div>
        </section>

        {/* All Bookings Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
          <div className="space-y-3">
            {bookings
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
                        Slot {booking.slotNumber} • {booking.vehicleType === "car" ? "Car" : "Motorcycle"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                    {booking.duration === "full" ? "All Day" : 
                     booking.duration === "morning" ? "Morning" : "Afternoon"}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Booking Dialog */}
      {selectedSlot && (
        <BookingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          slotNumber={selectedSlot}
          slotType={selectedSlot === 1 ? "car" : "motorcycle-multiple"}
          existingBookings={bookings}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default Index;
