import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench, Sparkles, Scissors, Zap, Car, Palette, Home, Heart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useMouseFollower } from "../../contexts/MouseFollowerContext";
import AuthModal from "../Home/AuthModal";

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setTalkText } = useMouseFollower();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleBookNow = (serviceName: string) => {
    if (!isAuthenticated) {
      setSelectedService(serviceName);
      setIsModalOpen(true);
    } else {
      navigate(`/book/${serviceName.toLowerCase()}`);
    }
  };

  const categories = [
    { 
      id: 1, 
      name: "Cleaning", 
      icon: <Sparkles className="w-6 h-6" />, 
      description: "Home & Office Cleaning", 
      image: "https://thumbs.dreamstime.com/b/indian-man-vacuum-cleaner-home-household-cleaning-concept-148409168.jpg",
      hoverText: "Sparkling clean homes with our professional service ✨"
    },
    { 
      id: 2, 
      name: "Repairs", 
      icon: <Wrench className="w-6 h-6" />, 
      description: "Home Repairs & Fixes", 
      image: "https://repairindia.in/Images/Category/gas-stove-repairing-service.jpg",
      hoverText: "Fix it right the first time with our experts 🔧"
    },
    { 
      id: 3, 
      name: "Beauty", 
      icon: <Scissors className="w-6 h-6" />, 
      description: "Salon & Spa Services", 
      image: "https://lirp.cdn-website.com/2a1049ba/dms3rep/multi/opt/Luxe-Salon_2-1920w.jpg",
      hoverText: "Pamper yourself with our beauty treatments ✂️"
    },
    { 
      id: 4, 
      name: "Electrical", 
      icon: <Zap className="w-6 h-6" />, 
      description: "Electrical Services", 
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400",
      hoverText: "Safe and reliable electrical solutions ⚡"
    },
    { 
      id: 5, 
      name: "Automotive", 
      icon: <Car className="w-6 h-6" />, 
      description: "Car Care & Repair", 
      image: "https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20201022051442_Home-Mechanic-van-equipment.jpg&w=700&c=1",
      hoverText: "Keep your vehicle running smoothly 🚗"
    },
    { 
      id: 6, 
      name: "Painting", 
      icon: <Palette className="w-6 h-6" />, 
      description: "Home Painting", 
      image: "https://www.colourdrive.in/images/projects/289.jpg",
      hoverText: "Transform your space with our painting services 🎨"
    },
    { 
      id: 7, 
      name: "Plumbing", 
      icon: <Home className="w-6 h-6" />, 
      description: "Plumbing Services", 
      image: "https://static.vecteezy.com/system/resources/thumbnails/049/047/816/small/female-plumber-portrait-of-a-young-woman-plumber-in-uniform-standing-in-the-kitchen-free-photo.jpg",
      hoverText: "Expert plumbing solutions for your home 🚿"
    },
    { 
      id: 8, 
      name: "Wellness", 
      icon: <Heart className="w-6 h-6" />, 
      description: "Health & Wellness", 
      image: "https://img.freepik.com/premium-photo/indian-doctor-is-looking-couple-patients-his-chamber_299154-4434.jpg",
      hoverText: "Take care of your health with our wellness services ❤️"
    },
  ];

  return (
    <section id="services" className="py-24 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold text-white mb-6"
            onMouseEnter={() => setTalkText("Browse our most popular services")}
            onMouseLeave={() => setTalkText(null)}
          >
            Popular Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Quality professionals for all your home service needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`relative group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-white hover:shadow-lg hover:shadow-white/10 ${hoveredCard === category.id ? 'scale-105' : ''}`}
              onMouseEnter={() => {
                setHoveredCard(category.id);
                setTalkText(category.hoverText);
              }}
              onMouseLeave={() => {
                setHoveredCard(null);
                setTalkText(null);
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {category.icon}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                <button
                  onClick={() => handleBookNow(category.name)}
                  className="w-full bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
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