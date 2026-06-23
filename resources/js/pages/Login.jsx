import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { User, Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react";

const loginImage = "/login-image.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="flex min-h-screen w-full">

      <div className="relative hidden w-[45%] flex-shrink-0 overflow-hidden lg:flex">
        <img
          src={loginImage}
          alt="Masjid Al Anhar"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-10 left-8 right-8">
          <h2 className="text-4xl font-bold font-second leading-snug text-secondary">
            Ketenangan dalam
            <br />
            Pengabdian
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Platform manajemen terintegrasi untuk kemudahan
            <br />
            dan transparansi Masjid Al Anhar.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-8 py-10 md:px-14">
        <div className="flex items-center gap-3">

        </div>

        <div className="mx-auto w-full max-w-md">
          <a href="/" className="flex items-center justify-center mb-2">
            <img
              src="/logo-hijau.svg"
              alt="Logo Masjid Al Anhar"
              className="md:h-24 h-16 w-auto"
            />
          </a>
          <p className="max-w-md mx-auto text-sm text-gray-500 text-center">
            Platform manajemen terintegrasi untuk kemudahan dan transparansi Masjid Al Anhar.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Email atau Username
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus-within:border-primary">
                <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none border-none focus:outline-none focus:ring-0"
                  required
                />
              </div>
              {errors.username && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.username}
                </span>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                Kata Sandi
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus-within:border-primary">
                <Lock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none border-none focus:outline-none focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData("remember", e.target.checked)}
                  className="h-4 w-4 accent-primary rounded"
                />
                Ingat Saya
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Lupa Kata Sandi?
              </a>
            </div>

            {(errors.username || errors.password) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Gagal Masuk</span>
                  <p>{errors.username || errors.password}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {processing ? "Masuk..." : "Masuk"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400">
          <p>©2026 MASJID AL ANHAR. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;