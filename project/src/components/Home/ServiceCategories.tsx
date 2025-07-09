
// --- ServiceCategories.tsx ---
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench, Sparkles, Scissors, Zap, Car, Palette, Home, Heart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../Home/AuthModal";

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (serviceName: string) => {
    if (!isAuthenticated) {
      setSelectedService(serviceName);
      setIsModalOpen(true);
    } else {
      navigate(`/book/${serviceName.toLowerCase()}`);
    }
  };

  const categories = [
    { id: 1, name: "Cleaning", icon: <Sparkles />, description: "Home & Office Cleaning", image: "https://thumbs.dreamstime.com/b/indian-man-vacuum-cleaner-home-household-cleaning-concept-148409168.jpg" },
    { id: 2, name: "Repairs", icon: <Wrench />, description: "Home Repairs & Fixes", image: "https://repairindia.in/Images/Category/gas-stove-repairing-service.jpg" },
    { id: 3, name: "Beauty", icon: <Scissors />, description: "Salon & Spa Services", image: "https://lirp.cdn-website.com/2a1049ba/dms3rep/multi/opt/Luxe-Salon_2-1920w.jpg" },
    { id: 4, name: "Electrical", icon: <Zap />, description: "Electrical Services", image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 5, name: "Automotive", icon: <Car />, description: "Car Care & Repair", image: "https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20201022051442_Home-Mechanic-van-equipment.jpg&w=700&c=1" },
    { id: 6, name: "Painting", icon: <Palette />, description: "Home Painting", image: "https://www.colourdrive.in/images/projects/289.jpg" },
    { id: 7, name: "Plumbing", icon: <Home />, description: "Plumbing Services", image: "https://static.vecteezy.com/system/resources/thumbnails/049/047/816/small/female-plumber-portrait-of-a-young-woman-plumber-in-uniform-standing-in-the-kitchen-free-photo.jpg" },
    { id: 8, name: "Wellness", icon: <Heart />, description: "Health & Wellness", image: "https://img.freepik.com/premium-photo/indian-doctor-is-looking-couple-patients-his-chamber_299154-4434.jpg" },
  ];

  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <button
                  onClick={() => handleBookNow(category.name)}
                  className="text-blue-600 hover:underline"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedService && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialMode="login"
          redirectPath={`/book/${selectedService.toLowerCase()}`}
        />
      )}
    </section>
  );
};

export default ServiceCategories;