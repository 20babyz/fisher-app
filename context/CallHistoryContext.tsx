import React, { createContext, useState, ReactNode } from 'react';

/* ─── 데이터 타입 ─── */
export interface HistoryItem {
  id:       string;
  name:     string;
  category: '보이스피싱 의심' | '딥보이스 의심' | '안심 통화' | '통화 내용 없음';
  callType: 'incoming' | 'outgoing' | 'missed';
  summary:  string;
  dateTime: string;   // ISO 문자열
}

/* ─── Context 인터페이스 ─── */
interface Ctx {
  calls: HistoryItem[];
  addCall:        (c: HistoryItem) => void;
  updateCategory: (id: string, cat: HistoryItem['category']) => void;
}

export const CallHistoryContext = createContext<Ctx>({
  calls: [], addCall: () => {}, updateCategory: () => {},
});

/* ─── 샘플 초기 데이터 ─── */
const init: HistoryItem[] = [
  {
    id:'1',name:'070-5232-5486',category:'보이스피싱 의심',
    callType:'incoming',summary:'발신 전화 | 2분 5초',dateTime:'2025-06-02T15:58:00',
  },{
    id:'2',name:'02-6344-4478',category:'안심 통화',
    callType:'outgoing',summary:'수신 전화 | 1분 12초',dateTime:'2025-06-02T14:18:00',
  },{
    id:'3',name:'조민혁 (모시공20)',category:'통화 내용 없음',
    callType:'missed',summary:'부재중 전화',dateTime:'2025-05-31T19:13:00',
  },{
    id:'4',name:'010-1122-3344',category:'딥보이스 의심',
    callType:'outgoing',summary:'발신 전화 | 3분 27초',dateTime:'2025-05-30T00:00:00',
  },
];

/* ─── Provider ─── */
export const CallHistoryProvider: React.FC<{children:ReactNode}> = ({ children }) => {
  const [calls, setCalls] = useState<HistoryItem[]>(init);

  const addCall = (item: HistoryItem) => setCalls(p => [item, ...p]);

  /** id 매칭 항목의 category 만 변경 */
  const updateCategory = (id: string, cat: HistoryItem['category']) =>
    setCalls(prev => prev.map(c => c.id === id ? { ...c, category: cat } : c));

  return (
    <CallHistoryContext.Provider value={{ calls, addCall, updateCategory }}>
      {children}
    </CallHistoryContext.Provider>
  );
};
