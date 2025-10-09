import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Car, Bike } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Booking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicleType: "car" | "motorcycle";
  userName: string;
  slotNumber: number;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotNumber: number;
  slotType: "car" | "motorcycle-multiple";
  existingBookings: Booking[];
  onConfirm: (booking: {
    userName: string;
    date: string;
    duration: "morning" | "afternoon" | "full";
    vehicleType: "car" | "motorcycle";
    slotNumber: number;
  }) => void;
}

export const BookingDialog = ({ open, onOpenChange, slotNumber, slotType, existingBookings, onConfirm }: BookingDialogProps) => {
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState<Date>();
  const [duration, setDuration] = useState<"morning" | "afternoon" | "full">("full");
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");

  const handleSubmit = () => {
    if (!userName || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedDateStr = format(date, "yyyy-MM-dd");
    const bookingsForDate = existingBookings.filter(
      b => b.date === selectedDateStr && b.slotNumber === slotNumber
    );

    // Validation for car slot
    if (slotType === "car" && vehicleType === "car") {
      const hasConflict = bookingsForDate.some(b => {
        if (b.vehicleType !== "car") return false;
        
        // Check for time conflicts
        if (duration === "full" || b.duration === "full") return true;
        if (duration === b.duration) return true;
        return false;
      });

      if (hasConflict) {
        toast.error("This slot is already booked for a car at that time");
        return;
      }
    }

    // Validation for motorcycle slot
    if (slotType === "motorcycle-multiple" && vehicleType === "motorcycle") {
      const motorcycleCount = bookingsForDate.filter(b => b.vehicleType === "motorcycle").length;
      
      if (motorcycleCount >= 4) {
        toast.error("Maximum 4 motorcycles can book this slot");
        return;
      }
    }

    // Prevent car from booking motorcycle slot
    if (slotType === "motorcycle-multiple" && vehicleType === "car") {
      toast.error("Cars cannot book the motorcycle slot");
      return;
    }

    // Prevent motorcycle from booking car slot
    if (slotType === "car" && vehicleType === "motorcycle") {
      toast.error("Motorcycles cannot book the car slot");
      return;
    }

    onConfirm({
      userName,
      date: selectedDateStr,
      duration,
      vehicleType,
      slotNumber,
    });

    toast.success("Parking slot booked successfully!");
    
    // Reset form
    setUserName("");
    setDate(undefined);
    setDuration("full");
    setVehicleType("car");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Parking Slot {slotNumber}</DialogTitle>
          <DialogDescription>
            Fill in the details to reserve your parking spot
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <RadioGroup value={vehicleType} onValueChange={(v) => setVehicleType(v as "car" | "motorcycle")}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth cursor-pointer">
                <RadioGroupItem value="car" id="car" />
                <Label htmlFor="car" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Car</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth cursor-pointer">
                <RadioGroupItem value="motorcycle" id="motorcycle" />
                <Label htmlFor="motorcycle" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Bike className="h-5 w-5 text-primary" />
                  <span>Motorcycle</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <RadioGroup value={duration} onValueChange={(v) => setDuration(v as any)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth cursor-pointer">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="cursor-pointer flex-1">Full Day</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth cursor-pointer">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning" className="cursor-pointer flex-1">Morning (Half Day)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-smooth cursor-pointer">
                <RadioGroupItem value="afternoon" id="afternoon" />
                <Label htmlFor="afternoon" className="cursor-pointer flex-1">Afternoon (Half Day)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-gradient-primary">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
