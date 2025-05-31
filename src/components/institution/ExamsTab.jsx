import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiBook, FiClock, FiUsers, FiBarChart2, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ExamsTab = ({ institutionId }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchExamsAndInstitution = async () => {
      try {
        setLoading(true);
        
        // 1. Get institution data
        const institutionRef = doc(db, 'institutions', institutionId);
        const institutionSnap = await getDoc(institutionRef);
        
        if (!institutionSnap.exists()) {
          throw new Error('Institution not found');
        }
        
        setInstitution(institutionSnap.data());

        // 2. Get exams for this institution
        const examsQuery = query(
          collection(db, 'institutionsExams'),
          where('institutionId', '==', institutionId)
        );
        
        const examsSnapshot = await getDocs(examsQuery);
        const examsData = examsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to JS Date
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate()
        }));

        setExams(examsData);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    if (institutionId) {
      fetchExamsAndInstitution();
    }
  }, [institutionId]);
  console.log('Exams:', exams);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {institution?.name || 'Institution'} Exams
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Create New Exam
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500">No exams found for this institution</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create First Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{exam.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  exam.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.status || 'draft'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>
                    {exam.startDate?.toLocaleDateString()} - {exam.endDate?.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-2" />
                  <span>{exam.participants?.length || 0} participants</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiBarChart2 className="mr-2" />
                  <span>{exam.questions?.length || 0} questions</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <Link
                  to={`/exam/${exam.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

     
    </div>
  );
};

export default ExamsTab;