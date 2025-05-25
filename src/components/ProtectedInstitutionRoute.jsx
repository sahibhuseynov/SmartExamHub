import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedInstitutionRoute = () => {
  const user = useSelector((state) => state.user.user);
  const [hasInstitution, setHasInstitution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInstitution = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          setHasInstitution(!!userDoc.data()?.activeInstitution);
        } catch (error) {
          console.error('Kurum kontrol hatası:', error);
          setHasInstitution(false);
        }
      }
      setLoading(false);
    };

    checkInstitution();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (!hasInstitution) return <Navigate to="/kurslar" />;

  return <Outlet />;
};

export default ProtectedInstitutionRoute;