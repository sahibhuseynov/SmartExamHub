import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc, arrayRemove, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiUser, FiMail, FiCalendar,  FiTrash2,  FiBell, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';

const StudentsTab = ({ institutionId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [institution, setInstitution] = useState(null);
  
  const currentUser = useSelector((state) => state.user.user);
  const formRef = useRef();

  useEffect(() => {
    const fetchStudentsAndInstitution = async () => {
      try {
        setLoading(true);
        
        const institutionRef = doc(db, 'institutions', institutionId);
        const institutionSnap = await getDoc(institutionRef);
        
        if (!institutionSnap.exists()) {
          setStudents([]);
          return;
        }

        const institutionData = institutionSnap.data();
        setInstitution(institutionData);

        const memberUIDs = institutionData.members || [];
        
        const usersRef = collection(db, 'Users');
        const usersQuery = query(usersRef, where('__name__', 'in', memberUIDs));
        const usersSnapshot = await getDocs(usersQuery);
        
        let studentsData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isAdmin: doc.id === institutionData.adminUserId
        }));

        studentsData.sort((a, b) => {
          if (a.isAdmin && !b.isAdmin) return -1;
          if (!a.isAdmin && b.isAdmin) return 1;
          return 0;
        });
        
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndInstitution();
  }, [institutionId]);

  const handleRemoveStudent = async (studentId) => {
    try {
      if (studentId === currentUser?.uid) return;
      
      const institutionRef = doc(db, 'institutions', institutionId);
      await updateDoc(institutionRef, {
        members: arrayRemove(studentId)
      });
      
      setStudents(prev => prev.filter(student => student.id !== studentId));
    } catch (error) {
      console.error("Error removing student:", error);
      alert('Error removing student');
    }
  };

  const filteredStudents = students.filter(student =>
    student.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    const nonAdminStudents = filteredStudents.filter(s => !s.isAdmin).map(s => s.id);
    if (selectedStudents.length === nonAdminStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(nonAdminStudents);
    }
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (!isBulkMode) {
      setSelectedStudents([]);
    }
  };

  const handleSendNotification = async (notificationData) => {
    console.log('Notification data received:', notificationData);
    
    try {
      // Final validation
      if (!notificationData.title?.trim() || !notificationData.message?.trim()) {
        throw new Error('Both title and message are required');
      }

      const batch = writeBatch(db);
      const timestamp = Timestamp.now();
      const targets = selectedStudent ? [selectedStudent] : selectedStudents;

      if (targets.length === 0) {
        throw new Error('No students selected');
      }

      let notificationCount = 0;
      
      for (const studentId of targets) {
        const student = students.find(s => s.id === studentId);
        if (student && !student.isAdmin) {
          const notificationRef = doc(collection(db, 'Users', studentId, 'notifications'));
          batch.set(notificationRef, {
            title: notificationData.title,
            message: notificationData.message,
            read: false,
            createdAt: timestamp,
            institutionId: institutionId,
            institutionName: institution?.name || 'Institution'
          });
          notificationCount++;
        }
      }

      if (notificationCount === 0) {
        throw new Error('No valid students found for notification');
      }

      await batch.commit();
      alert(`Notification sent to ${notificationCount} student(s)`);
      
      // Reset states
      setShowNotificationModal(false);
      setSelectedStudent(null);
      setSelectedStudents([]);
      setIsBulkMode(false);

      return true;
    } catch (error) {
      console.error('Notification sending failed:', error);
      alert(`Failed to send notification: ${error.message}`);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-500">
            {students.length} registered students
            {isBulkMode && ` | ${selectedStudents.length} selected`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleBulkMode}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              isBulkMode 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isBulkMode ? (
              <>
                <FiX size={18} />
                Cancel Bulk Mode
              </>
            ) : (
              <>
                <FiCheck size={18} />
                Bulk Actions
              </>
            )}
          </button>
          
          {isBulkMode && selectedStudents.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowNotificationModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FiBell size={18} />
              Send Notification
            </motion.button>
          )}
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isBulkMode && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.filter(s => !s.isAdmin).length && 
                               filteredStudents.filter(s => !s.isAdmin).length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    className={`transition-colors ${
                      student.isAdmin ? 'bg-gray-50' : 
                      selectedStudents.includes(student.id) ? 'bg-green-50' : ''
                    } ${isBulkMode && !student.isAdmin ? 'cursor-pointer' : ''}`}
                    onClick={() => isBulkMode && !student.isAdmin && toggleStudentSelection(student.id)}
                  >
                    {isBulkMode && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!student.isAdmin && (
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          student.isAdmin ? 'bg-purple-100 text-purple-600' : 
                          selectedStudents.includes(student.id) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {student.photoURL ? (
                            <img className="h-10 w-10 rounded-full" src={student.photoURL} alt={student.displayName} />
                          ) : (
                            <FiUser className="text-lg" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {student.displayName || 'Unnamed User'}
                            {student.isAdmin && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <FiShield className="mr-1" />
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{student.role || 'Student'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-2 text-gray-400" />
                        {student.createdAt?.toDate?.().toLocaleDateString() || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {student.isAdmin ? (
                        <span className="text-gray-400">Admin actions</span>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student.id);
                              setShowNotificationModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg"
                            title="Details"
                          >
                            <FiUser className="text-lg" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student.id);
                              setShowNotificationModal(true);
                            }}
                            className="p-2 text-purple-600 hover:text-purple-800 bg-purple-50 rounded-lg"
                            title="Send Notification"
                          >
                            <FiBell className="text-lg" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Remove ${student.displayName} from institution?`)) {
                                handleRemoveStudent(student.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-lg"
                            title="Remove Student"
                          >
                            <FiTrash2 className="text-lg" />
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isBulkMode ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No students matching your search' : 'No registered students yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showNotificationModal && (
          <NotificationModal
            onClose={() => {
              setShowNotificationModal(false);
              setSelectedStudent(null);
            }}
            onSubmit={handleSendNotification}
            studentCount={selectedStudent ? 1 : selectedStudents.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationModal = ({ onClose, onSubmit, studentCount }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    message: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {
      title: !formData.title.trim(),
      message: !formData.message.trim()
    };
    setFormErrors(errors);
    
    if (errors.title || errors.message) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset on success
      setFormData({ title: '', message: '' });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {studentCount > 1 ? `Send Notification (${studentCount} students)` : 'Send Notification'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                className={`w-full p-3 border rounded-lg ${
                  formErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">Title is required</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                className={`w-full p-3 border rounded-lg h-32 ${
                  formErrors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.message && (
                <p className="text-red-500 text-xs mt-1">Message is required</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentsTab;