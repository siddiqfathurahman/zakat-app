import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="content px-6 py-12">
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12">
          
          {/* Logo & Deskripsi */}
          <div>
            <img
              src="/logo-putih.svg"
              alt="Masjid Al Anhar"
              className="w-40 mb-4"
            />

            <p className="text-sm leading-7 max-w-lg text-white/80">
              Masjid Al Anhar merupakan pusat kegiatan ibadah, dakwah,
              pendidikan Islam, serta pelayanan umat yang berkomitmen
              menghadirkan manfaat bagi masyarakat melalui berbagai program
              keislaman, zakat, qurban, dan kajian Al-Qur'an.
            </p>

            {/* Kontak */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white" />
                <span className="text-sm text-white/90">
                  info@masjidalanhar.id
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-sm text-white/90">
                  +62 812-3456-7890
                </span>
              </div>
            </div>
          </div>

          {/* Navigasi + Lokasi */}
          <div className="grid sm:grid-cols-2 gap-8">
            
            {/* Navigasi */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Navigasi
              </h3>

              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="/berita"
                    className="hover:text-white transition-colors"
                  >
                    Berita
                  </a>
                </li>

                <li>
                  <a
                    href="/al-quran"
                    className="hover:text-white transition-colors"
                  >
                    Qur'an Online
                  </a>
                </li>

                <li>
                  <a
                    href="/zakat"
                    className="hover:text-white transition-colors"
                  >
                    Zakat
                  </a>
                </li>

                <li>
                  <a
                    href="/qurban"
                    className="hover:text-white transition-colors"
                  >
                    Qurban
                  </a>
                </li>
              </ul>
            </div>

            {/* Lokasi */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Lokasi Masjid
              </h3>

              <p className="text-sm text-white/80 mb-4 leading-6">
                Keparakan Kidul MG/1234,
                Kec. Mergangsan,
                Kota Yogyakarta,
                Daerah Istimewa Yogyakarta.
              </p>

              <div className="overflow-hidden rounded-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.7714640029835!2d110.37169497412104!3d-7.813999377588248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a579ed87d4a77%3A0x75276a25a1d74088!2sMasjid%20Al%20Anhar!5e0!3m2!1sid!2sid!4v1731558857405!5m2!1sid!2sid"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Masjid Al Anhar"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} Masjid Al Anhar. Seluruh hak cipta
          dilindungi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;