import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, Car, Bike, Percent, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Database booking interface (matches database structure)
interface DbBooking {
  id: string;
  date: string;
  duration: "morning" | "afternoon" | "full";
  vehicle_type: "car" | "motorcycle";
  user_name: string;
  spot_number: number;
}

const Statistics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Fetch ALL bookings from all users for statistics
      // No user check needed - statistics should always load
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load statistics');
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const filterByDateRange = (start: Date, end: Date) => {
    return bookings.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate >= start && bookingDate <= end;
    });
  };

  const thisWeekBookings = filterByDateRange(thisWeekStart, thisWeekEnd);
  const thisMonthBookings = filterByDateRange(thisMonthStart, thisMonthEnd);
  const activeBookings = bookings.filter(b => new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0)));

  const carBookings = bookings.filter(b => b.vehicle_type === "car").length;
  const motorcycleBookings = bookings.filter(b => b.vehicle_type === "motorcycle").length;
  const totalBookings = bookings.length;

  // Calculate occupation percentage
  // Each spot can have: 2 half-day slots for cars OR 4 motorcycles per day
  // Total capacity per day = 2 spots × 2 periods = 4 car slots (or more motorcycle capacity)
  const calculateOccupation = (bookingsInRange: DbBooking[]) => {
    if (bookingsInRange.length === 0) return 0;
    
    // Group by date
    const dateGroups: { [key: string]: DbBooking[] } = {};
    bookingsInRange.forEach(b => {
      if (!dateGroups[b.date]) dateGroups[b.date] = [];
      dateGroups[b.date].push(b);
    });

    const occupations = Object.values(dateGroups).map(dayBookings => {
      let totalCapacity = 0;
      let usedCapacity = 0;

      // Calculate for each spot
      [84, 85].forEach(spot => {
        const spotBookings = dayBookings.filter(b => b.spot_number === spot);
        
        // Check morning capacity
        const morningBookings = spotBookings.filter(b => b.duration === "morning" || b.duration === "full");
        const morningCars = morningBookings.filter(b => b.vehicle_type === "car").length;
        const morningMotos = morningBookings.filter(b => b.vehicle_type === "motorcycle").length;
        
        if (morningCars > 0 || morningMotos > 0) {
          totalCapacity += morningCars > 0 ? 1 : 4; // 1 car or 4 motorcycles
          usedCapacity += morningCars > 0 ? 1 : morningMotos;
        }

        // Check afternoon capacity
        const afternoonBookings = spotBookings.filter(b => b.duration === "afternoon" || b.duration === "full");
        const afternoonCars = afternoonBookings.filter(b => b.vehicle_type === "car").length;
        const afternoonMotos = afternoonBookings.filter(b => b.vehicle_type === "motorcycle").length;
        
        if (afternoonCars > 0 || afternoonMotos > 0) {
          totalCapacity += afternoonCars > 0 ? 1 : 4;
          usedCapacity += afternoonCars > 0 ? 1 : afternoonMotos;
        }
      });

      return totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    });

    return occupations.reduce((a, b) => a + b, 0) / occupations.length;
  };

  const weekOccupation = calculateOccupation(thisWeekBookings);
  const monthOccupation = calculateOccupation(thisMonthBookings);

  // Most popular spot
  const spot84Count = bookings.filter(b => b.spot_number === 84).length;
  const spot85Count = bookings.filter(b => b.spot_number === 85).length;
  const mostPopularSpot = spot84Count >= spot85Count ? 84 : 85;

  // Most popular time
  const morningCount = bookings.filter(b => b.duration === "morning" || b.duration === "full").length;
  const afternoonCount = bookings.filter(b => b.duration === "afternoon" || b.duration === "full").length;
  const mostPopularTime = morningCount >= afternoonCount ? "Morning" : "Afternoon";

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      gradient: "bg-gradient-primary",
      description: "All time"
    },
    {
      title: "This Week",
      value: thisWeekBookings.length,
      icon: TrendingUp,
      gradient: "bg-gradient-success",
      description: `${weekOccupation.toFixed(1)}% occupation`
    },
    {
      title: "This Month",
      value: thisMonthBookings.length,
      icon: TrendingUp,
      gradient: "bg-gradient-accent",
      description: `${monthOccupation.toFixed(1)}% occupation`
    },
    {
      title: "Week Occupation",
      value: `${weekOccupation.toFixed(1)}%`,
      icon: Percent,
      gradient: "bg-gradient-primary",
      description: "Average capacity used"
    },
    {
      title: "Car Bookings",
      value: carBookings,
      icon: Car,
      gradient: "bg-gradient-success",
      description: `${((carBookings / totalBookings) * 100 || 0).toFixed(1)}% of total`
    },
    {
      title: "Motorcycle Bookings",
      value: motorcycleBookings,
      icon: Bike,
      gradient: "bg-gradient-accent",
      description: `${((motorcycleBookings / totalBookings) * 100 || 0).toFixed(1)}% of total`
    },
    {
      title: "Most Popular Spot",
      value: `Spot ${mostPopularSpot}`,
      icon: TrendingUp,
      gradient: "bg-gradient-primary",
      description: `${Math.max(spot84Count, spot85Count)} bookings`
    },
    {
      title: "Most Popular Time",
      value: mostPopularTime,
      icon: Clock,
      gradient: "bg-gradient-success",
      description: `${Math.max(morningCount, afternoonCount)} bookings`
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-8 md:py-12 px-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-primary-foreground hover:bg-white/10 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Statistics</h1>
            <p className="text-base md:text-xl opacity-90">
              Detailed insights and usage metrics
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
        {loading ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Main Stats Grid */}
            <section className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-primary rounded"></div>
                Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <Card 
                    key={stat.title} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <CardDescription className="text-[10px] sm:text-xs">
                        {stat.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl sm:text-3xl font-bold truncate">{stat.value}</div>
                        <div className={`p-2 sm:p-3 rounded-lg ${stat.gradient} shadow-md`}>
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Detailed Breakdown */}
            <section className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-success rounded"></div>
                Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="transition-all hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Vehicle Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                          <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                          Cars
                        </span>
                        <span className="text-xs sm:text-sm font-bold">{carBookings}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(carBookings / totalBookings) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                          <Bike className="h-3 w-3 sm:h-4 sm:w-4" />
                          Motorcycles
                        </span>
                        <span className="text-xs sm:text-sm font-bold">{motorcycleBookings}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(motorcycleBookings / totalBookings) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Spot Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium">Spot 84</span>
                        <span className="text-xs sm:text-sm font-bold">{spot84Count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-success h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(spot84Count / totalBookings) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium">Spot 85</span>
                        <span className="text-xs sm:text-sm font-bold">{spot85Count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(spot85Count / totalBookings) * 100 || 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
