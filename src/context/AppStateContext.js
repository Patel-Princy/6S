import React, { createContext, useState, useContext } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  // Mock Checklists
  const [checklists, setChecklists] = useState([
    { id: 'chk_1', zone: 1, subZone: 'Anviksha Ground Floor', submittedAt: new Date().toISOString(), status: 'completed' }, // Today
    { id: 'chk_2', zone: 1, subZone: 'Anviksha First Floor', submittedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), status: 'completed' }, // 1 day ago
    { id: 'chk_3', zone: 2, subZone: 'SoT Ground Floor All Labs', submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed' }, // 3 days ago
  ]);

  // Mock Complaints
  const [complaints, setComplaints] = useState([
    { id: 'comp_1', zone: 1, description: 'Dustbin missing in room 101', reportedBy: 'student_akshat', status: 'open', timestamp: new Date().toISOString() },
  ]);

  const addComplaint = (complaint) => {
    setComplaints([...complaints, { ...complaint, id: `comp_${Date.now()}`, timestamp: new Date().toISOString(), status: 'open' }]);
  };

  const addChecklist = (checklist) => {
    setChecklists([...checklists, { ...checklist, id: `chk_${Date.now()}`, submittedAt: new Date().toISOString(), status: 'completed' }]);
  };

  return (
    <AppStateContext.Provider value={{ checklists, complaints, addComplaint, addChecklist }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
