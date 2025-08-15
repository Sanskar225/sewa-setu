import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Camera, BarChart, HelpCircle, Medal } from 'lucide-react';
import { apiService } from '../../services/api';
import dayjs from 'dayjs';

const ServiceProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [availability, setAvailability] = useState(true);
  const [serviceArea, setServiceArea] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await apiService.get('/provider/dashboard');
      setBookings(data.bookings);
    } catch (error) {
      console.error('Dashboard Error:', error);
    }
  };

  const handleJobStart = (jobId) => {
    setCurrentJobId(jobId);
    setTimerStart(Date.now());
  };

  const handleJobComplete = (jobId) => {
    setCurrentJobId(null);
    setTimerStart(null);
    // Send job completion to server
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, Provider!</h2>

      {/* Live Timer */}
      {currentJobId && (
        <div className="bg-yellow-100 p-4 rounded-xl mb-4">
          <Clock className="inline mr-2" />
          <span>Job #{currentJobId} started: {dayjs(timerStart).format('HH:mm:ss')}</span>
        </div>
      )}

      {/* Today's Jobs */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h4 className="text-lg font-bold mb-3">Today's Bookings</h4>
        {bookings.map((booking) => (
          <div key={booking.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{booking.customerName}</p>
              <p className="text-sm text-gray-600">{booking.serviceType} at {booking.time}</p>
            </div>
            <div className="flex gap-2">
              {currentJobId !== booking.id ? (
                <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleJobStart(booking.id)}>Start</button>
              ) : (
                <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleJobComplete(booking.id)}>Complete</button>
              )}
              <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded">
                <Camera className="inline w-4 h-4" />
                <input type="file" className="hidden" multiple onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Analytics */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <BarChart className="inline mr-2" />
        <h4 className="text-lg font-bold">Performance Analytics</h4>
        <p className="text-sm">(Dummy Chart or integrate Recharts/Chart.js here)</p>
      </div>

      {/* Leaderboard / Badges */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <Medal className="inline mr-2 text-yellow-500" />
        <h4 className="text-lg font-bold">Your Rank: #12 (Gold Pro)</h4>
        <p className="text-sm">Complete more jobs to reach Platinum!</p>
      </div>

      {/* Availability */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h4 className="text-lg font-bold mb-2">Availability</h4>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={availability} onChange={() => setAvailability(!availability)} />
          <span>{availability ? 'Available for bookings' : 'Not available'}</span>
        </label>
      </div>

      {/* Service Area */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h4 className="text-lg font-bold mb-2">Service Area</h4>
        <input
          type="text"
          value={serviceArea}
          onChange={(e) => setServiceArea(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="Enter city or pin code(s)"
        />
      </div>

      {/* Help Center */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <HelpCircle className="inline mr-2 text-blue-500" />
        <h4 className="text-lg font-bold">Need Help?</h4>
        <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Report an Issue</button>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
  