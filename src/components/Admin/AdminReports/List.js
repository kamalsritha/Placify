import React, { useEffect, useState } from "react";

const List = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/list");
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Placed Students by Company</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : companies.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Company Name</th>
              <th className="border p-2 text-left">Students Placed</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id} className="border">
                <td className="border p-2">{company._id}</td>
                <td className="border p-2">{company.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No data available</p>
      )}
    </div>
  );
};

export default List;
