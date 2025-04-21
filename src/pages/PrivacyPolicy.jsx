// src/pages/PrivacyPolicy.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-16 px-4 lg:px-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-center mb-12">Məxfilik Siyasəti</h1>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Toplanan Məlumat</h2>
            <p className="text-lg leading-relaxed">
              <span className="font-bold">Balabebir.az</span> saytı üzərindən qeydiyyatdan keçən istifadəçilərdən ad, soyad, email ünvanı kimi məlumatlar toplanır. 
              Bu məlumatlar yalnız istifadəçi təcrübəsini yaxşılaşdırmaq və xidmətlərimizi təkmilləşdirmək məqsədilə istifadə olunur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Məlumatların Təhlükəsizliyi</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçi məlumatları yüksək təhlükəsizlik tədbirləri ilə qorunur. <span className="font-bold">Balabebir.az</span> mütəmadi olaraq məlumat təhlükəsizliyini izləyir
              və yeni təhlükəsizlik risklərinə qarşı tədbirlər alır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Kukilər (Cookies)</h2>
            <p className="text-lg leading-relaxed">
              Saytımıza daxil olduğunuz zaman kukilər (cookies) istifadə edilir. Bu kukilər saytda səyahətinizi daha asanlaşdırır və fərdiləşdirir. 
              İstifadəçilər öz brauzerlərindən kukiləri idarə edə bilərlər.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Məlumatların Üçüncü Tərəflərə Verilməsi</h2>
            <p className="text-lg leading-relaxed">
              <span className="font-bold">Balabebir.az</span> tərəfindən toplanan məlumatlar üçüncü tərəflərə yalnız qanuni əsaslarla və ya dövlət orqanlarının tələbi ilə verilə bilər.
              Bu halda, məlumatların verilməsi yalnız müvafiq qanunvericiliyə uyğun şəkildə həyata keçirilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Məlumatların Silinməsi</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçilər öz məlumatlarının silinməsi üçün bizimlə əlaqə saxlaya bilərlər. Məlumatlar silindikdən sonra geri qaytarılacaq məlumatlar olmayacaqdır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Dəyişikliklər</h2>
            <p className="text-lg leading-relaxed">
              Məxfilik siyasətində edilən dəyişikliklər <span className="font-bold">Balabebir.az</span> saytında yerləşdiriləcək və istifadəçilərə bu barədə xəbər veriləcəkdir.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
