import { HikerProfile } from '../types';

// Exact 299 completed spots for 299-level challenge explorers (368 total - 69 deep mountain/outer islets)
export const HERMANN_299_COMPLETED_IDS: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 38,
  39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
  51, 52, 53, 54, 55, 56, 59, 61, 62,
  67, 68, 69, 70, 73, 74, 75, 76, 79, 80,
  83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 99, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 142, 143, 144, 145, 146, 147,
  149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
  162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 187, 188, 189,
  191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202,
  203, 204, 205, 206, 207, 208, 209, 213,
  216, 217, 218, 219, 220, 221, 222, 223, 224, 226, 227, 228, 229,
  232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 246, 247,
  250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 268, 269, 270, 271, 272,
  276, 277, 278, 279, 280, 281, 282, 284, 286,
  290, 291, 292, 293, 294, 295, 296, 297, 298,
  300, 301, 303, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319,
  322, 323, 324, 325, 326, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 344, 345, 346,
  350, 351, 353, 362, 363, 364, 365, 366, 367, 368
];

export const HIKER_ROSTER: HikerProfile[] = [
  {
    nickname: '文華',
    email: 'hermannhuang@gmail.com',
    levelTitle: '台灣采風環島探索達人',
    certId: 'TW-WENHUA-2026-299',
    finishDate: '2026-08-18',
    motto: '走遍雙北基隆、桃竹苗客庄、中彰投雲、南台灣嘉南高屏、宜花東山海與璀璨離島，記錄台灣最美的風情。',
    completedPeakIds: [...HERMANN_299_COMPLETED_IDS]
  },
  {
    nickname: '如娟',
    email: 'ruchuan30@gmail.com',
    levelTitle: '台灣采風環島探索達人',
    certId: 'TW-RUCHUAN-2026-299',
    finishDate: '2026-08-18',
    motto: '攜手同行，記錄台灣最美的山海、北北基都會、桃竹苗客庄、中彰投雲都會、南台灣與離島景緻。',
    completedPeakIds: [...HERMANN_299_COMPLETED_IDS]
  },
  {
    nickname: 'Hermann',
    email: 'hermanntalk@gmail.com',
    levelTitle: '台灣采風環島探索達人',
    certId: 'TW-HERMANN-2026-299',
    finishDate: '2026-08-18',
    motto: '用心感受台灣每一寸土地、都會人文、桃竹苗山海、中彰投雲、南台灣與島嶼的溫度與風采。',
    completedPeakIds: [...HERMANN_299_COMPLETED_IDS]
  },
  {
    nickname: 'Joyease',
    email: 'joyease@gmail.com',
    levelTitle: '台灣鄉鎮區景點大滿貫達人',
    certId: 'TW-JOY-2026-001',
    finishDate: '2026-06-18',
    motto: '368處鄉鎮區特色景點全制霸！感受台灣本島與外島山海人情之美。',
    completedPeakIds: Array.from({ length: 368 }, (_, i) => i + 1) // 368/368 全完登!
  },
  {
    nickname: '小林隊長',
    email: 'lin.captain@gmail.com',
    levelTitle: '台灣鄉鎮區景點大滿貫達人',
    certId: 'TW-ALLDIST-2026-008',
    finishDate: '2026-05-20',
    motto: '一步一腳印，用雙腳丈量台灣都會、鄉間與外島的美麗風景與歷史。',
    completedPeakIds: Array.from({ length: 368 }, (_, i) => i + 1) // 368/368
  },
  {
    nickname: '阿吉領隊',
    email: 'mount.aji@gmail.com',
    levelTitle: '台灣深度采風探索達人',
    certId: 'TW-ALLDIST-2026-178',
    finishDate: '2026-07-12',
    motto: '享受漫遊台灣的每刻時光，發現城市、山海與離島的驚喜。',
    completedPeakIds: [
      ...Array.from({ length: 38 }, (_, i) => i + 1), // 1-38 (Kaohsiung)
      ...Array.from({ length: 12 }, (_, i) => i + 39), // 39-50 (Yilan)
      ...Array.from({ length: 16 }, (_, i) => i + 51), // 51-66 (Taitung)
      67, 68, 69, 70, 73, 74, 79, 80,
      ...Array.from({ length: 30 }, (_, i) => i + 83), // Tainan
      ...Array.from({ length: 20 }, (_, i) => i + 120), // Taichung
      ...Array.from({ length: 8 }, (_, i) => i + 149), // Taoyuan
      ...Array.from({ length: 20 }, (_, i) => i + 162), // New Taipei
      ...Array.from({ length: 10 }, (_, i) => i + 191), // Taipei
      ...Array.from({ length: 10 }, (_, i) => i + 203) // Hualien
    ]
  },
  {
    nickname: '島嶼旅人',
    email: 'mountain.traveler@gmail.com',
    levelTitle: '東部與離島樂活踩點客',
    certId: 'TW-ALLDIST-2026-105',
    finishDate: '2026-04-08',
    motto: '從宜蘭頭城漫步到花蓮太魯閣、台東縱谷與澎湖金馬，找尋最純粹的感動。',
    // 51 spots completed (Eastern & Islands)
    completedPeakIds: [
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
      67, 68, 69, 70, 71, 72, 73, 74, 79, 80,
      203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215
    ]
  },
  {
    nickname: '阿梅好友',
    email: 'may.hike@gmail.com',
    levelTitle: '台灣特色景點漫遊者',
    certId: 'TW-ALLDIST-2026-188',
    finishDate: '2026-03-15',
    motto: '台灣處處有好景，享受每一次出發的精彩！',
    // 65 spots completed
    completedPeakIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 19, 24, 27,
      39, 40, 41, 43, 48, 51, 55, 56, 67, 73,
      83, 84, 85, 86, 87, 88, 96, 103, 106,
      120, 123, 124, 125, 130, 131, 138,
      149, 150, 151, 157,
      162, 163, 169, 170, 171, 173, 185, 188, 189,
      191, 192, 193, 195, 196, 197, 201,
      203, 206, 207, 213
    ]
  },
  {
    nickname: 'Joy旅行隊',
    email: 'joy.team@gmail.com',
    levelTitle: '台灣鄉鎮區團體完登榮譽榜',
    certId: 'TW-TEAM-2026-888',
    finishDate: '2026-08-01',
    motto: '攜手同行，全台與離島各鄉鎮區特色景點全踩點完滿！',
    completedPeakIds: Array.from({ length: 368 }, (_, i) => i + 1) // 368/368
  },
  {
    nickname: '熱血旅行家',
    email: 'taiwan.hiker@gmail.com',
    levelTitle: '特色景點初探者',
    certId: 'TW-ALLDIST-2026-302',
    finishDate: '2026-02-14',
    motto: '用心感受台灣每一個鄉鎮區的獨特人情味。',
    completedPeakIds: [1, 2, 3, 4, 39, 40, 51, 52, 67, 68, 73, 79, 83, 86, 120, 124, 149, 151, 162, 171, 191, 192, 203, 206]
  }
];

export function findHikerByGmail(input: string): HikerProfile | null {
  if (!input || !input.trim()) return null;
  const clean = input.trim().toLowerCase();
  const inputUser = clean.includes('@') ? clean.split('@')[0] : clean;
  const inputEmail = clean.includes('@') ? clean : `${clean}@gmail.com`;

  // 1. Direct match in roster first (official data source)
  const rosterMatch = HIKER_ROSTER.find((h) => {
    const hEmail = h.email.toLowerCase();
    const hUser = hEmail.split('@')[0];
    const hNick = h.nickname.toLowerCase();
    
    return (
      hEmail === clean ||
      hEmail === inputEmail ||
      hUser === inputUser ||
      hNick === clean
    );
  });

  if (rosterMatch) {
    // Check if user made additional local custom checkmarks on top of roster
    try {
      const saved = localStorage.getItem(`peak100_user_${rosterMatch.email.toLowerCase()}`);
      if (saved) {
        const parsed = JSON.parse(saved) as HikerProfile;
        if (parsed && Array.isArray(parsed.completedPeakIds) && parsed.completedPeakIds.length >= rosterMatch.completedPeakIds.length) {
          return { ...rosterMatch, ...parsed };
        }
      }
    } catch (e) {
      // Ignore
    }
    return rosterMatch;
  }

  // 2. Check localStorage for non-roster custom saved record
  try {
    const saved = localStorage.getItem(`peak100_user_${inputEmail}`) || localStorage.getItem(`peak100_user_${inputUser}`);
    if (saved) {
      const parsed = JSON.parse(saved) as HikerProfile;
      if (parsed && Array.isArray(parsed.completedPeakIds)) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore localStorage parse errors
  }

  return null;
}
