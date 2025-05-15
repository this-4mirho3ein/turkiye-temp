"use client";
import { FormData } from "../PostAdForm";
import {
  Button,
  Autocomplete,
  AutocompleteItem,
  Textarea,
} from "@heroui/react";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import {
  getAreas,
  getCities,
  getCountries,
  getProvinces,
  createAdvertisementStep3,
} from "@/controllers/makeRequest";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "@/context/AuthContext";

const fetchers = {
  countries: getCountries,
  provinces: getProvinces,
  cities: getCities,
  areas: getAreas,
};

type Props = {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  next: () => void;
  back: () => void;
};

// Helper component to handle map click
function LocationMarker({
  setLatLng,
}: {
  setLatLng: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      setLatLng(e.latlng.lat, e.latlng.lng);
    },
  });

  // Force map to recalculate size
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map]);

  return null;
}

export default function StepThree({
  formData,
  updateField,
  next,
  back,
}: Props) {
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: countries, isLoading: isCountriesLoading } = useApi(
    "countries",
    fetchers,
    null,
    true
  );
  const { data: provinces, isLoading: isProvincesLoading } = useApi(
    "provinces",
    fetchers,
    formData.country,
    !!formData.country
  );
  const { data: cities, isLoading: isCitiesLoading } = useApi(
    "cities",
    fetchers,
    formData.province,
    !!formData.province
  );
  const { data: areas, isLoading: isAreasLoading } = useApi(
    "areas",
    fetchers,
    formData.city,
    !!formData.city
  );

  console.log("countries:", countries);
  console.log("provinces:", provinces);
  console.log("cities:", cities);
  console.log("areas:", areas);

  // const filteredCities = cities.filter(city => city.country === formData.country);

  // Create location data object for API submission
  const prepareLocationData = () => {
    return {
      elan_id: formData.elan_id || formData.id, // Use either elan_id or id
      country: formData.country,
      province: formData.province,
      city: formData.city,
      nighborhood: formData.area, // Map area to neighborhood
      address: formData.address,
      x: formData.latitude ? Number(formData.latitude) : null,
      y: formData.longitude ? Number(formData.longitude) : null,
    };
  };

  // Handle next button click with location data preparation and API submission
  const handleNext = async () => {
    setError(null);
    setLoading(true);

    try {
      const locationData = prepareLocationData();
      console.log("Sending location data to API:", locationData);

      // Send API request using the existing function
      const response = await createAdvertisementStep3(
        locationData,
        authState.accessToken
      );

      if (response.status === 200 || response.status === 201) {
        console.log("API response:", response);
        next();
      } else {
        setError(response.message || "خطا در ثبت اطلاعات مکانی");
      }
    } catch (error) {
      console.error("Error submitting location data:", error);
      setError("خطا در ارتباط با سرور. لطفا مجددا تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  // Create a custom icon using React Icons
  const customMarkerIcon = divIcon({
    html: renderToStaticMarkup(<FaMapMarkerAlt size={24} color="#FF0000" />),
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg border border-gray-100 rtl space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-right text-indigo-700">
        اطلاعات موقعیت مکانی
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            کشور
          </label>
          <Autocomplete
            selectedKey={formData.country}
            onSelectionChange={(key) => updateField("country", key as string)}
            isLoading={isCountriesLoading}
            placeholder="انتخاب کشور"
            className="text-right"
          >
            {Array.isArray(countries?.results)
              ? countries.results.map((item: any) => (
                  <AutocompleteItem key={item.slug}>
                    {item.name}
                  </AutocompleteItem>
                ))
              : null}
          </Autocomplete>
        </div>
        {/* Province */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            استان
          </label>
          <Autocomplete
            selectedKey={formData.province}
            onSelectionChange={(key) => updateField("province", key as string)}
            isLoading={isProvincesLoading}
            placeholder="انتخاب استان"
            className="text-right"
            isDisabled={!formData.country}
          >
            {Array.isArray(provinces)
              ? provinces.map((item: any) => (
                  <AutocompleteItem key={item.slug}>
                    {item.name}
                  </AutocompleteItem>
                ))
              : null}
          </Autocomplete>
        </div>
        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            شهر
          </label>
          <Autocomplete
            selectedKey={formData.city}
            onSelectionChange={(key) => updateField("city", key as string)}
            isLoading={isCitiesLoading}
            placeholder="انتخاب شهر"
            className="text-right"
            isDisabled={!formData.province}
          >
            {Array.isArray(cities)
              ? cities.map((item: any) => (
                  <AutocompleteItem key={item.slug}>
                    {item.name}
                  </AutocompleteItem>
                ))
              : null}
          </Autocomplete>
        </div>
        {/* Area */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            منطقه
          </label>
          <Autocomplete
            selectedKey={formData.area}
            onSelectionChange={(key) => updateField("area", key as string)}
            isLoading={isAreasLoading}
            placeholder="انتخاب منطقه"
            className="text-right"
            isDisabled={!formData.city}
          >
            {Array.isArray(areas)
              ? areas.map((item: any) => (
                  <AutocompleteItem key={item.slug}>
                    {item.name}
                  </AutocompleteItem>
                ))
              : null}
          </Autocomplete>
        </div>
        {/* Address */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            آدرس دقیق
          </label>
          <Textarea
            minRows={2}
            maxRows={6}
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="آدرس دقیق ملک را وارد کنید"
            className="text-right"
          />
        </div>
      </div>{" "}
      <div className="relative w-full h-[300px] mt-4 border border-gray-200 rounded-lg overflow-hidden">
        <MapContainer
          center={[
            formData.latitude ? Number(formData.latitude) : 35.6892,
            formData.longitude ? Number(formData.longitude) : 51.389,
          ]} // Default to Tehran
          zoom={13}
          key={`${formData.latitude}-${formData.longitude}`}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {formData.latitude && formData.longitude && (
            <Marker
              position={[Number(formData.latitude), Number(formData.longitude)]}
              icon={customMarkerIcon}
            />
          )}
          <LocationMarker
            setLatLng={(lat, lng) => {
              // Update both the form data latitude/longitude and prepare for x/y API format
              updateField("latitude", String(lat));
              updateField("longitude", String(lng));
            }}
          />
        </MapContainer>
      </div>
      <div className="flex justify-between mt-8">
        <Button
          onPress={back}
          variant="bordered"
          className="text-gray-700 border-gray-300 hover:bg-gray-50 px-6 py-2"
        >
          بازگشت
        </Button>
        <Button
          onPress={handleNext}
          color="primary"
          isLoading={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
        >
          ادامه
        </Button>
      </div>
      {/* debug */}
      <div
        dir="ltr"
        className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm font-mono max-w-7xl"
      >
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="font-bold text-blue-600 mb-2">Form Data:</h4>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-green-600 mb-2">API Data:</h4>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(prepareLocationData(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
