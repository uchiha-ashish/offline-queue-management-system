// data.jsx — mock queue + customer data for the prototype

const INITIAL_QUEUE = [
  {
    id: 'c1', name: 'Rohan Mehta', initials: 'RM', visit: 'first', type: 'walkin',
    status: 'in-session', rank: 0, waitMin: 0, phone: '98201 44210',
    sessionLen: 40, elapsed: 24, prebookTime: null, note: null,
  },
  {
    id: 'c2', name: 'Anjali Sharma', initials: 'AS', visit: 'repeat', type: 'prebook',
    status: 'next', rank: 1, waitMin: 4, phone: '99300 77815',
    sessionLen: 20, elapsed: 0, prebookTime: '12:00', note: null,
  },
  {
    id: 'c3', name: 'Vikram Nair', initials: 'VN', visit: 'first', type: 'walkin',
    status: 'waiting', rank: 2, waitMin: 24, phone: '90049 22107',
    sessionLen: 40, elapsed: 0, prebookTime: null, note: null,
  },
  {
    id: 'c4', name: 'Kavya Reddy', initials: 'KR', visit: 'repeat', type: 'prebook',
    status: 'waiting', rank: 3, waitMin: 44, phone: '70123 55980',
    sessionLen: 20, elapsed: 0, prebookTime: '12:20', note: null,
  },
  {
    id: 'c5', name: 'Sunita Desai', initials: 'SD', visit: 'first', type: 'walkin',
    status: 'stepped-out', rank: 4, waitMin: 64, phone: '88790 31146',
    sessionLen: 40, elapsed: 0, prebookTime: null, note: 'Stepped out · notified',
  },
];

const CALLBACK_TASKS = [
  { id: 't1', name: 'Imran Qureshi', initials: 'IQ', phone: '98335 70021', prebookTime: '11:40', graceEndedAt: '11:55', reason: 'No-show — grace expired', done: false },
  { id: 't2', name: 'Meera Joshi', initials: 'MJ', phone: '99670 14238', prebookTime: '11:20', graceEndedAt: '11:35', reason: 'No-show — grace expired', done: false },
];

const COACHES = [
  { id: 'coach1', name: 'Neha Kulkarni', initials: 'NK', status: 'available', current: 'Rohan Mehta', queueLen: 4, nextWait: 4 },
  { id: 'coach2', name: 'Arjun Verma', initials: 'AV', status: 'available', current: 'Pooja Iyer', queueLen: 3, nextWait: 9 },
  { id: 'coach3', name: 'Priya Menon', initials: 'PM', status: 'break', current: null, queueLen: 2, nextWait: 18 },
];

const FLOOR_QUEUES = {
  coach1: [
    { name: 'Anjali Sharma', wait: 4, tag: 'prebook' },
    { name: 'Vikram Nair', wait: 24, tag: 'walkin' },
    { name: 'Kavya Reddy', wait: 44, tag: 'prebook' },
    { name: 'Sunita Desai', wait: 64, tag: 'stepped' },
  ],
  coach2: [
    { name: 'Dev Khanna', wait: 9, tag: 'walkin' },
    { name: 'Ritika Bose', wait: 29, tag: 'prebook' },
    { name: 'Sameer Ali', wait: 49, tag: 'walkin' },
  ],
  coach3: [
    { name: 'Farah Sheikh', wait: 18, tag: 'prebook' },
    { name: 'Manish Gupta', wait: 38, tag: 'walkin' },
  ],
};

const ACTIVITY_LOG = [
  { icon: 'arrowUp', text: 'Kavya Reddy moved up — priority (infant)', meta: 'Coach Neha · 2 min ago · WhatsApp sent' },
  { icon: 'clock', text: 'Session extended +10 min for Rohan Mehta', meta: 'Coach Neha · 8 min ago · 3 customers notified' },
  { icon: 'coffee', text: 'Priya Menon went on break', meta: '14 min ago · queue paused' },
  { icon: 'userPlus', text: 'Vikram Nair checked in at kiosk', meta: '21 min ago · walk-in' },
];

const COMM_LOG = [
  { icon: 'message', text: 'Check-in confirmed — #3 in queue, ~44 min', meta: 'WhatsApp · delivered · 11:38' },
  { icon: 'bell', text: 'Reminder scheduled — fires 10 min before turn', meta: 'Auto · pending' },
  { icon: 'phone', text: 'Phone number on file', meta: '70123 55980' },
];

Object.assign(window, {
  INITIAL_QUEUE, CALLBACK_TASKS, COACHES, FLOOR_QUEUES, ACTIVITY_LOG, COMM_LOG,
});
