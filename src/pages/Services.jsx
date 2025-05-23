import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Container types data
const containerTypes = [
  {
    category: "Dry Container (Standard)",
    options: [
      {
        name: "20ft Standard",
        dimensions: [589, 234, 238],
        maxWeight: 28000,
        pricePerKm: 1.2
      },
      {
        name: "40ft Standard",
        dimensions: [1200, 234, 238],
        maxWeight: 30480,
        pricePerKm: 1.8
      },
      {
        name: "40ft High Cube",
        dimensions: [1200, 234, 269],
        maxWeight: 30480,
        pricePerKm: 2.0
      },
      {
        name: "45ft High Cube",
        dimensions: [1355, 234, 269],
        maxWeight: 29000,
        pricePerKm: 2.2
      }
    ]
  },
  {
    category: "Refrigerated Container (Reefer)",
    options: [
      {
        name: "20ft Reefer",
        dimensions: [585, 228, 226],
        maxWeight: 30480,
        pricePerKm: 2.5
      },
      {
        name: "40ft High Cube Reefer",
        dimensions: [1155, 228, 254],
        maxWeight: 34000,
        pricePerKm: 3.0
      }
    ]
  },
  {
    category: "Tank Container",
    options: [
      {
        name: "20ft Tank Container",
        dimensions: [605, 243, 259],
        maxWeight: 36000,
        pricePerKm: 3.2,
        capacity: 26000
      }
    ]
  },
  {
    category: "Flat Rack Container",
    options: [
      {
        name: "20ft Flat Rack",
        dimensions: [605, 243, 200], // Variable height
        maxWeight: 34000,
        pricePerKm: 2.8
      },
      {
        name: "40ft Flat Rack",
        dimensions: [1219, 243, 200], // Variable height
        maxWeight: 45000,
        pricePerKm: 3.5
      }
    ]
  },
  {
    category: "Open Top Container",
    options: [
      {
        name: "20ft Open Top",
        dimensions: [589, 234, 238],
        maxWeight: 30480,
        pricePerKm: 2.3
      },
      {
        name: "40ft Open Top",
        dimensions: [1200, 234, 238],
        maxWeight: 30480,
        pricePerKm: 2.7
      }
    ]
  }
];

// Sample port distances (in km)
const portDistances = {
  "Mumbai → Los Angeles": 14000,
  "Karnataka → Rotterdam": 18000,
  "Goa → Hamburg": 15000,
  "Kerla → Long Beach": 9500,
  "Andra Pradesh → New York": 12000
};

function Container({ width, height, depth }) {
  return (
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      <meshBasicMaterial color="gray" wireframe />
    </mesh>
  );
}

function CargoBox({ position, dimensions, fragile }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={fragile ? "tomato" : "deepskyblue"}
        opacity={fragile ? 0.7 : 1}
        transparent={fragile}
      />
    </mesh>
  );
}

function RotatingContainer({ children }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Services() {
  const [step, setStep] = useState(1); // 1: Container, 2: Route, 3: Cargo, 4: Summary
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [route, setRoute] = useState({
    origin: "",
    destination: "",
    distance: 0
  });
  const [cargoList, setCargoList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    quantity: 1,
    stackable: false,
    fragile: false,
  });

  const scale = 0.01;
  const [isMobileView, setIsMobileView] = useState(false);
  const [showForm, setShowForm] = useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate total CBM and weight
  const calculateTotals = () => {
    let totalCBM = 0;
    let totalWeight = 0;

    cargoList.forEach(cargo => {
      const cbm = (cargo.length * cargo.width * cargo.height * cargo.quantity) / 1000000; // Convert to m³
      totalCBM += cbm;
      totalWeight += cargo.weight * cargo.quantity;
    });

    return { totalCBM, totalWeight };
  };

  // Calculate shipping cost estimate
  const calculateShippingCost = () => {
    if (!selectedContainer || !route.distance) return null;

    const { totalWeight } = calculateTotals();
    const baseCost = selectedContainer.pricePerKm * route.distance;
    const fuelSurcharge = baseCost * 0.15;
    const portFees = 1050;
    const documentation = 150;

    return {
      containerType: selectedContainer.name,
      baseCost: baseCost.toFixed(2),
      fuelSurcharge: fuelSurcharge.toFixed(2),
      portFees,
      documentation,
      totalCost: (baseCost + fuelSurcharge + portFees + documentation).toFixed(2)
    };
  };

  const calculateCargoPositions = () => {
    if (!selectedContainer) return [];
    
    const positions = [];
    const [containerW, containerH, containerD] = selectedContainer.dimensions.map(d => d * scale);

    let currentY = -containerH / 2;
    let currentLayerHeight = 0;
    let currentX = -containerW / 2;
    let currentZ = -containerD / 2;
    let rowHeight = 0;
    let rowDepth = 0;

    const fragileAreas = [];
    let remainingCargo = 0;
    let currentCargoName = '';
    let currentCargoTotal = 0;

    cargoLoop: for (const cargo of cargoList) {
      const length = cargo.length * scale;
      const width = cargo.width * scale;
      const height = cargo.height * scale;
      currentCargoName = cargo.name;
      currentCargoTotal = cargo.quantity;

      for (let i = 0; i < cargo.quantity; i++) {
        if (currentX + length > containerW / 2) {
          currentX = -containerW / 2;
          currentZ += rowDepth;
          rowHeight = 0;
          rowDepth = 0;
        }

        if (currentZ + width > containerD / 2) {
          currentY += currentLayerHeight;
          currentLayerHeight = 0;
          currentX = -containerW / 2;
          currentZ = -containerD / 2;
          rowHeight = 0;
          rowDepth = 0;
        }

        if (currentY + height > containerH / 2) {
          remainingCargo = cargo.quantity - i;
          break cargoLoop;
        }

        if (cargo.stackable) {
          for (const area of fragileAreas) {
            const overlapX = currentX < area.x + area.length && currentX + length > area.x;
            const overlapZ = currentZ < area.z + area.width && currentZ + width > area.z;
            if (overlapX && overlapZ && currentY > area.y) {
              currentX += length;
              i--;
              continue cargoLoop;
            }
          }
        }

        positions.push({
          id: `${cargo.name}-${i}-${Date.now()}`,
          position: [currentX + length/2, currentY + height/2, currentZ + width/2],
          dimensions: [length, height, width],
          fragile: cargo.fragile,
        });

        if (cargo.fragile) {
          fragileAreas.push({
            x: currentX,
            y: currentY,
            z: currentZ,
            length,
            width,
            height
          });
        }

        currentX += length;
        if (height > rowHeight) rowHeight = height;
        if (width > rowDepth) rowDepth = width;
        if (rowHeight > currentLayerHeight) currentLayerHeight = rowHeight;
      }
    }

    if (remainingCargo > 0) {
      alert(`🚫 Container fully loaded. Unable to load ${remainingCargo} ${remainingCargo === 1 ? 'box' : 'boxes'} of ${currentCargoName} (loaded ${currentCargoTotal - remainingCargo} of ${currentCargoTotal})`);
    }

    return positions;
  };

  const cargoPositions = calculateCargoPositions();
  const { totalCBM, totalWeight } = calculateTotals();
  const shippingCost = calculateShippingCost();

  const addCargo = (e) => {
    e.preventDefault();

    const length = parseFloat(form.length);
    const width = parseFloat(form.width);
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const quantity = parseInt(form.quantity);

    if (!form.name || isNaN(length) || isNaN(width) || isNaN(height) || isNaN(weight) || isNaN(quantity)) {
      alert("Please fill out all cargo fields correctly.");
      return;
    }

    const newCargo = {
      id: Date.now(),
      name: form.name,
      length,
      width,
      height,
      weight,
      quantity,
      stackable: form.stackable,
      fragile: form.fragile,
    };

    setCargoList([...cargoList, newCargo]);

    setForm({
      name: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      quantity: 1,
      stackable: false,
      fragile: false,
    });
  };

  const removeCargo = (id) => {
    setCargoList(cargoList.filter(cargo => cargo.id !== id));
  };

  const handleRouteChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      const [origin, destination] = selectedRoute.split(" → ");
      setRoute({
        origin,
        destination,
        distance: portDistances[selectedRoute]
      });
    }
  };

  const toggleView = () => {
    setShowForm(!showForm);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="relative" style={{ height: "93.3vh", fontFamily: "Arial" }}>
      {/* Mobile Toggle Button */}
      {isMobileView && (
        <button
          onClick={toggleView}
          className="absolute top-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
        >
          {showForm ? "Show 3D View" : "Show Form"}
        </button>
      )}

      <div className={`${isMobileView ? 'flex-col' : 'flex'} h-full`}>
        {/* Form Section */}
        <div 
          className={`${isMobileView ? (showForm ? 'block' : 'hidden') : 'block'} w-full md:max-w-md p-6 bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-xl overflow-y-auto`}
          style={{ height: isMobileView ? '100%' : '100%' }}
        >
          {/* Step Navigation */}
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {stepNumber}
                </div>
                <span className="text-xs mt-1">
                  {stepNumber === 1 ? 'Container' : 
                   stepNumber === 2 ? 'Route' : 
                   stepNumber === 3 ? 'Cargo' : 'Summary'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Container Selection */}
          {step === 1 && (
            <div className="space-y-5 h-full flex flex-col">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">📦 Select Container</h2>
                <p className="text-sm text-gray-500 mt-1">Choose the appropriate container type for your shipment</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {containerTypes.map((category) => (
                  <div key={category.category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">{category.category}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {category.options.map((option) => (
                        <div 
                          key={option.name}
                          onClick={() => setSelectedContainer(option)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedContainer?.name === option.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{option.name}</span>
                            {selectedContainer?.name === option.name && (
                              <span className="text-blue-500">✓</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {option.dimensions.join(' × ')} cm
                          </div>
                          <div className="text-sm text-gray-600">
                            Max Weight: {option.maxWeight.toLocaleString()} kg
                          </div>
                          {option.capacity && (
                            <div className="text-sm text-gray-600">
                              Capacity: {option.capacity.toLocaleString()} liters
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!selectedContainer}
                  className={`px-6 py-2 rounded-lg ${selectedContainer ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Next: Route Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Route Details */}
          {step === 2 && (
            <div className="space-y-5 h-full flex flex-col">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">🌍 Route Details</h2>
                <p className="text-sm text-gray-500 mt-1">Enter origin and destination ports</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Select Route</label>
                  <select
                    value={`${route.origin}${route.origin ? ' → ' : ''}${route.destination}`}
                    onChange={handleRouteChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select a route</option>
                    {Object.keys(portDistances).map((route) => (
                      <option key={route} value={route}>{route}</option>
                    ))}
                  </select>
                </div>

                {route.distance > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Origin</div>
                        <div className="font-medium">{route.origin}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Destination</div>
                        <div className="font-medium">{route.destination}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Distance</div>
                        <div className="font-medium">{route.distance.toLocaleString()} km</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Container</div>
                        <div className="font-medium">{selectedContainer.name}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!route.distance}
                  className={`px-6 py-2 rounded-lg ${route.distance ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Next: Cargo Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Cargo Details */}
          {step === 3 && (
            <form onSubmit={addCargo} className="space-y-5 h-full flex flex-col">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">📦 Add Cargo</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details of your shipment</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium">Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {['Length (cm)', 'Width (cm)', 'Height (cm)'].map((label, i) => {
                    const field = ['length', 'width', 'height'][i];
                    return (
                      <div key={field}>
                        <label className="block text-gray-700 font-medium">{label}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          required
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      required
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      required
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="flex gap-6 items-center mb-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={form.stackable}
                      onChange={(e) => setForm({ ...form, stackable: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Stackable</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={form.fragile}
                      onChange={(e) => setForm({ ...form, fragile: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-red-500"
                    />
                    <span className="ml-2 text-gray-700">Fragile</span>
                  </label>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">📋 Cargo List</h3>
                  <ul className="space-y-2">
                    {cargoList.map((c) => (
                      <li key={c.id} className="p-2 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="flex justify-between">
                            <span className="font-medium">{c.name}</span>
                            <span>Qty: {c.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{c.stackable ? "✓ Stackable" : "✗ Not stackable"}</span>
                            <span>{c.fragile ? "⚠ Fragile" : "✓ Durable"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCargo(c.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg"
                  >
                    Add Cargo
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={cargoList.length === 0}
                    className={`px-6 py-2 rounded-lg ${cargoList.length > 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Next: Summary
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-5 h-full flex flex-col">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">📝 Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Review your shipment details</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Container Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="font-medium">{selectedContainer.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Dimensions</div>
                      <div className="font-medium">{selectedContainer.dimensions.join(' × ')} cm</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Max Weight</div>
                      <div className="font-medium">{selectedContainer.maxWeight.toLocaleString()} kg</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Route Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Origin</div>
                      <div className="font-medium">{route.origin}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{route.destination}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Distance</div>
                      <div className="font-medium">{route.distance.toLocaleString()} km</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Cargo Summary</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-500">Total CBM</div>
                      <div className="font-medium">{totalCBM.toFixed(2)} m³</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Weight</div>
                      <div className="font-medium">{totalWeight.toLocaleString()} kg</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Items ({cargoList.length})</div>
                  <ul className="space-y-2">
                    {cargoList.map((c) => (
                      <li key={c.id} className="p-2 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">{c.name}</span>
                          <span>Qty: {c.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{c.length} × {c.width} × {c.height} cm</span>
                          <span>{c.weight} kg each</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {shippingCost && (
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Shipping Cost Estimate</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Freight Charges ({route.origin} → {route.destination})</span>
                        <span className="font-medium">${shippingCost.baseCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Container Type</span>
                        <span className="font-medium">{selectedContainer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel Surcharge (15%)</span>
                        <span className="font-medium">${shippingCost.fuelSurcharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Port Fees</span>
                        <span className="font-medium">${shippingCost.portFees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Documentation</span>
                        <span className="font-medium">${shippingCost.documentation}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total Estimated Cost</span>
                        <span>${shippingCost.totalCost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => alert("Shipment booked successfully!")}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Section */}
        <div 
          className={`${isMobileView ? (showForm ? 'hidden' : 'block') : 'flex-1'}`}
          style={{ height: isMobileView ? '100%' : '100%' }}
        >
          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ width: '100%', height: '100%', background: "#e0e0e0" }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            
            {selectedContainer && (
              <RotatingContainer>
                <Container
                  width={selectedContainer.dimensions[0] * scale}
                  height={selectedContainer.dimensions[1] * scale}
                  depth={selectedContainer.dimensions[2] * scale}
                />
                {cargoPositions.map((cargo) => (
                  <CargoBox
                    key={cargo.id}
                    position={cargo.position}
                    dimensions={cargo.dimensions}
                    fragile={cargo.fragile}
                  />
                ))}
              </RotatingContainer>
            )}
          </Canvas>
        </div>
      </div>
    </div>
  );
}
