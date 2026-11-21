import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileDown,
  FileText,
  FolderCheck,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import { copyRichTextForWord } from '../utils/wordExport';
import {
  CLASS_8A_SCENARIO,
  EVIDENCE_PREP_CHECKLIST_GROUPS,
  PLC2_GATE_CHECKLIST,
  PLC6_AI_LEVELS,
  STEP_DEFINITIONS,
  escapeHtml,
  type KhbdDraftState,
} from '../data/v21Content';

const EVIDENCE_STORAGE_KEY = 'himlam_v21_evidence_prep_checked';

interface Step5Props {
  draft: KhbdDraftState;
  updateDraft: (patch: Partial<KhbdDraftState>) => void;
  onPrevStep: () => void;
  onOpenExportModal: () => void;
  onOpenLegalDoc: (docId: string) => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
}

export function Step5Workspace({
  draft,
  updateDraft,
  onPrevStep,
  onOpenExportModal,
  onOpenLegalDoc,
  router,
  onCopyPath,
  notify,
}: Step5Props) {
  const stepDef = STEP_DEFINITIONS[4];
  const [copiedPlc6, setCopiedPlc6] = useState(false);
  const [copiedEvidence, setCopiedEvidence] = useState(false);
  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(EVIDENCE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(checkedEvidenceIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedEvidenceIds]);

  const totalEvidenceItems = EVIDENCE_PREP_CHECKLIST_GROUPS.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  const toggleEvidenceId = (id: string) => {
    setCheckedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCopyEvidenceChecklist = async () => {
    const plainLines: string[] = [
      'DANH MỤC TÀI LIỆU & MINH CHỨNG CẦN CHUẨN BỊ TRIỂN KHAI NLS – ATM – AI',
      'Đơn vị: Trường PTDTNT THCS Him Lam (Thạnh Xuân, TP. Cần Thơ) | Tập huấn: 22/11/2026 | Hạn KHDH: trước 04/12/2026',
      '',
    ];
    const htmlBlocks: string[] = [
      '<h2>DANH MỤC TÀI LIỆU &amp; MINH CHỨNG CẦN CHUẨN BỊ TRIỂN KHAI NLS – ATM – AI</h2>',
      '<p><strong>Đơn vị:</strong> Trường PTDTNT THCS Him Lam (Thạnh Xuân, TP. Cần Thơ) · Tập huấn: 22/11/2026 · Hạn KHDH: trước 04/12/2026</p>',
    ];

    for (const grp of EVIDENCE_PREP_CHECKLIST_GROUPS) {
      plainLines.push(`${grp.groupTitle} (${grp.owner} — ${grp.deadline})`);
      htmlBlocks.push(
        `<p><strong>${escapeHtml(grp.groupTitle)}</strong> <em>(${escapeHtml(grp.owner)} — ${escapeHtml(grp.deadline)})</em></p><ul>`
      );
      for (const item of grp.items) {
        const mark = checkedEvidenceIds.includes(item.id) ? '☑' : '☐';
        plainLines.push(`  ${mark} ${item.name}: ${item.detail}`);
        htmlBlocks.push(
          `<li>${mark} <strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.detail)}</li>`
        );
      }
      plainLines.push('');
      htmlBlocks.push('</ul>');
    }

    const ok = await copyRichTextForWord(
      plainLines.join('\n'),
      `<div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.45;">${htmlBlocks.join('')}</div>`
    );
    if (ok) {
      setCopiedEvidence(true);
      notify('Đã copy trọn bộ Danh mục Tài liệu & Minh chứng chuẩn dán Word!', 'success');
      window.setTimeout(() => setCopiedEvidence(false), 2000);
    }
  };

  const totalItems = PLC2_GATE_CHECKLIST.length;
  const checkedCount = draft.checkedChecklistIds.length;
  const progressPct = Math.round((checkedCount / totalItems) * 100);
  const isAllPassed = checkedCount === totalItems;

  const toggleCheckItem = (id: string) => {
    const exists = draft.checkedChecklistIds.includes(id);
    const next = exists
      ? draft.checkedChecklistIds.filter((x) => x !== id)
      : [...draft.checkedChecklistIds, id];
    updateDraft({ checkedChecklistIds: next });
  };

  const togglePlc6Level = (lvl: string) => {
    const current = draft.plc6.usageLevels;
    const next = current.includes(lvl)
      ? current.filter((x) => x !== lvl)
      : [...current, lvl];
    updateDraft({
      plc6: { ...draft.plc6, usageLevels: next },
    });
  };

  // Flow L8: Auto-sync PLC.6 from Steps 1–4
  const handleSyncPlc6FromSteps = () => {
    const nlsList = draft.selectedNlsCodes.map((x) => x.code).join(', ');
    const aiTag = draft.selectedAiCode ? `Mã AI: ${draft.selectedAiCode}` : 'Tích hợp NLS/ATM';
    const defaultUsage =
      draft.lowDeviceMode === 'one_device_teacher'
        ? ['GV trình diễn']
        : draft.lowDeviceMode === 'computer_lab_4roles'
        ? ['Nhóm dùng công cụ']
        : ['GV trình diễn'];

    updateDraft({
      plc6: {
        toolAndDate: `Công cụ AI tạo sinh dùng cho bài "${draft.lessonTitle}" (Môn ${draft.subject} ${draft.grade})`,
        purpose: `Hỗ trợ gợi ý nội dung/thông tin để HS kiểm chứng theo ${aiTag}${
          nlsList ? ` và NLS (${nlsList})` : ''
        }`,
        aiScope:
          'AI chỉ đưa ra gợi ý ban đầu / bản in câu trả lời mẫu; không làm thay thí nghiệm, đo đạc hay bài làm của HS',
        studentWork:
          draft.activitySuggestion ||
          'HS trực tiếp đối chiếu từng ý với SGK, dữ liệu thí nghiệm và hoàn thành biên bản kiểm chứng',
        verificationAndEdit:
          draft.verificationCriteria ||
          'Đối chiếu ≥ 2 nguồn độc lập (SGK, nguồn khoa học chính thống), chỉ ra ý sai/thiếu và tự chỉnh sửa kết luận cuối',
        usageLevels: defaultUsage,
      },
    });
    notify('Luồng L8: Đã tự động đồng bộ mẫu Khai báo AI (PLC.6) từ Bước 1–4.', 'success');
  };

  const handleCopyPlc6 = async () => {
    const levelsLine = PLC6_AI_LEVELS.map(
      (lvl) => `${draft.plc6.usageLevels.includes(lvl) ? '☑' : '☐'} ${lvl}`
    ).join('   ');

    const plainText = [
      `MẪU KHAI BÁO SỬ DỤNG AI (PLC.6) — ${draft.subject.toUpperCase()} LỚP ${draft.grade}`,
      `Bài học: ${draft.lessonTitle}`,
      `Mã NLS / AI tích hợp: ${
        [...draft.selectedNlsCodes.map((x) => x.code), draft.selectedAiCode]
          .filter(Boolean)
          .join(', ') || 'Chưa chọn'
      }`,
      `Mức độ sử dụng AI: ${levelsLine}`,
      `1. Công cụ đã dùng (tên, ngày): ${draft.plc6.toolAndDate}`,
      `2. Mục đích dùng: ${draft.plc6.purpose}`,
      `3. Phạm vi AI hỗ trợ: ${draft.plc6.aiScope}`,
      `4. Phần việc HS trực tiếp thực hiện: ${draft.plc6.studentWork}`,
      `5. Cách kiểm chứng và chỉnh sửa kết quả: ${draft.plc6.verificationAndEdit}`,
    ].join('\n');

    const htmlContent = `
      <div style="font-family:'Times New Roman',serif;font-size:13pt;line-height:1.45;">
        <p><strong>MẪU KHAI BÁO SỬ DỤNG AI (PLC.6) — ${escapeHtml(draft.subject)} LỚP ${escapeHtml(draft.grade)}</strong></p>
        <p><strong>Bài học:</strong> ${escapeHtml(draft.lessonTitle)}</p>
        <p><strong>Mức dùng AI:</strong> ${escapeHtml(levelsLine)}</p>
        <ol>
          <li><strong>Công cụ đã dùng (tên, ngày):</strong> ${escapeHtml(draft.plc6.toolAndDate)}</li>
          <li><strong>Mục đích dùng:</strong> ${escapeHtml(draft.plc6.purpose)}</li>
          <li><strong>Phạm vi AI hỗ trợ:</strong> ${escapeHtml(draft.plc6.aiScope)}</li>
          <li><strong>Phần việc HS trực tiếp thực hiện:</strong> ${escapeHtml(draft.plc6.studentWork)}</li>
          <li><strong>Cách kiểm chứng và chỉnh sửa kết quả:</strong> ${escapeHtml(draft.plc6.verificationAndEdit)}</li>
        </ol>
      </div>
    `;

    const ok = await copyRichTextForWord(plainText, htmlContent);
    if (ok) {
      setCopiedPlc6(true);
      notify('Đã copy Khung Khai báo AI (PLC.6) chuẩn dán Word.', 'success');
      window.setTimeout(() => setCopiedPlc6(false), 2000);
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
          <div className="text-xs font-bold uppercase tracking-wider text-white/95">
            Bước 5 / 5 · Kiểm soát chất lượng & Minh bạch học thuật
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
            Bước 4
          </button>
          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Xuất trọn bộ KHBD nháp
          </button>
        </div>
      </div>

      {/* Khối A: Gate 2 câu, PLC.5, PLC.4 & Tình huống lớp 8A */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#059669] text-xs font-extrabold border border-[#34D399]">
              A
            </span>
            Cổng Gate 2 câu, Nguyên tắc đánh giá (PLC.5) & An toàn tâm lí (PLC.4)
          </h3>
          <button
            type="button"
            onClick={() => onOpenLegalDoc('cv-5588')}
            className="px-2.5 py-1 rounded-lg bg-[#D1FAE5] text-[#065F46] text-xs font-bold hover:opacity-90 cursor-pointer"
          >
            Xem CV 5588 (Đánh giá quá trình)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-[#ECFDF5] border border-[#6EE7B7] space-y-2.5 text-xs sm:text-sm text-[#0F172A]">
            <div>
              <div className="font-extrabold text-[#065F46]">2 Câu hỏi Gate bắt buộc trước khi chốt KHBD:</div>
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li><strong>Có biểu hiện quan sát được không?</strong></li>
                <li>
                  <strong>Có sản phẩm / minh chứng đánh giá quá trình không</strong> (Phiếu đối chiếu, biên bản kiểm chứng, bảng kiểm, khuyến nghị ≤ 50 chữ)? Nếu <strong>KHÔNG</strong> → bỏ mã hoặc sửa hoạt động.
                </li>
              </ol>
            </div>
            <div className="pt-2 border-t border-emerald-200">
              <div className="font-extrabold text-[#065F46]">Nguyên tắc đánh giá (PLC.5):</div>
              <p className="mt-1 leading-relaxed">
                Đánh giá quá trình là chủ đạo; <strong>không lập đầu điểm riêng</strong> cho AI/ATM; công bằng (không để HS thiệt thòi vì thiếu thiết bị); ghi nhận đóng góp cá nhân trong nhóm; nhận xét theo 3 ý: <em>đã làm được – bằng chứng – bước tiếp theo</em>.
              </p>
            </div>
          </div>

          {/* Tình huống lớp 8A (Slide 20) & PLC.4 */}
          <div className="rounded-xl p-4 bg-[#FFF1F2] border border-[#FDA4AF] space-y-2 text-xs sm:text-sm text-[#0F172A]">
            <div className="font-extrabold text-[#BE123C] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              An toàn tâm lí (PLC.4) & {CLASS_8A_SCENARIO.title}
            </div>
            <p className="leading-relaxed bg-white/85 p-2.5 rounded-lg border border-rose-200 text-xs">
              <strong>Tình huống:</strong> {CLASS_8A_SCENARIO.situation}
            </p>
            <div className="flex flex-wrap gap-1">
              {CLASS_8A_SCENARIO.relatedAtm.map((code) => (
                <span
                  key={code}
                  className="px-2 py-0.5 rounded bg-[#FFE4E6] text-[#BE123C] font-mono text-[13px] font-bold"
                >
                  {code}
                </span>
              ))}
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              {CLASS_8A_SCENARIO.pedagogicalHandling.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Khối B: 3 Công cụ tương tác Bước 5 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-6"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#059669] text-white text-xs font-extrabold">
            B
          </span>
          Bảng kiểm Gate & PLC.2 · Trình tạo Khai báo AI (PLC.6) · Xuất KHBD nháp
        </h3>

        {/* Tool 1: 7+2 Gate Checklist */}
        <div className="rounded-2xl p-4 bg-[#ECFDF5]/70 border-2 border-[#6EE7B7] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-[#065F46] flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              1. Bảng kiểm An toàn & Chất lượng KHBD (2 câu Gate + 7 tiêu chí PLC.2)
            </div>
            <span className="text-xs font-extrabold text-[#065F46]">
              Hoàn thành: {checkedCount}/{totalItems} ({progressPct}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-white border border-emerald-200 overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #10B981, #84CC16)',
              }}
            />
          </div>

          {isAllPassed && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-extrabold text-sm flex items-center gap-2.5 shadow-sm">
              <Award className="w-5 h-5 shrink-0" />
              Đạt chuẩn tích hợp — Sẵn sàng nộp Tổ CM trước 04/12/2026!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PLC2_GATE_CHECKLIST.map((item) => {
              const checked = draft.checkedChecklistIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'bg-white border-[#059669]'
                      : 'bg-white/80 border-emerald-200 hover:border-emerald-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckItem(item.id)}
                    className="mt-0.5 w-4 h-4 accent-[#059669] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[12px] font-extrabold ${
                          item.group === 'GATE'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.group}
                      </span>
                      <span className="font-bold text-xs text-[#0F172A]">{item.title}</span>
                    </div>
                    <p className="text-[13px] text-slate-600 mt-0.5 leading-snug">
                      {item.detail}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Tool 2: PLC.6 AI Declaration Builder (Flow L8) */}
        <div className="rounded-2xl p-4 bg-slate-50 border-2 border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-extrabold text-[#0F172A]">
                2. Trình tạo Mẫu Khai báo sử dụng AI (PLC.6 — 5 ý + Dòng mức dùng AI)
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Tự động liên thông tên bài học ({draft.lessonTitle || '...'}) & mã AI/NLS từ Bước 1–4 (Luồng L8).
              </div>
            </div>
            <button
              type="button"
              onClick={handleSyncPlc6FromSteps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#059669] text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tự điền từ Bước 1–4
            </button>
          </div>

          {/* 5 Checkboxes for AI Usage Levels */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700">
              Dòng chọn mức dùng AI chuẩn (tích chọn các mức phù hợp):
            </div>
            <div className="flex flex-wrap gap-2">
              {PLC6_AI_LEVELS.map((lvl) => {
                const active = draft.plc6.usageLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => togglePlc6Level(lvl)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#059669] text-white border-[#059669]'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                (1) Công cụ đã dùng (tên, ngày)
              </label>
              <input
                type="text"
                value={draft.plc6.toolAndDate}
                onChange={(e) =>
                  updateDraft({ plc6: { ...draft.plc6, toolAndDate: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                (2) Mục đích dùng
              </label>
              <input
                type="text"
                value={draft.plc6.purpose}
                onChange={(e) =>
                  updateDraft({ plc6: { ...draft.plc6, purpose: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                (3) Phạm vi AI hỗ trợ
              </label>
              <textarea
                rows={2}
                value={draft.plc6.aiScope}
                onChange={(e) =>
                  updateDraft({ plc6: { ...draft.plc6, aiScope: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                (4) Phần việc HS trực tiếp thực hiện
              </label>
              <textarea
                rows={2}
                value={draft.plc6.studentWork}
                onChange={(e) =>
                  updateDraft({ plc6: { ...draft.plc6, studentWork: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                (5) Cách kiểm chứng và chỉnh sửa kết quả
              </label>
              <textarea
                rows={2}
                value={draft.plc6.verificationAndEdit}
                onChange={(e) =>
                  updateDraft({
                    plc6: { ...draft.plc6, verificationAndEdit: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => void handleCopyPlc6()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer"
            >
              {copiedPlc6 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedPlc6 ? 'Đã copy Khung PLC.6!' : 'Copy Khung Khai báo AI (PLC.6)'}
            </button>

            <button
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-extrabold shadow-md hover:opacity-95 cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
              }}
            >
              <FileDown className="w-4 h-4" />
              Xuất trọn bộ KHBD nháp (Bước 1 → Bước 5)
            </button>
          </div>
        </div>

        {/* Tool 3: Danh mục Tài liệu & Minh chứng cần chuẩn bị (5 nhóm - 12 đầu mục) */}
        <div className="rounded-2xl p-4 bg-white border-2 border-emerald-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="text-sm font-extrabold text-[#065F46] flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#059669]" />
                3. Danh mục Tài liệu & Minh chứng cần chuẩn bị ({checkedEvidenceIds.length}/{totalEvidenceItems} đầu mục)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Tích đánh dấu tiến độ chuẩn bị hồ sơ cho Tập huấn 22/11/2026, nộp KHDH trước 04/12/2026 và minh chứng tiết dạy (lưu tự động trên máy).
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyEvidenceChecklist()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedEvidence ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEvidence ? 'Đã copy danh mục!' : 'Copy Danh mục Minh chứng (Word)'}
            </button>
          </div>

          <div className="space-y-3">
            {EVIDENCE_PREP_CHECKLIST_GROUPS.map((grp) => (
              <div
                key={grp.id}
                className="rounded-xl p-3.5 border space-y-2.5"
                style={{
                  backgroundColor: grp.bgHex,
                  borderColor: `${grp.accentHex}55`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    className="text-xs sm:text-sm font-extrabold"
                    style={{ color: grp.accentHex }}
                  >
                    {grp.groupTitle}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-black/10">
                      {grp.owner}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: grp.accentHex }}
                    >
                      {grp.deadline}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {grp.items.map((item) => {
                    const checked = checkedEvidenceIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl bg-white border transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 ${
                          checked ? 'border-emerald-400' : 'border-slate-200'
                        }`}
                      >
                        <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEvidenceId(item.id)}
                            className="mt-1 w-4 h-4 accent-[#059669] shrink-0"
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-xs sm:text-sm font-bold leading-snug ${
                                checked ? 'line-through text-slate-500' : 'text-[#0F172A]'
                              }`}
                            >
                              {item.name}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                        </label>
                        {item.sourceRef && (
                          <button
                            type="button"
                            onClick={() => void router.openDocument(item.sourceRef!, item.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-bold whitespace-nowrap shrink-0 cursor-pointer self-start"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Mở tệp mẫu
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Khối C: Tài liệu đính kèm Bước 5 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-3"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#059669] text-xs font-extrabold border border-[#34D399]">
            C
          </span>
          <FileText className="w-4 h-4 text-[#059669]" />
          Tài liệu đính kèm Bước 5 (4 tệp gốc)
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
