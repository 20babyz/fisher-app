import React, { createContext, useState, ReactNode } from 'react';

/* ───────── 데이터 타입 ───────── */
export interface HistoryItem {
  id:       string;
  name:     string;
  category: '보이스피싱 의심' | '딥보이스 의심' | '안심 통화' | '통화 내용 없음';
  callType: 'incoming' | 'outgoing' | 'missed';
  summary:  string;
  dateTime: string;       // ISO 문자열 (정렬용)
}

/* ───────── Context 생성 ───────── */
interface ContextProps {
  calls:    HistoryItem[];
  addCall: (item: HistoryItem) => void;
}

export const CallHistoryContext = createContext<ContextProps>({
  calls:   [],
  addCall: () => {},
});

/* ───────── Provider ───────── */
const initialCalls: HistoryItem[] = [
  {
    id: '1',
    name: '070-5232-5486',
    category: '보이스피싱 의심',
    callType: 'incoming',
    summary: '발신 전화 | 2분 5초',
    dateTime:'2025-06-02T15:58:00',       // 6월 2일 15:58
  },
  {
    id: '2',
    name: '02-6344-4478',
    category: '안심 통화',
    callType: 'outgoing',
    summary: '수신 전화 | 1분 12초',
    dateTime:'2025-06-02T14:18:00',
  },
  {
    id: '3',
    name: '조민혁 (모시공20)',
    category: '통화 내용 없음',
    callType: 'missed',
    summary: '부재중 전화',
    dateTime:'2025-05-31T19:13:00',
  },
  {
    id: '4',
    name: '010-1122-3344',
    category: '딥보이스 의심',
    callType: 'outgoing',
    summary: '발신 전화 | 3분 27초',
    dateTime:'2025-05-30T00:00:00',
  },
];

export const CallHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calls, setCalls] = useState<HistoryItem[]>(initialCalls);

  /* 맨 앞에 삽입해 최신순 유지함 */
  const addCall = (item: HistoryItem) => setCalls(prev => [item, ...prev]);

  return (
    <CallHistoryContext.Provider value={{ calls, addCall }}>
      {children}
    </CallHistoryContext.Provider>
  );
};
