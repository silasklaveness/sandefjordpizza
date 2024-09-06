import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddressInputs({ addressProps, setAddressProps }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={addressProps.phone}
              onChange={(ev) => setAddressProps("phone", ev.target.value)}
              placeholder="Your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              type="text"
              value={addressProps.streetAddress}
              onChange={(ev) =>
                setAddressProps("streetAddress", ev.target.value)
              }
              placeholder="Street address"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              type="text"
              value={addressProps.postalCode}
              onChange={(ev) => setAddressProps("postalCode", ev.target.value)}
              placeholder="Postal code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              value={addressProps.city}
              onChange={(ev) => setAddressProps("city", ev.target.value)}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              type="text"
              value={addressProps.country}
              onChange={(ev) => setAddressProps("country", ev.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
