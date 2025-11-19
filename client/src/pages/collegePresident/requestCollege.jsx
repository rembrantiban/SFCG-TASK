import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import RequestCard from "../../component//taskpresidentview/requestCard"
import RequestDetailsModal from "../../component/taskpresidentview/requestDetailModal";
import Header from "../../component/common/presidentaskheader";

const UnnapprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchUnnotedRequests();
  }, []);

  const fetchUnnotedRequests = async () => {
    try {
      const res = await axiosInstance.get("/request/getallunapproved");
      if (res.data.success) setRequests(res.data.requests);
    } catch (error) {
      console.error("Error fetching unnoted requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <span className="bg-blue-600 text-white p-2 rounded-lg">
            📌
          </span>
          Staff Requests
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          View and monitor pending staff work orders and follow-ups.
        </p>
      </div>


      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No unnoted requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => (
            <RequestCard key={req._id} data={req} onViewDetails={() => setSelectedRequest(req)} />
          ))}
        </div>
      )}

      {selectedRequest && (
       <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          refreshData={fetchUnnotedRequests}
        />

      )}
    </div>
    </div>
  );
};

export default UnnapprovedRequests;
