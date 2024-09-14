"use client";

import { useState } from "react";
import { UseProfile } from "../UseProfile";
import EditableImage from "./EditableImage";
import AddressInputs from "./AddressInputs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function UserForm({ user, onSave }) {
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [admin, setAdmin] = useState(user?.admin || false);
  const { data: loggedInUserData } = UseProfile();

  function handleAddressChange(propName, value) {
    if (propName === "phone") setPhone(value);
    if (propName === "streetAddress") setStreetAddress(value);
    if (propName === "postalCode") setPostalCode(value);
    if (propName === "city") setCity(value);
    if (propName === "country") setCountry(value);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Din profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-8"
          onSubmit={(ev) =>
            onSave(ev, {
              name: userName,
              image,
              phone,
              admin,
              streetAddress,
              postalCode,
              city,
              country,
            })
          }
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="relative p-2 rounded-lg max-w-[200px] mx-auto">
                <EditableImage link={image} setLink={setImage} />
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userName">Fullt navn</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Fullt navn"
                  value={userName}
                  onChange={(ev) => setUserName(ev.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  disabled={true}
                  value={user?.email}
                />
              </div>
            </div>
          </div>

          <AddressInputs
            addressProps={{ streetAddress, phone, postalCode, city, country }}
            setAddressProps={handleAddressChange}
          />

          {loggedInUserData.admin && (
            <div className="flex items-center space-x-2">
              <Switch
                id="adminSwitch"
                checked={admin}
                onCheckedChange={setAdmin}
              />
              <Label htmlFor="adminSwitch">Admin privileges</Label>
            </div>
          )}

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
