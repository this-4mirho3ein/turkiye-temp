import { Property } from "@/types/interfaces";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

const PropertyList = ({ properties, isLoading, error }: PropertyListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!properties.length) {
    return <div>No properties found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Property card content will be added later */}
          <div className="p-4">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-gray-600">
              {property.price.toLocaleString()} تومان
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
