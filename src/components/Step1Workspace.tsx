import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import {
  getExpectedLevelForGrade,
  QUICK_SAMPLES_STEP1,
  STEP_DEFINITIONS,
  type GradeType,
  type IntegrationLevelType,
  type KhbdDraftState,
  type SubjectType,
} from '../data/v21Content';

interface Step1Props {
  draft: KhbdDraftState;
  updateDraft: (patch: Partial<KhbdDraftState>) => void;
  onNextStep: () => void;
  onOpenKhtnAiDrawer: () => void;
  onOpenLegalDoc: (docId: string) => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
}

export function Step1Workspace({
  draft,
  updateDraft,
  onNextStep,
  onOpenKhtnAiDrawer,
  onOpenLegalDoc,
  router,
  onCopyPath,
  notify,
}: Step1Props) {
  const stepDef = STEP_DEFINITIONS[0];
  const expectedLevel = getExpectedLevelForGrade(draft.grade);

  const handleGradeChange = (grade: GradeType) => {
    const newLevel = getExpectedLevelForGrade(grade);
    updateDraft({ grade });
    notify(
      `Đã chuyển sang Lớp ${grade} → Bước 2 tự động lọc bậc ${newLevel} (${
        newLevel === 'TC1' ? '54 chỉ báo Lớp 6–7' : '55 chỉ báo Lớp 8–9'
      }) và ma trận KHTN Lớp ${grade}.`,
      'info'
    );
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
            Bước 1 / 5 · Xuất phát từ chương trình môn học
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5 leading-tight">
            {stepDef.title}
          </h2>
          <p className="text-sm text-white/95 mt-1">{stepDef.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenKhtnAiDrawer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#1D4ED8] font-bold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#EA580C]" />
            Chọn từ 55 bài KHTN có AI
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Sang Bước 2
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Khối A: Nội dung chuyên môn & Nguyên tắc vàng */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold">
              A
            </span>
            Nguyên tắc bất biến & 3 Mức độ tích hợp
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onOpenLegalDoc('cv-6206')}
              className="px-2.5 py-1 rounded-lg bg-[#FFE4E6] text-[#BE123C] text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              Xem CV 6206 (ATMTD)
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalDoc('cv-3456')}
              className="px-2.5 py-1 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              Xem CV 3456 (NLS)
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalDoc('cv-5588')}
              className="px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE] text-xs font-bold hover:opacity-90 cursor-pointer"
            >
              Xem CV 5588 (AI)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-[#EFF6FF] border border-[#BFDBFE] space-y-2.5">
            <div className="text-sm font-extrabold text-[#1E3A8A]">
              3 Nguyên tắc bất biến khi thiết kế bài dạy
            </div>
            <ol className="space-y-2 text-sm text-[#0F172A] list-decimal pl-5">
              <li>
                <strong>Không đi ngược</strong> từ Khung NLS hay Khung AI rồi ép bài học môn Toán, KHTN, Công nghệ chạy theo.
              </li>
              <li>
                <strong>Không nâng mức YCCĐ môn học</strong> và không biến nội dung gợi ý thành yêu cầu bắt buộc gây quá tải cho HS.
              </li>
              <li>
                <strong>AI không thay thế thí nghiệm, đo đạc, quan sát mẫu vật</strong> trong KHTN; <strong>ATMTD không tách thành môn/tiết riêng</strong> (
                <button
                  type="button"
                  onClick={() => onOpenLegalDoc('cv-6206')}
                  className="underline font-bold text-[#BE123C] cursor-pointer"
                >
                  CV 6206/BGDĐT-GDPT
                </button>
                ).
              </li>
            </ol>
          </div>

          <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="text-sm font-extrabold text-[#0F172A]">
              3 Mức độ tích hợp (Tài liệu NLS–ATM lớp KHTN, tr. 58)
            </div>
            <div className="space-y-2 text-sm text-[#0F172A]">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-[#2563EB]">1. Tích hợp nhẹ:</span> 1 câu hỏi gợi mở hoặc 1 lưu ý an toàn trong hoạt động có dùng Internet.
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-[#0891B2]">2. Tích hợp bộ phận:</span> 1 hoạt động xử lí tình huống 10–15 phút (ví dụ HĐ 2.4).
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="font-bold text-[#9333EA]">3. Tích hợp thành nhiệm vụ/dự án:</span> Khi chủ đề môn học liên quan trực tiếp (Biểu đồ cột Toán 6, Dinh dưỡng KHTN 8).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Khối B: Công cụ tương tác Bước 1 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-5"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#2563EB] text-white text-xs font-extrabold">
              B
            </span>
            Thiết lập thông tin bài dạy & (a) YCCĐ môn học
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tự động đồng bộ Bước 2 → 5 · Đang chọn Lớp {draft.grade} ({expectedLevel})
          </span>
        </div>

        {/* 3 Nút nạp nhanh bài mẫu chuẩn */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            Nạp nhanh 3 bài mẫu chuẩn (1-click tự điền dữ liệu liên thông)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {QUICK_SAMPLES_STEP1.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  updateDraft(sample.patch);
                  notify(`Đã nạp mẫu "${sample.label}" vào toàn bộ Quy trình 5 bước.`, 'success');
                }}
                className="text-left p-3 rounded-xl border-2 border-[#BFDBFE] bg-[#EFF6FF]/60 hover:bg-[#DBEAFE]/70 hover:border-[#2563EB] transition-all cursor-pointer"
              >
                <div className="font-bold text-sm text-[#1E3A8A] leading-snug">
                  {sample.label}
                </div>
                <div className="text-xs text-slate-700 mt-1">{sample.shortDesc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide whitespace-nowrap">
              Môn học
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['KHTN', 'Toán', 'Công nghệ'] as SubjectType[]).map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => updateDraft({ subject: subj })}
                  className={`min-h-[54px] px-2.5 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap flex items-center justify-center cursor-pointer ${
                    draft.subject === subj
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 space-y-1.5">
            <label
              title="Tự động lọc bậc TC1 (Lớp 6–7) hoặc TC2 (Lớp 8–9) ở Bước 2"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide whitespace-nowrap"
            >
              Khối lớp (lọc TC1/TC2)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['6', '7', '8', '9'] as GradeType[]).map((gr) => {
                const lvl = getExpectedLevelForGrade(gr);
                const active = draft.grade === gr;
                return (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => handleGradeChange(gr)}
                    className={`min-h-[54px] py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center justify-center cursor-pointer ${
                      active
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="whitespace-nowrap">Lớp {gr}</span>
                    <span className={`block text-[12px] font-mono ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                      {lvl}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-12 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide whitespace-nowrap">
              Mức độ tích hợp dự kiến
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'nhe', label: 'Tích hợp nhẹ', sub: '1 câu hỏi gợi mở / lưu ý an toàn' },
                  { id: 'bo_phan', label: "Bộ phận (10–15')", sub: '1 hoạt động xử lí tình huống (vd HĐ 2.4)' },
                  { id: 'du_an', label: 'Nhiệm vụ / Dự án', sub: 'Chủ đề môn liên quan trực tiếp' },
                ] as { id: IntegrationLevelType; label: string; sub: string }[]
              ).map((opt) => {
                const active = draft.integrationLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateDraft({ integrationLevel: opt.id })}
                    className={`px-3.5 py-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0891B2] text-white border-[#0891B2] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-extrabold whitespace-nowrap">{opt.label}</div>
                    <div className={`text-[12px] mt-0.5 ${active ? 'text-cyan-50' : 'text-slate-500'}`}>
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Tên bài học / Tiết dạy
            </label>
            <input
              type="text"
              value={draft.lessonTitle}
              onChange={(e) => updateDraft({ lessonTitle: e.target.value })}
              placeholder="Ví dụ: Bài 32: Dinh dưỡng và tiêu hóa ở người"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Chủ đề / Chương trong CTGDPT 2018
            </label>
            <input
              type="text"
              value={draft.topicName}
              onChange={(e) => updateDraft({ topicName: e.target.value })}
              placeholder="Ví dụ: Dinh dưỡng và tiêu hoá ở người"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="md:col-span-12 space-y-1.5">
            <label className="block text-xs font-bold text-[#1D4ED8] uppercase tracking-wide">
              (a) Yêu cầu cần đạt cốt lõi của môn học (CTGDPT 2018) — tự động truyền sang Bước 3
            </label>
            <textarea
              rows={3}
              value={draft.partA}
              onChange={(e) => updateDraft({ partA: e.target.value })}
              placeholder="Nhập YCCĐ cốt lõi của môn học (bắt đầu bằng động từ: phân tích được..., vẽ và đọc được..., giải thích được...)"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#93C5FD] bg-[#EFF6FF]/35 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onOpenKhtnAiDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF7ED] border border-[#FB923C] text-[#9A3412] text-sm font-bold hover:bg-[#FFEDD5] transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#EA580C]" />
            ⚡ Chọn từ 55 bài KHTN có AI (tự điền cả Bước 1, 2, 4, 5)
          </button>

          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            style={{ background: stepDef.gradientCss }}
          >
            Tiếp tục sang Bước 2: Tra cứu NLS – ATM – AI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Khối C: Tài liệu đính kèm của Bước 1 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-3"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-extrabold">
              C
            </span>
            <FileText className="w-4 h-4 text-[#2563EB]" />
            Tài liệu đính kèm Bước 1 (mở qua Bộ định tuyến 3 chế độ)
          </h3>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Bấm "Mở tài liệu" hoặc "Đổi đường dẫn"
          </span>
        </div>
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
