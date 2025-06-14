import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

const InstitutionShowcase = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 -right-6 z-10 cursor-pointer bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-800 hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
      onClick={onClick}
      aria-label="Next"
    >
      <MdArrowForwardIos className="text-xl" />
    </button>
  );
  
  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 -left-6 z-10 cursor-pointer bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-800 hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
      onClick={onClick}
      aria-label="Previous"
    >
      <MdOutlineArrowBackIosNew className="text-xl" />
    </button>
  );

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'institutions'));
        const institutionsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(institution => institution.status === 'active')
          .sort((a, b) => a.order - b.order);
        
        setInstitutions(institutionsData);
      } catch (err) {
        console.error('Error fetching institutions:', err);
        setError('Təhsil müəssisələri yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Kurslar</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ən yaxşı təhsil təcrübəsini təqdim edən kurslarımız
        </p>
      </div>

      {error ? (
        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
      ) : (
        <div className="relative group">
          <Slider {...sliderSettings}>
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="px-2">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="p-6 flex flex-col items-center h-full">
                      <Skeleton circle width={120} height={120} className="mb-5" />
                      <Skeleton width="80%" height={24} className="mb-3" />
                      <Skeleton width="60%" height={18} className="mb-4" />
                      <Skeleton width="100%" height={40} className="rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              institutions.map((institution) => (
                <div key={institution.id} className="px-2">
                  <Link 
                    to={`/institutions/${institution.id}`}
                    className="block h-full"
                  >
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                      <div className="p-6 pb-4 flex-grow flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-5 flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                          {institution.logoUrl ? (
                            <img
                              src={institution.logoUrl}
                              alt={institution.name}
                              className="w-32 h-32 object-contain rounded-full transition-transform duration-300 hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-4xl font-bold text-blue-600">
                              {institution.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                         {institution.name.charAt(0).toUpperCase() + institution.name.slice(1)}

                        </h3>
                        
                      </div>
                      <div className="px-6 pb-6 w-full">
                        <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all">
                          Ətraflı
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default InstitutionShowcase;