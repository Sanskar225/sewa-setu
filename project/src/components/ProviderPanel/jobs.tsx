import React, { useState } from "react";
import { Job, Bid } from "./types";

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "AC Not Cooling",
    description: "AC blows air but not cold. Might need gas refill.",
    location: "Mumbai, Andheri",
    budget: 1500,
    serviceType: "AC",
    createdAt: "2023-10-25",
    userRating: 4.2,
  },
  {
    id: "2",
    title: "Kitchen Pipe Leak",
    description: "Pipe under sink leaking badly.",
    location: "Delhi, Rohini",
    budget: 800,
    serviceType: "Plumbing",
    createdAt: "2023-10-24",
  },
];

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidMessage, setBidMessage] = useState<string>("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("All");

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setBidAmount(job.budget); // Pre-fill with job's budget
  };

  const submitBid = () => {
    if (!selectedJob) return;
    const newBid: Bid = {
      jobId: selectedJob.id,
      providerId: "provider-123", // Replace with actual provider ID (from auth)
      amount: bidAmount,
      message: bidMessage,
    };
    alert(`Bid submitted! ₹${bidAmount} for "${selectedJob.title}"`);
    setSelectedJob(null); // Close modal
  };

  const filteredJobs = serviceTypeFilter === "All" 
    ? jobs 
    : jobs.filter(job => job.serviceType === serviceTypeFilter);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Services</option>
          <option value="AC">AC Repair</option>
          <option value="Plumbing">Plumbing</option>
        </select>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg">{job.title}</h2>
            <p className="text-gray-600">{job.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span>📍 {job.location}</span>
              <span>💰 ₹{job.budget}</span>
            </div>
            <button
              onClick={() => handleApply(job)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Bid for: {selectedJob.title}</h2>
            <p className="mb-4">{selectedJob.description}</p>
            
            <div className="mb-4">
              <label className="block mb-2">Your Bid (₹)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Message (Optional)</label>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={submitBid}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit Bid
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;