import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

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
  const containerSize = { width: 600, height: 240, depth: 240 };
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

  const calculateCargoPositions = () => {
    const positions = [];
    const containerW = containerSize.width * scale;
    const containerH = containerSize.height * scale;
    const containerD = containerSize.depth * scale;

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

  const toggleView = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="relative" style={{ height: "86vh", fontFamily: "Arial" }}>
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
            </div>

            <div className="mb-4 flex-1 min-h-[200px] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">📋 Cargo List</h3>
              <ul className="space-y-2">
                {cargoList.map((c) => (
                  <li key={c.id} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{c.name}</span>
                      <span>Qty: {c.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{c.stackable ? "✓ Stackable" : "✗ Not stackable"}</span>
                      <span>{c.fragile ? "⚠ Fragile" : "✓ Durable"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-inner border-b-4 border-yellow-700 transition transform hover:scale-105"
            >
              📦 Add Cargo
            </button>
          </form>
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
            
            <RotatingContainer>
              <Container
                width={containerSize.width * scale}
                height={containerSize.height * scale}
                depth={containerSize.depth * scale}
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
          </Canvas>
        </div>
      </div>
    </div>
  );
}