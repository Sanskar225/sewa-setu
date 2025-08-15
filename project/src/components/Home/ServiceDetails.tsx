import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useMouseFollower } from '../../contexts/MouseFollowerContext';

const Testimonials: React.FC = () => {
  const { setTalkText } = useMouseFollower();

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homeowner, Lucknow',
      rating: 5,
      comment: 'Excellent service! The cleaning team was professional and thorough. My house has never looked better.',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400',
      hoverText: "Priya loved our cleaning service! 🧹"
    },
    {
      id: 2,
      name: 'Rohit Verma',
      role: 'Business Owner, Lucknow',
      rating: 5,
      comment: 'The repair service was quick and efficient. Fixed my electrical issue within hours of booking.',
      image: 'https://images.pexels.com/photos/3564440/pexels-photo-3564440.jpeg?auto=compress&cs=tinysrgb&w=400',
      hoverText: "Rohit was impressed with our quick response time ⚡"
    },
    {
      id: 3,
      name: 'Anjali Mehta',
      role: 'Working Professional, Lucknow',
      rating: 5,
      comment: 'Love the convenience! Beauty services at home save me so much time. Highly recommended.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      hoverText: "Anjali enjoys our at-home beauty services 💅"
    },
    {
      id: 4,
      name: 'Aman Singh',
      role: 'Tech Professional, Lucknow',
      rating: 5,
      comment: 'The app is so easy to use and the service providers are always punctual and professional.',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      hoverText: "Aman loves our user-friendly app 📱"
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white mix-blend-overlay animate-float1"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-white mix-blend-overlay animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold text-white mb-6"
            onMouseEnter={() => setTalkText("Hear what our happy customers say!")}
            onMouseLeave={() => setTalkText(null)}
          >
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-300 group"
              onMouseEnter={() => setTalkText(testimonial.hoverText)}
              onMouseLeave={() => setTalkText(null)}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white group-hover:border-gray-300 transition-colors"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>

              <Quote className="w-6 h-6 text-gray-400 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div 
            className="inline-flex items-center space-x-2 bg-gray-800 px-8 py-4 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
            onMouseEnter={() => setTalkText("We're proud of our 4.8 rating!")}
            onMouseLeave={() => setTalkText(null)}
          >
            <Star className="w-6 h-6 fill-white text-white" />
            <span className="text-white font-medium">4.8 out of 5 stars</span>
            <span className="text-gray-400">from 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;