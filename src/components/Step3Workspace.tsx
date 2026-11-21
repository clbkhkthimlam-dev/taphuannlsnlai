import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import { copyRichTextForWord } from '../utils/wordExport';
import {
  STEP3_SAMPLES_3,
  STEP_DEFINITIONS,
  buildPartBFromSelections,
  composeObjectiveParts,
  type KhbdDraftState,
} from '../data/v21Content';

interface Step3Props {
  draft: KhbdDraftState;
  updateDraft: (patch: Partial<KhbdDraftState>) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
}

export function Step3Workspace({
  draft,
  updateDraft,
  onPrevStep,
  onNextStep,
  router,
  onCopyPath,
  notify,
}: Step3Props) {
  const stepDef = STEP_DEFINITIONS[2];
  const [copiedObjective, setCopiedObjective] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const composed = composeObjectiveParts(draft);

  const handleCopyObjective = async () => {
    const ok = await copyRichTextForWord(composed.plainText, composed.htmlContent);
    if (ok) {
      setCopiedObjective(true);
      notify('Đã copy Mục tiêu (a)+(b)+(c) chuẩn định dạng Word (Times New Roman 13pt).', 'success');
      window.setTimeout(() => setCopiedObjective(false), 2000);
    } else {
      notify('Không thể tự động copy. Hãy bôi đen khung xem trước và nhấn Ctrl+C.', 'warning');
    }
  };

  const handleResetPartBFromStep2 = () => {
    const auto = buildPartBFromSelections(draft.selectedNlsCodes, draft.selectedAiCode);
    updateDraft({ partBOverride: auto });
    notify('Đã đồng bộ lại phần (b) từ các chỉ báo NLS & mã AI đã chọn ở Bước 2.', 'info');
  };

  const handleAskAiReview = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'map_nls',
          query: `Hãy rà soát và đề xuất chỉnh sửa câu mục tiêu (a)+(b)+(c) sau cho bài "${draft.lessonTitle}" (Môn ${draft.subject} Lớp ${draft.grade}):\n${composed.plainText}`,
          context: `Mã NLS đang chọn: ${draft.selectedNlsCodes.map((x) => x.code).join(', ') || 'chưa có'}. Nhóm ATM: ${draft.selectedAtmGroups.join(', ') || 'chưa có'}. Mã AI: ${draft.selectedAiCode || 'không'}. Bối cảnh: Trường PTDTNT THCS Him Lam (HS nội trú, hạn chế thiết bị).`,
        }),
      });
      const data = (await res.json()) as { result?: string; error?: string };
      if (!res.ok || !data.result) {
        setAiError(data.error || 'Không thể kết nối trợ lý rà soát AI.');
      } else {
        setAiOutput(data.result);
      }
    } catch {
      setAiError('Lỗi mạng khi gọi máy chủ rà soát AI.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Step Banner */}
      <div
        className="rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: stepDef.gradientCss }}
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white/90">
            Bước 3 / 5 · Diễn đạt hành vi quan sát được & đo lường được
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
            Bước 2
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 cursor-pointer"
          >
            Sang Bước 4: 4 HĐ & Thiếu TB
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Khối A: Công thức chuẩn & 4 lỗi cần tránh */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF5FF] text-[#9333EA] text-xs font-extrabold">
            A
          </span>
          Công thức Mục tiêu 3 Thành phần & 4 Lỗi thường gặp cần tránh
        </h3>

        <div className="rounded-xl p-4 bg-[#FAF5FF] border-2 border-[#D8B4FE] text-sm sm:text-base text-[#0F172A] leading-relaxed">
          <span className="font-bold">Công thức chuẩn:</span> “Học sinh{' '}
          <span className="px-1.5 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8] font-bold">
            [(a) YCCĐ môn học]
          </span>
          ; trong quá trình đó{' '}
          <span className="px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">
            [(b) Chỉ báo NLS / Mã YCCĐ AI]
          </span>
          ; cụ thể là{' '}
          <span className="px-1.5 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE] font-bold">
            [(c) Biểu hiện ATM / Hành vi quan sát được & Minh chứng cụ thể]
          </span>
          .”
        </div>

        <div className="rounded-xl p-4 bg-[#FFF1F2] border border-[#FECDD3] space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#BE123C] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            4 Lỗi thường gặp cần tránh (tr. 60 — Tài liệu NLS–ATM lớp KHTN)
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-[#0F172A] list-decimal pl-5">
            <li>
              Chỉ ghi mã chỉ báo (<code className="font-mono font-bold">1.2TC2a</code>) mà không diễn đạt thành hành vi quan sát được.
            </li>
            <li>Ghép quá nhiều nhóm ATM vào một bài học.</li>
            <li>
              Dùng động từ không đo được (<em>“hiểu”</em>, <em>“có ý thức”</em>, <em>“nâng cao nhận thức”</em>).
            </li>
            <li>
              Mục tiêu ATM tách rời nội dung bài học (ví dụ bài phương trình mà mục tiêu lại là <em>“nhận diện bắt nạt mạng”</em>).
            </li>
          </ol>
        </div>
      </section>

      {/* Khối B: Trình ghép Mục tiêu Tự động (a)+(b)+(c) */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-5"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#9333EA] text-white text-xs font-extrabold">
              B
            </span>
            Trình ghép Mục tiêu Tự động (a) + (b) + (c)
          </h3>

          <button
            type="button"
            onClick={handleResetPartBFromStep2}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Đồng bộ lại (b) từ Bước 2
          </button>
        </div>

        {/* 3 Nút nạp mẫu 1-click */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
            3 Mẫu hoàn chỉnh 1-click (chuẩn tài liệu tập huấn)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {STEP3_SAMPLES_3.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  updateDraft({
                    subject: sample.subject,
                    grade: sample.grade,
                    lessonTitle: sample.lessonTitle,
                    partA: sample.partA,
                    partBOverride: sample.partB,
                    partC: sample.partC,
                    selectedAtmGroups: sample.selectedAtmGroups,
                    selectedAiCode: sample.selectedAiCode,
                  });
                  notify(`Đã nạp ${sample.title} vào khung ghép mục tiêu.`, 'success');
                }}
                className="text-left p-3 rounded-xl border-2 border-[#E9D5FF] bg-[#FAF5FF] hover:border-[#9333EA] hover:bg-[#F3E8FF]/60 transition-all cursor-pointer"
              >
                <div className="font-extrabold text-sm text-[#7E22CE]">{sample.title}</div>
                <div className="text-xs text-slate-700 mt-1 line-clamp-2">{sample.partC}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editable 3 parts */}
        <div className="grid grid-cols-1 gap-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-[#1D4ED8]">
              Thành phần (a) — YCCĐ môn học (tự nhận từ Bước 1)
            </label>
            <textarea
              rows={2}
              value={draft.partA}
              onChange={(e) => updateDraft({ partA: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#93C5FD] bg-[#EFF6FF]/40 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-[#0E7490]">
              Thành phần (b) — Chỉ báo NLS / Mã YCCĐ AI (tự nhận từ Bước 2, có thể tinh chỉnh)
            </label>
            <textarea
              rows={2}
              value={draft.partBOverride}
              onChange={(e) => updateDraft({ partBOverride: e.target.value })}
              placeholder="Ví dụ: phân tích, so sánh, đánh giá nguồn thông tin sức khỏe (1.2TC2a) và đối chiếu câu trả lời của AI (6.3TC2a, 8.A1.2)"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#67E8F9] bg-[#ECFEFF]/50 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-[#7E22CE]">
              Thành phần (c) — Biểu hiện ATM / Hành vi quan sát được & Minh chứng cụ thể (tự nhận từ ATM Bước 2)
            </label>
            <textarea
              rows={2}
              value={draft.partC}
              onChange={(e) => updateDraft({ partC: e.target.value })}
              placeholder="Ví dụ: áp dụng 4 bước SIFT kiểm chứng tin đồn qua ≥ 2 nguồn độc lập, viết khuyến nghị ≤ 50 chữ (ATM1, ATM7)"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D8B4FE] bg-[#FAF5FF]/60 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
            />
          </div>
        </div>

        {/* Live Color-Coded Preview */}
        <div className="rounded-2xl p-5 bg-slate-50 border-2 border-[#C084FC] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#7E22CE]">
              Xem trước câu mục tiêu dán thẳng vào KHBD Word (tô màu 3 thành phần)
            </div>
            <div className="flex flex-wrap gap-1.5 text-[13px] font-bold">
              <span className="px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1D4ED8]">(a) YCCĐ môn</span>
              <span className="px-2 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490]">(b) NLS / AI</span>
              <span className="px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE]">(c) Hành vi ATM</span>
            </div>
          </div>

          <p className="text-base leading-relaxed text-[#0F172A] bg-white p-4 rounded-xl border border-slate-200 font-medium">
            “Học sinh{' '}
            <span className="bg-[#DBEAFE] text-[#1E3A8A] px-1 rounded font-semibold">
              {composed.partA}
            </span>
            ; trong quá trình đó{' '}
            <span className="bg-[#CFFAFE] text-[#155E75] px-1 rounded font-semibold">
              {composed.partB}
            </span>
            ; cụ thể là{' '}
            <span className="bg-[#F3E8FF] text-[#6B21A8] px-1 rounded font-semibold">
              {composed.partC}
            </span>
            .”
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleCopyObjective()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm hover:opacity-95 cursor-pointer"
                style={{ background: stepDef.gradientCss }}
              >
                {copiedObjective ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedObjective ? 'Đã copy chuẩn Word!' : 'Copy mục tiêu vào KHBD'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold hover:bg-slate-100 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                In phiếu thực hành
              </button>
              <button
                type="button"
                onClick={() => setShowAiPanel((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-sm font-bold hover:bg-[#E0E7FF] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {showAiPanel ? 'Ẩn rà soát AI' : 'Nhờ AI rà soát 4 lỗi mục tiêu'}
              </button>
            </div>

            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold hover:bg-slate-800 cursor-pointer"
            >
              Tiếp tục sang Bước 4
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional AI review panel */}
        {showAiPanel && (
          <div className="rounded-xl p-4 bg-[#EEF2FF] border border-[#C7D2FE] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#3730A3] uppercase tracking-wide">
                Trợ lý rà soát mục tiêu (a)+(b)+(c) — GV tự kiểm chứng theo nguyên tắc con người quyết định cuối cùng
              </div>
              <button
                type="button"
                disabled={aiLoading}
                onClick={() => void handleAskAiReview()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F46E5] text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiLoading ? 'Đang phân tích...' : 'Chạy rà soát ngay'}
              </button>
            </div>
            {aiError && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                {aiError}
              </div>
            )}
            {aiOutput && (
              <div className="text-xs sm:text-sm text-[#0F172A] bg-white p-4 rounded-xl border border-indigo-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {aiOutput}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Khối C: Tài liệu đính kèm Bước 3 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-3"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF5FF] text-[#9333EA] text-xs font-extrabold">
            C
          </span>
          <FileText className="w-4 h-4 text-[#9333EA]" />
          Tài liệu đính kèm Bước 3
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
