import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from "recharts";

import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ];

  useEffect(() => {
    if (isOwner) fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/owner/dashboard");
      if (res.data?.success) setData(res.data.dashboardData);
      else toast.error(res.data?.message || "Failed to load dashboard data");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------- Helpers ----------
  const safeBookings = Array.isArray(data.recentBookings) ? data.recentBookings : [];

  const monthLabel = (dateStr) => {
    if (!dateStr) return "Unknown";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Unknown";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  };

  // ---------- Charts data (computed from recentBookings) ----------
  const statusDonutData = useMemo(() => {
    const map = new Map();
    safeBookings.forEach((b) => {
      const s = (b?.status || "Unknown").toString();
      map.set(s, (map.get(s) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [safeBookings]);

  const bookingsByMonthBarData = useMemo(() => {
    const map = new Map();
    safeBookings.forEach((b) => {
      const key = monthLabel(b?.createdAt);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, bookings]) => ({ month, bookings }));
  }, [safeBookings]);

  const revenueByMonthLineData = useMemo(() => {
    const map = new Map();
    safeBookings.forEach((b) => {
      const key = monthLabel(b?.createdAt);
      const price = Number(b?.price || 0);
      map.set(key, (map.get(key) || 0) + (Number.isFinite(price) ? price : 0));
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  }, [safeBookings]);

  const scatterPriceVsDayData = useMemo(() => {
    // x = day of month, y = price
    return safeBookings
      .map((b) => {
        const d = new Date(b?.createdAt);
        const day = Number.isNaN(d.getTime()) ? null : d.getDate();
        const price = Number(b?.price || 0);
        if (day == null || !Number.isFinite(price)) return null;
        return { day, price };
      })
      .filter(Boolean);
  }, [safeBookings]);

  const priceHistogramData = useMemo(() => {
    // Histogram buckets: 0-199, 200-399, 400-599, 600-799, 800+
    const buckets = [
      { label: "0-199", min: 0, max: 199, count: 0 },
      { label: "200-399", min: 200, max: 399, count: 0 },
      { label: "400-599", min: 400, max: 599, count: 0 },
      { label: "600-799", min: 600, max: 799, count: 0 },
      { label: "800+", min: 800, max: Infinity, count: 0 },
    ];

    safeBookings.forEach((b) => {
      const price = Number(b?.price || 0);
      if (!Number.isFinite(price)) return;
      const bucket = buckets.find((x) => price >= x.min && price <= x.max);
      if (bucket) bucket.count += 1;
    });

    return buckets.map((b) => ({ range: b.label, count: b.count }));
  }, [safeBookings]);

  const CHART_COLORS = ["#2563eb", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#14b8a6"];

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* RECENT BOOKINGS + MONTHLY REVENUE */}
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {safeBookings.length === 0 ? (
            <p className="text-sm text-gray-400 mt-4">No recent bookings.</p>
          ) : (
            safeBookings.map((booking, index) => (
              <div key={index} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>

                  <div>
                    <p>
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.createdAt?.split("T")?.[0] || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">
                    {booking?.price ?? 0}
                    {currency}
                  </p>
                  <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                    {booking?.status || "Unknown"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {data.monthlyRevenue}
            {currency}
          </p>
        </div>
      </div>

      {/* ✅ CHARTS SECTION (5 charts minimum) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* 1) Donut chart */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full">
          <h2 className="text-lg font-medium">Bookings by Status</h2>
          <p className="text-gray-500 text-sm mb-4">Donut chart</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {statusDonutData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2) Bar chart */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full">
          <h2 className="text-lg font-medium">Bookings per Month</h2>
          <p className="text-gray-500 text-sm mb-4">Bar chart</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByMonthBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3) Line chart */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full">
          <h2 className="text-lg font-medium">Revenue Trend</h2>
          <p className="text-gray-500 text-sm mb-4">Line chart</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonthLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4) Scatter plot */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full">
          <h2 className="text-lg font-medium">Price vs Day of Month</h2>
          <p className="text-gray-500 text-sm mb-4">Scatter plot chart</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" name="Day" />
                <YAxis dataKey="price" name="Price" unit={currency} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Scatter name="Bookings" data={scatterPriceVsDayData} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5) Histogram */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full lg:col-span-2">
          <h2 className="text-lg font-medium">Price Distribution</h2>
          <p className="text-gray-500 text-sm mb-4">Histogram (buckets)</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceHistogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
