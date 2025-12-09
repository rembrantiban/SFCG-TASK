import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../lib/axios";
import {
  ArrowUpDown,
  Search,
  UserCheck,
  ListChecks,
  Calendar,
  Eye,
  X,
  Printer,
} from "lucide-react";

import { useReactToPrint } from "react-to-print";

const RecordTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRecord, setSelectedRecord] = useState(null);

  // PRINT REF
  const printRef = useRef(null);

  // PRINT FUNCTION
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Task Records Report",
  });

  // FETCH
  useEffect(() => {
    axiosInstance.get("/assign/record").then((res) => {
      setRecords(res.data.records || []);
      setFilteredRecords(res.data.records || []);
    });
  }, []);

  // SEARCH + SORT
  useEffect(() => {
    let filtered = [...records];

    filtered = filtered.filter((r) => {
      const term = search.toLowerCase();
      const title = r.requestId?.taskType?.toLowerCase() || "";
      const assigned = `${r.assign?.firstName || ""} ${
        r.assign?.lastName || ""
      }`.toLowerCase();
      return title.includes(term) || assigned.includes(term);
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const A = getSortValue(a, sortConfig.key);
        const B = getSortValue(b, sortConfig.key);
        if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
        if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredRecords(filtered);
  }, [search, sortConfig, records]);

  const getSortValue = (record, key) => {
    switch (key) {
      case "title":
        return record.requestId?.taskType || "";
      case "assign":
        return `${record.assign?.firstName} ${record.assign?.lastName}`;
      case "date":
        return new Date(record.updatedAt);
      default:
        return "";
    }
  };

  const SortIcon = () => (
    <ArrowUpDown size={14} className="inline ml-1 text-gray-500" />
  );

   const latestRecord = filteredRecords[0] || null;

  return (
    <div className="p-4">

      <div className="no-print bg-white shadow-sm p-4 rounded-lg  ">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Task Records</h2>

          <div className="flex gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 border border-gray-300 outline outline-gray-400 rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => setSortConfig({ key: "title", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                <ListChecks size={14} className="inline mr-1" />
                Request Title <SortIcon />
              </th>

              <th className="px-4 py-2 cursor-pointer" onClick={() => setSortConfig({ key: "assign", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                <UserCheck size={14} className="inline mr-1" />
                Assigned Staff <SortIcon />
              </th>

              <th className="px-4 py-2">Status</th>

              <th className="px-4 py-2 cursor-pointer" onClick={() => setSortConfig({ key: "date", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                <Calendar size={14} className="inline mr-1" />
                Completed Date <SortIcon />
              </th>

              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r._id} className="">
                <td className="px-4  relative left-15 py-2">{r.requestId?.taskType}</td>
                <td className="px-4  relative left-15 py-2">{r.assign?.firstName} {r.assign?.lastName}</td>
                <td className="px-4 relative left-10 py-2">{r.status}</td>
                <td className=" relative left-20 py-2">{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td className="px-4  relative left-5  py-2">
                  <button className="text-blue-600" onClick={() => setSelectedRecord(r)}>
                    <Eye size={16} className="inline" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>


      <div ref={printRef} className="hidden print:block mx-auto w-[210mm] min-h-[297mm] p-5 bg-white text-black border border-black">

       
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/sfcg.png" className="h-12 w-12" />
            <div>
              <p className="font-bold uppercase">Saint Francis College Guihulngan</p>
              <p className="text-xs">NOI Task Management System</p>
            </div>
          </div>

          <div className="text-xs border border-black p-2 leading-tight">
            <div className="flex justify-between gap-2">
              <span>Form No.</span><span>: TM-001</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Rev. No.</span><span>: 00</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Date</span><span>: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="border border-black mt-4 text-center py-1">
          <p className="font-bold uppercase text-sm">Master List of Completed Tasks</p>
          <p className="text-xs">SFCG – NOI Task Management System</p>
        </div>

        <table className="w-full border border-black mt-4 text-[11px] border-collapse">
          <thead>
            <tr>
              <th className="border border-black px-1 py-1 w-10 text-center">No</th>
              <th className="border border-black px-1 py-1">Request Type</th>
              <th className="border border-black px-1 py-1">Assigned Staff</th>
              <th className="border border-black px-1 py-1">Status</th>
              <th className="border border-black px-1 py-1">Date Completed</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r, i) => (
              <tr key={r._id}>
                <td className="border border-black px-1 py-1 text-center">{i + 1}</td>
                <td className="border border-black px-1 py-1">{r.requestId?.taskType}</td>
                <td className="border border-black px-1 py-1">{r.assign?.firstName} {r.assign?.lastName}</td>
                <td className="border border-black px-1 py-1">{r.status}</td>
                <td className="border border-black px-1 py-1">
                  {new Date(r.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       <div className="mt-10 flex gap-16 text-[11px]">
<div>
    <div>Noted by:</div>
    <div className="mt-2 border-b border-black w-40 text-center">
      {latestRecord?.requestId?.notedBy
        ? `${latestRecord.requestId.notedBy.firstName} ${latestRecord.requestId.notedBy.lastName}`
        : ""}
    </div>
  </div>

  <div>
    <div>Approved by:</div>
    <div className="mt-2 border-b border-black w-40 text-center">
      {latestRecord?.requestId?.approvedBy
        ? `${latestRecord.requestId.approvedBy.firstName} ${latestRecord.requestId.approvedBy.lastName}`
        : ""}
    </div>
  </div>

</div>

      </div>

{selectedRecord && (
  <div className="no-print fixed z-40 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
    
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden animate-scaleIn">
      
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Eye size={20} className="text-blue-600" />
          Request Details
        </h3>

        <button
          onClick={() => setSelectedRecord(null)}
          className="text-gray-500 hover:text-red-600 transition"
        >
          <X size={22} />
        </button>
      </div>

      <div className="p-5 space-y-4 text-sm">
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Request Type</p>
          <div className="p-2 bg-gray-100 rounded text-gray-800">
            {selectedRecord?.requestId?.taskType}
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-medium text-gray-700">Category</p>
          <div className="p-2 bg-gray-100 rounded text-gray-800">
            {selectedRecord?.requestId?.category}
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-medium text-gray-700">Urgency</p>
          <div className="p-2 bg-gray-100 rounded text-gray-800">
            {selectedRecord?.requestId?.urgency}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-gray-700">Requested By</p>
            <div className="p-2 bg-gray-100 rounded text-gray-800">
              {selectedRecord?.requestId?.requestedBy?.firstName}{" "}
              {selectedRecord?.requestId?.requestedBy?.lastName}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Assigned Staff</p>
            <div className="p-2 bg-gray-100 rounded text-gray-800">
              {selectedRecord?.assign?.firstName}{" "}
              {selectedRecord?.assign?.lastName}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-medium text-gray-700">Date Completed</p>
          <div className="p-2 bg-gray-100 rounded text-gray-800">
            {new Date(selectedRecord?.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Details</p>
          <div className="p-3 bg-gray-100 rounded text-gray-800 leading-relaxed">
            {selectedRecord?.requestId?.requestDetails}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-right border-t">
        <button
          onClick={() => setSelectedRecord(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default RecordTable;
