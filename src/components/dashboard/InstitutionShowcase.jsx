import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { db } from '../../firebase/config';

const InstitutionShowcase = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'institutions'));
        const institutionsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          // Filter to only include active institutions
          .filter(institution => institution.status === 'active');
        setInstitutions(institutionsData);
      } catch (err) {
        console.error('Error fetching institutions:', err);
        setError('Kurum bilgileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">İş Birliği Yaptığımız Kurumlar</span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Eğitimde mükemmelliği birlikte inşa ettiğimiz değerli kurumlar
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5"
          >
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Skeleton circle width={120} height={120} />
                      <Skeleton width={100} height={20} className="mt-4" />
                    </div>
                  ))
              : institutions.map((institution) => (
                  <motion.div
                    key={institution.id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-md transition duration-300"></div>
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-lg flex items-center justify-center p-4 border-2 border-gray-200 group-hover:border-blue-300 transition duration-300">
                        {institution.logoUrl ? (
                          <img
                            src={institution.logoUrl}
                            alt={institution.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">
                            {institution.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                      {institution.name}
                    </h3>
                  </motion.div>
                ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default InstitutionShowcase;