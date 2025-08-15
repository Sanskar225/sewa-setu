// src/pages/AboutUs.tsx
import React from "react";
import { useMouseFollower } from "../contexts/MouseFollowerContext";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  const { setTalkText } = useMouseFollower();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            onMouseEnter={() => setTalkText("Go back to home")}
            onMouseLeave={() => setTalkText(null)}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold">सेवासेतु</span>
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/services" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onMouseEnter={() => setTalkText("View our services")}
              onMouseLeave={() => setTalkText(null)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-blue-600 font-medium"
              onMouseEnter={() => setTalkText("You're here")}
              onMouseLeave={() => setTalkText(null)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onMouseEnter={() => setTalkText("Contact us")}
              onMouseLeave={() => setTalkText(null)}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 
            className="text-5xl font-bold text-gray-900 mb-6"
            onMouseEnter={() => setTalkText("Our story")}
            onMouseLeave={() => setTalkText(null)}
          >
            About सेवासेतु
          </h1>
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            onMouseEnter={() => setTalkText("Who we are and what we do")}
            onMouseLeave={() => setTalkText(null)}
          >
            Your trusted partner for professional home services. Quality, convenience, 
            and reliability at your doorstep.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl font-bold text-gray-900 mb-6"
                onMouseEnter={() => setTalkText("How it all began")}
                onMouseLeave={() => setTalkText(null)}
              >
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p onMouseEnter={() => setTalkText("Our founding")} onMouseLeave={() => setTalkText(null)}>
                  सेवासेतु was founded in 2023 with a simple mission: to make professional 
                  home services accessible, reliable, and convenient for everyone in India.
                </p>
                <p onMouseEnter={() => setTalkText("Our growth")} onMouseLeave={() => setTalkText(null)}>
                  What started as a small team of passionate individuals has now grown into 
                  a network of hundreds of skilled professionals serving thousands of happy 
                  customers across multiple cities.
                </p>
                <p onMouseEnter={() => setTalkText("Our vision")} onMouseLeave={() => setTalkText(null)}>
                  We believe in empowering both our customers and service providers through 
                  technology, creating a seamless experience that benefits everyone involved.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-xl h-80 overflow-hidden">
              {/* Placeholder for team image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">Team photo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="mb-20">
          <h2 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            onMouseEnter={() => setTalkText("Meet our leadership")}
            onMouseLeave={() => setTalkText(null)}
          >
            Founders & Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Piyush Kumar",
                role: "Co-Founder & CEO",
                bio: "Piyush oversees the company's vision and strategy. With a background in technology and business, he's passionate about creating solutions that improve people's lives.",
                img: "/placeholder.jpg"
              },
              {
                name: "Ankit Kumar",
                role: "Co-Founder & CTO",
                bio: "Ankit leads our technology team, ensuring our platform provides the best experience for both customers and service professionals.",
                img: "/placeholder.jpg"
              },
              {
                name: "Rahul Kumar",
                role: "Head of Operations",
                bio: "Rahul manages our network of service professionals, maintaining our high standards of quality and reliability across all services.",
                img: "/placeholder.jpg"
              }
            ].map((person, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                onMouseEnter={() => setTalkText(`Learn more about ${person.name}`)}
                onMouseLeave={() => setTalkText(null)}
              >
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  {/* Placeholder for profile image */}
                  <span className="text-gray-500">Profile photo</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                  <p className="text-blue-600 mb-3">{person.role}</p>
                  <p className="text-gray-600">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            onMouseEnter={() => setTalkText("What we stand for")}
            onMouseLeave={() => setTalkText(null)}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Customer First",
                description: "We prioritize our customers' needs and satisfaction above all else.",
                icon: "❤️"
              },
              {
                title: "Quality Service",
                description: "We maintain the highest standards in all the services we provide.",
                icon: "✨"
              },
              {
                title: "Integrity",
                description: "We believe in transparency and honesty in all our dealings.",
                icon: "🤝"
              },
              {
                title: "Innovation",
                description: "We continuously improve our services through technology and feedback.",
                icon: "💡"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                onMouseEnter={() => setTalkText(value.title)}
                onMouseLeave={() => setTalkText(null)}
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="bg-blue-600 rounded-xl p-10 text-center text-white">
          <h2 
            className="text-3xl font-bold mb-4"
            onMouseEnter={() => setTalkText("Be part of our journey")}
            onMouseLeave={() => setTalkText(null)}
          >
            Want to join our team?
          </h2>
          <p 
            className="text-xl mb-8 max-w-3xl mx-auto text-blue-100"
            onMouseEnter={() => setTalkText("We're always looking for talent")}
            onMouseLeave={() => setTalkText(null)}
          >
            We're always looking for passionate individuals to join us in our mission 
            to revolutionize home services in India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/careers"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              onMouseEnter={() => setTalkText("Explore career opportunities")}
              onMouseLeave={() => setTalkText(null)}
            >
              View Open Positions
            </Link>
            <Link 
              to="/provider"
              className="bg-transparent border-2 border-white hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors"
              onMouseEnter={() => setTalkText("Become a service partner")}
              onMouseLeave={() => setTalkText(null)}
            >
              Join as Service Provider
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;