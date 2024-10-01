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

const daysOfWeek: string[] = [
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
  }, [currentWeekStart]);

  const navigateWeek = (direction: number) => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
  };

  if (isLoading) {
    return <div className="text-center p-4">Laster åpningstider...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!restaurantData) {
    return (
      <div className="text-center p-4">Ingen åpningstider tilgjengelig</div>
    );
  }

  const weekDates = getWeekDates(currentWeekStart);
  const today = new Date();

  const groupedOpeningHours = groupOpeningHours(
    weekDates,
    restaurantData,
    today
  );

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center text-yellow-400">
          <Clock className="mr-2" />
          Åpningstider
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium whitespace-nowrap">
            Uke {getWeekNumber(currentWeekStart)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(1)}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ul className="space-y-1">
        {groupedOpeningHours.map((group, index) => (
          <li key={index} className="flex justify-between py-1">
            <span>
              {group.days}
              {group.isToday && (
                <span className="ml-1 text-yellow-400">(I dag)</span>
              )}
            </span>
            <span>{group.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function groupOpeningHours(
  weekDates: Date[],
  restaurantData: RestaurantData,
  today: Date
) {
  let currentGroup: { days: string[]; hours: string; isToday: boolean } = {
    days: [],
    hours: "",
    isToday: false,
  };
  const groups: Array<{ days: string; hours: string; isToday: boolean }> = [];

  weekDates.forEach((date, index) => {
    const dateString = formatDate(date);
    const times =
      restaurantData.openingTimes[dateString] || defaultOpeningHours;
    const specialOccasion = restaurantData.specialOccasions.find(
      (so) => so.date === dateString
    );
    const isToday = date.toDateString() === today.toDateString();
    const hours = specialOccasion
      ? specialOccasion.isClosed
        ? "Stengt"
        : `${specialOccasion.open} - ${specialOccasion.close}`
      : `${times.open} - ${times.close}`;

    if (currentGroup.hours === hours && !isToday) {
      currentGroup.days.push(daysOfWeek[index]);
    } else {
      if (currentGroup.days.length > 0) {
        groups.push({
          days: formatDayRange(currentGroup.days),
          hours: currentGroup.hours,
          isToday: currentGroup.isToday,
        });
      }
      currentGroup = { days: [daysOfWeek[index]], hours, isToday };
    }
  });

  if (currentGroup.days.length > 0) {
    groups.push({
      days: formatDayRange(currentGroup.days),
      hours: currentGroup.hours,
      isToday: currentGroup.isToday,
    });
  }

  return groups;
}

function formatDayRange(days: string[]): string {
  if (days.length === 1) return days[0];
  if (days.length === 7) return "Alle dager";
  return `${days[0]}-${days[days.length - 1]}`;
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
