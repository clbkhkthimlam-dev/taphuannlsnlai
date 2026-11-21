import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileDown,
  FolderCheck,
  FolderOpen,
  GraduationCap,
  Link2,
  MonitorPlay,
  RotateCcw,
  X,
} from 'lucide-react';
import { VERIFIED_FILES_142, VERIFIED_NLS_109, type RawKhtnAiV21, type RawNlsV21 } from './data/verifiedV21Datasets';
import {
  ATM_GROUPS_8,
  CASE_STUDIES_2,
  DEFAULT_KHBD_DRAFT,
  LEGAL_DOCS_13,
  STEP_DEFINITIONS,
  buildDraftFromKhtnAiLesson,
  buildPartBFromSelections,
  type KhbdDraftState,
  type StepNumber,
} from './data/v21Content';
import { useDocumentRouter } from './hooks/useDocumentRouter';
import { DocumentModals } from './components/DocumentModals';
import { Step1Workspace } from './components/Step1Workspace';
import { Step2Workspace } from './components/Step2Workspace';
import { Step3Workspace } from './components/Step3Workspace';
import { Step4Workspace } from './components/Step4Workspace';
import { Step5Workspace } from './components/Step5Workspace';
import {
  CaseStudyModal,
  DraftExportModal,
  KnowledgeDrawer,
  LegalDocDetailModal,
  type DrawerTabId,
} from './components/KnowledgeDrawerAndModals';

const STORAGE_DRAFT_KEY = 'himlam_v21_khbd_draft_state';

function loadInitialDraft(): KhbdDraftState {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (!raw) return DEFAULT_KHBD_DRAFT;
    const parsed = JSON.parse(raw) as Partial<KhbdDraftState>;
    return {
      ...DEFAULT_KHBD_DRAFT,
      ...parsed,
      plc6: {
        ...DEFAULT_KHBD_DRAFT.plc6,
        ...(parsed.plc6 || {}),
      },
    };
  } catch {
    return DEFAULT_KHBD_DRAFT;
  }
}

interface ToastState {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'warning';
  actionLabel?: string;
  actionStep?: StepNumber;
}

export default function App() {
  const [activeStep, setActiveStep] = useState<StepNumber>(1);
  const [draft, setDraft] = useState<KhbdDraftState>(loadInitialDraft);
  const [presentationMode, setPresentationMode] = useState(false);

  // Step 2 embedded tab & NLTP filter (for Flow L3)
  const [step2SubTab, setStep2SubTab] = useState<'nls' | 'atm' | 'khtn'>('nls');
  const [step2ComponentFilter, setStep2ComponentFilter] = useState<string[]>([]);

  // Drawers & Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTabId>('legal');
  const [drawerFilesFilter, setDrawerFilesFilter] = useState('');
  const [activeLegalDocId, setActiveLegalDocId] = useState<string | null>(null);
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<
    'khtn8-bai32' | 'toan6-bai40' | null
  >(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<ToastState | null>(null);

  const notify = useCallback(
    (
      message: string,
      tone: 'success' | 'info' | 'warning' = 'info',
      actionLabel?: string,
      actionStep?: StepNumber
    ) => {
      setToast({ id: Date.now(), message, tone, actionLabel, actionStep });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Persist draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage quota issues
    }
  }, [draft]);

  const docRouter = useDocumentRouter(notify);

  const updateDraft = useCallback((patch: Partial<KhbdDraftState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCopyText = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          notify(`Đã copy: "${text.length > 65 ? `${text.slice(0, 65)}...` : text}"`, 'success');
          return;
        }
      } catch {
        // Fallback below
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      notify('Đã copy vào bộ nhớ tạm.', 'success');
    },
    [notify]
  );

  // Flow L2: Add NLS indicator to Step 3 (b) + toast with jump button
  const handleAddNlsToPartB = useCallback(
    (item: RawNlsV21) => {
      setDraft((prev) => {
        if (prev.selectedNlsCodes.some((x) => x.code === item.c)) {
          return prev;
        }
        const nextCodes = [
          ...prev.selectedNlsCodes,
          {
            code: item.c,
            level: item.l,
            component: item.n,
            description: item.y,
          },
        ];
        return {
          ...prev,
          selectedNlsCodes: nextCodes,
          partBOverride: buildPartBFromSelections(nextCodes, prev.selectedAiCode),
        };
      });
      notify(
        `Luồng L2: Đã thêm mã ${item.c} vào thành phần (b) của Bước 3.`,
        'success',
        'Đi tới Bước 3 →',
        3
      );
    },
    [notify]
  );

  const handleRemoveNlsFromPartB = useCallback((code: string) => {
    setDraft((prev) => {
      const nextCodes = prev.selectedNlsCodes.filter((x) => x.code !== code);
      return {
        ...prev,
        selectedNlsCodes: nextCodes,
        partBOverride: buildPartBFromSelections(nextCodes, prev.selectedAiCode),
      };
    });
  }, []);

  // Flow L3: Click NLTP badge on ATM card -> jump to Step 2 Tab 2.1 filtered
  const handleJumpAtmToNls = useCallback(
    (codes: string[], atmCode: string) => {
      setStep2ComponentFilter(codes);
      setStep2SubTab('nls');
      setActiveStep(2);
      notify(
        `Luồng L3: Đã lọc bảng ChiBao-NLS theo các NL thành phần (${codes.join(', ')}) của ${atmCode}.`,
        'info'
      );
    },
    [notify]
  );

  // Flow L4: Select ATM group -> populate Step 3 (c)
  const handleSelectAtmForPartC = useCallback(
    (atmCode: string) => {
      const atm = ATM_GROUPS_8.find((a) => a.code === atmCode);
      if (!atm) return;
      setDraft((prev) => {
        const exists = prev.selectedAtmGroups.includes(atmCode);
        const nextGroups = exists
          ? prev.selectedAtmGroups.filter((c) => c !== atmCode)
          : [...prev.selectedAtmGroups, atmCode];
        const nextPartC =
          nextGroups.length === 0
            ? ''
            : nextGroups
                .map((g) => ATM_GROUPS_8.find((x) => x.code === g)?.observablePartC || '')
                .filter(Boolean)
                .join('; ');
        return {
          ...prev,
          selectedAtmGroups: nextGroups,
          partC: nextPartC || prev.partC,
        };
      });
      notify(
        `Luồng L4: Đã cập nhật ${atm.code} vào hành vi quan sát được (c) ở Bước 3.`,
        'success',
        'Đi tới Bước 3 →',
        3
      );
    },
    [notify]
  );

  // Flow L5: Load 1 of 55 KHTN AI lessons -> auto-fill Steps 1, 2, 4, 5
  const handleLoadKhtnAiLesson = useCallback(
    (lesson: RawKhtnAiV21) => {
      const patch = buildDraftFromKhtnAiLesson(lesson, VERIFIED_NLS_109);
      setDraft((prev) => ({
        ...prev,
        ...patch,
        plc6: {
          ...prev.plc6,
          ...(patch.plc6 || {}),
        },
      }));
      setActiveStep(3);
      notify(
        `Luồng L5: Đã nạp bài "${lesson.b}" (Lớp ${lesson.l}, AI ${lesson.ai}) đồng bộ vào cả Bước 1, 2, 3, 4 và 5!`,
        'success'
      );
    },
    [notify]
  );

  const handleSelectAiCodeOnly = useCallback(
    (aiCode: string) => {
      setDraft((prev) => ({
        ...prev,
        selectedAiCode: aiCode,
        partBOverride: buildPartBFromSelections(prev.selectedNlsCodes, aiCode),
      }));
      notify(`Đã gắn mã YCCĐ AI ${aiCode} vào bài học và cập nhật Bước 3.`, 'success', 'Đi tới Bước 3 →', 3);
    },
    [notify]
  );

  // Flow L7: Apply Case Study into 5-step pipeline
  const handleApplyCaseStudy = useCallback(
    (id: 'khtn8-bai32' | 'toan6-bai40') => {
      const cs = CASE_STUDIES_2.find((x) => x.id === id);
      if (!cs) return;
      const matchedNls = VERIFIED_NLS_109.filter((x) => cs.nlsCodes.includes(x.c)).map(
        (x) => ({
          code: x.c,
          level: x.l,
          component: x.n,
          description: x.y,
        })
      );
      setDraft((prev) => ({
        ...prev,
        subject: cs.subject,
        grade: cs.grade,
        lessonTitle: cs.title,
        partA: cs.goalA,
        selectedNlsCodes: matchedNls,
        selectedAiCode: cs.aiCode || '',
        selectedAtmGroups: cs.atmCodes,
        partBOverride: cs.goalB,
        partC: cs.goalC,
        activitySuggestion: `${cs.activityTitle}: ${cs.contentB}`,
        lowDeviceNote: cs.boardingPlan,
        evidenceNote: cs.productC,
      }));
      setActiveStep(3);
      notify(`Đã nạp trọn vẹn ${cs.badge} vào Quy trình 5 bước.`, 'success');
    },
    [notify]
  );

  // Flow L8: Auto-enrich PLC.6 when entering Step 5 if still empty
  const goToStep = useCallback((step: StepNumber) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openDrawer = useCallback((tab: DrawerTabId, filesFilter = '') => {
    setDrawerTab(tab);
    setDrawerFilesFilter(filesFilter);
    setIsDrawerOpen(true);
  }, []);

  const activeLegalDoc =
    LEGAL_DOCS_13.find((d) => d.id === activeLegalDocId) || null;

  return (
    <div
      className={`min-h-screen flex flex-col vibrant-canvas text-[#0F172A] ${
        presentationMode ? 'presentation-mode' : ''
      }`}
    >
      {/* Hidden webkitdirectory input fallback for Mode 1 Folder Picker */}
      <input
        ref={docRouter.folderInputRef}
        type="file"
        multiple
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore webkitdirectory is a standard non-TS DOM attribute
        webkitdirectory=""
        className="hidden"
        onChange={(e) => docRouter.handleFolderInputFiles(e.target.files)}
      />

      {/* 1. STICKY VIBRANT HEADER */}
      <header
        className="sticky top-0 z-30 text-white shadow-lg print:hidden"
        style={{
          background:
            'linear-gradient(135deg, #4F46E5 0%, #7C3AED 45%, #EC4899 85%, #F59E0B 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight truncate">
                Cổng Soạn KHBD Tích hợp NLS – ATM – AI
              </h1>
              <p className="text-[13px] sm:text-xs text-white/90 truncate">
                Trường PTDTNT THCS Him Lam (Thạnh Xuân, TP. Cần Thơ)
              </p>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Folder Picker button + connection status badge */}
            <button
              type="button"
              onClick={() => void docRouter.pickRootFolder()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/18 hover:bg-white/28 border border-white/30 text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              title="Chọn thư mục 0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026 trên máy tính"
            >
              {docRouter.matchedVerifiedCount > 0 ? (
                <FolderCheck className="w-4 h-4 text-emerald-200" />
              ) : (
                <FolderOpen className="w-4 h-4 text-amber-200" />
              )}
              <span className="hidden md:inline">Chọn thư mục tài liệu</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[12px] font-extrabold ${
                  docRouter.matchedVerifiedCount > 0
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-[#451A03]'
                }`}
              >
                {docRouter.matchedVerifiedCount > 0
                  ? `Đã kết nối ${docRouter.matchedVerifiedCount}/${VERIFIED_FILES_142.length}`
                  : 'Chưa kết nối'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => docRouter.setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/18 hover:bg-white/28 border border-white/30 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cài đặt đường dẫn</span>
            </button>

            <button
              type="button"
              onClick={() => openDrawer('legal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/18 hover:bg-white/28 border border-white/30 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5" />
              Kho tra cứu đầy đủ
            </button>

            <button
              type="button"
              onClick={() => setPresentationMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                presentationMode
                  ? 'bg-[#0F172A] text-amber-300 border-amber-300'
                  : 'bg-white/18 hover:bg-white/28 border-white/30 text-white'
              }`}
              title="Ẩn phần phụ và phóng to chữ cho máy chiếu hội trường"
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              {presentationMode ? 'Thoát Trình chiếu' : 'Trình chiếu'}
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-extrabold whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-300" />
              Xuất KHBD nháp
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 py-5 space-y-5">
        {/* 2. COMPACT VIBRANT HERO BANNER (hidden in Presentation Mode) */}
        {!presentationMode && (
          <section className="rounded-3xl bg-white/95 border-2 border-indigo-200/80 shadow-sm p-5 sm:p-6 space-y-4 print:hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-[#DBEAFE] text-[#1D4ED8]">
                    Tập huấn lại: 22/11/2026
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FFE4E6] text-[#BE123C]">
                    Hạn KHDH: trước 04/12/2026
                  </span>
                  <button
                    type="button"
                    onClick={() => openDrawer('schedule')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE] hover:bg-purple-200/70 cursor-pointer"
                  >
                    <CalendarClock className="w-3.5 h-3.5" />
                    Xem Kịch bản 60 phút →
                  </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                  Quy trình 5 Bước Soạn Kế hoạch Bài dạy Tích hợp{' '}
                  <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#EA580C] bg-clip-text text-transparent">
                    Năng lực số – An toàn mạng – AI
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Công cụ chuyên môn dành cho giáo viên Toán, KHTN, Công nghệ Trường PTDTNT THCS Him Lam — tích hợp sẵn dữ liệu thật từ{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalDocId('tt-02-2025')}
                    className="font-bold text-[#1D4ED8] underline cursor-pointer"
                  >
                    TT 02/2025
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalDocId('cv-3456')}
                    className="font-bold text-[#1D4ED8] underline cursor-pointer"
                  >
                    CV 3456
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalDocId('qd-2422')}
                    className="font-bold text-[#7E22CE] underline cursor-pointer"
                  >
                    QĐ 2422
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalDocId('cv-5588')}
                    className="font-bold text-[#7E22CE] underline cursor-pointer"
                  >
                    CV 5588
                  </button>
                  {' '}và{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalDocId('cv-6206')}
                    className="font-bold text-[#BE123C] underline cursor-pointer"
                  >
                    CV 6206
                  </button>
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openDrawer('files')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-[#4F46E5]" />
                  142 Tệp chuẩn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(DEFAULT_KHBD_DRAFT);
                    notify('Đã khôi phục bài mẫu mặc định KHTN 8 Bài 32.', 'info');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  title="Đặt lại về bài mẫu mặc định KHTN 8 Bài 32"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Nạp lại mẫu
                </button>
              </div>
            </div>

            {/* 4 Quick-Jump Stat Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openDrawer('legal')}
                className="text-left p-3 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border-2 border-[#93C5FD] transition-all cursor-pointer"
              >
                <div className="text-lg font-extrabold text-[#1D4ED8] leading-none">
                  13 Văn bản
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  Pháp lý TW, Sở Cần Thơ & Him Lam →
                </div>
              </button>

              <button
                type="button"
                onClick={() => openDrawer('nls')}
                className="text-left p-3 rounded-xl bg-[#ECFEFF] hover:bg-[#CFFAFE] border-2 border-[#67E8F9] transition-all cursor-pointer"
              >
                <div className="text-lg font-extrabold text-[#0E7490] leading-none">
                  109 Chỉ báo THCS
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  54 TC1 (L6–7) + 55 TC2 (L8–9) →
                </div>
              </button>

              <button
                type="button"
                onClick={() => openDrawer('atm')}
                className="text-left p-3 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border-2 border-[#FDA4AF] transition-all cursor-pointer"
              >
                <div className="text-lg font-extrabold text-[#BE123C] leading-none">
                  8 Nhóm ATM & SIFT
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  ATM1–ATM8, 5 nguy cơ & Lớp 8A →
                </div>
              </button>

              <button
                type="button"
                onClick={() => openDrawer('khtn')}
                className="text-left p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border-2 border-[#D8B4FE] transition-all cursor-pointer"
              >
                <div className="text-lg font-extrabold text-[#7E22CE] leading-none">
                  207 Bài KHTN
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  55 Có AI + 152 Không AI & 4 Hồ sơ →
                </div>
              </button>
            </div>
          </section>
        )}

        {/* 3. CENTERPIECE: INTERACTIVE 5-STEP PIPELINE WITH RAINBOW PROGRESS BAR */}
        <section className="rounded-3xl bg-white border-2 border-indigo-200 shadow-sm p-4 sm:p-5 space-y-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#4F46E5]" />
              <span className="font-extrabold text-sm sm:text-base text-[#0F172A]">
                Sơ đồ Quy trình 5 Bước Tương tác
              </span>
              <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                — Đang soạn: <strong>{draft.subject} {draft.grade}</strong> · {draft.lessonTitle || 'Chưa đặt tên'}
              </span>
            </div>
            <div className="text-xs font-extrabold text-[#4F46E5]">
              Bước {activeStep} / 5
            </div>
          </div>

          {/* Rainbow Progress Bar */}
          <div className="relative h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(activeStep / 5) * 100}%`,
                background:
                  'linear-gradient(90deg, #2563EB, #06B6D4, #9333EA, #EA580C, #059669)',
              }}
            />
          </div>

          {/* 5 Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {STEP_DEFINITIONS.map((st) => {
              const isActive = activeStep === st.step;
              const isCompleted = activeStep > st.step;
              const stepStatusText =
                st.step === 1
                  ? `${draft.subject} Lớp ${draft.grade}`
                  : st.step === 2
                  ? `${draft.selectedNlsCodes.length} NLS · ${draft.selectedAtmGroups.length} ATM${
                      draft.selectedAiCode ? ` · ${draft.selectedAiCode}` : ''
                    }`
                  : st.step === 3
                  ? draft.partA && draft.partC
                    ? 'Đủ (a)+(b)+(c)'
                    : 'Đang ghép mục tiêu'
                  : st.step === 4
                  ? draft.lowDeviceMode === 'zero_device'
                    ? 'PA 0 thiết bị'
                    : draft.lowDeviceMode === 'one_device_teacher'
                    ? 'PA 1 thiết bị GV'
                    : 'PA Phòng máy 4 vai'
                  : `Gate ${draft.checkedChecklistIds.length}/9`;

              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => goToStep(st.step)}
                  className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'text-white shadow-md scale-[1.01]'
                      : 'hover:shadow-xs'
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            st.step === 4
                              ? 'linear-gradient(135deg, #EA580C 0%, #D97706 100%)'
                              : st.gradientCss,
                          borderColor: st.accentHex,
                        }
                      : {
                          backgroundColor: st.lightBgHex,
                          borderColor: st.borderHex,
                        }
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-xs font-extrabold ${
                        isActive ? 'bg-white/25 text-white' : 'text-white'
                      }`}
                      style={!isActive ? { backgroundColor: st.accentHex } : undefined}
                    >
                      Bước {st.step}
                    </span>
                    {isCompleted && (
                      <CheckCircle2
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`}
                      />
                    )}
                  </div>

                  <div>
                    <div
                      className={`font-extrabold text-sm leading-snug ${
                        isActive
                          ? 'text-white'
                          : st.step === 4
                          ? 'text-[#7C2D12]'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {st.shortTitle}
                    </div>
                    <div
                      className={`text-[13px] font-semibold mt-1 truncate ${
                        isActive
                          ? 'text-white/95'
                          : st.step === 4
                          ? 'text-[#9A3412]'
                          : 'text-slate-700'
                      }`}
                    >
                      {stepStatusText}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. ACTIVE STEP WORKSPACE (3 Fixed Blocks A, B, C) */}
        <section aria-live="polite">
          {activeStep === 1 && (
            <Step1Workspace
              draft={draft}
              updateDraft={updateDraft}
              onNextStep={() => goToStep(2)}
              onOpenKhtnAiDrawer={() => openDrawer('khtn')}
              onOpenLegalDoc={(id) => setActiveLegalDocId(id)}
              router={docRouter}
              onCopyPath={(p) => void handleCopyText(p)}
              notify={notify}
            />
          )}

          {activeStep === 2 && (
            <Step2Workspace
              draft={draft}
              onAddNlsToPartB={handleAddNlsToPartB}
              onRemoveNlsFromPartB={handleRemoveNlsFromPartB}
              onSelectAtmForPartC={handleSelectAtmForPartC}
              onLoadKhtnAiLesson={handleLoadKhtnAiLesson}
              onSelectAiCodeOnly={handleSelectAiCodeOnly}
              onPrevStep={() => goToStep(1)}
              onNextStep={() => goToStep(3)}
              onOpenLegalDoc={(id) => setActiveLegalDocId(id)}
              router={docRouter}
              onCopyPath={(p) => void handleCopyText(p)}
              notify={notify}
              activeSubTab={step2SubTab}
              setActiveSubTab={setStep2SubTab}
              componentFilter={step2ComponentFilter}
              setComponentFilter={setStep2ComponentFilter}
            />
          )}

          {activeStep === 3 && (
            <Step3Workspace
              draft={draft}
              updateDraft={updateDraft}
              onPrevStep={() => goToStep(2)}
              onNextStep={() => goToStep(4)}
              router={docRouter}
              onCopyPath={(p) => void handleCopyText(p)}
              notify={notify}
            />
          )}

          {activeStep === 4 && (
            <Step4Workspace
              draft={draft}
              updateDraft={updateDraft}
              onPrevStep={() => goToStep(3)}
              onNextStep={() => goToStep(5)}
              onOpenCaseStudy={(id) => setActiveCaseStudyId(id)}
              onOpenFilesDrawer={(q) => openDrawer('files', q || '')}
              router={docRouter}
              onCopyPath={(p) => void handleCopyText(p)}
              notify={notify}
            />
          )}

          {activeStep === 5 && (
            <Step5Workspace
              draft={draft}
              updateDraft={updateDraft}
              onPrevStep={() => goToStep(4)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenLegalDoc={(id) => setActiveLegalDocId(id)}
              router={docRouter}
              onCopyPath={(p) => void handleCopyText(p)}
              notify={notify}
            />
          )}
        </section>
      </main>

      {/* Compact Footer */}
      {!presentationMode && (
        <footer className="mt-8 border-t border-indigo-200/80 bg-white/80 py-4 px-4 text-center text-xs text-slate-600 print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              <strong>Trường PTDTNT THCS Him Lam</strong> (Thạnh Xuân, TP. Cần Thơ) · Dữ liệu xác minh 100%: 13 Văn bản · 109 Chỉ báo NLS · 8 Nhóm ATM · 207 Bài KHTN · 142 Tệp
            </span>
            <button
              type="button"
              onClick={() => openDrawer('schedule')}
              className="text-[#4F46E5] font-bold hover:underline cursor-pointer"
            >
              Lộ trình Tập huấn 22/11/2026 & Hạn KHDH trước 04/12/2026
            </button>
          </div>
        </footer>
      )}

      {/* TOAST NOTIFICATION WITH OPTIONAL STEP JUMP (L2/L4) */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] print:hidden">
          <div
            className={`rounded-2xl shadow-xl border-2 px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold ${
              toast.tone === 'success'
                ? 'bg-emerald-950 text-white border-emerald-400'
                : toast.tone === 'warning'
                ? 'bg-amber-950 text-white border-amber-400'
                : 'bg-indigo-950 text-white border-indigo-400'
            }`}
          >
            <span className="leading-snug">{toast.message}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {toast.actionLabel && toast.actionStep && (
                <button
                  type="button"
                  onClick={() => {
                    goToStep(toast.actionStep!);
                    setToast(null);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-[#0F172A] text-xs font-extrabold hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                >
                  {toast.actionLabel}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 rounded-lg hover:bg-white/15 text-white cursor-pointer"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWERS & MODALS */}
      <KnowledgeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={drawerTab}
        setActiveTab={setDrawerTab}
        initialFilesFilter={drawerFilesFilter}
        draft={draft}
        onAddNlsToPartB={handleAddNlsToPartB}
        onJumpAtmToNls={handleJumpAtmToNls}
        onSelectAtmForPartC={handleSelectAtmForPartC}
        onLoadKhtnAiLesson={handleLoadKhtnAiLesson}
        onOpenLegalDoc={(id) => setActiveLegalDocId(id)}
        router={docRouter}
        onCopyPath={(p) => void handleCopyText(p)}
      />

      <LegalDocDetailModal
        doc={activeLegalDoc}
        onClose={() => setActiveLegalDocId(null)}
        router={docRouter}
        onCopyCitation={(citation) => void handleCopyText(citation)}
      />

      <CaseStudyModal
        caseStudyId={activeCaseStudyId}
        onClose={() => setActiveCaseStudyId(null)}
        onApplyCaseStudy={handleApplyCaseStudy}
      />

      <DraftExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        draft={draft}
        notify={notify}
      />

      <DocumentModals
        router={docRouter}
        onCopyPath={(p) => void handleCopyText(p)}
      />
    </div>
  );
}
