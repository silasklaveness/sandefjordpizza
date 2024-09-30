import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [selectedHour, selectedMinute] = value
    ? value.split(":")
    : ["12", "00"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleHourChange = (hour: string) => {
    onChange(`${hour}:${selectedMinute}`);
  };

  const handleMinuteChange = (minute: string) => {
    onChange(`${selectedHour}:${minute}`);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value || ""}
        onClick={() => setIsOpen(true)}
        readOnly
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="flex">
            <div className="w-1/2 border-r">
              <div className="flex flex-col items-center p-2">
                <button
                  onClick={() =>
                    handleHourChange(
                      ((parseInt(selectedHour) + 1) % 24)
                        .toString()
                        .padStart(2, "0")
                    )
                  }
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="my-2">{selectedHour}</span>
                <button
                  onClick={() =>
                    handleHourChange(
                      ((parseInt(selectedHour) - 1 + 24) % 24)
                        .toString()
                        .padStart(2, "0")
                    )
                  }
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex flex-col items-center p-2">
                <button
                  onClick={() =>
                    handleMinuteChange(
                      ((parseInt(selectedMinute) + 1) % 60)
                        .toString()
                        .padStart(2, "0")
                    )
                  }
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="my-2">{selectedMinute}</span>
                <button
                  onClick={() =>
                    handleMinuteChange(
                      ((parseInt(selectedMinute) - 1 + 60) % 60)
                        .toString()
                        .padStart(2, "0")
                    )
                  }
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
