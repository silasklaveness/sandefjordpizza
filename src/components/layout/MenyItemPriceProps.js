import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

export default function MenuItemPriceProps({
  name,
  addLabel,
  props,
  setProps,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newSizes;
    });
  }

  function removeProp(indexToRemove) {
    setProps((prev) => prev.filter((v, index) => index !== indexToRemove));
  }

  function toggleOpen(ev) {
    ev.preventDefault(); // Prevent form submission
    setIsOpen((prev) => !prev);
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <Button
          onClick={toggleOpen}
          variant="ghost"
          className="w-full justify-between mb-2"
          type="button" // Explicitly set type to button
        >
          <span className="flex items-center gap-2">
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {name}
          </span>
          <span className="text-sm text-gray-500">({props?.length})</span>
        </Button>
        {isOpen && (
          <div className="space-y-4">
            {props?.length > 0 &&
              props.map((size, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Size name"
                      value={size.name}
                      onChange={(ev) => editProp(ev, index, "name")}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extra price
                    </label>
                    <Input
                      type="number"
                      placeholder="Extra price"
                      value={size.price}
                      onChange={(ev) => editProp(ev, index, "price")}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeProp(index)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            <Button
              type="button"
              onClick={addProp}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{addLabel}</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
