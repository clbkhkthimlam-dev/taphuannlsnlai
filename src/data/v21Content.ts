// Verified v2.1 Master Content — Zero Fabrication
// Source: 05_CAP_NHAT_TRONG_TAM_5_BUOC_VA_MAU_SAC_RUC_RO.md (Trường PTDTNT THCS Him Lam, TP. Cần Thơ)

import type { RawKhtnAiV21, RawNlsV21 } from './verifiedV21Datasets';

export type StepNumber = 1 | 2 | 3 | 4 | 5;
export type SubjectType = 'KHTN' | 'Toán' | 'Công nghệ';
export type GradeType = '6' | '7' | '8' | '9';
export type IntegrationLevelType = 'nhe' | 'bo_phan' | 'du_an';
export type LowDeviceModeType = 'zero_device' | 'one_device_teacher' | 'computer_lab_4roles';

export interface SelectedNlsItem {
  code: string;
  level: 'TC1' | 'TC2';
  component: string;
  description: string;
}

export interface Plc6Draft {
  toolAndDate: string;
  purpose: string;
  aiScope: string;
  studentWork: string;
  verificationAndEdit: string;
  usageLevels: string[];
}

export interface KhbdDraftState {
  subject: SubjectType;
  grade: GradeType;
  lessonTitle: string;
  topicName: string;
  integrationLevel: IntegrationLevelType;
  partA: string; // (a) YCCĐ môn học
  selectedNlsCodes: SelectedNlsItem[]; // (b) Chỉ báo NLS
  selectedAiCode: string; // Mã YCCĐ AI chính (ví dụ 8.A1.2)
  selectedAtmGroups: string[]; // ATM1..ATM8
  partBOverride: string; // Cho phép GV tinh chỉnh phần (b)
  partC: string; // (c) Biểu hiện ATM / Hành vi quan sát được & Minh chứng
  activitySuggestion: string;
  aiPromptQuestion: string;
  verificationCriteria: string;
  lowDeviceMode: LowDeviceModeType;
  lowDeviceNote: string;
  evidenceNote: string;
  checkedChecklistIds: string[];
  plc6: Plc6Draft;
}

export const DEFAULT_KHBD_DRAFT: KhbdDraftState = {
  subject: 'KHTN',
  grade: '8',
  lessonTitle: 'Bài 32: Dinh dưỡng và tiêu hóa ở người',
  topicName: 'Dinh dưỡng và tiêu hoá ở người',
  integrationLevel: 'bo_phan',
  partA: 'phân tích được chế độ dinh dưỡng hợp lí và an toàn vệ sinh thực phẩm',
  selectedNlsCodes: [
    {
      code: '1.2TC2a',
      level: 'TC2',
      component: '1.2',
      description: 'Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu, thông tin và nội dung số.',
    },
    {
      code: '6.3TC2a',
      level: 'TC2',
      component: '6.3',
      description: 'Phân tích được hiệu quả của hệ thống AI trong việc giải quyết các vấn đề cụ thể.',
    },
  ],
  selectedAiCode: '8.A1.2',
  selectedAtmGroups: ['ATM1', 'ATM7'],
  partBOverride:
    'phân tích, so sánh, đánh giá nguồn thông tin sức khỏe (1.2TC2a) và đối chiếu câu trả lời của AI với nguồn khoa học (6.3TC2a, 8.A1.2)',
  partC:
    'áp dụng 4 bước SIFT kiểm chứng tin đồn sức khỏe qua ≥ 2 nguồn độc lập, viết khuyến nghị ≤ 50 chữ, không nhập dữ liệu cá nhân khi hỏi AI (ATM1, ATM7)',
  activitySuggestion:
    'HĐ 2.4 "Thám tử khoa học – kiểm chứng tin đồn sức khỏe": Nhóm HS áp dụng 4 bước SIFT kiểm chứng 1 tin đồn trong Hồ sơ tin đồn và đối chiếu câu trả lời AI với SGK Bài 32, hoàn thành Biên bản kiểm chứng và khuyến nghị ≤ 50 chữ.',
  aiPromptQuestion:
    'AI đưa ra lời giải thích về "Bài 32: Dinh dưỡng và tiêu hóa ở người". Em cần kiểm tra những luận điểm nào bằng kiến thức KHTN, SGK hoặc bằng chứng thực nghiệm?',
  verificationCriteria:
    'Đối chiếu Bảng 32.1 SGK/chương trình; kiểm tra nguồn và đơn vị kcal; phát hiện nội dung tuyệt đối hóa/bịa đặt; HS giải thích được kết luận đúng/sai/thiếu căn cứ.',
  lowDeviceMode: 'zero_device',
  lowDeviceNote:
    'GV phát Hồ sơ tin đồn & bản in câu trả lời AI có cài sẵn lỗi; nhóm HS dùng bút đánh dấu ý đúng/sai/thiếu, đối chiếu Bảng 32.1 SGK và hoàn thành Biên bản kiểm chứng trên giấy.',
  evidenceNote:
    'Biên bản kiểm chứng của nhóm + Khuyến nghị ≤ 50 chữ + Bảng kiểm quan sát nhóm + Phiếu khai báo AI (PLC.6).',
  checkedChecklistIds: ['gate-1', 'gate-2', 'plc2-1', 'plc2-2'],
  plc6: {
    toolAndDate: 'Công cụ AI tạo sinh do GV trình diễn mẫu (Ngày dạy dự kiến: .../11/2026)',
    purpose: 'Gợi ý thông tin về dinh dưỡng/tin đồn sức khỏe để HS thực hành kiểm chứng phản biện',
    aiScope: 'AI chỉ cung cấp văn bản gợi ý ban đầu (hoặc bản in sẵn câu trả lời AI của GV)',
    studentWork:
      'HS trực tiếp áp dụng 4 bước SIFT, đối chiếu Bảng 32.1 SGK KHTN 8, chỉ ra lỗi sai/thiếu và tự viết khuyến nghị ≤ 50 chữ',
    verificationAndEdit:
      'Đối chiếu ≥ 2 nguồn độc lập (SGK KHTN 8, tài liệu y tế chính thống), bác bỏ khẳng định tuyệt đối hóa và không nhập dữ liệu cá nhân lên AI',
    usageLevels: ['GV trình diễn'],
  },
};

export interface StepDefinition {
  step: StepNumber;
  shortTitle: string;
  title: string;
  subtitle: string;
  accentHex: string;
  gradientCss: string;
  lightBgHex: string;
  borderHex: string;
  badgeBgClass: string;
  badgeTextClass: string;
  attachments: {
    label: string;
    path: string;
    note: string;
  }[];
}

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    step: 1,
    shortTitle: 'YCCĐ môn học',
    title: 'Bước 1 — Xác định YCCĐ môn học cốt lõi (CTGDPT 2018)',
    subtitle: 'Bắt đầu từ nội dung môn Toán, KHTN, Công nghệ; không đi ngược từ khung NLS/AI',
    accentHex: '#2563EB',
    gradientCss: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
    lightBgHex: '#EFF6FF',
    borderHex: '#60A5FA',
    badgeBgClass: 'bg-[#DBEAFE]',
    badgeTextClass: 'text-[#1D4ED8]',
    attachments: [
      {
        label: 'Bảng rà soát tích hợp AI môn KHTN 6–9 (207 bài)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/RA_SOAT_TICH_HOP_AI_MON_KHTN_6_7_8_9.xlsx',
        note: '55 bài Có AI & 152 bài Không AI',
      },
      {
        label: 'Kế hoạch Tập huấn NLS – ATMTD – AI Trường Him Lam',
        path: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
        note: 'Tập huấn lại 22/11/2026, hạn KHDH trước 04/12/2026',
      },
      {
        label: 'Công văn 3456/BGDĐT-GDPT hướng dẫn triển khai Khung NLS',
        path: '1. Phap_ly_va_Chinh_sach/3456_BGDDT_GDPT.signed.pdf',
        note: '25 trang — Tích hợp vào KHDH và KHBD',
      },
    ],
  },
  {
    step: 2,
    shortTitle: 'Địa chỉ NLS–ATM–AI',
    title: 'Bước 2 — Tra cứu & Chọn "Địa chỉ tích hợp" (NLS – ATM – AI)',
    subtitle: 'Lọc đúng bậc TC1/TC2 từ 109 chỉ báo NLS, chọn 1–2 nhóm ATM & mã YCCĐ AI phù hợp',
    accentHex: '#0891B2',
    gradientCss: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
    lightBgHex: '#ECFEFF',
    borderHex: '#22D3EE',
    badgeBgClass: 'bg-[#CFFAFE]',
    badgeTextClass: 'text-[#0E7490]',
    attachments: [
      {
        label: 'Bảng chỉ báo Năng lực số (ChiBao-NLS.xlsx)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/ChiBao-NLS.xlsx',
        note: '109 chỉ báo THCS (54 TC1 + 55 TC2)',
      },
      {
        label: 'Rà soát tích hợp AI môn KHTN 6–9',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/RA_SOAT_TICH_HOP_AI_MON_KHTN_6_7_8_9.xlsx',
        note: 'Ma trận 207 bài học KHTN',
      },
      {
        label: 'Hướng dẫn giải thích ATM1–ATM8 cấp THCS',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/Huong_dan_giai_thich_ATM1_ATM8_THCS.docx',
        note: '8 nhóm chủ đề An toàn mạng toàn diện',
      },
      {
        label: 'Quy ước Mã hóa YCCĐ AI',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/MÃ HÓA YCCD AI.docx',
        note: '[Lớp].[Mã chủ đề].[STT] — 4 mạch A, B, C, D',
      },
      {
        label: 'Phụ lục QĐ 2422/QĐ-BGDĐT — Khung ND GD AI từ 2026–2027',
        path: '1. Phap_ly_va_Chinh_sach/2422_QD_BGDDT_PL kem theo QĐ - Khung ND GD AI từ 2026-2027.signed.pdf',
        note: '51 trang — 4 mạch A, B, C, D',
      },
      {
        label: 'Công văn 5588/BGDĐT-GDPT triển khai GD AI',
        path: '1. Phap_ly_va_Chinh_sach/5588_BGDDT_GDPT.signed.pdf',
        note: 'Đủ 12 tiết/lớp/năm học, không lập đầu điểm riêng',
      },
      {
        label: 'Công văn 6206/BGDĐT-GDPT về ATMTD',
        path: '1. Phap_ly_va_Chinh_sach/6206_BGDDT_GDPT.signed.pdf',
        note: 'Không tách thành môn/tiết riêng',
      },
    ],
  },
  {
    step: 3,
    shortTitle: 'Mục tiêu (a)+(b)+(c)',
    title: 'Bước 3 — Viết Mục tiêu Tích hợp 3 Thành phần (a) + (b) + (c)',
    subtitle: 'Ghép tự động YCCĐ môn (a) + Chỉ báo NLS/AI (b) + Hành vi đo được ATM (c) chuẩn dán Word',
    accentHex: '#9333EA',
    gradientCss: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
    lightBgHex: '#FAF5FF',
    borderHex: '#C084FC',
    badgeBgClass: 'bg-[#F3E8FF]',
    badgeTextClass: 'text-[#7E22CE]',
    attachments: [
      {
        label: 'Tài liệu Tập huấn NLS – ATM lớp KHTN THCS (PDF)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/THCS_ Tai lieu NLS-ATM lop KHTN.pdf',
        note: 'Trang 58–61: 3 mức độ, công thức (a)+(b)+(c), 4 lỗi cần tránh',
      },
      {
        label: 'Báo cáo tổng hợp NLS – ATM – AI (Times New Roman)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
        note: 'Slide chuẩn pháp lý, 6 bước kiểm chứng AI, 4 sai lầm',
      },
      {
        label: 'Bài trình chiếu Tập huấn 60 phút Trường Him Lam',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_TAP_HUAN_60_PHUT_HIM_LAM.pptx',
        note: 'Tài liệu trình chiếu ngày 22/11/2026',
      },
    ],
  },
  {
    step: 4,
    shortTitle: '4 HĐ & Thiếu thiết bị',
    title: 'Bước 4 — Thiết kế Tiến trình 4 Hoạt động (CV 5512) & Phương án Thiếu thiết bị',
    subtitle: 'SIFT 4 bước, 6 bước kiểm chứng AI, 3 phương án cho HS nội trú Him Lam & 2 Case Study',
    accentHex: '#EA580C',
    gradientCss: 'linear-gradient(135deg, #F97316 0%, #FACC15 100%)',
    lightBgHex: '#FFF7ED',
    borderHex: '#FB923C',
    badgeBgClass: 'bg-[#FFEDD5]',
    badgeTextClass: 'text-[#9A3412]',
    attachments: [
      {
        label: 'Tài liệu Tập huấn triển khai nội dung GD AI — cấp THCS',
        path: '3. Khung_Chuong_Trinh_AI_THCS/Tài liệu cấp Trung học cơ sở/Tài liệu Tập huấn triển khai nội dung Giáo dục AI - cấp THCS.pdf',
        note: 'Hướng dẫn triển khai khung GD AI THCS',
      },
      {
        label: 'Chuyên đề 2 — Tổng quan về AI theo QĐ 2422',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/Chuyên đề 2_ Tong quan vê AI theo QĐ 2422.pdf',
        note: 'Tổng quan 4 mạch A, B, C, D & 12 chủ đề',
      },
      {
        label: 'Tài liệu Tập huấn Giáo dục AI THCS (Lớp KHTN)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/2. Tài liệu Tập huấn Giáo dục AI THCS (Lớp KHTN).pptx',
        note: 'Slide 141: 4 sai lầm khi lồng ghép AI',
      },
    ],
  },
  {
    step: 5,
    shortTitle: 'Gate & Khai báo AI',
    title: 'Bước 5 — Minh chứng Đánh giá, An toàn Tâm lí & Khai báo AI (PLC.1, PLC.2, PLC.6)',
    subtitle: 'Cổng kiểm tra chất lượng (Gate 2 câu + 7 tiêu chí PLC.2), tình huống lớp 8A & mẫu PLC.6',
    accentHex: '#059669',
    gradientCss: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)',
    lightBgHex: '#ECFDF5',
    borderHex: '#34D399',
    badgeBgClass: 'bg-[#D1FAE5]',
    badgeTextClass: 'text-[#065F46]',
    attachments: [
      {
        label: 'Phụ lục chung — Bộ KHBD Giáo dục AI THCS (PLC.1 – PLC.6)',
        path: '3. Khung_Chuong_Trinh_AI_THCS/Tài liệu cấp Trung học cơ sở/Phu luc chung - Bo KHBD Giao duc AI THCS.docx',
        note: 'Biểu mẫu PLC.1, PLC.2, PLC.4, PLC.5, PLC.6',
      },
      {
        label: 'Kế hoạch triển khai tập huấn 60 phút',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/KE_HOACH_TRIEN_KHAI_60_PHUT.md',
        note: 'Kịch bản 4 chặng & lộ trình sau tập huấn',
      },
      {
        label: 'Tập huấn NLS ATMTD — Lớp KHTN THCS (Đợt 1)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/1a. Tap huan NLS ATMTD -  Lop KHTN THCS (dot 1).pptx',
        note: 'Slide 15, 17, 20, 62 — Nguy cơ, bảo mật, lớp 8A',
      },
      {
        label: 'Tập huấn NLS ATMTD — Lớp KHTN THCS (Đợt 2)',
        path: '2. Tai_lieu_Tap_huan_va_Bao_cao/1b. Tap huan NLS ATMTD -  Lop KHTN THCS (dot 2).pptx',
        note: 'Thực hành thiết kế KHBD & đánh giá minh chứng',
      },
    ],
  },
];

// =========================================================================
// 4.1. DANH MỤC 13 VĂN BẢN PHÁP LÝ & KẾ HOẠCH TRIỂN KHAI (100% VERIFIED)
// =========================================================================
export interface LegalDocV21 {
  stt: number;
  id: string;
  code: string;
  shortAliases: string[];
  date: string;
  agency: string;
  pillars: ('NLS' | 'ATMTD' | 'AI' | 'Chung')[];
  keyPoints: string;
  sourceFile: string | null;
  sourceNote: string;
  citation: string;
}

export const LEGAL_DOCS_13: LegalDocV21[] = [
  {
    stt: 1,
    id: 'nq-57',
    code: 'Nghị quyết 57-NQ/TW',
    shortAliases: ['NQ 57', '57-NQ/TW'],
    date: '22/12/2024',
    agency: 'Bộ Chính trị',
    pillars: ['NLS', 'AI'],
    keyPoints:
      'Đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.',
    sourceFile: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    sourceNote: 'Tham chiếu Slide 3 BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    citation:
      'Nghị quyết số 57-NQ/TW ngày 22/12/2024 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.',
  },
  {
    stt: 2,
    id: 'tt-02-2025',
    code: 'Thông tư 02/2025/TT-BGDĐT',
    shortAliases: ['TT 02/2025', '02/2025/TT-BGDĐT'],
    date: '24/01/2025',
    agency: 'Bộ GD&ĐT',
    pillars: ['NLS'],
    keyPoints:
      'Ban hành Khung năng lực số cho người học: 6 miền năng lực · 24 năng lực thành phần · 4 trình độ, 8 bậc (CB-B1..B2, TC-B3..B4, NC-B5..B6, CS-B7..B8).',
    sourceFile: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    sourceNote: 'Tham chiếu Slide 3, 5 BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    citation:
      'Thông tư số 02/2025/TT-BGDĐT ngày 24/01/2025 của Bộ GD&ĐT quy định Khung năng lực số cho người học.',
  },
  {
    stt: 3,
    id: 'cv-3456',
    code: 'Công văn 3456/BGDĐT-GDPT',
    shortAliases: ['CV 3456', '3456/BGDĐT-GDPT'],
    date: '27/06/2025',
    agency: 'Bộ GD&ĐT',
    pillars: ['NLS'],
    keyPoints:
      'Hướng dẫn triển khai thực hiện Khung NLS cho HS phổ thông và học viên GDTX (25 trang); tích hợp vào KHDH và KHBD.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/3456_BGDDT_GDPT.signed.pdf',
    sourceNote: '1. Phap_ly_va_Chinh_sach/3456_BGDDT_GDPT.signed.pdf',
    citation:
      'Công văn số 3456/BGDĐT-GDPT ngày 27/06/2025 của Bộ GD&ĐT về việc hướng dẫn triển khai thực hiện khung năng lực số cho học sinh phổ thông và học viên giáo dục thường xuyên.',
  },
  {
    stt: 4,
    id: 'nq-71',
    code: 'Nghị quyết 71-NQ/TW',
    shortAliases: ['NQ 71', '71-NQ/TW'],
    date: '22/08/2025',
    agency: 'Bộ Chính trị',
    pillars: ['Chung'],
    keyPoints: 'Đột phá phát triển giáo dục và đào tạo.',
    sourceFile: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    sourceNote: 'Tham chiếu Slide 3 BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    citation:
      'Nghị quyết số 71-NQ/TW ngày 22/08/2025 của Bộ Chính trị về đột phá phát triển giáo dục và đào tạo.',
  },
  {
    stt: 5,
    id: 'qd-2422',
    code: 'Quyết định 2422/QĐ-BGDĐT',
    shortAliases: ['QĐ 2422', '2422/QĐ-BGDĐT'],
    date: '18/08/2026',
    agency: 'Bộ GD&ĐT',
    pillars: ['AI'],
    keyPoints:
      'Ban hành Khung nội dung giáo dục Trí tuệ nhân tạo cho HS phổ thông từ năm học 2026–2027 (kèm Phụ lục 51 trang, 4 mạch A, B, C, D).',
    sourceFile: '1. Phap_ly_va_Chinh_sach/2422_QD_BGDDT.signed.pdf',
    sourceNote: '1. Phap_ly_va_Chinh_sach/2422_QD_BGDDT.signed.pdf & Phụ lục 51 trang',
    citation:
      'Quyết định số 2422/QĐ-BGDĐT ngày 18/08/2026 của Bộ GD&ĐT ban hành Khung nội dung giáo dục Trí tuệ nhân tạo cho học sinh phổ thông từ năm học 2026–2027.',
  },
  {
    stt: 6,
    id: 'cv-5588',
    code: 'Công văn 5588/BGDĐT-GDPT',
    shortAliases: ['CV 5588', '5588/BGDĐT-GDPT'],
    date: '19/08/2026',
    agency: 'Bộ GD&ĐT',
    pillars: ['AI'],
    keyPoints:
      'Hướng dẫn triển khai nội dung giáo dục AI (6 trang): bảo đảm đủ 12 tiết/lớp/năm học nội dung cốt lõi; đánh giá quá trình, không lập đầu điểm riêng.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/5588_BGDDT_GDPT.signed.pdf',
    sourceNote: '1. Phap_ly_va_Chinh_sach/5588_BGDDT_GDPT.signed.pdf',
    citation:
      'Công văn số 5588/BGDĐT-GDPT ngày 19/08/2026 của Bộ GD&ĐT về việc hướng dẫn triển khai nội dung giáo dục trí tuệ nhân tạo cho học sinh phổ thông.',
  },
  {
    stt: 7,
    id: 'cv-6206',
    code: 'Công văn 6206/BGDĐT-GDPT',
    shortAliases: ['CV 6206', '6206/BGDĐT-GDPT'],
    date: '14/09/2026',
    agency: 'Bộ GD&ĐT',
    pillars: ['ATMTD'],
    keyPoints:
      'Hướng dẫn các chủ đề giáo dục an toàn mạng toàn diện trong GDPT (6 trang); không tách thành môn/tiết riêng.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/6206_BGDDT_GDPT.signed.pdf',
    sourceNote: '1. Phap_ly_va_Chinh_sach/6206_BGDDT_GDPT.signed.pdf',
    citation:
      'Công văn số 6206/BGDĐT-GDPT ngày 14/09/2026 của Bộ GD&ĐT về việc hướng dẫn triển khai các chủ đề giáo dục an toàn mạng toàn diện trong giáo dục phổ thông.',
  },
  {
    stt: 8,
    id: 'cv-7179',
    code: 'Công văn 7179/BGDĐT-GDPT',
    shortAliases: ['CV 7179', '7179/BGDĐT-GDPT'],
    date: '13/10/2026',
    agency: 'Bộ GD&ĐT',
    pillars: ['NLS', 'ATMTD', 'AI'],
    keyPoints:
      'Tổ chức tập huấn CBQL, GV cốt cán về NLS, ATMTD và giáo dục AI.',
    sourceFile: '2. Tai_lieu_Tap_huan_va_Bao_cao/BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    sourceNote: 'Tham chiếu Slide 1, 3 BAO_CAO_NLS_ATM_AI_TIMES_NEW_ROMAN.pptx',
    citation:
      'Công văn số 7179/BGDĐT-GDPT ngày 13/10/2026 của Bộ GD&ĐT về việc tổ chức tập huấn cán bộ quản lý, giáo viên cốt cán về NLS, ATMTD và giáo dục AI.',
  },
  {
    stt: 9,
    id: 'kh-37',
    code: 'Kế hoạch 37/KH-SGDĐT',
    shortAliases: ['KH 37', '37/KH-SGDĐT'],
    date: '11/02/2026',
    agency: 'Sở GD&ĐT TP. Cần Thơ',
    pillars: ['NLS'],
    keyPoints:
      'Triển khai thực hiện Khung năng lực số cho HS phổ thông và học viên GDTX tại TP. Cần Thơ.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    sourceNote: 'Trích dẫn trong KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    citation:
      'Kế hoạch số 37/KH-SGDĐT ngày 11/02/2026 của Sở GD&ĐT TP. Cần Thơ về triển khai thực hiện Khung năng lực số.',
  },
  {
    stt: 10,
    id: 'kh-184',
    code: 'Kế hoạch 184/KH-SGDĐT',
    shortAliases: ['KH 184', '184/KH-SGDĐT'],
    date: '17/09/2026',
    agency: 'Sở GD&ĐT TP. Cần Thơ',
    pillars: ['AI'],
    keyPoints:
      'Triển khai thực hiện nội dung giáo dục AI cho HS phổ thông từ năm học 2026–2027 tại TP. Cần Thơ.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    sourceNote: 'Trích dẫn trong KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    citation:
      'Kế hoạch số 184/KH-SGDĐT ngày 17/09/2026 của Sở GD&ĐT TP. Cần Thơ về triển khai nội dung giáo dục AI từ năm học 2026–2027.',
  },
  {
    stt: 11,
    id: 'kh-245',
    code: 'Kế hoạch 245/KH-SGDĐT',
    shortAliases: ['KH 245', '245/KH-SGDĐT'],
    date: '03/11/2026',
    agency: 'Sở GD&ĐT TP. Cần Thơ',
    pillars: ['ATMTD'],
    keyPoints:
      'Triển khai thực hiện giáo dục an toàn mạng toàn diện từ năm học 2026–2027 tại TP. Cần Thơ.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    sourceNote: 'Trích dẫn trong KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    citation:
      'Kế hoạch số 245/KH-SGDĐT ngày 03/11/2026 của Sở GD&ĐT TP. Cần Thơ về triển khai giáo dục an toàn mạng toàn diện từ năm học 2026–2027.',
  },
  {
    stt: 12,
    id: 'kh-247',
    code: 'Kế hoạch 247/KH-SGDĐT',
    shortAliases: ['KH 247', '247/KH-SGDĐT'],
    date: '04/11/2026',
    agency: 'Sở GD&ĐT TP. Cần Thơ',
    pillars: ['NLS', 'ATMTD', 'AI'],
    keyPoints:
      'Tổ chức tập huấn triển khai NLS, ATMTD và giáo dục AI cho HS phổ thông tại TP. Cần Thơ.',
    sourceFile: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    sourceNote: 'Trích dẫn trong KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    citation:
      'Kế hoạch số 247/KH-SGDĐT ngày 04/11/2026 của Sở GD&ĐT TP. Cần Thơ về tổ chức tập huấn triển khai NLS, ATMTD và giáo dục AI.',
  },
  {
    stt: 13,
    id: 'kh-him-lam',
    code: 'Kế hoạch Trường PTDTNT THCS Him Lam',
    shortAliases: ['KH Trường Him Lam', 'KH Him Lam'],
    date: '11/2026',
    agency: 'Trường PTDTNT THCS Him Lam',
    pillars: ['NLS', 'ATMTD', 'AI'],
    keyPoints:
      'Tập huấn lại ngày 22/11/2026 (07h30–11h00, 13h30–16h30); hoàn thành KHDH trước 04/12/2026; 4 báo cáo viên: Phan Hoàng Toán (PHT), Nguyễn Viết Hoàng Chương (Tin học), Lê Thanh Liêm (Toán–KHTN–Công nghệ), Ngô Văn Ửng Em (KHXH).',
    sourceFile: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    sourceNote: '1. Phap_ly_va_Chinh_sach/KẾ HOẠCH TẬP HUẤN NLS - ATMTD - AI.pdf',
    citation:
      'Kế hoạch tập huấn NLS – ATMTD – AI tháng 11/2026 của Trường PTDTNT THCS Him Lam (Thạnh Xuân, TP. Cần Thơ).',
  },
];

// =========================================================================
// 4.2. KHUNG NĂNG LỰC SỐ (TT 02/2025): 6 MIỀN · 24 NLTP · 4 TRÌNH ĐỘ, 8 BẬC
// =========================================================================
export const NLS_LEVELS_8 = [
  { group: 'Cơ bản (CB)', code: 'CB-B1', grade: 'Lớp 1–3', count: 49, highlight: false },
  { group: 'Cơ bản (CB)', code: 'CB-B2', grade: 'Lớp 4–5', count: 52, highlight: false },
  { group: 'Trung cấp (TC — THCS)', code: 'TC-B3 / TC1', grade: 'Lớp 6–7', count: 54, highlight: true },
  { group: 'Trung cấp (TC — THCS)', code: 'TC-B4 / TC2', grade: 'Lớp 8–9', count: 55, highlight: true },
  { group: 'Nâng cao (NC)', code: 'NC-B5', grade: 'Lớp 10–12', count: 55, highlight: false },
  { group: 'Nâng cao (NC)', code: 'NC-B6', grade: 'Lớp 10–12 (NC)', count: 56, highlight: false },
  { group: 'Chuyên sâu (CS)', code: 'CS-B7', grade: 'Sau phổ thông', count: 49, highlight: false },
  { group: 'Chuyên sâu (CS)', code: 'CS-B8', grade: 'Chuyên sâu', count: 49, highlight: false },
];

export interface NlsDomainV21 {
  id: string;
  name: string;
  components: { code: string; name: string }[];
}

export const NLS_DOMAINS_6: NlsDomainV21[] = [
  {
    id: '1',
    name: '1. Khai thác dữ liệu và thông tin',
    components: [
      { code: '1.1', name: 'Duyệt, tìm kiếm và lọc' },
      { code: '1.2', name: 'Đánh giá dữ liệu, thông tin và nội dung số' },
      { code: '1.3', name: 'Quản lý dữ liệu, thông tin và nội dung số' },
    ],
  },
  {
    id: '2',
    name: '2. Giao tiếp và Hợp tác',
    components: [
      { code: '2.1', name: 'Tương tác' },
      { code: '2.2', name: 'Chia sẻ thông tin' },
      { code: '2.3', name: 'Trách nhiệm công dân' },
      { code: '2.4', name: 'Hợp tác' },
      { code: '2.5', name: 'Quy tắc ứng xử trên mạng' },
      { code: '2.6', name: 'Quản lý danh tính số' },
    ],
  },
  {
    id: '3',
    name: '3. Sáng tạo nội dung số',
    components: [
      { code: '3.1', name: 'Phát triển nội dung số' },
      { code: '3.2', name: 'Tích hợp và tạo lập lại' },
      { code: '3.3', name: 'Thực thi bản quyền và giấy phép' },
      { code: '3.4', name: 'Lập trình' },
    ],
  },
  {
    id: '4',
    name: '4. An toàn',
    components: [
      { code: '4.1', name: 'Bảo vệ thiết bị' },
      { code: '4.2', name: 'Bảo vệ dữ liệu cá nhân và quyền riêng tư' },
      { code: '4.3', name: 'Bảo vệ sức khỏe và an sinh số' },
      { code: '4.4', name: 'Bảo vệ môi trường' },
    ],
  },
  {
    id: '5',
    name: '5. Giải quyết vấn đề',
    components: [
      { code: '5.1', name: 'Giải quyết vấn đề kỹ thuật' },
      { code: '5.2', name: 'Xác định nhu cầu và giải pháp công nghệ' },
      { code: '5.3', name: 'Sử dụng sáng tạo công nghệ số' },
      { code: '5.4', name: 'Xác định vấn đề cần cải thiện về NLS' },
    ],
  },
  {
    id: '6',
    name: '6. Ứng dụng trí tuệ nhân tạo',
    components: [
      { code: '6.1', name: 'Hiểu biết về AI' },
      { code: '6.2', name: 'Sử dụng AI' },
      { code: '6.3', name: 'Đánh giá AI' },
    ],
  },
];

export const ACTION_TO_NLS_MAP = [
  { action: 'Tìm tư liệu số', codes: ['1.1'] },
  { action: 'Đánh giá độ tin cậy, kiểm chứng', codes: ['1.2'] },
  { action: 'Lưu trữ, sắp xếp dữ liệu', codes: ['1.3'] },
  { action: 'Chia sẻ, ghi nguồn', codes: ['2.2', '3.3'] },
  { action: 'Hợp tác nhóm trên tài liệu chung', codes: ['2.4'] },
  { action: 'Ứng xử văn minh trên mạng', codes: ['2.5'] },
  { action: 'Tạo nội dung, vẽ biểu đồ bảng tính', codes: ['3.1', '5.2'] },
  { action: 'Bảo vệ thiết bị, dữ liệu, sức khỏe số', codes: ['4.1', '4.2', '4.3'] },
  { action: 'Hiểu, sử dụng, đối chiếu/đánh giá AI', codes: ['6.1', '6.2', '6.3'] },
];

// =========================================================================
// 4.3. CẨM NANG AN TOÀN MẠNG (ATM1–ATM8), 5 NGUY CƠ, BẢO MẬT & LỚP 8A
// =========================================================================
export interface AtmGroupV21 {
  code: string;
  title: string;
  nlCodes: string[];
  description: string;
  observablePartC: string;
  accentHex: string;
  bgHex: string;
  borderHex: string;
}

export const ATM_GROUPS_8: AtmGroupV21[] = [
  {
    code: 'ATM1',
    title: 'Khai thác, đánh giá thông tin số và nhận diện rủi ro',
    nlCodes: ['1.1', '1.2', '1.3'],
    description:
      'Dừng lại trước khi chia sẻ; kiểm chứng bằng ≥ 2 nguồn độc lập; nhận diện tiêu đề giật gân, quảng cáo trá hình, thao túng cảm xúc.',
    observablePartC:
      'áp dụng 4 bước SIFT kiểm chứng thông tin bằng ≥ 2 nguồn độc lập, chỉ ra được ≥ 2 dấu hiệu nguồn kém tin cậy/giật gân (ATM1)',
    accentHex: '#2563EB',
    bgHex: '#EFF6FF',
    borderHex: '#93C5FD',
  },
  {
    code: 'ATM2',
    title: 'Giao tiếp, hợp tác, ứng xử và công dân số',
    nlCodes: ['2.1', '2.2', '2.5', '2.6'],
    description:
      'Ứng xử văn minh trong nhóm nhắn tin lớp; nhận diện bắt nạt mạng, dụ dỗ trực tuyến; không hùa theo, biết hỗ trợ bạn.',
    observablePartC:
      'thể hiện ứng xử văn minh khi thảo luận số, nhận diện hành vi bắt nạt mạng/dụ dỗ trực tuyến và nêu được cách từ chối, hỗ trợ bạn (ATM2)',
    accentHex: '#0891B2',
    bgHex: '#ECFEFF',
    borderHex: '#67E8F9',
  },
  {
    code: 'ATM3',
    title: 'Quản lí danh tính số, dữ liệu cá nhân và quyền riêng tư',
    nlCodes: ['2.6', '4.2'],
    description:
      'Thiết lập quyền riêng tư; không chia sẻ thông tin, hình ảnh với người lạ; hiểu dấu vết số tồn tại lâu dài.',
    observablePartC:
      'không chia sẻ thông tin định danh/hình ảnh cá nhân với người lạ và giải thích được cách thiết lập quyền riêng tư, hạn chế dấu vết số (ATM3)',
    accentHex: '#7C3AED',
    bgHex: '#F5F3FF',
    borderHex: '#C4B5FD',
  },
  {
    code: 'ATM4',
    title: 'An toàn thiết bị, tài khoản và ứng phó sự cố',
    nlCodes: ['4.1', '4.2', '5.1', '5.2'],
    description:
      'Mật khẩu mạnh, không dùng chung, không chia sẻ; nhận diện link "nhận quà trong trò chơi"; lưu bằng chứng, chặn, báo cáo.',
    observablePartC:
      'nhận diện đường link lừa đảo/mạo danh, nêu được quy tắc mật khẩu mạnh + 2FA và quy trình lưu bằng chứng – chặn – báo cáo (ATM4)',
    accentHex: '#DC2626',
    bgHex: '#FEF2F2',
    borderHex: '#FCA5A5',
  },
  {
    code: 'ATM5',
    title: 'Sức khỏe số, an sinh số và cân bằng đời sống số',
    nlCodes: ['4.3', '4.4'],
    description:
      'Nhận biết dấu hiệu lệ thuộc trò chơi, mạng xã hội; tự lập và thực hiện kế hoạch cân bằng thời gian dùng thiết bị.',
    observablePartC:
      'chỉ ra được ≥ 1 nguy cơ sức khỏe khi dùng thiết bị kéo dài và đề xuất ≥ 1 biện pháp cân bằng thời gian đo được (ATM5)',
    accentHex: '#059669',
    bgHex: '#ECFDF5',
    borderHex: '#6EE7B7',
  },
  {
    code: 'ATM6',
    title: 'Sáng tạo nội dung số, bản quyền và trách nhiệm số',
    nlCodes: ['3.1', '3.2', '3.3', '3.4'],
    description:
      'Ghi nguồn tư liệu; không đăng ảnh, video người khác khi chưa được đồng ý; không tạo nội dung chế giễu, gây hại.',
    observablePartC:
      'ghi rõ nguồn tư liệu minh họa trong sản phẩm học tập và cam kết không sử dụng hình ảnh/nội dung người khác khi chưa được đồng ý (ATM6)',
    accentHex: '#D97706',
    bgHex: '#FFFBEB',
    borderHex: '#FCD34D',
  },
  {
    code: 'ATM7',
    title: 'Sử dụng AI an toàn khi học tập và sinh hoạt',
    nlCodes: ['6.1', '6.2', '6.3'],
    description:
      'Biết AI có thể sai ("ảo giác AI"); không nhập thông tin cá nhân; dùng AI để hiểu bài, không làm thay; không tin ngay nội dung "gây sốc".',
    observablePartC:
      'đối chiếu câu trả lời của AI với SGK/nguồn khoa học để chỉ ra ý sai/thiếu, không nhập dữ liệu cá nhân và khai báo minh bạch phần AI hỗ trợ (ATM7)',
    accentHex: '#9333EA',
    bgHex: '#FAF5FF',
    borderHex: '#D8B4FE',
  },
  {
    code: 'ATM8',
    title: 'Tìm kiếm hỗ trợ, phục hồi và đóng góp cộng đồng số',
    nlCodes: ['5.4', '4.3', '2.2'],
    description:
      'Biết người lớn tin cậy, kênh hỗ trợ (cha mẹ, GVCN, Tổng đài 111, tính năng báo cáo); không làm nạn nhân tổn thương thêm.',
    observablePartC:
      'xác định đúng kênh hỗ trợ tin cậy (cha mẹ, GVCN, TPT Đội, Tổng đài 111) và nêu được cách không làm nạn nhân tổn thương thêm (ATM8)',
    accentHex: '#DB2777',
    bgHex: '#FDF2F8',
    borderHex: '#F9A8D4',
  },
];

export const THCS_RISKS_5 = [
  {
    num: 1,
    title: 'Bắt nạt mạng',
    detail: 'Loại trừ bạn khỏi nhóm nhắn tin, chế ảnh giễu cợt, lan truyền tin nhắn riêng tư.',
  },
  {
    num: 2,
    title: 'Dụ dỗ trực tuyến',
    detail: 'Học sinh lớp 6–8 dễ bị nhắm đến qua lời ngọt ngào và yêu cầu giữ bí mật ("đừng kể với ai").',
  },
  {
    num: 3,
    title: 'Lộ thông tin, mất tài khoản',
    detail: 'Đặt mật khẩu đơn giản, bấm link mạo danh "tặng 500 kim cương", chia sẻ mã OTP.',
  },
  {
    num: 4,
    title: 'Nội dung không phù hợp, tin giả, video AI giả',
    detail: 'Tiếp cận tin đồn sức khỏe sai lệch, video cắt ghép/deepfake gây sốc.',
  },
  {
    num: 5,
    title: 'Lệ thuộc thiết bị, trò chơi trực tuyến',
    detail: 'Cơ chế bang hội, điểm danh tạo cảm giác "phải trực tuyến" ảnh hưởng giấc ngủ và học tập.',
  },
];

export const SECURITY_PRACTICES_5 = [
  'Đặt mật khẩu mạnh bằng cách ghép 3–4 từ ngẫu nhiên kết hợp chữ số và kí tự.',
  'Bật xác thực 2 bước (2FA) cho tài khoản quan trọng.',
  'Không dùng chung một mật khẩu cho nhiều dịch vụ; ưu tiên bảo vệ email gốc trước.',
  'Không chia sẻ mật khẩu cho bất kì ai, kể cả bạn thân.',
  'Không đưa mật khẩu hoặc mã OTP cho người tự xưng là "quản trị viên".',
];

export const SCAM_EMOTIONS_4 = [
  { label: 'Khẩn cấp', desc: 'Thúc ép "làm ngay lập tức" để nạn nhân không kịp suy nghĩ.' },
  { label: 'Sợ hãi', desc: 'Dọa sắp khóa tài khoản, bị phạt hoặc gặp rắc rối pháp lí.' },
  { label: 'Tham lam', desc: 'Hứa hẹn trúng thưởng, nhận quà miễn phí, tặng 500 kim cương.' },
  { label: 'Tin tưởng', desc: 'Giả danh người thân, thầy cô, nhà trường hoặc quản trị viên.' },
];

export const CLASS_8A_SCENARIO = {
  title: 'Tình huống thực hành lớp 8A (Slide 20)',
  situation:
    'Trong nhóm nhắn tin lớp 8A (40 thành viên), một tài khoản ẩn danh đăng ảnh chụp màn hình tin nhắn riêng của bạn T. kèm lời chế giễu; nhiều bạn thả biểu tượng cười, chia sẻ sang nhóm khác; T. nghỉ học 2 ngày; một bạn nhắn riêng cho GV Toán nhờ "tìm giúp ai lập tài khoản ẩn danh".',
  relatedRisks: 'Bắt nạt mạng & Lộ thông tin cá nhân',
  relatedAtm: ['ATM2', 'ATM3', 'ATM6', 'ATM8'],
  pedagogicalHandling: [
    'GV bộ môn KHÔNG tự ý "truy tìm" chủ tài khoản ẩn danh hay xử lí đơn lẻ.',
    'Lắng nghe, ghi nhận thiện chí và bảo mật tuyệt đối thông tin của học sinh đã báo tin.',
    'Hướng dẫn lưu bằng chứng (ảnh chụp màn hình), ngừng lan truyền và không làm nạn nhân tổn thương thêm.',
    'Báo ngay GVCN – Tổng phụ trách Đội – Ban Giám hiệu – Cha mẹ học sinh (và Tổng đài 111 khi cần) để hỗ trợ tâm lí cho em T. và xử lí đúng quy trình nhà trường.',
  ],
};

// =========================================================================
// SIFT 4 BƯỚC, 6 BƯỚC KIỂM CHỨNG AI, 3 PHƯƠNG ÁN THIẾU THIẾT BỊ (BƯỚC 4)
// =========================================================================
export const SIFT_STEPS_4 = [
  {
    letter: 'S',
    english: 'Stop',
    vietnamese: 'Dừng lại',
    color: '#DC2626',
    bg: '#FEF2F2',
    action:
      'Khoan tin ngay, khoan chia sẻ. Tự hỏi: Tiêu đề này có đang kích động cảm xúc sợ hãi, phẫn nộ hay quá giật gân không?',
    sampleAnalysis:
      'Dừng lại trước con số "nguy cơ trầm cảm cao gấp 3 lần" và "50.000 lượt chia sẻ" — lượt chia sẻ cao KHÔNG chứng minh tính đúng đắn khoa học.',
  },
  {
    letter: 'I',
    english: 'Investigate the source',
    vietnamese: 'Tìm hiểu nguồn',
    color: '#D97706',
    bg: '#FFFBEB',
    action:
      'Ai là tác giả? Trang đăng tải là cơ quan khoa học/y tế chính thống hay fanpage ẩn danh bán hàng, câu tương tác?',
    sampleAnalysis:
      'Kiểm tra xem "nghiên cứu mới" là nghiên cứu của tổ chức nào, công bố năm nào, trên tạp chí y khoa uy tín hay chỉ là bài viết giật tít không rõ tác giả.',
  },
  {
    letter: 'F',
    english: 'Find better coverage',
    vietnamese: 'Tìm ≥ 2 nguồn tin cậy',
    color: '#0891B2',
    bg: '#ECFEFF',
    action:
      'Đối chiếu cùng thông tin đó trên ít nhất 2 nguồn độc lập uy tín (SGK, Bộ Y tế, WHO, báo khoa học chính thống).',
    sampleAnalysis:
      'Tra cứu tài liệu y tế/SGK: Thời gian dùng màn hình kéo dài có liên quan đến mệt mỏi, giảm giấc ngủ, nhưng trầm cảm chịu tác động đa yếu tố chứ không suy ra máy móc "hơn 2 tiếng = gấp 3 lần".',
  },
  {
    letter: 'T',
    english: 'Trace claims to original context',
    vietnamese: 'Truy xuất ngữ cảnh gốc',
    color: '#059669',
    bg: '#ECFDF5',
    action:
      'Truy về bài báo/số liệu gốc để xem trích dẫn có bị cắt xén, tuyệt đối hóa hay tách khỏi bối cảnh nghiên cứu ban đầu không.',
    sampleAnalysis:
      'Đọc lại bối cảnh gốc: Khác nhau giữa "tương quan" (correlation) và "nguyên nhân trực tiếp" (causation); loại nội dung sử dụng (học tập vs thức khuya chơi game) cũng quyết định mức độ ảnh hưởng.',
  },
];

export const SIFT_PRACTICE_STIMULUS =
  'Nghiên cứu mới chứng minh: HS dùng điện thoại hơn 2 tiếng/ngày có nguy cơ trầm cảm cao gấp 3 lần – 50.000 lượt chia sẻ';

export const AI_VERIFY_STEPS_6 = [
  {
    step: 1,
    title: 'Tách từng khẳng định',
    detail: 'Chia câu trả lời của AI thành từng ý nhỏ, từng số liệu hoặc công thức riêng lẻ để kiểm tra.',
  },
  {
    step: 2,
    title: 'Đối chiếu nguồn độc lập',
    detail: 'So sánh trực tiếp với SGK CTGDPT 2018, kết quả thí nghiệm, số liệu đo thực tế hoặc nguồn khoa học uy tín.',
  },
  {
    step: 3,
    title: 'Mở từng nguồn AI dẫn',
    detail: 'Kiểm tra đường link/tài liệu tham khảo AI trích dẫn xem có tồn tại thật và có đúng nội dung AI nói hay không.',
  },
  {
    step: 4,
    title: 'Soát độ phù hợp & thời điểm',
    detail: 'Kiểm tra ngữ cảnh, đơn vị đo, độ tuổi học sinh THCS và tính cập nhật của số liệu.',
  },
  {
    step: 5,
    title: 'Nhận diện thiên lệch / ảo giác AI',
    detail: 'Phát hiện câu khẳng định tuyệt đối hóa, nội dung bịa đặt tự tin ("hallucination") hoặc thiên kiến văn hóa/giới.',
  },
  {
    step: 6,
    title: 'Giữ, sửa hay bỏ; ghi nguồn',
    detail: 'Con người quyết định cuối cùng: giữ ý đúng, tự sửa ý thiếu, loại bỏ ý sai và ghi nguồn + khai báo AI minh bạch.',
  },
];

export const LOW_DEVICE_OPTIONS_3: {
  id: LowDeviceModeType;
  badge: string;
  title: string;
  suitableFor: string;
  steps: string[];
  draftNote: string;
}[] = [
  {
    id: 'zero_device',
    badge: 'Phương án 0 thiết bị',
    title: 'Phiếu in sẵn (Unplugged — Phù hợp nhất HS nội trú)',
    suitableFor: 'Lớp không có điện thoại/mạng Internet; học sinh nội trú không mang thiết bị cá nhân.',
    steps: [
      'GV chuẩn bị trước ảnh chụp tin đồn hoặc bản in câu trả lời của AI trên giấy (có cài sẵn 1–2 lỗi sai/thiếu).',
      'HS làm việc nhóm đọc phiếu in, dùng bút đánh dấu ý đúng / sai / chưa đủ căn cứ.',
      'HS đối chiếu trực tiếp với SGK, bảng số liệu hoặc kết quả thí nghiệm tại lớp và hoàn thành Biên bản kiểm chứng giấy.',
    ],
    draftNote:
      'Phương án 0 thiết bị (Phiếu in sẵn): GV chuẩn bị trước ảnh chụp tin đồn hoặc câu trả lời AI in trên giấy (có cài sẵn lỗi); HS làm việc nhóm đánh dấu ý đúng/sai/thiếu và đối chiếu SGK.',
  },
  {
    id: 'one_device_teacher',
    badge: 'Phương án 1 thiết bị chung',
    title: 'Giáo viên trình diễn trên máy chiếu',
    suitableFor: 'Phòng học chỉ có 01 máy tính của GV kết nối máy chiếu/TV.',
    steps: [
      'GV thao tác mẫu trực tiếp trên máy chiếu (hỏi AI bằng tài khoản GV hoặc tạo biểu đồ bảng tính mẫu).',
      'Cả lớp quan sát, dự đoán lỗi có thể xuất hiện, thảo luận cặp/nhóm để phản biện kết quả hiển thị trên màn hình.',
      'HS ghi nhận xét và bằng chứng đối chiếu SGK vào phiếu kiểm chứng cá nhân/nhóm.',
    ],
    draftNote:
      'Phương án 1 thiết bị chung (GV trình diễn): GV thao tác trực tiếp trên máy chiếu bằng tài khoản GV; cả lớp dự đoán, phản biện và ghi phiếu kiểm chứng.',
  },
  {
    id: 'computer_lab_4roles',
    badge: 'Phương án Phòng máy / Nhóm 4 vai',
    title: 'Chia nhóm 4 vai (Đổi vai sau mỗi lượt)',
    suitableFor: 'Tiết học tại phòng máy Tin học hoặc lớp có 1 máy tính/nhóm 4 HS.',
    steps: [
      'Vai 1 — Thao tác: Nhập câu lệnh/từ khóa tìm kiếm hoặc dữ liệu theo thống nhất của nhóm (không nhập dữ liệu cá nhân).',
      'Vai 2 — Thẩm định: Đối chiếu từng khẳng định với SGK, tài liệu khoa học và đơn vị đo chuẩn.',
      'Vai 3 — Thư kí: Ghi phiếu kiểm chứng, nhật kí sửa lỗi và mẫu khai báo AI (PLC.6).',
      'Vai 4 — Báo cáo: Trình bày kết luận của nhóm và trả lời phản biện trước lớp. Đổi vai sau mỗi lượt thực hành.',
    ],
    draftNote:
      'Phương án Phòng máy / Nhóm 4 vai (Đổi vai sau mỗi lượt): 1. Thao tác – 2. Thẩm định – 3. Thư kí – 4. Báo cáo.',
  },
];

// =========================================================================
// 6.2 A & B. HỒ SƠ AI THEO KHỐI LỚP & KHUNG SƯ PHẠM DÙNG CHUNG (55 BÀI KHTN)
// =========================================================================
export interface GradeAiProfileV21 {
  grade: GradeType;
  strand: string;
  primaryCode: string;
  primaryType: string;
  primaryDesc: string;
  secondaryCode: string;
  secondaryDesc: string;
}

export const GRADE_AI_PROFILES: Record<GradeType, GradeAiProfileV21> = {
  '6': {
    grade: '6',
    strand: 'Mạch A – Tư duy lấy con người làm trung tâm',
    primaryCode: '6.A1.3',
    primaryType: 'Cốt lõi',
    primaryDesc:
      'Thực hiện được việc kiểm tra lại một kết quả do AI đưa ra (đối chiếu với sách giáo khoa, nguồn tin cậy khác hoặc hỏi thầy cô) trước khi sử dụng, thể hiện thói quen "con người quyết định cuối cùng".',
    secondaryCode: '6.D1.1',
    secondaryDesc: 'Nêu được một số tình huống quen thuộc nên hoặc không nên sử dụng AI.',
  },
  '7': {
    grade: '7',
    strand: 'Mạch A – Tư duy lấy con người làm trung tâm',
    primaryCode: '7.A1.MR1',
    primaryType: 'Mở rộng',
    primaryDesc:
      'Thực hiện được việc kiểm chứng một thông tin do AI cung cấp bằng ít nhất một nguồn đáng tin cậy khác (sách giáo khoa, trang thông tin chính thống, ý kiến thầy cô) trước khi sử dụng.',
    secondaryCode: '7.B2.1',
    secondaryDesc:
      'Nêu được một số tiêu chí đơn giản (dựa trên các nguyên tắc đạo đức) để đánh giá mức độ phù hợp, an toàn của một ứng dụng AI.',
  },
  '8': {
    grade: '8',
    strand: 'Mạch A – Tư duy lấy con người làm trung tâm',
    primaryCode: '8.A1.2',
    primaryType: 'Cốt lõi',
    primaryDesc:
      'Nêu được những rủi ro của việc lạm dụng các công cụ AI tạo sinh, liên hệ với nguy cơ suy giảm tư duy phản biện, kĩ năng sáng tạo, sử dụng thông tin sai lệch; từ đó nêu được sự cần thiết của việc kiểm chứng nguồn thông tin khi sử dụng AI tạo sinh trong học tập.',
    secondaryCode: '8.A3.3',
    secondaryDesc:
      'Nêu được những việc thể hiện trách nhiệm giải trình khi sử dụng AI trong học tập và tạo sản phẩm.',
  },
  '9': {
    grade: '9',
    strand: 'Mạch B – Đạo đức AI',
    primaryCode: '9.B2.1',
    primaryType: 'Cốt lõi',
    primaryDesc:
      'Trình bày được vai trò của người dùng trong việc kiểm soát và chịu trách nhiệm đối với kết quả cuối cùng do AI tạo ra. Khai báo được việc sử dụng AI trong sản phẩm học tập của bản thân.',
    secondaryCode: '9.D2.1',
    secondaryDesc:
      'Thực hiện việc kiểm tra, đánh giá kết quả do AI tạo ra trước khi sử dụng; chịu trách nhiệm về nội dung được lựa chọn.',
  },
};

export const SHARED_AI_55_FRAMEWORK = {
  formAndLevel:
    'Tích hợp trực tiếp có kiểm soát (Phù hợp có điều kiện); AI chỉ gợi ý, HS kiểm chứng bằng SGK, thí nghiệm/dữ liệu và nguồn khoa học.',
  proposedActivity:
    'GV giao câu hỏi/nhiệm vụ để HS yêu cầu AI gợi ý lời giải thích, sơ đồ hoặc cách trình bày; HS kiểm tra từng ý bằng SGK, dữ liệu/thí nghiệm và nguồn khoa học, sau đó sửa và nêu phần AI sai/thiếu.',
  promptTemplate: (lessonName: string) =>
    `AI đưa ra lời giải thích về “${lessonName}”. Em cần kiểm tra những luận điểm nào bằng kiến thức KHTN, SGK hoặc bằng chứng thực nghiệm?`,
  verificationCriteria:
    'Đối chiếu SGK/chương trình, số liệu đo hoặc thí nghiệm; kiểm tra nguồn và đơn vị; phát hiện nội dung bịa đặt/không nhất quán; HS giải thích được kết luận cuối.',
  lowDevicePlan:
    'GV chuẩn bị trước một câu trả lời AI in trên giấy; HS làm việc nhóm, đánh dấu ý đúng/sai/thiếu và đối chiếu SGK, dữ liệu hoặc thí nghiệm.',
  evidenceAndDeclaration:
    'Phiếu đối chiếu câu trả lời AI; phần HS sửa/giải thích lỗi; nguồn tham khảo; ghi rõ công cụ AI đã dùng, mục đích và phần có AI hỗ trợ; không tải ảnh/dữ liệu cá nhân.',
};

// =========================================================================
// 4.4. HAI CASE STUDY KHBD MINH HỌA ĐẦY ĐỦ
// =========================================================================
export interface CaseStudyV21 {
  id: 'khtn8-bai32' | 'toan6-bai40';
  badge: string;
  title: string;
  activityTitle: string;
  meta: string;
  subject: SubjectType;
  grade: GradeType;
  nlsCodes: string[];
  atmCodes: string[];
  aiCode?: string;
  goalA: string;
  goalB: string;
  goalC: string;
  fullGoalText: string;
  contentB: string;
  productC: string;
  organizationD: string[];
  boardingPlan: string;
}

export const CASE_STUDIES_2: CaseStudyV21[] = [
  {
    id: 'khtn8-bai32',
    badge: 'Case Study 1 · KHTN 8',
    title: 'KHTN 8, Bài 32: Dinh dưỡng và tiêu hóa ở người',
    activityTitle: 'HĐ 2.4 "Thám tử khoa học – kiểm chứng tin đồn sức khỏe"',
    meta: 'Lớp 8 (Bậc 4 – TC2) · 2 tiết (90 phút) · Mã NLS: 1.2TC2a, 6.3TC2a · ATM: ATM1, ATM7 (mức KK) · Mã AI: 8.A1.2',
    subject: 'KHTN',
    grade: '8',
    nlsCodes: ['1.2TC2a', '6.3TC2a'],
    atmCodes: ['ATM1', 'ATM7'],
    aiCode: '8.A1.2',
    goalA: 'phân tích được chế độ dinh dưỡng hợp lí và an toàn vệ sinh thực phẩm',
    goalB:
      'phân tích, so sánh, đánh giá nguồn thông tin sức khỏe (1.2TC2a) và đối chiếu câu trả lời của AI với nguồn khoa học (6.3TC2a, 8.A1.2)',
    goalC:
      'áp dụng 4 bước SIFT kiểm chứng tin đồn sức khỏe qua ≥ 2 nguồn độc lập, kết luận đúng/sai/chưa đủ căn cứ, viết khuyến nghị ≤ 50 chữ, không nhập dữ liệu cá nhân khi hỏi AI (ATM1, ATM7)',
    fullGoalText:
      'Học sinh phân tích được chế độ dinh dưỡng hợp lí và an toàn vệ sinh thực phẩm; trong quá trình đó phân tích, so sánh, đánh giá nguồn thông tin sức khỏe (1.2TC2a) và đối chiếu câu trả lời của AI với nguồn khoa học (6.3TC2a, 8.A1.2); cụ thể là áp dụng 4 bước SIFT kiểm chứng tin đồn sức khỏe qua ≥ 2 nguồn độc lập, kết luận đúng/sai/chưa đủ căn cứ, viết khuyến nghị ≤ 50 chữ, không nhập dữ liệu cá nhân khi hỏi AI (ATM1, ATM7).',
    contentB:
      'Kiểm chứng 1 tin đồn trong Hồ sơ tin đồn (Học liệu 1) bằng 4 bước SIFT và kiến thức Bài 32; đối chiếu câu trả lời của AI; hoàn thành Biên bản kiểm chứng và viết khuyến nghị ≤ 50 chữ.',
    productC:
      'Biên bản kiểm chứng của nhóm. Cả 4 tin đồn đều mang tính tuyệt đối hóa → kết luận hợp lí: "sai" hoặc "thiếu căn cứ, gây hiểu lầm", kèm khuyến nghị đi khám khi có triệu chứng. Ví dụ Nhóm 3: Kiểm chứng tin đồn "Nhịn ăn sáng giúp tỉnh táo hơn" → đối chiếu Bảng 32.1 (HS 12–14 tuổi cần khoảng 2.310–2.500 kcal/ngày) → kết luận "thiếu căn cứ", viết khuyến nghị ≤ 50 chữ.',
    organizationD: [
      'B1 (3\'): Giao Hồ sơ tin đồn, nêu quy tắc an toàn (không nhập dữ liệu cá nhân lên AI), phân vai trong nhóm.',
      'B2 (12\'): Nhóm áp dụng 4 bước SIFT và đối chiếu Bảng 32.1 SGK; GV quan sát và đánh giá quá trình bằng bảng kiểm.',
      'B3 (8\'): 4 nhóm trình bày biên bản kiểm chứng, các nhóm khác đặt câu hỏi phản biện.',
      'B4 (4\'): GV chốt kiến thức dinh dưỡng & thói quen kiểm chứng AI; thu Biên bản kiểm chứng làm minh chứng quá trình.',
    ],
    boardingPlan:
      'Dùng Hồ sơ tin đồn & bản in câu trả lời AI (Học liệu 1) phát trực tiếp cho từng nhóm — hoàn toàn không cần HS mang điện thoại.',
  },
  {
    id: 'toan6-bai40',
    badge: 'Case Study 2 · Toán 6',
    title: 'Toán 6, Bài 40: Biểu đồ cột',
    activityTitle: 'HĐ 2.4 "Một tuần sống cùng màn hình"',
    meta: 'Lớp 6 (Bậc 3 – TC1) · 2 tiết (90 phút) · Mã NLS: 4.3TC1a, 3.1TC1a · ATM: ATM5 (mức KK)',
    subject: 'Toán',
    grade: '6',
    nlsCodes: ['4.3TC1a', '3.1TC1a'],
    atmCodes: ['ATM5'],
    goalA: 'vẽ, đọc, mô tả và phân tích được biểu đồ cột (nội dung Bài 40)',
    goalB:
      'giải thích được một số cách tránh rủi ro đối với sức khỏe khi sử dụng thiết bị số (4.3TC1a) và chỉ ra được cách tạo biểu đồ cột bằng phần mềm bảng tính qua quan sát giáo viên thao tác mẫu (3.1TC1a)',
    goalC:
      'từ biểu đồ thời gian sử dụng thiết bị trong một tuần (số liệu mô phỏng), chỉ ra được ngày sử dụng nhiều nhất, nêu được ít nhất một nguy cơ và đề xuất được ít nhất một biện pháp điều chỉnh đo được (ATM5)',
    fullGoalText:
      'Học sinh vẽ, đọc, mô tả và phân tích được biểu đồ cột (nội dung Bài 40); trong quá trình đó giải thích được một số cách tránh rủi ro đối với sức khỏe khi sử dụng thiết bị số (4.3TC1a) và chỉ ra được cách tạo biểu đồ cột bằng phần mềm bảng tính qua quan sát giáo viên thao tác mẫu (3.1TC1a); cụ thể là từ biểu đồ thời gian sử dụng thiết bị trong một tuần (số liệu mô phỏng), chỉ ra được ngày sử dụng nhiều nhất, nêu được ít nhất một nguy cơ và đề xuất được ít nhất một biện pháp điều chỉnh (ATM5).',
    contentB:
      'HS phân tích bảng số liệu mô phỏng thời gian dùng thiết bị trong 1 tuần của "bạn Minh", vẽ biểu đồ cột trên giấy kẻ ô vuông, quan sát GV thao tác tạo biểu đồ cột trên phần mềm bảng tính và đề xuất biện pháp cân bằng sức khỏe số.',
    productC:
      'Biểu đồ cột vẽ đúng tỉ lệ trên giấy ô vuông + câu trả lời xác định ngày dùng nhiều nhất, nêu ≥ 1 nguy cơ (mỏi mắt, mất ngủ, giảm tập trung) và ≥ 1 biện pháp đo được (ví dụ: không dùng thiết bị sau 21 giờ).',
    organizationD: [
      'B1 (3\'): GV phát phiếu số liệu mô phỏng của "bạn Minh" (bộ 1: Thứ Bảy 140 phút, Thứ Tư 50 phút, tổng 600 phút = 10 giờ; bộ 2: Thứ Bảy 110 phút, Thứ Tư 40 phút, tổng 500 phút = 8 giờ 20 phút).',
      'B2 (10\'): HS vẽ biểu đồ cột trên giấy kẻ ô vuông và trả lời câu hỏi phân tích sức khỏe số (ATM5).',
      'B3 (5\'): GV thao tác mẫu tạo biểu đồ cột bằng phần mềm bảng tính trên máy chiếu; HS quan sát, đối chiếu quy trình (3.1TC1a).',
      'B4 (4\'): Nhóm chia sẻ biện pháp cân bằng thời gian đo được; GV chốt và thu phiếu bài làm làm minh chứng.',
    ],
    boardingPlan:
      'Phương án không thiết bị HS: HS không cần mang điện thoại; dùng số liệu mô phỏng của "bạn Minh" (bộ 1: 600 phút = 10 giờ; bộ 2: 500 phút = 8 giờ 20 phút), vẽ trên giấy kẻ ô vuông và quan sát GV thao tác bảng tính trên máy chiếu.',
  },
];

// =========================================================================
// 4.5. KỊCH BẢN TẬP HUẤN 60 PHÚT (22/11/2026) & LỘ TRÌNH SAU TẬP HUẤN
// =========================================================================
export const TRAINING_60_MIN_STAGES = [
  {
    stage: 'Chặng 1',
    time: "00' – 10'",
    title: 'Khởi động bình chọn & Hành lang pháp lý',
    color: '#2563EB',
    details:
      'Khởi động bình chọn "Hoạt động nào thực sự phát triển NLS?" + Hệ thống hóa hành lang pháp lý (TT 02/2025, CV 3456, CV 6206, QĐ 2422, CV 5588, KH 37, 184, 245, 247 Cần Thơ, KH Trường Him Lam).',
  },
  {
    stage: 'Chặng 2',
    time: "10' – 25'",
    title: 'Làm chủ 3 bộ công cụ & Công thức (a)+(b)+(c)',
    color: '#0891B2',
    details:
      'Làm chủ 3 bộ công cụ (ChiBao-NLS.xlsx, ATM1–ATM8 & SIFT, RA_SOAT AI KHTN) + Công thức mục tiêu (a)+(b)+(c) + Phân tích Case study KHTN 8 Bài 32.',
  },
  {
    stage: 'Chặng 3',
    time: "25' – 50'",
    title: 'Thực hành tại chỗ trên Laptop theo nhóm môn',
    color: '#9333EA',
    details:
      'Thực hành theo nhóm Toán, KHTN, Công nghệ: Bước A điền 2–3 địa chỉ tích hợp vào KHDH; Bước B soạn 01 mục tiêu + 01 hoạt động KHBD phù hợp HS nội trú; 02 nhóm trình bày & sửa lỗi trực tiếp.',
  },
  {
    stage: 'Chặng 4',
    time: "50' – 60'",
    title: 'Chốt 3 đầu việc sau tập huấn & Q&A',
    color: '#059669',
    details:
      'Thống nhất tiến độ nộp KHDH trước 04/12/2026, kế hoạch SHCM nghiên cứu bài học và diễn đàn học sinh nội trú; giải đáp thắc mắc chuyên môn.',
  },
];

export const POST_TRAINING_ROADMAP = [
  {
    deadline: 'Trước 04/12/2026',
    owner: 'Các Tổ CM & PHT + Tổ Tin học–Công nghệ',
    task: 'Các tổ CM hoàn thiện điều chỉnh KHDH nộp BGH phê duyệt; PHT + Tổ Tin học–Công nghệ hoàn thiện khung 12 tiết AI.',
  },
  {
    deadline: 'Trong năm học 2026–2027',
    owner: 'Mỗi Tổ chuyên môn',
    task: 'Tổ chức ít nhất 01 chuyên đề SHCM theo hướng nghiên cứu bài học có tích hợp NLS/ATM/AI.',
  },
  {
    deadline: 'Hoạt động nội trú 2026–2027',
    owner: 'TPT Đội + Quản lý nội trú + BGH',
    task: 'Tổ chức diễn đàn "Học sinh nội trú với không gian mạng an toàn"; BGH kiểm tra nội bộ và dự giờ định kỳ.',
  },
];

export const HIM_LAM_SPEAKERS = [
  { name: 'Phan Hoàng Toán', role: 'Phó Hiệu trưởng' },
  { name: 'Nguyễn Viết Hoàng Chương', role: 'Giáo viên Tin học' },
  { name: 'Lê Thanh Liêm', role: 'Tổ Toán – KHTN – Công nghệ' },
  { name: 'Ngô Văn Ửng Em', role: 'Tổ Khoa học Xã hội' },
];

// =========================================================================
// QUICK-LOAD SAMPLES (BƯỚC 1 & BƯỚC 3)
// =========================================================================
export interface QuickSampleV21 {
  id: string;
  label: string;
  shortDesc: string;
  patch: Partial<KhbdDraftState>;
}

export const QUICK_SAMPLES_STEP1: QuickSampleV21[] = [
  {
    id: 'sample-khtn6',
    label: 'KHTN 6 – Phân loại thế giới sống',
    shortDesc: 'Tự điền YCCĐ + gợi ý 1.2TC1a, 6.A1.3',
    patch: {
      subject: 'KHTN',
      grade: '6',
      topicName: 'Đa dạng thế giới sống',
      lessonTitle: '1. Phân loại thế giới sống',
      integrationLevel: 'bo_phan',
      partA:
        'nêu được sự cần thiết của việc phân loại thế giới sống, nhận biết năm giới sinh vật và thực hành xây dựng khóa lưỡng phân',
      selectedNlsCodes: [
        {
          code: '1.2TC1a',
          level: 'TC1',
          component: '1.2',
          description:
            'Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của các nguồn dữ liệu, thông tin và nội dung số đã được tổ chức rõ ràng.',
        },
      ],
      selectedAiCode: '6.A1.3',
      selectedAtmGroups: ['ATM1', 'ATM7'],
      partBOverride:
        'đánh giá được độ tin cậy của nguồn thông tin (1.2TC1a) và kiểm tra lại kết quả do AI gợi ý về phân loại sinh vật (6.A1.3)',
      partC:
        'chỉ ra được ≥ 2 dấu hiệu của trang ngụy khoa học/thông tin sai về sinh vật và đối chiếu khóa lưỡng phân AI gợi ý với SGK (ATM1, ATM7)',
      activitySuggestion: SHARED_AI_55_FRAMEWORK.proposedActivity,
      aiPromptQuestion: SHARED_AI_55_FRAMEWORK.promptTemplate('1. Phân loại thế giới sống'),
      verificationCriteria: SHARED_AI_55_FRAMEWORK.verificationCriteria,
      lowDeviceMode: 'zero_device',
      lowDeviceNote: SHARED_AI_55_FRAMEWORK.lowDevicePlan,
      evidenceNote: SHARED_AI_55_FRAMEWORK.evidenceAndDeclaration,
    },
  },
  {
    id: 'sample-khtn8',
    label: 'KHTN 8 – Bài 32: Dinh dưỡng và tiêu hóa ở người',
    shortDesc: 'Tự điền YCCĐ + gợi ý 1.2TC2a, 6.3TC2a, ATM1, ATM7, 8.A1.2',
    patch: {
      ...DEFAULT_KHBD_DRAFT,
    },
  },
  {
    id: 'sample-toan6',
    label: 'Toán 6 – Bài 40: Biểu đồ cột',
    shortDesc: 'Tự điền YCCĐ + gợi ý 4.3TC1a, 3.1TC1a, ATM5',
    patch: {
      subject: 'Toán',
      grade: '6',
      topicName: 'Thống kê và Xác suất',
      lessonTitle: 'Bài 40: Biểu đồ cột',
      integrationLevel: 'du_an',
      partA: 'vẽ, đọc, mô tả và phân tích được biểu đồ cột',
      selectedNlsCodes: [
        {
          code: '4.3TC1a',
          level: 'TC1',
          component: '4.3',
          description:
            'Giải thích được những cách thức cơ bản và phổ biến để tránh rủi ro và đe dọa đối với sức khỏe thể chất và tinh thần khi sử dụng công nghệ số.',
        },
        {
          code: '3.1TC1a',
          level: 'TC1',
          component: '3.1',
          description:
            'Chỉ ra được cách tạo và chỉnh sửa nội dung có khái niệm cụ thể và mang tính phổ thông bằng những định dạng rõ ràng, phổ biến.',
        },
      ],
      selectedAiCode: '',
      selectedAtmGroups: ['ATM5'],
      partBOverride:
        'giải thích được một số cách tránh rủi ro đối với sức khỏe khi sử dụng thiết bị số (4.3TC1a) và chỉ ra được cách tạo biểu đồ cột bằng phần mềm bảng tính qua quan sát GV thao tác mẫu (3.1TC1a)',
      partC:
        'từ biểu đồ thời gian sử dụng thiết bị trong một tuần (số liệu mô phỏng), chỉ ra được ngày dùng nhiều nhất, nêu ≥ 1 nguy cơ và đề xuất ≥ 1 biện pháp điều chỉnh đo được (ATM5)',
      activitySuggestion:
        'HĐ 2.4 "Một tuần sống cùng màn hình": HS dùng bảng số liệu mô phỏng của "bạn Minh" (600 phút hoặc 500 phút/tuần), vẽ biểu đồ cột trên giấy ô vuông, quan sát GV thao tác mẫu bảng tính và đề xuất biện pháp cân bằng sức khỏe số.',
      aiPromptQuestion: 'Bài học tập trung NLS (4.3TC1a, 3.1TC1a) & ATM5 — không bắt buộc dùng AI.',
      verificationCriteria:
        'Đối chiếu độ chính xác của trục, tỉ lệ cột, tổng thời gian trên giấy ô vuông và tính đo được của biện pháp điều chỉnh sức khỏe số.',
      lowDeviceMode: 'one_device_teacher',
      lowDeviceNote:
        'HS không cần mang điện thoại; vẽ biểu đồ từ số liệu mô phỏng trên giấy kẻ ô vuông và quan sát GV thao tác phần mềm bảng tính trên máy chiếu.',
      evidenceNote:
        'Biểu đồ cột vẽ trên giấy kẻ ô vuông + Phiếu phân tích nguy cơ & biện pháp cân bằng đo được (ATM5).',
    },
  },
];

export const STEP3_SAMPLES_3 = [
  {
    id: 'step3-khtn6-modau',
    title: 'Mẫu KHTN 6 (Mở đầu)',
    partA: 'trình bày được cách tìm hiểu một hiện tượng tự nhiên',
    partB: 'đánh giá được độ tin cậy của nguồn thông tin (1.2TC1a)',
    partC: 'chỉ ra được ≥ 2 dấu hiệu của trang ngụy khoa học (ATM1)',
    subject: 'KHTN' as SubjectType,
    grade: '6' as GradeType,
    lessonTitle: 'Mở đầu — Phương pháp tìm hiểu tự nhiên',
    selectedAtmGroups: ['ATM1'],
    selectedAiCode: '',
  },
  {
    id: 'step3-khtn8-bai32',
    title: 'Mẫu KHTN 8 (Bài 32)',
    partA: 'phân tích được chế độ dinh dưỡng hợp lí và an toàn vệ sinh thực phẩm',
    partB:
      'phân tích, so sánh, đánh giá nguồn thông tin sức khỏe (1.2TC2a) và đối chiếu câu trả lời của AI với nguồn khoa học (6.3TC2a, 8.A1.2)',
    partC:
      'áp dụng 4 bước SIFT kiểm chứng tin đồn sức khỏe qua ≥ 2 nguồn độc lập, viết khuyến nghị ≤ 50 chữ, không nhập dữ liệu cá nhân khi hỏi AI (ATM1, ATM7)',
    subject: 'KHTN' as SubjectType,
    grade: '8' as GradeType,
    lessonTitle: 'Bài 32: Dinh dưỡng và tiêu hóa ở người',
    selectedAtmGroups: ['ATM1', 'ATM7'],
    selectedAiCode: '8.A1.2',
  },
  {
    id: 'step3-toan6-bai40',
    title: 'Mẫu Toán 6 (Bài 40 – Biểu đồ cột)',
    partA: 'vẽ, đọc, mô tả và phân tích được biểu đồ cột',
    partB:
      'giải thích được một số cách tránh rủi ro đối với sức khỏe khi sử dụng thiết bị số (4.3TC1a) và chỉ ra được cách tạo biểu đồ cột bằng phần mềm bảng tính qua quan sát GV thao tác mẫu (3.1TC1a)',
    partC:
      'từ biểu đồ thời gian sử dụng thiết bị trong một tuần (số liệu mô phỏng), chỉ ra được ngày dùng nhiều nhất, nêu ≥ 1 nguy cơ và đề xuất ≥ 1 biện pháp điều chỉnh đo được (ATM5)',
    subject: 'Toán' as SubjectType,
    grade: '6' as GradeType,
    lessonTitle: 'Bài 40: Biểu đồ cột',
    selectedAtmGroups: ['ATM5'],
    selectedAiCode: '',
  },
];

// =========================================================================
// BƯỚC 5: BẢNG KIỂM GATE 2 CÂU + 7 TIÊU CHÍ PLC.2 & MỨC DÙNG AI PLC.6
// =========================================================================
export interface GateChecklistItem {
  id: string;
  group: 'GATE' | 'PLC.2';
  title: string;
  detail: string;
}

export const PLC2_GATE_CHECKLIST: GateChecklistItem[] = [
  {
    id: 'gate-1',
    group: 'GATE',
    title: 'Câu hỏi Gate 1: Có biểu hiện quan sát được không?',
    detail:
      'Mục tiêu đã diễn đạt bằng động từ đo lường/quan sát được (không dùng "hiểu", "có ý thức", "nâng cao nhận thức").',
  },
  {
    id: 'gate-2',
    group: 'GATE',
    title: 'Câu hỏi Gate 2: Có sản phẩm / minh chứng đánh giá quá trình không?',
    detail:
      'Có sản phẩm cụ thể: Phiếu đối chiếu, biên bản kiểm chứng, bảng kiểm, khuyến nghị ≤ 50 chữ... (Nếu KHÔNG → bỏ mã hoặc sửa hoạt động).',
  },
  {
    id: 'plc2-1',
    group: 'PLC.2',
    title: '1. Xuất phát từ YCCĐ môn học CTGDPT 2018',
    detail: 'Không đi ngược từ khung NLS/AI; không nâng mức YCCĐ môn học gây quá tải.',
  },
  {
    id: 'plc2-2',
    group: 'PLC.2',
    title: '2. Đúng bậc THCS & giới hạn số mã (1–2 mã NLS, 1–2 nhóm ATM)',
    detail: 'Lớp 6–7 chọn đúng TC1, Lớp 8–9 chọn đúng TC2; không rải nhiều mã hình thức.',
  },
  {
    id: 'plc2-3',
    group: 'PLC.2',
    title: '3. Mục tiêu đủ 3 thành phần (a) + (b) + (c) gắn liền bài học',
    detail: 'Nội dung ATM/AI gắn tự nhiên với nội dung bài học, không gượng ép tách rời.',
  },
  {
    id: 'plc2-4',
    group: 'PLC.2',
    title: '4. AI không thay thế thí nghiệm, đo đạc & HS là chủ thể kiểm chứng',
    detail: 'Không mắc lỗi "GV dùng AI soạn bài rồi gọi là lồng ghép GD AI"; HS thực hành đối chiếu SGK/thực nghiệm.',
  },
  {
    id: 'plc2-5',
    group: 'PLC.2',
    title: '5. Khả thi với HS nội trú Trường Him Lam (phương án 0/1 thiết bị)',
    detail: 'Có phiếu in sẵn hoặc kịch bản GV trình diễn/nhóm 4 vai để mọi HS đều công bằng, không thiệt thòi vì thiếu thiết bị.',
  },
  {
    id: 'plc2-6',
    group: 'PLC.2',
    title: '6. Bảo đảm an toàn dữ liệu & an toàn tâm lí (PLC.4)',
    detail: 'Không nhập dữ liệu cá nhân/ảnh thật lên AI; không dùng chuyện thật trong lớp hay trùng tên HS.',
  },
  {
    id: 'plc2-7',
    group: 'PLC.2',
    title: '7. Đánh giá quá trình & khai báo AI minh bạch (PLC.5, PLC.6)',
    detail: 'Không lập đầu điểm riêng cho AI/ATM; nhận xét 3 ý (đã làm được – bằng chứng – bước tiếp theo) và có khung khai báo PLC.6.',
  },
];

export const PLC6_AI_LEVELS = [
  'Không dùng AI',
  'GV trình diễn',
  'Em dùng công cụ',
  'Nhóm dùng công cụ',
  'Công cụ tạo một phần sản phẩm',
];

// =========================================================================
// HELPERS: CHUẨN HÓA MÃ NLS, GHÉP MỤC TIÊU (a)+(b)+(c), TẠO DRAFT TỪ 55 BÀI KHTN
// =========================================================================
export function normalizeNlsSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .replace(/\s+/g, '');
}

export function getExpectedLevelForGrade(grade: GradeType): 'TC1' | 'TC2' {
  return grade === '6' || grade === '7' ? 'TC1' : 'TC2';
}

export function buildPartBFromSelections(
  nlsItems: SelectedNlsItem[],
  aiCode: string
): string {
  const parts: string[] = [];
  if (nlsItems.length > 0) {
    const nlsDesc = nlsItems
      .map((item) => {
        const cleanDesc = item.description.replace(/\.$/, '');
        const lowerFirst = cleanDesc.charAt(0).toLowerCase() + cleanDesc.slice(1);
        return `${lowerFirst} (${item.code})`;
      })
      .join('; ');
    parts.push(nlsDesc);
  }
  if (aiCode.trim()) {
    parts.push(`kiểm chứng và sử dụng AI có trách nhiệm (${aiCode.trim()})`);
  }
  return parts.join('; ');
}

export function getEffectivePartB(draft: KhbdDraftState): string {
  if (draft.partBOverride.trim()) return draft.partBOverride.trim();
  const generated = buildPartBFromSelections(draft.selectedNlsCodes, draft.selectedAiCode);
  return generated || '[Chọn chỉ báo NLS / Mã YCCĐ AI ở Bước 2]';
}

export function composeObjectiveParts(draft: KhbdDraftState) {
  const partA = draft.partA.trim() || '[Nhập YCCĐ môn học ở Bước 1]';
  const partB = getEffectivePartB(draft);
  const partC = draft.partC.trim() || '[Chọn nhóm ATM / hành vi quan sát được ở Bước 2]';
  const plainText = `Học sinh ${partA}; trong quá trình đó ${partB}; cụ thể là ${partC}.`;
  const htmlContent = `<p style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.5;text-align:justify;"><strong>Mục tiêu tích hợp NLS – ATM – AI:</strong> Học sinh <span style="color:#1D4ED8;">${escapeHtml(
    partA
  )}</span>; trong quá trình đó <span style="color:#0E7490;">${escapeHtml(
    partB
  )}</span>; cụ thể là <span style="color:#7E22CE;">${escapeHtml(partC)}</span>.</p>`;
  return { partA, partB, partC, plainText, htmlContent };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildDraftFromKhtnAiLesson(
  lesson: RawKhtnAiV21,
  allNls: RawNlsV21[]
): Partial<KhbdDraftState> {
  const level = getExpectedLevelForGrade(lesson.l);
  const profile = GRADE_AI_PROFILES[lesson.l];
  const primaryNlsCode = level === 'TC1' ? '1.2TC1a' : '1.2TC2a';
  const aiNlsCode = level === 'TC1' ? '6.3TC1a' : '6.3TC2a';
  const matchedNls = allNls
    .filter((item) => item.c === primaryNlsCode || item.c === aiNlsCode)
    .map((item) => ({
      code: item.c,
      level: item.l,
      component: item.n,
      description: item.y,
    }));

  const shortYc =
    lesson.yc.length > 260 ? `${lesson.yc.slice(0, 260).trim()}...` : lesson.yc.trim();

  return {
    subject: 'KHTN',
    grade: lesson.l,
    topicName: lesson.cd,
    lessonTitle: lesson.b,
    integrationLevel: 'bo_phan',
    partA: shortYc,
    selectedNlsCodes: matchedNls,
    selectedAiCode: lesson.ai || profile.primaryCode,
    selectedAtmGroups: ['ATM1', 'ATM7'],
    partBOverride: `đánh giá nguồn thông tin khoa học (${primaryNlsCode}) và đối chiếu kết quả do AI gợi ý với SGK/thí nghiệm (${aiNlsCode}, ${lesson.ai || profile.primaryCode})`,
    partC:
      'áp dụng 4 bước SIFT và quy trình 6 bước kiểm chứng AI để đánh dấu ý đúng/sai/thiếu trên phiếu đối chiếu, không nhập dữ liệu cá nhân lên AI (ATM1, ATM7)',
    activitySuggestion: SHARED_AI_55_FRAMEWORK.proposedActivity,
    aiPromptQuestion: SHARED_AI_55_FRAMEWORK.promptTemplate(lesson.b),
    verificationCriteria: SHARED_AI_55_FRAMEWORK.verificationCriteria,
    lowDeviceMode: 'zero_device',
    lowDeviceNote: SHARED_AI_55_FRAMEWORK.lowDevicePlan,
    evidenceNote: SHARED_AI_55_FRAMEWORK.evidenceAndDeclaration,
    plc6: {
      toolAndDate: 'Công cụ AI tạo sinh do GV trình diễn / in sẵn câu trả lời mẫu',
      purpose: `Gợi ý lời giải thích hoặc sơ đồ cho bài "${lesson.b}" để HS kiểm chứng khoa học`,
      aiScope: 'AI chỉ cung cấp văn bản/sơ đồ gợi ý ban đầu (không thay thế thí nghiệm/đo đạc)',
      studentWork:
        'HS đối chiếu từng khẳng định của AI với SGK KHTN và dữ liệu thí nghiệm, sửa lỗi và giải thích kết luận cuối',
      verificationAndEdit: SHARED_AI_55_FRAMEWORK.verificationCriteria,
      usageLevels: ['GV trình diễn'],
    },
  };
}
