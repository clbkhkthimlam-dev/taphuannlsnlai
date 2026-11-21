import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Plus,
  Printer,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import { copyRichTextForWord, downloadWordDocument } from '../utils/wordExport';
import {
  VERIFIED_FILES_142,
  VERIFIED_KHTN_AI_55,
  VERIFIED_KHTN_NO_AI_152,
  VERIFIED_NLS_109,
  type RawKhtnAiV21,
  type RawNlsV21,
} from '../data/verifiedV21Datasets';
import {
  ATM_GROUPS_8,
  CASE_STUDIES_2,
  CLASS_8A_SCENARIO,
  GRADE_AI_PROFILES,
  HIM_LAM_SPEAKERS,
  LEGAL_DOCS_13,
  LOW_DEVICE_OPTIONS_3,
  NLS_DOMAINS_6,
  NLS_LEVELS_8,
  PLC2_GATE_CHECKLIST,
  PLC6_AI_LEVELS,
  POST_TRAINING_ROADMAP,
  SCAM_EMOTIONS_4,
  SECURITY_PRACTICES_5,
  THCS_RISKS_5,
  TRAINING_60_MIN_STAGES,
  composeObjectiveParts,
  escapeHtml,
  normalizeNlsSearch,
  type GradeType,
  type KhbdDraftState,
  type LegalDocV21,
} from '../data/v21Content';

export type DrawerTabId = 'legal' | 'nls' | 'atm' | 'khtn' | 'files' | 'schedule';

interface KnowledgeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTabId;
  setActiveTab: (tab: DrawerTabId) => void;
  initialFilesFilter?: string;
  draft: KhbdDraftState;
  onAddNlsToPartB: (item: RawNlsV21) => void;
  onJumpAtmToNls: (codes: string[], atmCode: string) => void;
  onSelectAtmForPartC: (atmCode: string) => void;
  onLoadKhtnAiLesson: (lesson: RawKhtnAiV21) => void;
  onOpenLegalDoc: (docId: string) => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
}

export function KnowledgeDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  initialFilesFilter = '',
  draft,
  onAddNlsToPartB,
  onJumpAtmToNls,
  onSelectAtmForPartC,
  onLoadKhtnAiLesson,
  onOpenLegalDoc,
  router,
  onCopyPath,
}: KnowledgeDrawerProps) {
  const [nlsQuery, setNlsQuery] = useState('');
  const [nlsLevel, setNlsLevel] = useState<'ALL' | 'TC1' | 'TC2'>('ALL');
  const [khtnMode, setKhtnMode] = useState<'ai' | 'no_ai'>('ai');
  const [khtnGrade, setKhtnGrade] = useState<'ALL' | GradeType>('ALL');
  const [khtnQuery, setKhtnQuery] = useState('');
  const [filesFolder, setFilesFolder] = useState<string>('ALL');
  const [filesQuery, setFilesQuery] = useState(initialFilesFilter);

  React.useEffect(() => {
    if (initialFilesFilter) {
      setFilesQuery(initialFilesFilter);
    }
  }, [initialFilesFilter]);

  const filteredNls = useMemo(() => {
    const qNorm = normalizeNlsSearch(nlsQuery);
    const qLower = nlsQuery.trim().toLowerCase();
    return VERIFIED_NLS_109.filter((item) => {
      if (nlsLevel !== 'ALL' && item.l !== nlsLevel) return false;
      if (qNorm) {
        return (
          normalizeNlsSearch(item.c).includes(qNorm) ||
          normalizeNlsSearch(item.n).includes(qNorm) ||
          item.y.toLowerCase().includes(qLower)
        );
      }
      return true;
    });
  }, [nlsLevel, nlsQuery]);

  const filteredKhtnAi = useMemo(() => {
    const q = khtnQuery.trim().toLowerCase();
    return VERIFIED_KHTN_AI_55.filter((item) => {
      if (khtnGrade !== 'ALL' && item.l !== khtnGrade) return false;
      if (!q) return true;
      return (
        item.b.toLowerCase().includes(q) ||
        item.cd.toLowerCase().includes(q) ||
        item.ai.toLowerCase().includes(q)
      );
    });
  }, [khtnGrade, khtnQuery]);

  const filteredKhtnNoAi = useMemo(() => {
    const q = khtnQuery.trim().toLowerCase();
    return VERIFIED_KHTN_NO_AI_152.filter((item) => {
      if (khtnGrade !== 'ALL' && item.l !== khtnGrade) return false;
      if (!q) return true;
      return item.b.toLowerCase().includes(q) || item.cd.toLowerCase().includes(q);
    });
  }, [khtnGrade, khtnQuery]);

  const filteredFiles = useMemo(() => {
    const q = filesQuery.trim().toLowerCase();
    return VERIFIED_FILES_142.filter((p) => {
      if (filesFolder !== 'ALL' && !p.startsWith(filesFolder)) return false;
      if (q && !p.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filesFolder, filesQuery]);

  if (!isOpen) return null;

  const tabs: { id: DrawerTabId; label: string }[] = [
    { id: 'legal', label: '13 Văn bản' },
    { id: 'nls', label: '109 Chỉ báo NLS' },
    { id: 'atm', label: 'ATM1–ATM8 & SIFT' },
    { id: 'khtn', label: '207 Bài KHTN' },
    { id: 'files', label: '142 Tệp (AI & KHBD)' },
    { id: 'schedule', label: 'Lộ trình 60 phút' },
  ];

  const selectedCodesSet = new Set(draft.selectedNlsCodes.map((x) => x.code));

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-full bg-[#F8FAFC] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          className="px-5 py-4 text-white flex items-center justify-between gap-3 shrink-0"
          style={{
            background:
              'linear-gradient(135deg, #4F46E5 0%, #7C3AED 45%, #EC4899 85%, #F59E0B 100%)',
          }}
        >
          <div className="min-w-0">
            <h2 className="font-extrabold text-base sm:text-lg truncate">
              Kho tra cứu đầy đủ — 100% Dữ liệu xác minh (Zero Fabrication)
            </h2>
            <p className="text-xs text-white/90 truncate">
              13 Văn bản · 109 Chỉ báo NLS · 8 Nhóm ATM · 207 Bài KHTN (55 AI) · 142 Tệp · Lộ trình 22/11/2026
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer shrink-0"
            aria-label="Đóng kho tra cứu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: 13 VĂN BẢN PHÁP LÝ */}
          {activeTab === 'legal' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 font-medium">
                Danh mục đầy đủ <strong>13 văn bản pháp lý & kế hoạch triển khai</strong> (Bộ Chính trị, Bộ GD&ĐT, Sở GD&ĐT TP. Cần Thơ, Trường PTDTNT THCS Him Lam). Bấm vào từng văn bản để xem chi tiết & copy trích dẫn chuẩn.
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {LEGAL_DOCS_13.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[13px] font-bold">
                          #{doc.stt}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenLegalDoc(doc.id)}
                          className="font-extrabold text-sm text-[#1D4ED8] hover:underline text-left cursor-pointer"
                        >
                          {doc.code}
                        </button>
                        <span className="text-xs font-semibold text-slate-500">
                          ({doc.date} · {doc.agency})
                        </span>
                        {doc.pillars.map((p) => (
                          <span
                            key={p}
                            className={`px-2 py-0.5 rounded text-[13px] font-bold ${
                              p === 'NLS'
                                ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                                : p === 'ATMTD'
                                ? 'bg-[#FFE4E6] text-[#BE123C]'
                                : p === 'AI'
                                ? 'bg-[#F3E8FF] text-[#7E22CE]'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-[#0F172A] leading-relaxed">
                        {doc.keyPoints}
                      </p>
                      <div className="text-[13px] text-slate-500 font-mono">
                        Nguồn: {doc.sourceNote}
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenLegalDoc(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4338CA] text-xs font-bold hover:bg-indigo-100 whitespace-nowrap cursor-pointer"
                      >
                        Chi tiết & Trích dẫn
                      </button>
                      {doc.sourceFile && (
                        <button
                          type="button"
                          onClick={() => void router.openDocument(doc.sourceFile!, doc.code)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Mở tệp gốc
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 109 CHỈ BÁO NLS */}
          {activeTab === 'nls' && (
            <div className="space-y-4">
              {/* 4 Trình độ, 8 Bậc summary */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#1D4ED8]">
                  Khung NLS (TT 02/2025): 6 Miền · 24 NLTP · 4 Trình độ, 8 Bậc (Trọng tâm THCS = 109 chỉ báo)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NLS_LEVELS_8.map((lv) => (
                    <div
                      key={lv.code}
                      className={`p-2.5 rounded-lg border text-xs ${
                        lv.highlight
                          ? 'bg-[#EFF6FF] border-[#60A5FA] text-[#1E3A8A]'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="font-extrabold font-mono">{lv.code}</div>
                      <div className="text-[13px]">{lv.grade}</div>
                      <div className="font-bold mt-0.5">{lv.count} chỉ báo</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {NLS_DOMAINS_6.map((d) => (
                    <div key={d.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-[#0F172A]">{d.name}</div>
                      <div className="text-slate-600 mt-0.5">
                        {d.components.map((c) => `${c.code} ${c.name}`).join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search & filter 109 */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nlsQuery}
                    onChange={(e) => setNlsQuery(e.target.value)}
                    placeholder="Tìm mã (1.2TC2a / 1.2.TC2a) hoặc từ khóa YCCĐ..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A]"
                  />
                </div>
                <div className="flex gap-1">
                  {(['ALL', 'TC1', 'TC2'] as const).map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setNlsLevel(lv)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        nlsLevel === lv
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {lv === 'ALL' ? 'Cả 109' : lv === 'TC1' ? 'TC1 (54)' : 'TC2 (55)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredNls.map((item) => {
                  const chosen = selectedCodesSet.has(item.c);
                  return (
                    <div
                      key={item.c}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8] font-mono text-xs font-extrabold">
                            {item.c}
                          </span>
                          <span className="text-[13px] font-bold text-slate-600">
                            {item.l} · NL {item.n}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#0F172A] mt-1">{item.y}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onCopyPath(item.c)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          Copy mã
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddNlsToPartB(item)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            chosen
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#2563EB] text-white hover:bg-blue-700'
                          }`}
                        >
                          {chosen ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          {chosen ? 'Đã chọn (b)' : 'Chọn làm (b)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ATM1-ATM8, 5 NGUY CƠ, BẢO MẬT & LỚP 8A */}
          {activeTab === 'atm' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ATM_GROUPS_8.map((atm) => (
                  <div
                    key={atm.code}
                    className="p-4 rounded-xl border-2 space-y-2.5 flex flex-col justify-between"
                    style={{ backgroundColor: atm.bgHex, borderColor: atm.borderHex }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-lg text-white font-mono text-xs font-extrabold"
                          style={{ backgroundColor: atm.accentHex }}
                        >
                          {atm.code}
                        </span>
                        <span className="font-extrabold text-sm text-[#0F172A]">
                          {atm.title}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1E293B] mt-2 leading-relaxed">
                        {atm.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10">
                      <button
                        type="button"
                        onClick={() => {
                          onJumpAtmToNls(atm.nlCodes, atm.code);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-[#0E7490] font-mono text-xs font-bold hover:bg-cyan-50 cursor-pointer"
                      >
                        NL: {atm.nlCodes.join('; ')} → Lọc Bước 2
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectAtmForPartC(atm.code)}
                        className="px-3 py-1 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        + Chọn làm (c)
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5 Nhóm nguy cơ trọng tâm THCS (Slide 15) */}
              <div className="p-4 rounded-xl bg-white border-2 border-rose-200 space-y-2.5">
                <div className="text-sm font-extrabold text-[#BE123C] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  5 Nhóm nguy cơ trọng tâm ở cấp THCS (Slide 15)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#0F172A]">
                  {THCS_RISKS_5.map((r) => (
                    <div key={r.num} className="p-3 rounded-lg bg-rose-50/70 border border-rose-200">
                      <div className="font-extrabold text-[#9F1239]">
                        {r.num}. {r.title}
                      </div>
                      <p className="mt-0.5 leading-snug">{r.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Thực hành bảo mật & 4 Cảm giác lừa đảo (Slide 17) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                  <div className="text-sm font-extrabold text-[#065F46]">
                    5 Thực hành bảo mật tài khoản (Slide 17)
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#0F172A]">
                    {SECURITY_PRACTICES_5.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
                  <div className="text-sm font-extrabold text-[#9A3412]">
                    4 Cảm giác kẻ lừa đảo thường tạo ra (Slide 17)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {SCAM_EMOTIONS_4.map((e) => (
                      <div key={e.label} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="font-extrabold text-[#7C2D12]">{e.label}</div>
                        <p className="text-[#0F172A] mt-0.5">{e.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tình huống lớp 8A */}
              <div className="p-4 rounded-xl bg-[#FFF1F2] border-2 border-[#FDA4AF] space-y-2 text-xs sm:text-sm text-[#0F172A]">
                <div className="font-extrabold text-[#BE123C]">{CLASS_8A_SCENARIO.title}</div>
                <p className="bg-white p-3 rounded-lg border border-rose-200">
                  {CLASS_8A_SCENARIO.situation}
                </p>
                <div className="font-bold text-[#9F1239]">Hướng xử lí sư phạm chuẩn:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {CLASS_8A_SCENARIO.pedagogicalHandling.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: 207 BÀI KHTN (55 CÓ AI + 152 KHÔNG AI) */}
          {activeTab === 'khtn' && (
            <div className="space-y-4">
              {/* 4 Hồ sơ AI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(['6', '7', '8', '9'] as GradeType[]).map((g) => {
                  const prof = GRADE_AI_PROFILES[g];
                  return (
                    <div
                      key={g}
                      className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-[#7E22CE]">
                          Lớp {g} · {prof.strand}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE] font-mono font-extrabold">
                          {prof.primaryCode} / {prof.secondaryCode}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-snug">{prof.primaryDesc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setKhtnMode('ai')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    khtnMode === 'ai'
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  55 Bài Có tích hợp AI
                </button>
                <button
                  type="button"
                  onClick={() => setKhtnMode('no_ai')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    khtnMode === 'no_ai'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  152 Bài Không bắt buộc AI
                </button>
                <div className="flex gap-1">
                  {(['ALL', '6', '7', '8', '9'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setKhtnGrade(g)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        khtnGrade === g
                          ? 'bg-[#0891B2] text-white border-[#0891B2]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {g === 'ALL' ? 'Cả 4 lớp' : `L${g}`}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={khtnQuery}
                  onChange={(e) => setKhtnQuery(e.target.value)}
                  placeholder="Tìm bài học, chủ đề..."
                  className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-[#0F172A]"
                />
              </div>

              {khtnMode === 'ai' ? (
                <div className="space-y-2.5">
                  {filteredKhtnAi.map((lesson) => (
                    <div
                      key={lesson.s}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-500">#{lesson.s}</span>
                          <span className="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold">
                            Lớp {lesson.l}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE] font-mono text-xs font-extrabold">
                            {lesson.ai}
                          </span>
                          <span className="text-xs text-slate-600">{lesson.cd}</span>
                        </div>
                        <div className="font-bold text-sm text-[#0F172A]">{lesson.b}</div>
                        <p className="text-xs text-slate-600 line-clamp-2">{lesson.yc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadKhtnAiLesson(lesson);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Nạp vào 5 bước
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredKhtnNoAi.map((lesson) => (
                    <div
                      key={lesson.s}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-mono text-slate-500 mr-2">#{lesson.s}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold mr-2">
                          Lớp {lesson.l}
                        </span>
                        <span className="font-semibold text-[#0F172A]">{lesson.b}</span>
                        <span className="text-slate-500 ml-1">({lesson.cd})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 142 ĐƯỜNG DẪN TỆP THẬT */}
          {activeTab === 'files' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-indigo-700" />
                  <span>
                    Tổng cộng <strong>142 tệp chuẩn</strong>: 6 Pháp lý · 14 Tập huấn/Báo cáo · 68 Khung AI THCS (31 bài AI) · 54 KHBD Minh họa KHTN.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void router.pickRootFolder()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Kết nối thư mục gốc
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: 'Tất cả (142)' },
                  { id: '1. Phap_ly_va_Chinh_sach/', label: '1. Pháp lý (6)' },
                  { id: '2. Tai_lieu_Tap_huan_va_Bao_cao/', label: '2. Tập huấn & Báo cáo (14)' },
                  { id: '3. Khung_Chuong_Trinh_AI_THCS/', label: '3. Khung AI THCS (68)' },
                  { id: '4. KHBD_Minh_Hoa_KHTN/', label: '4. KHBD Minh họa (54)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilesFolder(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      filesFolder === f.id
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filesQuery}
                  onChange={(e) => setFilesQuery(e.target.value)}
                  placeholder="Tìm theo tên tệp, môn (Toán, Hóa, Lý, Sinh, Công nghệ) hoặc lớp (Lop6..Lop9)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A]"
                />
              </div>

              <div className="text-xs text-slate-600">
                Đang hiển thị <strong>{filteredFiles.length}</strong> / 142 tệp.
              </div>

              <DocLinkList
                items={filteredFiles.map((path) => ({
                  label: path.split('/').pop() || path,
                  path,
                }))}
                router={router}
                onCopyPath={onCopyPath}
                accentHex="#4F46E5"
              />
            </div>
          )}

          {/* TAB 6: LỘ TRÌNH TẬP HUẤN 60 PHÚT (22/11/2026) */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border-2 border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#4338CA]">
                  <CalendarClock className="w-4 h-4" />
                  Kịch bản Tập huấn 60 phút — Trường PTDTNT THCS Him Lam (Ngày 22/11/2026)
                </div>
                <p className="text-xs text-slate-600">
                  Thời gian tập huấn lại: <strong>22/11/2026</strong> (07h30–11h00, 13h30–16h30) · Hạn hoàn thành KHDH: <strong>trước 04/12/2026</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {TRAINING_60_MIN_STAGES.map((st) => (
                    <div
                      key={st.stage}
                      className="p-3.5 rounded-xl bg-slate-50 border-l-4 space-y-1"
                      style={{ borderLeftColor: st.color }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-xs font-extrabold uppercase"
                          style={{ color: st.color }}
                        >
                          {st.stage}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-xs font-bold text-slate-700">
                          {st.time}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-[#0F172A]">{st.title}</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{st.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2.5">
                <div className="text-sm font-extrabold text-[#065F46]">
                  3 Đầu việc trọng tâm sau tập huấn
                </div>
                <div className="space-y-2">
                  {POST_TRAINING_ROADMAP.map((item) => (
                    <div
                      key={item.deadline}
                      className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                          {item.deadline}
                        </span>
                        <span className="font-bold text-emerald-950">{item.owner}</span>
                      </div>
                      <p className="text-[#0F172A] mt-1 leading-relaxed">{item.task}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  4 Báo cáo viên Tập huấn Trường PTDTNT THCS Him Lam
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HIM_LAM_SPEAKERS.map((sp) => (
                    <div
                      key={sp.name}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="font-bold text-[#0F172A]">{sp.name}</div>
                      <div className="text-slate-600">{sp.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// L6: LEGAL DOCUMENT DETAIL MODAL
// =========================================================================
export function LegalDocDetailModal({
  doc,
  onClose,
  router,
  onCopyCitation,
}: {
  doc: LegalDocV21 | null;
  onClose: () => void;
  router: DocumentRouterApi;
  onCopyCitation: (text: string) => void;
}) {
  if (!doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 text-white flex items-center justify-between gap-3"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 60%, #7C3AED 100%)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Scale className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-white/85">Văn bản pháp lý #{doc.stt} / 13</div>
              <h3 className="font-extrabold text-base truncate">{doc.code}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
              Ngày ban hành: {doc.date}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold">
              Cơ quan: {doc.agency}
            </span>
            {doc.pillars.map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold"
              >
                Trụ cột: {p}
              </span>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#1D4ED8]">
              Điểm cốt lõi giáo viên cần nhớ
            </div>
            <p className="text-sm text-[#0F172A] leading-relaxed">{doc.keyPoints}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-slate-600">Trích dẫn chuẩn đưa vào KHDH / KHBD:</div>
            <p className="text-xs text-[#0F172A] italic">{doc.citation}</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onCopyCitation(doc.citation)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy trích dẫn chuẩn
            </button>
            {doc.sourceFile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  void router.openDocument(doc.sourceFile!, doc.code);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Mở tệp PDF / Tài liệu gốc
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// L7: CASE STUDY DETAIL MODAL
// =========================================================================
export function CaseStudyModal({
  caseStudyId,
  onClose,
  onApplyCaseStudy,
}: {
  caseStudyId: 'khtn8-bai32' | 'toan6-bai40' | null;
  onClose: () => void;
  onApplyCaseStudy: (id: 'khtn8-bai32' | 'toan6-bai40') => void;
}) {
  const cs = CASE_STUDIES_2.find((item) => item.id === caseStudyId);
  if (!cs) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-orange-300 w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 text-white flex items-center justify-between gap-3 shrink-0"
          style={{ background: 'linear-gradient(135deg, #EA580C 0%, #D97706 100%)' }}
        >
          <div>
            <div className="text-xs font-bold uppercase text-white/90">{cs.badge}</div>
            <h3 className="font-extrabold text-base sm:text-lg">{cs.title}</h3>
            <p className="text-xs text-white/95">{cs.activityTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-sm text-[#0F172A]">
          <div className="p-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-xs font-semibold text-[#7C2D12]">
            {cs.meta}
          </div>

          <div className="space-y-1">
            <div className="font-extrabold text-[#7E22CE]">a) Mục tiêu tích hợp (a) + (b) + (c)</div>
            <p className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] leading-relaxed">
              {cs.fullGoalText}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-extrabold text-[#0F172A]">b) Nội dung hoạt động</div>
            <p className="leading-relaxed">{cs.contentB}</p>
          </div>

          <div className="space-y-1">
            <div className="font-extrabold text-[#0F172A]">c) Sản phẩm / Minh chứng quá trình</div>
            <p className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 leading-relaxed">
              {cs.productC}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-extrabold text-[#0F172A]">d) Tổ chức thực hiện (B1 – B4)</div>
            <ul className="list-disc pl-5 space-y-1.5">
              {cs.organizationD.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm">
            <strong className="text-blue-900">Phương án không thiết bị cho HS nội trú:</strong>{' '}
            {cs.boardingPlan}
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyCaseStudy(cs.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#D97706] text-white text-xs font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Nạp Case Study này vào Quy trình 5 bước
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// L9: COMPLETE KHBD DRAFT EXPORT MODAL (BƯỚC 1 -> BƯỚC 5)
// =========================================================================
export function DraftExportModal({
  isOpen,
  onClose,
  draft,
  notify,
}: {
  isOpen: boolean;
  onClose: () => void;
  draft: KhbdDraftState;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
}) {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const composed = composeObjectiveParts(draft);
  const lowDeviceObj =
    LOW_DEVICE_OPTIONS_3.find((o) => o.id === draft.lowDeviceMode) ||
    LOW_DEVICE_OPTIONS_3[0];
  const levelsLine = PLC6_AI_LEVELS.map(
    (lvl) => `${draft.plc6.usageLevels.includes(lvl) ? '☑' : '☐'} ${lvl}`
  ).join('   ');

  const nlsCodesText = draft.selectedNlsCodes.map((x) => x.code).join(', ') || 'Chưa chọn';
  const atmText = draft.selectedAtmGroups.join(', ') || 'Chưa chọn';

  const buildPlainText = () =>
    [
      `KẾ HOẠCH BÀI DẠY NHÁP TÍCH HỢP NLS – ATM – AI (TRƯỜNG PTDTNT THCS HIM LAM)`,
      `Môn: ${draft.subject} · Lớp: ${draft.grade} · Chủ đề: ${draft.topicName || '—'}`,
      `Tên bài học: ${draft.lessonTitle || 'Chưa đặt tên'}`,
      `Địa chỉ tích hợp: NLS [${nlsCodesText}] | ATM [${atmText}] | AI [${draft.selectedAiCode || 'Không'}]`,
      ``,
      `I. MỤC TIÊU TÍCH HỢP (a) + (b) + (c)`,
      composed.plainText,
      ``,
      `II. HOẠT ĐỘNG TÍCH HỢP & PHƯƠNG ÁN TỔ CHỨC THIẾU THIẾT BỊ`,
      `- Hoạt động đề xuất: ${draft.activitySuggestion}`,
      `- Phương án thiết bị (${lowDeviceObj.badge}): ${draft.lowDeviceNote}`,
      `- Tiêu chí kiểm chứng (SIFT / 6 bước AI): ${draft.verificationCriteria}`,
      ``,
      `III. MINH CHỨNG ĐÁNH GIÁ & BẢNG KIỂM GATE/PLC.2 (${draft.checkedChecklistIds.length}/${PLC2_GATE_CHECKLIST.length} đạt)`,
      `- Minh chứng đánh giá quá trình: ${draft.evidenceNote}`,
      ``,
      `IV. KHUNG KHAI BÁO SỬ DỤNG AI (PLC.6)`,
      `- Mức dùng AI: ${levelsLine}`,
      `1. Công cụ đã dùng: ${draft.plc6.toolAndDate}`,
      `2. Mục đích dùng: ${draft.plc6.purpose}`,
      `3. Phạm vi AI hỗ trợ: ${draft.plc6.aiScope}`,
      `4. Phần việc HS trực tiếp thực hiện: ${draft.plc6.studentWork}`,
      `5. Cách kiểm chứng & chỉnh sửa: ${draft.plc6.verificationAndEdit}`,
    ].join('\n');

  const buildWordHtml = () => `
    <h1>KẾ HOẠCH BÀI DẠY TÍCH HỢP NLS – ATM – AI</h1>
    <p><strong>Đơn vị:</strong> Trường PTDTNT THCS Him Lam (Thạnh Xuân, TP. Cần Thơ)</p>
    <p><strong>Môn học:</strong> ${escapeHtml(draft.subject)} — <strong>Lớp:</strong> ${escapeHtml(draft.grade)} — <strong>Chủ đề:</strong> ${escapeHtml(draft.topicName || '—')}</p>
    <p><strong>Tên bài học:</strong> ${escapeHtml(draft.lessonTitle || 'Chưa đặt tên')}</p>
    <p><strong>Địa chỉ tích hợp:</strong> NLS (${escapeHtml(nlsCodesText)}) · ATM (${escapeHtml(atmText)}) · Mã AI (${escapeHtml(draft.selectedAiCode || 'Không')})</p>
    <h2>I. Mục tiêu tích hợp 3 thành phần (a) + (b) + (c)</h2>
    ${composed.htmlContent}
    <h2>II. Tiến trình hoạt động & Phương án thiếu thiết bị</h2>
    <p><strong>Hoạt động đề xuất:</strong> ${escapeHtml(draft.activitySuggestion)}</p>
    <p><strong>Phương án tổ chức (${escapeHtml(lowDeviceObj.badge)}):</strong> ${escapeHtml(draft.lowDeviceNote)}</p>
    <p><strong>Tiêu chí kiểm chứng (SIFT / 6 bước AI):</strong> ${escapeHtml(draft.verificationCriteria)}</p>
    <h2>III. Minh chứng đánh giá quá trình & Gate PLC.2</h2>
    <p><strong>Minh chứng:</strong> ${escapeHtml(draft.evidenceNote)}</p>
    <p><strong>Kết quả tự kiểm Gate & PLC.2:</strong> Đạt ${draft.checkedChecklistIds.length}/${PLC2_GATE_CHECKLIST.length} tiêu chí.</p>
    <h2>IV. Mẫu Khai báo sử dụng AI (PLC.6)</h2>
    <p><strong>Mức dùng AI:</strong> ${escapeHtml(levelsLine)}</p>
    <ol>
      <li><strong>Công cụ đã dùng (tên, ngày):</strong> ${escapeHtml(draft.plc6.toolAndDate)}</li>
      <li><strong>Mục đích dùng:</strong> ${escapeHtml(draft.plc6.purpose)}</li>
      <li><strong>Phạm vi AI hỗ trợ:</strong> ${escapeHtml(draft.plc6.aiScope)}</li>
      <li><strong>Phần việc HS trực tiếp thực hiện:</strong> ${escapeHtml(draft.plc6.studentWork)}</li>
      <li><strong>Cách kiểm chứng và chỉnh sửa kết quả:</strong> ${escapeHtml(draft.plc6.verificationAndEdit)}</li>
    </ol>
  `;

  const handleCopyAll = async () => {
    const ok = await copyRichTextForWord(buildPlainText(), buildWordHtml());
    if (ok) {
      setCopiedAll(true);
      notify('Đã copy trọn bộ KHBD nháp (Bước 1 → 5) chuẩn dán Microsoft Word!', 'success');
      window.setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownloadDoc = () => {
    const safeName = `KHBD_NLS_ATM_AI_${draft.subject}_Lop${draft.grade}`.replace(/\s+/g, '_');
    downloadWordDocument(safeName, buildWordHtml());
    notify(`Đã tải xuống tệp Word "${safeName}.doc".`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 text-white flex items-center justify-between gap-3 shrink-0"
          style={{
            background:
              'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
          }}
        >
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              Tổng hợp KHBD Nháp (Bước 1 → Bước 5) — Chuẩn dán Word / Nộp Tổ CM
            </h3>
            <p className="text-xs text-white/90">
              {draft.subject} Lớp {draft.grade} · {draft.lessonTitle || 'Chưa đặt tên bài'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-[#0F172A]">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <strong>Môn / Lớp:</strong> {draft.subject} Lớp {draft.grade}
            </div>
            <div>
              <strong>Chủ đề:</strong> {draft.topicName || '—'}
            </div>
            <div>
              <strong>Mã NLS:</strong> <span className="font-mono font-bold text-[#1D4ED8]">{nlsCodesText}</span>
            </div>
            <div>
              <strong>Nhóm ATM / AI:</strong>{' '}
              <span className="font-mono font-bold text-[#BE123C]">{atmText}</span>
              {draft.selectedAiCode && (
                <span className="ml-1.5 font-mono font-bold text-[#7E22CE]">
                  · AI: {draft.selectedAiCode}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#D8B4FE] space-y-1.5">
            <div className="text-xs font-extrabold uppercase text-[#7E22CE]">
              I. Mục tiêu tích hợp (a) + (b) + (c)
            </div>
            <p className="leading-relaxed">{composed.plainText}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] space-y-2">
            <div className="text-xs font-extrabold uppercase text-[#7C2D12]">
              II. Hoạt động tích hợp & Phương án thiết bị ({lowDeviceObj.badge})
            </div>
            <p>
              <strong>Hoạt động:</strong> {draft.activitySuggestion}
            </p>
            <p>
              <strong>Phương án HS nội trú:</strong> {draft.lowDeviceNote}
            </p>
            <p>
              <strong>Tiêu chí kiểm chứng:</strong> {draft.verificationCriteria}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] space-y-2">
            <div className="text-xs font-extrabold uppercase text-[#065F46]">
              III. Minh chứng & Khai báo sử dụng AI (PLC.6) · Gate {draft.checkedChecklistIds.length}/{PLC2_GATE_CHECKLIST.length}
            </div>
            <p>
              <strong>Minh chứng quá trình:</strong> {draft.evidenceNote}
            </p>
            <p className="font-mono text-xs bg-white p-2 rounded border border-emerald-200">
              {levelsLine}
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li><strong>Công cụ:</strong> {draft.plc6.toolAndDate}</li>
              <li><strong>Mục đích:</strong> {draft.plc6.purpose}</li>
              <li><strong>Phạm vi AI hỗ trợ:</strong> {draft.plc6.aiScope}</li>
              <li><strong>Phần việc HS thực hiện:</strong> {draft.plc6.studentWork}</li>
              <li><strong>Kiểm chứng & chỉnh sửa:</strong> {draft.plc6.verificationAndEdit}</li>
            </ol>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            In phiếu tổng hợp
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Tải tệp Word (.doc)
            </button>
            <button
              type="button"
              onClick={() => void handleCopyAll()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-extrabold cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #EC4899 100%)',
              }}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'Đã copy toàn bộ!' : 'Copy toàn bộ dán vào Word'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
