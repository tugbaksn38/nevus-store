//src/app/users/page.js

"use client";

import BackButton from "@/components/BackButton"; // bileşeni eklemeyi unutma
import { useEffect, useState } from "react";
import { getUsers } from "@/services/products";


export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    async function fetchData() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchData();
  }, []);

  const safeCompare = (a, b) => {
    if (!a) a = "";
    if (!b) b = "";
    return a.localeCompare(b);
  };


  const sortedUsers = [...users].sort((a, b) => {
    let valA = sortConfig.key === "city" ? a.address?.city : a[sortConfig.key];
    let valB = sortConfig.key === "city" ? b.address?.city : b[sortConfig.key];
    return sortConfig.direction === "asc" ? safeCompare(valA, valB) : safeCompare(valB, valA);
  });

  const renderSortDropdown = (columnKey) => (
    <select
      className="ml-2 border rounded p-1"
      value={sortConfig.key === columnKey ? sortConfig.direction : "asc"}
      onChange={e => setSortConfig({ key: columnKey, direction: e.target.value })}
    >
      <option value="asc">A → Z</option>
      <option value="desc">Z → A</option>
    </select>
  );

  return (
    <div className="p-6">
       <BackButton /> {/* Geri butonu en üstte */}
      <h1 className="text-2xl font-bold mb-4">Kullanıcılar</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">
              Ad {renderSortDropdown("name")}
            </th>
            <th className="border p-2 text-left">
              Mail {renderSortDropdown("email")}
            </th>
            <th className="border p-2 text-left">
              Şehir {renderSortDropdown("city")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.address?.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
