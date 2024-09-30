"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpeningTime {
  open: string;
  close: string;
}

interface RestaurantData {
  openingTimes: Record<string, OpeningTime>;
  specialOccasions: Array<{
    date: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
}

const daysOfWeek = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
];

const defaultOpeningHours: OpeningTime = {
  open: "12:00",
  close: "22:00",
};

export default function OpeningHours() {
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date())
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/restaurant");
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data = await response.json();
        setRestaurantData(data);
      } catch (err) {
        setError("Kunne ikke hente åpningstider");
        console.error("Error fetching restaurant data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();

    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    return () => clearInterval(timer);
  }, [currentWeekStart]);

  const navigateWeek = (direction: number) => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
  };

  const isCurrentlyOpen = (date: Date, times: OpeningTime): boolean => {
    const now = currentTime;
    if (date.toDateString() !== now.toDateString()) return false;

    const [openHour, openMinute] = times.open.split(":").map(Number);
    const [closeHour, closeMinute] = times.close.split(":").map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (closeHour < openHour) {
      // Handles cases where closing time is after midnight
      return (
        currentHour > openHour ||
        (currentHour === openHour && currentMinute >= openMinute) ||
        currentHour < closeHour ||
        (currentHour === closeHour && currentMinute < closeMinute)
      );
    } else {
      return (
        (currentHour > openHour ||
          (currentHour === openHour && currentMinute >= openMinute)) &&
        (currentHour < closeHour ||
          (currentHour === closeHour && currentMinute < closeMinute))
      );
    }
  };

  if (isLoading) {
    return <div className="text-center">Laster åpningstider...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!restaurantData) {
    return <div className="text-center">Ingen åpningstider tilgjengelig</div>;
  }

  const weekDates = getWeekDates(currentWeekStart);
  const today = new Date();
  const todayString = formatDate(today);
  const todayTimes =
    restaurantData.openingTimes[todayString] || defaultOpeningHours;
  const isOpen = isCurrentlyOpen(today, todayTimes);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
      <div
        className={`text-center mb-4 p-2 rounded-md ${
          isOpen ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <span className="font-bold">{isOpen ? "Åpent nå" : "Stengt nå"}</span>
      </div>
      <h3 className="text-2xl font-semibold mb-4 flex items-center justify-between text-yellow-400">
        <Clock className="mr-2" />
        Åpningstider
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Uke {getWeekNumber(currentWeekStart)} -{" "}
            {currentWeekStart.getFullYear()}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </h3>
      <ul className="space-y-2">
        {daysOfWeek.map((day, index) => {
          const date = weekDates[index];
          const dateString = formatDate(date);
          const times =
            restaurantData.openingTimes[dateString] || defaultOpeningHours;
          const specialOccasion = restaurantData.specialOccasions.find(
            (so) => so.date === dateString
          );
          const isToday = date.toDateString() === today.toDateString();
          const isOpenNow = isToday && isCurrentlyOpen(date, times);

          return (
            <li
              key={day}
              className={`flex justify-between p-2 rounded ${
                isToday ? (isOpenNow ? "bg-green-600" : "bg-red-600") : ""
              }`}
            >
              <span>
                {day} ({formatDateShort(date)}):
              </span>
              <span>
                {specialOccasion
                  ? specialOccasion.isClosed
                    ? "Stengt"
                    : `${specialOccasion.open} - ${specialOccasion.close}`
                  : `${times.open} - ${times.close}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDateShort(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

function getWeekDates(weekStart: Date): Date[] {
  return daysOfWeek.map((_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
