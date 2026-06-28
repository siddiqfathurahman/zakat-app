import DashboardLayout from "../../Layout/DashboardLayout";
import {
    Users,
    Newspaper,
    HandCoins,
    Wallet,
    Bell,
    Eye,
    Pencil,
    Trash2,
    TrendingUp,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";


const buildStatCards = (totalUsers, totalNews) => [
    {
        label: "Total User",
        value: totalUsers,
        badge: null,
        icon: Users,
        iconBg: "bg-emerald-50 text-emerald-600",
        highlight: false,
    },
    {
        label: "Berita & Artikel",
        value: totalNews,
        badge: "+5",
        badgeColor: "text-secondary bg-amber-50",
        icon: Newspaper,
        iconBg: "bg-amber-50 text-secondary",
    },
    {
        label: "Donasi Masuk (Bulan Ini)",
        value: "86",
        badge: "New",
        badgeColor: "text-sky-600 bg-sky-50",
        icon: HandCoins,
        iconBg: "bg-sky-50 text-sky-600",
    },
    {
        label: "Saldo Kas",
        value: "Rp 124.5M",
        badge: null,
        icon: Wallet,
        iconBg: "bg-teal-50 text-primary",
        highlight: true,
    },
];

const chartData = [
    { bulan: "Jan", pemasukan: 62, pengeluaran: 40 },
    { bulan: "Feb", pemasukan: 55, pengeluaran: 42 },
    { bulan: "Mar", pemasukan: 70, pengeluaran: 45 },
    { bulan: "Apr", pemasukan: 60, pengeluaran: 48 },
    { bulan: "Mei", pemasukan: 58, pengeluaran: 44 },
    { bulan: "Jun", pemasukan: 65, pengeluaran: 50 },
    { bulan: "Jul", pemasukan: 72, pengeluaran: 52 },
    { bulan: "Agu", pemasukan: 68, pengeluaran: 53 },
    { bulan: "Sep", pemasukan: 78, pengeluaran: 55 },
    { bulan: "Okt", pemasukan: 85, pengeluaran: 58 },
    { bulan: "Nov", pemasukan: 95, pengeluaran: 60 },
    { bulan: "Des", pemasukan: 120, pengeluaran: 62 },
];

const activities = [
    {
        name: "Ahmad Fauzi",
        activity: "Mengedit keuangan",
        date: "12 Mei 2024, 14:20",
    },
    {
        name: "Siti Aminah",
        activity: "Pendaftaran Akun Baru",
        date: "12 Mei 2024, 13:05",
    },
    {
        name: "Drs. H. Fulyadi",
        activity: "Update Pengumuman Berita",
        date: "12 Mei 2024, 10:20",
    },
];

const getInitials = (name) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

const avatarColors = [
    "bg-emerald-600",
    "bg-sky-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-violet-600",
    "bg-teal-600",
];
const avatarColor = (name) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

function Avatar({ name, size = "h-9 w-9", text = "text-sm" }) {
    return (
        <span
            className={`${size} ${avatarColor(name)} ${text} flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white`}
        >
            {getInitials(name)}
        </span>
    );
}


const AdminDashboard = ({ authUser, totalUsers, totalNews }) => {
    const statCards = buildStatCards(totalUsers, totalNews);
    return (
        <DashboardLayout>
            <div className="w-full ">
                <div className="flex items-center justify-between bg-white border border-gray-200 p-4 md:p-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Berikut adalah ringkasan performa Masjid Al Anhar
                            hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifikasi */}
                        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        {/* Profil Admin */}
                        <div className="flex items-center gap-2.5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 leading-none">
                                    {authUser.name}
                                </p>
                                <p className="mt-0.5 text-[11px] text-gray-400 capitalize">
                                    {authUser.role}
                                </p>
                            </div>
                            <Avatar
                                name={authUser.name}
                                size="h-9 w-9"
                                text="text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className=" space-y-6 px-4 py-6 md:px-6">
                    <div>
                        <p className="md:text-3xl text-xl font-bold text-primary">
                            Selamat Datang Kembali {authUser.role}, {authUser.name}!
                        </p>
                        <p className="text-xs text-gray-400">
                            Berikut adalah ringkasan performa Masjid Al Anhar
                            hari ini.
                        </p>
                    </div>


                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {statCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60"
                                >
                                    <div className="flex items-start justify-between">
                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        {card.badge && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${card.badgeColor}`}
                                            >
                                                {card.badge}
                                            </span>
                                        )}
                                        {!card.badge && i === 3 && (
                                            <Eye className="h-4 w-4 text-gray-300" />
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs text-gray-400">
                                        {card.label}
                                    </p>
                                    <p
                                        className={`mt-1 text-3xl font-extrabold ${
                                            card.highlight
                                                ? "text-primary"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {card.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Chart Keuangan ── */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/60">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">
                                Statistik Keuangan Bulanan
                            </p>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-primary">
                                Tahun 2024
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 4,
                                    right: 8,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="gradPemasukan"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#0d4f3c"
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#0d4f3c"
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="gradPengeluaran"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#b8924a"
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#b8924a"
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="bulan"
                                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow:
                                            "0 4px 16px rgba(0,0,0,0.08)",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        paddingTop: "12px",
                                    }}
                                    formatter={(value) =>
                                        value === "pemasukan"
                                            ? "Pemasukan (Donasi)"
                                            : "Pengeluaran (Operasional)"
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pemasukan"
                                    stroke="#0d4f3c"
                                    strokeWidth={2.5}
                                    fill="url(#gradPemasukan)"
                                    dot={{
                                        r: 3.5,
                                        fill: "#0d4f3c",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{ r: 5 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pengeluaran"
                                    stroke="#b8924a"
                                    strokeWidth={2}
                                    strokeDasharray="5 4"
                                    fill="url(#gradPengeluaran)"
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ── Aktivitas Terkini ── */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/60">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900">
                                Aktivitas Terkini
                            </p>
                            <button className="text-xs font-semibold text-primary hover:underline">
                                Lihat Semua
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {[
                                            "USER",
                                            "AKTIVITAS",
                                            "TANGGAL",
                                            "AKSI",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="pb-3 text-left text-[11px] font-bold tracking-wide text-primary"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activities.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50/60"
                                        >
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        name={row.name}
                                                        size="h-8 w-8"
                                                        text="text-xs"
                                                    />
                                                    <span className="font-semibold text-gray-800">
                                                        {row.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500">
                                                {row.activity}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">
                                                {row.date}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-primary transition">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
