import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import {
  VERIFIED_KHTN_AI_55,
  VERIFIED_KHTN_NO_AI_152,
  VERIFIED_NLS_109,
  type RawKhtnAiV21,
  type RawNlsV21,
} from '../data/verifiedV21Datasets';
import {
  ACTION_TO_NLS_MAP,
  ATM_GROUPS_8,
  GRADE_AI_PROFILES,
  NLS_DOMAINS_6,
  SHARED_AI_55_FRAMEWORK,
  STEP_DEFINITIONS,
  getExpectedLevelForGrade,
  normalizeNlsSearch,
  type GradeType,
  type KhbdDraftState,
} from '../data/v21Content';

interface Step2Props {
  draft: KhbdDraftState;
  onAddNlsToPartB: (item: RawNlsV21) => void;
  onRemoveNlsFromPartB: (code: string) => void;
  onSelectAtmForPartC: (atmCode: string) => void;
  onLoadKhtnAiLesson: (lesson: RawKhtnAiV21) => void;
  onSelectAiCodeOnly: (aiCode: string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onOpenLegalDoc: (docId: string) => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
  activeSubTab: 'nls' | 'atm' | 'khtn';
  setActiveSubTab: (tab: 'nls' | 'atm' | 'khtn') => void;
  componentFilter: string[];
  setComponentFilter: (codes: string[]) => void;
}

export function Step2Workspace({
  draft,
  onAddNlsToPartB,
  onRemoveNlsFromPartB,
  onSelectAtmForPartC,
  onLoadKhtnAiLesson,
  onSelectAiCodeOnly,
  onPrevStep,
  onNextStep,
  onOpenLegalDoc,
  router,
  onCopyPath,
  notify,
  activeSubTab,
  setActiveSubTab,
  componentFilter,
  setComponentFilter,
}: Step2Props) {
  const stepDef = STEP_DEFINITIONS[1];
  const expectedLevel = getExpectedLevelForGrade(draft.grade);

  // Tab 2.1 state (defaults automatically synced with Step 1 grade via expectedLevel)
  const [levelOverride, setLevelOverride] = useState<'AUTO' | 'ALL' | 'TC1' | 'TC2'>('AUTO');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [nlsQuery, setNlsQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Tab 2.3 state
  const [khtnTab, setKhtnTab] = useState<'ai' | 'no_ai'>('ai');
  const [khtnGradeFilter, setKhtnGradeFilter] = useState<'AUTO' | 'ALL' | GradeType>('AUTO');
  const [khtnQuery, setKhtnQuery] = useState('');

  const effectiveLevel = levelOverride === 'AUTO' ? expectedLevel : levelOverride;
  const effectiveKhtnGrade = khtnGradeFilter === 'AUTO' ? draft.grade : khtnGradeFilter;

  const filteredNls = useMemo(() => {
    const qNorm = normalizeNlsSearch(nlsQuery);
    const qLower = nlsQuery.trim().toLowerCase();
    return VERIFIED_NLS_109.filter((item) => {
      if (effectiveLevel !== 'ALL' && item.l !== effectiveLevel) return false;
      if (domainFilter !== 'ALL' && !item.n.startsWith(`${domainFilter}.`)) return false;
      if (componentFilter.length > 0 && !componentFilter.includes(item.n)) return false;
      if (qNorm) {
        const codeMatch = normalizeNlsSearch(item.c).includes(qNorm);
        const compMatch = normalizeNlsSearch(item.n).includes(qNorm);
        const textMatch = item.y.toLowerCase().includes(qLower);
        if (!codeMatch && !compMatch && !textMatch) return false;
      }
      return true;
    });
  }, [effectiveLevel, domainFilter, componentFilter, nlsQuery]);

  const filteredKhtnAi = useMemo(() => {
    const q = khtnQuery.trim().toLowerCase();
    return VERIFIED_KHTN_AI_55.filter((item) => {
      if (effectiveKhtnGrade !== 'ALL' && item.l !== effectiveKhtnGrade) return false;
      if (q) {
        return (
          item.b.toLowerCase().includes(q) ||
          item.cd.toLowerCase().includes(q) ||
          item.ai.toLowerCase().includes(q) ||
          item.yc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [effectiveKhtnGrade, khtnQuery]);

  const filteredKhtnNoAi = useMemo(() => {
    const q = khtnQuery.trim().toLowerCase();
    return VERIFIED_KHTN_NO_AI_152.filter((item) => {
      if (effectiveKhtnGrade !== 'ALL' && item.l !== effectiveKhtnGrade) return false;
      if (q) {
        return (
          item.b.toLowerCase().includes(q) ||
          item.cd.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [effectiveKhtnGrade, khtnQuery]);

  const handleCopyNlsCode = (code: string) => {
    onCopyPath(code);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1500);
  };

  // Flow L3: Click NLTP badge on ATM card -> jump to Tab 2.1 filtered by those component IDs
  const handleJumpFromAtmBadge = (codes: string[], atmCode: string) => {
    setDomainFilter('ALL');
    setNlsQuery('');
    setComponentFilter(codes);
    setActiveSubTab('nls');
    notify(
      `Luồng L3: Đã lọc bảng ChiBao-NLS theo các năng lực thành phần ${codes.join(', ')} của ${atmCode} (${effectiveLevel}).`,
      'info'
    );
  };

  const selectedCodesSet = new Set(draft.selectedNlsCodes.map((i) => i.code));
  const currentGradeProfile = GRADE_AI_PROFILES[draft.grade];

  return (
    <div className="space-y-5">
      {/* Step Banner */}
      <div
        className="rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: stepDef.gradientCss }}
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white/90">
            Bước 2 / 5 · Chọn đúng bậc THCS ({expectedLevel} — Lớp {draft.grade})
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5 leading-tight">
            {stepDef.title}
          </h2>
          <p className="text-sm text-white/95 mt-1">{stepDef.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrevStep}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Bước 1
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 cursor-pointer"
          >
            Sang Bước 3: Ghép (a)+(b)+(c)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Currently Selected Basket Summary */}
      <div className="rounded-2xl bg-white border-2 border-[#22D3EE] p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0E7490]">
            Địa chỉ tích hợp đang chọn cho bài "{draft.lessonTitle || 'Chưa đặt tên'}" (Lớp {draft.grade})
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {draft.selectedNlsCodes.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Chưa chọn mã NLS nào</span>
            ) : (
              draft.selectedNlsCodes.map((item) => (
                <span
                  key={item.code}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold font-mono"
                >
                  NLS: {item.code}
                  <button
                    type="button"
                    onClick={() => onRemoveNlsFromPartB(item.code)}
                    className="hover:text-rose-600 cursor-pointer"
                    aria-label={`Bỏ mã ${item.code}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
            {draft.selectedAtmGroups.map((atm) => (
              <span
                key={atm}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FFE4E6] text-[#BE123C] text-xs font-bold font-mono"
              >
                {atm}
              </span>
            ))}
            {draft.selectedAiCode && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold font-mono">
                AI: {draft.selectedAiCode}
              </span>
            )}
          </div>
        </div>
        {draft.selectedNlsCodes.length > 2 && (
          <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg">
            Khuyến nghị: Chỉ nên chọn tối đa 1–2 mã NLS gắn trực tiếp hoạt động!
          </div>
        )}
      </div>

      {/* Khối A: Quy tắc ánh xạ & Phân biệt TC1/TC2 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#ECFEFF] text-[#0891B2] text-xs font-extrabold">
              A
            </span>
            Ánh xạ hành động → NLTP, phân biệt TC1/TC2 & Quy ước mã AI
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onOpenLegalDoc('tt-02-2025')}
              className="px-2.5 py-1 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              TT 02/2025
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalDoc('qd-2422')}
              className="px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              QĐ 2422/QĐ-BGDĐT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Quick Action -> NLTP Map */}
          <div className="lg:col-span-7 rounded-xl p-4 bg-[#ECFEFF] border border-[#A5F3FC] space-y-2.5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#0E7490]">
              Bấm mã NLTP để lọc ngay bảng 109 chỉ báo bên dưới
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTION_TO_NLS_MAP.map((row) => (
                <div
                  key={row.action}
                  className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-cyan-200 text-xs"
                >
                  <span className="text-[#0F172A] font-medium">{row.action}</span>
                  <div className="flex gap-1 shrink-0">
                    {row.codes.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setComponentFilter([c]);
                          setActiveSubTab('nls');
                        }}
                        className="px-2 py-0.5 rounded bg-[#0891B2] text-white font-mono font-bold hover:bg-[#0E7490] cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TC1 vs TC2 & Limits & AI code */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-[#0F172A]">
              <div className="font-extrabold text-sm text-[#0F172A]">
                Phân biệt đúng bậc THCS (lỗi hay gặp nhất)
              </div>
              <p>
                <span className="font-bold text-[#1D4ED8]">Lớp 6–7 (TC1 — Bậc 3, 54 chỉ báo):</span> Nhiệm vụ quen thuộc, có hướng dẫn (<em>thực hiện, giải thích, phân loại, nhận diện</em>).
              </p>
              <p>
                <span className="font-bold text-[#7E22CE]">Lớp 8–9 (TC2 — Bậc 4, 55 chỉ báo):</span> Nhiệm vụ độc lập, phân tích, phản biện (<em>độc lập kiểm chứng, phân tích, so sánh, tổ chức</em>).
              </p>
              <p className="text-slate-600">
                <strong>Chuẩn mã ChiBao-NLS.xlsx:</strong> Mã liền không dấu chấm (<code className="font-mono font-semibold">1.2TC2a</code>, <code className="font-mono font-semibold">6.3TC2a</code>), hỗ trợ tìm cả dạng cũ có chấm (<code className="font-mono">1.2.TC2a</code>).
              </p>
            </div>
            <div className="rounded-xl p-3.5 bg-[#FAF5FF] border border-[#E9D5FF] text-xs space-y-1 text-[#0F172A]">
              <div>
                <strong className="text-[#7E22CE]">Giới hạn số lượng:</strong> Chỉ chọn tối đa <strong>1–2 mã NLS</strong> và <strong>1–2 nhóm ATM</strong> gắn trực tiếp với hoạt động.
              </div>
              <div>
                <strong className="text-[#7E22CE]">Quy ước mã YCCĐ AI:</strong>{' '}
                <code className="font-mono font-bold">[Lớp].[Mã chủ đề].[STT]</code> (ví dụ{' '}
                <code className="font-mono">6.A1.3</code>, <code className="font-mono">7.A1.MR1</code>,{' '}
                <code className="font-mono">8.A1.2</code>, <code className="font-mono">9.B2.1</code>) thuộc 4 mạch <code className="font-mono">A, B, C, D</code> và 12 chủ đề THCS.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Khối B: Bộ tra cứu 3 Tab nhúng trực tiếp */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0891B2] text-white text-xs font-extrabold">
              B
            </span>
            Bộ tra cứu 3 Tab nhúng trực tiếp (liên thông sang Bước 3)
          </h3>

          {/* 3 Embedded Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveSubTab('nls')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeSubTab === 'nls'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              2.1. 109 Chỉ báo NLS
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('atm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeSubTab === 'atm'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              2.2. 8 Nhóm ATM1–ATM8
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('khtn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeSubTab === 'khtn'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              2.3. Ma trận AI KHTN (55/207)
            </button>
          </div>
        </div>

        {/* TAB 2.1: 109 CHỈ BÁO NLS */}
        {activeSubTab === 'nls' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
              <div className="lg:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nlsQuery}
                  onChange={(e) => setNlsQuery(e.target.value)}
                  placeholder="Tìm mã (1.2TC2a hoặc 1.2.TC2a) hoặc từ khóa YCCĐ..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <div className="lg:col-span-3">
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                >
                  <option value="ALL">Tất cả 6 Miền (24 NLTP)</option>
                  {NLS_DOMAINS_6.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-4 grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'AUTO', label: `Auto (${expectedLevel})` },
                    { id: 'TC1', label: 'TC1' },
                    { id: 'TC2', label: 'TC2' },
                    { id: 'ALL', label: 'Cả 109' },
                  ] as const
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevelOverride(lvl.id)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border whitespace-nowrap cursor-pointer ${
                      levelOverride === lvl.id
                        ? 'bg-[#0891B2] text-white border-[#0891B2]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active NLTP Component Filter banner (from L3 ATM badge click) */}
            {componentFilter.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-cyan-50 border border-cyan-300 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-950 font-semibold">
                  <Filter className="w-3.5 h-3.5 text-[#0891B2]" />
                  Đang lọc theo năng lực thành phần:{' '}
                  {componentFilter.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-[#0891B2] text-white font-mono font-bold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setComponentFilter([])}
                  className="inline-flex items-center gap-1 text-rose-700 font-bold hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Bỏ lọc NLTP
                </button>
              </div>
            )}

            <div className="text-xs text-slate-600 font-medium">
              Hiển thị <strong>{filteredNls.length}</strong> / 109 chỉ báo NLS THCS (54 TC1 + 55 TC2).
            </div>

            <div className="max-h-[420px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-200">
              {filteredNls.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Không tìm thấy chỉ báo phù hợp. Hãy thử bỏ lọc NLTP hoặc đổi bậc TC1/TC2.
                </div>
              ) : (
                filteredNls.map((item) => {
                  const isSelected = selectedCodesSet.has(item.c);
                  return (
                    <div
                      key={item.c}
                      className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isSelected ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#DBEAFE] text-[#1D4ED8] font-mono text-xs font-extrabold">
                            {item.c}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[13px] font-bold ${
                              item.l === 'TC1'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {item.l === 'TC1' ? 'TC1 · Lớp 6–7' : 'TC2 · Lớp 8–9'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[13px] font-semibold">
                            NL {item.n}
                          </span>
                        </div>
                        <p className="text-sm text-[#0F172A] leading-snug">{item.y}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyNlsCode(item.c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap cursor-pointer"
                        >
                          {copiedCode === item.c ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          Copy mã
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            isSelected
                              ? onRemoveNlsFromPartB(item.c)
                              : onAddNlsToPartB(item)
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-[#2563EB] text-white hover:bg-blue-700'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Đã chọn (b)
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Chọn làm (b)
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2.2: 8 NHÓM ATM1–ATM8 */}
        {activeSubTab === 'atm' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#FFE4E6]/60 border border-[#FDA4AF] text-xs text-[#9F1239] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                <strong>Liên kết 2 chiều (L3 & L4):</strong> Bấm vào <strong>badge mã NL</strong> (ví dụ <code className="font-mono font-bold">1.1; 1.2; 1.3</code>) trên thẻ ATM để nhảy sang Tab 2.1 lọc đúng chỉ báo NLS, hoặc bấm <strong>+ Chọn làm (c)</strong> để điền ngay hành vi quan sát được sang Bước 3.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ATM_GROUPS_8.map((atm) => {
                const isSelected = draft.selectedAtmGroups.includes(atm.code);
                return (
                  <div
                    key={atm.code}
                    className="rounded-xl p-4 border-2 transition-all flex flex-col justify-between gap-3"
                    style={{
                      backgroundColor: atm.bgHex,
                      borderColor: isSelected ? atm.accentHex : atm.borderHex,
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-2.5 py-1 rounded-lg text-white font-mono text-xs font-extrabold"
                            style={{ backgroundColor: atm.accentHex }}
                          >
                            {atm.code}
                          </span>
                          <h4 className="font-extrabold text-sm text-[#0F172A] leading-snug">
                            {atm.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                        {atm.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[13px] font-bold text-slate-600 mr-0.5">
                          Mã NL liên thông:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleJumpFromAtmBadge(atm.nlCodes, atm.code)}
                          title="Bấm để lọc đúng các NL này trong bảng 109 chỉ báo NLS (Luồng L3)"
                          className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:border-[#0891B2] hover:bg-cyan-50 text-[#0E7490] font-mono text-xs font-bold cursor-pointer"
                        >
                          {atm.nlCodes.join('; ')} →
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectAtmForPartC(atm.code)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F172A] text-white hover:bg-slate-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Đã chọn (c)
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Chọn làm (c)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2.3: MA TRẬN AI KHTN (207 BÀI: 55 CÓ AI / 152 KHÔNG AI) & 4 HỒ SƠ AI */}
        {activeSubTab === 'khtn' && (
          <div className="space-y-4">
            {/* 4 Hồ sơ AI theo khối lớp */}
            <div className="rounded-xl p-4 bg-[#FAF5FF] border border-[#D8B4FE] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#7E22CE] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Hồ sơ AI Khối Lớp {draft.grade} (áp dụng cho 55 bài "Có" tích hợp AI)
                </div>
                <button
                  type="button"
                  onClick={() => onSelectAiCodeOnly(currentGradeProfile.primaryCode)}
                  className="px-3 py-1 rounded-lg bg-[#9333EA] text-white text-xs font-bold hover:bg-purple-700 cursor-pointer"
                >
                  + Gắn mã {currentGradeProfile.primaryCode} vào bài học
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#0F172A]">
                <div className="bg-white p-3 rounded-lg border border-purple-200 space-y-1">
                  <div className="font-bold text-[#7E22CE]">
                    {currentGradeProfile.strand} · Mã chính:{' '}
                    <span className="font-mono bg-purple-100 px-1.5 py-0.5 rounded">
                      {currentGradeProfile.primaryCode}
                    </span>{' '}
                    ({currentGradeProfile.primaryType})
                  </div>
                  <p className="leading-relaxed">{currentGradeProfile.primaryDesc}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200 space-y-1">
                  <div className="font-bold text-[#0F766E]">
                    Mã phụ:{' '}
                    <span className="font-mono bg-teal-100 px-1.5 py-0.5 rounded">
                      {currentGradeProfile.secondaryCode}
                    </span>
                  </div>
                  <p className="leading-relaxed">{currentGradeProfile.secondaryDesc}</p>
                </div>
              </div>
              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                <strong>Khung sư phạm dùng chung 55 bài:</strong> {SHARED_AI_55_FRAMEWORK.formAndLevel}
              </div>
            </div>

            {/* Filters for 207 KHTN lessons */}
            <div className="flex flex-col md:flex-row gap-2.5">
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setKhtnTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    khtnTab === 'ai'
                      ? 'bg-[#7C3AED] text-white'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  Có tích hợp AI (55 bài)
                </button>
                <button
                  type="button"
                  onClick={() => setKhtnTab('no_ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    khtnTab === 'no_ai'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  Không bắt buộc AI (152 bài)
                </button>
              </div>

              <div className="flex gap-1 shrink-0">
                {(['AUTO', 'ALL', '6', '7', '8', '9'] as const).map((gr) => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setKhtnGradeFilter(gr)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      khtnGradeFilter === gr
                        ? 'bg-[#0891B2] text-white border-[#0891B2]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {gr === 'AUTO' ? `Lớp ${draft.grade}` : gr === 'ALL' ? 'Cả 4 khối' : `L${gr}`}
                  </button>
                ))}
              </div>

              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={khtnQuery}
                  onChange={(e) => setKhtnQuery(e.target.value)}
                  placeholder="Tìm tên bài, chủ đề hoặc mã AI (6.A1.3, 8.A1.2...)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {khtnTab === 'ai' ? (
              <div className="max-h-[420px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-200">
                {filteredKhtnAi.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Không có bài KHTN Có AI khớp bộ lọc. Hãy thử chọn "Cả 4 khối".
                  </div>
                ) : (
                  filteredKhtnAi.map((lesson) => (
                    <div
                      key={lesson.s}
                      className="p-3.5 bg-white hover:bg-purple-50/40 flex flex-col lg:flex-row lg:items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[13px] font-bold">
                            #{lesson.s}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold">
                            KHTN Lớp {lesson.l}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE] font-mono text-xs font-extrabold">
                            AI: {lesson.ai}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            Chủ đề: {lesson.cd}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-[#0F172A]">{lesson.b}</div>
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                          {lesson.yc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLoadKhtnAiLesson(lesson)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold shadow-xs hover:opacity-95 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Nạp bài này vào Quy trình 5 bước
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-200">
                <div className="px-3.5 py-2 bg-slate-50 text-xs text-slate-600 font-medium">
                  152 bài không bắt buộc tích hợp AI (vẫn có thể tích hợp NLS/ATM nhẹ theo YCCĐ môn học) — đang hiển thị <strong>{filteredKhtnNoAi.length}</strong> bài.
                </div>
                {filteredKhtnNoAi.map((lesson) => (
                  <div
                    key={lesson.s}
                    className="px-3.5 py-2.5 bg-white flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="font-mono text-slate-500">#{lesson.s}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        Lớp {lesson.l}
                      </span>
                      <span className="font-semibold text-[#0F172A]">{lesson.b}</span>
                      <span className="text-slate-500">({lesson.cd})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Không bắt buộc AI
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Khối C: Tài liệu đính kèm của Bước 2 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-3"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#ECFEFF] text-[#0891B2] text-xs font-extrabold">
            C
          </span>
          <FileText className="w-4 h-4 text-[#0891B2]" />
          Tài liệu đính kèm Bước 2 (7 tệp gốc)
        </h3>
        <DocLinkList
          items={stepDef.attachments}
          router={router}
          onCopyPath={onCopyPath}
          accentHex={stepDef.accentHex}
        />
      </section>
    </div>
  );
}
