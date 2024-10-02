"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import { TimePicker } from "@/components/ui/timepicker";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoLoader from "@/components/ui/logoloader";

const daysOfWeek = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
];

const WeekNavigation = ({ currentWeekStart, onNavigate }) => (
  <div className="flex items-center justify-between mb-4">
    <Button variant="outline" size="icon" onClick={() => onNavigate(-1)}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="font-medium">
      Uke {currentWeekStart.getWeek()} - {currentWeekStart.getFullYear()}
    </span>
    <Button variant="outline" size="icon" onClick={() => onNavigate(1)}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

const OpeningTimesForm = ({
  weekDates,
  openingTimes,
  specialOccasions,
  onOpeningTimeChange,
}) => (
  <div className="space-y-2">
    {daysOfWeek.map((day, index) => {
      const date = weekDates[index];
      const specialOccasion = specialOccasions.find((so) => so.date === date);
      const times = specialOccasion ||
        openingTimes[date] || { open: "12:00", close: "22:00" };
      return (
        <div key={date} className="flex items-center space-x-2">
          <span className="w-24 text-sm font-medium">{day}</span>
          <span className="w-24 text-sm text-gray-500">{date}</span>
          {specialOccasion && specialOccasion.isClosed ? (
            <span className="text-red-500">Stengt (Spesiell Anledning)</span>
          ) : (
            <>
              <TimePicker
                value={times.open}
                onChange={(value) => onOpeningTimeChange(date, "open", value)}
              />
              <span className="mx-2">til</span>
              <TimePicker
                value={times.close}
                onChange={(value) => onOpeningTimeChange(date, "close", value)}
              />
              {specialOccasion && (
                <span className="text-blue-500 ml-2">(Spesiell Anledning)</span>
              )}
            </>
          )}
        </div>
      );
    })}
  </div>
);

const SpecialOccasionsForm = ({
  specialOccasions,
  onUpdate,
  onRemove,
  onAdd,
}) => (
  <div className="space-y-4">
    {specialOccasions.map((occasion, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={occasion.date}
              onChange={(ev) => onUpdate(index, "date", ev.target.value)}
              className="w-40"
            />
            <select
              value={occasion.isClosed ? "closed" : "open"}
              onChange={(ev) =>
                onUpdate(index, "isClosed", ev.target.value === "closed")
              }
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="open">Åpen</option>
              <option value="closed">Stengt</option>
            </select>
            {!occasion.isClosed && (
              <>
                <TimePicker
                  value={occasion.open}
                  onChange={(value) => onUpdate(index, "open", value)}
                />
                <TimePicker
                  value={occasion.close}
                  onChange={(value) => onUpdate(index, "close", value)}
                />
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => onRemove(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
    <Button onClick={onAdd} className="w-full">
      <Plus className="h-4 w-4 mr-2" />
      Legg til spesiell anledning
    </Button>
  </div>
);

export default function RestaurantPage() {
  const session = useSession();
  const [restaurant, setRestaurant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date())
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      Promise.all([
        fetch("/api/profile").then((res) => res.json()),
        fetch("/api/restaurant").then((res) => res.json()),
      ])
        .then(([profileData, restaurantData]) => {
          setIsAdmin(profileData.admin);
          if (restaurantData) {
            setRestaurant({
              ...restaurantData,
              openingTimes: restaurantData.openingTimes || {},
              specialOccasions: restaurantData.specialOccasions || [],
            });
          } else {
            setRestaurant({
              name: "",
              openingTimes: {},
              specialOccasions: [],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Kunne ikke hente restaurantdata");
        })
        .finally(() => setIsLoading(false));
    } else if (session.status === "unauthenticated") {
      redirect("/login");
    }
  }, [session.status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!restaurant || !hasUnsavedChanges) return;

    try {
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurant),
      });

      if (response.ok) {
        toast.success("Restaurant oppdatert!");
        setHasUnsavedChanges(false);
      } else {
        throw new Error("Feil ved lagring av restaurant");
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("Feil ved lagring av restaurant");
    }
  };

  const handleOpeningTimeChange = useCallback((date, type, value) => {
    setRestaurant((prev) => {
      if (!prev) return prev;
      const currentTimes = prev.openingTimes[date] || {
        open: "12:00",
        close: "22:00",
      };
      return {
        ...prev,
        openingTimes: {
          ...prev.openingTimes,
          [date]: { ...currentTimes, [type]: value },
        },
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const handleSpecialOccasionUpdate = useCallback((index, field, value) => {
    setRestaurant((prev) => {
      if (!prev) return prev;
      const newSpecialOccasions = [...prev.specialOccasions];
      newSpecialOccasions[index] = {
        ...newSpecialOccasions[index],
        [field]: value,
      };
      return { ...prev, specialOccasions: newSpecialOccasions };
    });
    setHasUnsavedChanges(true);
  }, []);

  const handleSpecialOccasionRemove = useCallback((index) => {
    setRestaurant((prev) => {
      if (!prev) return prev;
      const newSpecialOccasions = prev.specialOccasions.filter(
        (_, i) => i !== index
      );
      return { ...prev, specialOccasions: newSpecialOccasions };
    });
    setHasUnsavedChanges(true);
  }, []);

  const handleSpecialOccasionAdd = useCallback(() => {
    setRestaurant((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        specialOccasions: [
          ...prev.specialOccasions,
          { date: "", open: "12:00", close: "22:00", isClosed: false },
        ],
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const navigateWeek = useCallback((direction) => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LogoLoader size={75} color="#000000" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div>No restaurant data available.</div>;
  }

  const weekDates = getWeekDates(currentWeekStart);

  return (
    <section className="max-w-4xl mx-auto p-4">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {restaurant ? "Rediger Restaurant" : "Opprett Restaurant"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Restaurantnavn</Label>
              <Input
                id="name"
                value={restaurant.name}
                onChange={(e) => {
                  setRestaurant({ ...restaurant, name: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                required
              />
            </div>
            <Tabs defaultValue="openingTimes">
              <TabsList>
                <TabsTrigger value="openingTimes">Åpningstider</TabsTrigger>
                <TabsTrigger value="specialOccasions">
                  Spesielle Anledninger
                </TabsTrigger>
              </TabsList>
              <TabsContent value="openingTimes">
                <Card>
                  <CardHeader>
                    <CardTitle>Åpningstider</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeekNavigation
                      currentWeekStart={currentWeekStart}
                      onNavigate={navigateWeek}
                    />
                    <OpeningTimesForm
                      weekDates={weekDates}
                      openingTimes={restaurant.openingTimes}
                      specialOccasions={restaurant.specialOccasions}
                      onOpeningTimeChange={handleOpeningTimeChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specialOccasions">
                <Card>
                  <CardHeader>
                    <CardTitle>Spesielle Anledninger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpecialOccasionsForm
                      specialOccasions={restaurant.specialOccasions}
                      onUpdate={handleSpecialOccasionUpdate}
                      onRemove={handleSpecialOccasionRemove}
                      onAdd={handleSpecialOccasionAdd}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <Button
              type="submit"
              className="w-full"
              disabled={!hasUnsavedChanges}
            >
              {restaurant ? "Oppdater Restaurant" : "Opprett Restaurant"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getWeekDates(weekStart) {
  return daysOfWeek.map((_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return formatDate(date);
  });
}

// Add this method to the Date prototype to get the week number
Date.prototype.getWeek = function () {
  const d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};
