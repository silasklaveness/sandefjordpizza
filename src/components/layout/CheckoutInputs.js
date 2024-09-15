import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const libraries = ["places"];

export default function CheckoutInputs({
  addressProps,
  setAddressProps,
  deliveryOption,
  name,
  setName,
  email,
  setEmail,
  disabled = false,
}) {
  const autocompleteInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries: libraries,
  });

  useEffect(() => {
    if (
      isLoaded &&
      mapRef.current &&
      autocompleteInputRef.current &&
      !disabled
    ) {
      // Initialize the map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 }, // Default location (can be adjusted)
        zoom: 8,
      });
      setMap(mapInstance);

      // Initialize the marker
      const markerInstance = new google.maps.Marker({
        map: mapInstance,
      });
      markerRef.current = markerInstance;

      // Initialize Autocomplete and link it to the input field
      const autocompleteInstance = new google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        {
          fields: ["address_components", "geometry"],
        }
      );
      setAutocomplete(autocompleteInstance);

      // Set the autocomplete listener
      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (!place.geometry) {
          console.error("Place contains no geometry");
          return;
        }

        // Move the map to the selected place and update the marker position
        mapInstance.setCenter(place.geometry.location);
        markerInstance.setPosition(place.geometry.location);

        // Fill the form fields based on the selected address
        const components = place.address_components;
        fillFormFields(components);
      });
    }
  }, [isLoaded, disabled]);

  useEffect(() => {
    if (
      addressProps.streetAddress &&
      addressProps.city &&
      map &&
      markerRef.current
    ) {
      geocodeAddress(`${addressProps.streetAddress}, ${addressProps.city}`);
    }
  }, [addressProps, map]);

  const getComponent = (components, types) => {
    for (const type of types) {
      const component = components.find((comp) => comp.types.includes(type));
      if (component) return component.long_name;
    }
    return "";
  };

  const fillFormFields = (components) => {
    if (disabled) return;
    const street = getComponent(components, ["route"]);
    const streetNumber = getComponent(components, ["street_number"]);
    const city = getComponent(components, [
      "locality",
      "postal_town",
      "sublocality",
      "administrative_area_level_2",
    ]);
    const postalCode = getComponent(components, ["postal_code"]);
    const country = getComponent(components, ["country"]);

    setAddressProps("streetAddress", `${street} ${streetNumber}`);
    setAddressProps("city", city);
    setAddressProps("postalCode", postalCode);
    setAddressProps("country", country);
  };

  const geocodeAddress = (address) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && map && markerRef.current) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        markerRef.current.setPosition(location);
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  };

  const commonFields = [
    { id: "name", label: "Name", value: name, onChange: setName },
    {
      id: "email",
      label: "Email",
      type: "email",
      value: email,
      onChange: setEmail,
    },
    {
      id: "phone",
      label: "Phone",
      type: "tel",
      value: addressProps.phone,
      onChange: (value) => setAddressProps("phone", value),
    },
  ];

  const deliveryFields = [
    {
      id: "streetAddress",
      label: "Street Address",
      value: addressProps.streetAddress,
      onChange: (value) => setAddressProps("streetAddress", value),
    },
    {
      id: "postalCode",
      label: "Postal Code",
      value: addressProps.postalCode,
      onChange: (value) => setAddressProps("postalCode", value),
    },
    {
      id: "city",
      label: "City",
      value: addressProps.city,
      onChange: (value) => setAddressProps("city", value),
    },
  ];

  const inputFields =
    deliveryOption === "delivery"
      ? [...commonFields, ...deliveryFields]
      : commonFields;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {deliveryOption === "delivery"
          ? "Delivery Information"
          : "Contact Information"}
      </h2>

      {!disabled && deliveryOption === "delivery" && (
        <div className="space-y-2 mb-4">
          <Label htmlFor="autocompleteAddress">Search for Address</Label>
          <Input
            id="autocompleteAddress"
            ref={autocompleteInputRef}
            type="text"
            placeholder="Start typing your address"
          />
        </div>
      )}

      <div className="space-y-4">
        {inputFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type || "text"}
              value={field.value || ""}
              onChange={(ev) => !disabled && field.onChange(ev.target.value)}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {!disabled && deliveryOption === "delivery" && (
        <div
          ref={mapRef}
          style={{ height: "200px", width: "100%", marginTop: "20px" }}
        />
      )}
    </div>
  );
}
