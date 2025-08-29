import React, { useState, useEffect } from "react";
import { Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { apiService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Booking } from "../../types";
import toast from "react-hot-toast";

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiService.getMyJobs();
      setJobs(response.bookings || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId: string, status: string) => {
    try {
      await apiService.updateBookingStatus(jobId, status);
      toast.success(`Job ${status.toLowerCase()} successfully`);
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  const filteredJobs = statusFilter === "ALL" 
    ? jobs 
    : jobs.filter(job => job.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            💼 My Jobs
          </h1>
          <p className="text-gray-600 text-sm">Manage your service requests and bookings</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-medium border transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white border-gray-900 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                    {job.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{job.category}</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {job.user?.name || 'Customer'}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                    {job.status}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">₹{job.price}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{new Date(job.dateTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">{job.location}</span>
                </div>
              </div>

              {job.notes && (
                <div className="text-sm text-gray-600 italic mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-800">Customer Note:</span> {job.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Job ID: #{job.id.slice(0, 8)}
                </div>
                
                <div className="flex gap-2">
                  {job.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(job.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Accept Job
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(job.id, 'CANCELLED')}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleStatusUpdate(job.id, 'COMPLETED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 text-sm mb-6">
              {statusFilter === 'ALL'
                ? "You don't have any job requests yet. Make sure your profile is complete and you're available for bookings."
                : `No ${statusFilter.toLowerCase()} jobs found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;