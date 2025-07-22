import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homeowner, Lucknow',
      rating: 5,
      comment: 'Excellent service! The cleaning team was professional and thorough. My house has never looked better.',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Rohit Verma',
      role: 'Business Owner, Lucknow',
      rating: 5,
      comment: 'The repair service was quick and efficient. Fixed my electrical issue within hours of booking.',
      image: 'https://images.pexels.com/photos/3564440/pexels-photo-3564440.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Anjali Mehta',
      role: 'Working Professional, Lucknow',
      rating: 5,
      comment: 'Love the convenience! Beauty services at home save me so much time. Highly recommended.',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: 'Aman Singh',
      role: 'Tech Professional, Lucknow',
      rating: 5,
      comment: 'The app is so easy to use and the service providers are always punctual and professional.',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 grayscale"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-800 text-gray-800" />
                ))}
              </div>

              <Quote className="w-6 h-6 text-gray-600 mb-2" />
              <p className="text-gray-700 text-sm leading-relaxed">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gray-200 px-6 py-3 rounded-full">
            <Star className="w-5 h-5 fill-gray-800 text-gray-800" />
            <span className="text-gray-800 font-medium">4.8 out of 5 stars</span>
            <span className="text-gray-600">from 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
