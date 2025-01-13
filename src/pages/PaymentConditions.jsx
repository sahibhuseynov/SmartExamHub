// src/pages/PaymentConditions.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentConditions = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-16">
        <div className="max-w-6xl mx-auto ">
          <h1 className="text-4xl font-extrabold text-center mb-12">Ödəniş Şərtləri və Qaydaları</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Xidmətin İstifadə Qaydaları</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçi <span className="font-bold">Cirtdan.az</span> platformasında təqdim olunan xidmətlərdən istifadə etməklə bu
              şərtləri qəbul edir. Testlər və materiallar haqqında ətraflı məlumat əldə etdikdən sonra istifadəçi sərbəst şəkildə seçdiyi məhsulları
              ödənişli və ya pulsuz əldə edə bilər.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Geri Ödəniş Qaydası</h2>
            <p className="text-lg leading-relaxed">
              <span className="font-bold">Cirtdan.az</span> saytında yerləşdirilən tədris materiallarının keyfiyyətinə görə məsuliyyət müəllifə aiddir.
              İstifadəçinin şikayəti varsa, bu cür müraciətlər birbaşa müəllifə ünvanlanmalıdır. Ödənilən vəsaitlər <span className="font-bold">Cirtdan MMC</span>
              tərəfindən geri qaytarılmır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ödəniş Prosesi</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçi bank kartı ilə ödəniş edərək balansını artırıb məhsul əldə edə bilər. Profilinizdəki "Balansım" bölməsindən
              ödəniş məbləğini daxil edib kart məlumatlarını təqdim edin. Şərtləri qəbul edərək ödənişi təsdiqlədikdən sonra balansınız yenilənəcək.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Məxfilik və Təhlükəsizlik</h2>
            <p className="text-lg leading-relaxed">
              <span className="font-bold">Cirtdan MMC</span> kart məlumatlarınızı saxlamır və paylaşmır. Məlumatlarınızın qorunması üçün qabaqcıl
              təhlükəsizlik texnologiyaları tətbiq edilir.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentConditions;
