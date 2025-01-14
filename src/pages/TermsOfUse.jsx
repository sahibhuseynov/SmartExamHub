// src/pages/TermsOfUse.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfUse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-16 px-4 lg:px-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-center mb-12">İstifadə Şərtləri</h1>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Ümumi Məlumat</h2>
            <p className="text-lg leading-relaxed">
              Bu İstifadə Şərtləri "Cirtdan.az" platformasından istifadə edən hər bir istifadəçi üçün tətbiq olunur. Saytı ziyarət edərək və ya bu platformada qeydiyyatdan keçərək istifadəçi, bu şərtləri qəbul etmiş sayılır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Hesab Yaradılması və Təhlükəsizlik</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçilər platformadan tam olaraq istifadə edə bilmək üçün qeydiyyatdan keçməlidirlər. İstifadəçi hesablarının təhlükəsizliyindən tam məsuliyyət istifadəçiyə aiddir. Hesab məlumatları və şifrələr üçüncü tərəflərlə paylaşılmamalıdır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Xidmətlərdən İstifadə</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçilər platformada təqdim edilən xidmətlərdən yalnız qanuni məqsədlər üçün istifadə edə bilərlər. Saytda yayımlanan materiallar yalnız şəxsi istifadə məqsədilə əldə edilə bilər və icazəsiz şəkildə təkrarlanması və yayılması qadağandır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Ödəniş Prosesi</h2>
            <p className="text-lg leading-relaxed">
              Platforma üzərindən təqdim edilən məhsul və xidmətlərə görə ödənişlər qəbul edilir. İstifadəçi ödənişi təsdiqlədikdən sonra xidmətlərdən istifadə edə bilər. Ödənişlər geri qaytarılmır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">İstifadəçi Hüquqları və Vəzifələri</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçilər saytdan yalnız qanuni məqsədlər üçün istifadə etməli və digər istifadəçilərin hüquqlarına hörmət göstərməlidir. Sayta zərərli və ya qeyri-qanuni məzmun yerləşdirilməsi qadağandır və belə fəaliyyətlər hesabın dayandırılmasına səbəb ola bilər.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Şərtlərdə Dəyişikliklər</h2>
            <p className="text-lg leading-relaxed">
              "Cirtdan.az" platforması, bu İstifadə Şərtlərini istənilən vaxt dəyişdirmək hüququna malikdir. Dəyişikliklər saytda yayımlandığı andan etibarən qüvvəyə minir və istifadəçilər dəyişiklikləri izləmək məsuliyyətini daşıyırlar.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Məsuliyyət</h2>
            <p className="text-lg leading-relaxed">
              Sayt üzərindəki məlumatların doğruluğu və ya istifadəçi təcrübəsi ilə bağlı yaranan problemlər üçün "Cirtdan.az" məsuliyyət daşımır. Sayt istifadəçilərindən tələb olunan hər hansı bir məlumat, yalnız istifadəçinin öz riskləri ilə qəbul edilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Əlaqə</h2>
            <p className="text-lg leading-relaxed">
              İstifadəçilər, saytla əlaqə qurmaq və ya hər hansı bir sual vermək üçün <span className="font-bold">info@cirtdan.az</span> ünvanından istifadə edə bilərlər.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
