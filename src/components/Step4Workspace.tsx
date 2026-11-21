import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  FolderSearch,
  Laptop,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { DocLinkList } from './DocumentModals';
import { VERIFIED_FILES_142 } from '../data/verifiedV21Datasets';
import {
  AI_VERIFY_STEPS_6,
  CASE_STUDIES_2,
  LOW_DEVICE_OPTIONS_3,
  SIFT_PRACTICE_STIMULUS,
  SIFT_STEPS_4,
  STEP_DEFINITIONS,
  type KhbdDraftState,
} from '../data/v21Content';

interface Step4Props {
  draft: KhbdDraftState;
  updateDraft: (patch: Partial<KhbdDraftState>) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onOpenCaseStudy: (id: 'khtn8-bai32' | 'toan6-bai40') => void;
  onOpenFilesDrawer: (filterQuery?: string) => void;
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  notify: (msg: string, tone?: 'success' | 'info' | 'warning') => void;
}

export function Step4Workspace({
  draft,
  updateDraft,
  onPrevStep,
  onNextStep,
  onOpenCaseStudy,
  onOpenFilesDrawer,
  router,
  onCopyPath,
  notify,
}: Step4Props) {
  const stepDef = STEP_DEFINITIONS[3];
  const [activeSiftIdx, setActiveSiftIdx] = useState(0);
  const [checkedVerifySteps, setCheckedVerifySteps] = useState<number[]>([1, 2]);

  // Filter 54 KHBD minh họa files by current Step 1 subject (Flow L7)
  const matchingKhbdFiles = useMemo(() => {
    const khbdAll = VERIFIED_FILES_142.filter((p) =>
      p.startsWith('4. KHBD_Minh_Hoa_KHTN/')
    );
    const subj = draft.subject;
    const matched = khbdAll.filter((p) => {
      const lower = p.toLowerCase();
      if (subj === 'Toán') return lower.includes('toán') || lower.includes('toan');
      if (subj === 'Công nghệ') return lower.includes('công nghệ') || lower.includes('cong nghe');
      return (
        lower.includes('hóa') ||
        lower.includes('hoá') ||
        lower.includes('hoa') ||
        lower.includes('lý') ||
        lower.includes('lí') ||
        lower.includes('vat ly') ||
        lower.includes('physics') ||
        lower.includes('sinh') ||
        lower.includes('khtn')
      );
    });
    return matched.slice(0, 6);
  }, [draft.subject]);

  const activeLowDevice =
    LOW_DEVICE_OPTIONS_3.find((o) => o.id === draft.lowDeviceMode) ||
    LOW_DEVICE_OPTIONS_3[0];

  const toggleVerifyStep = (step: number) => {
    setCheckedVerifySteps((prev) =>
      prev.includes(step) ? prev.filter((x) => x !== step) : [...prev, step]
    );
  };

  return (
    <div className="space-y-5">
      {/* Step Banner (High-contrast orange/amber header) */}
      <div
        className="rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #EA580C 0%, #D97706 100%)' }}
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white/95">
            Bước 4 / 5 · Tổ chức dạy học CV 5512 & Khả thi với HS nội trú Him Lam
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
            Bước 3
          </button>
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs sm:text-sm hover:bg-slate-800 cursor-pointer"
          >
            Sang Bước 5: Gate & PLC.6
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Khối A: CV 5512, 5 nguyên tắc tình huống an toàn, 4 sai lầm AI */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-4"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#EA580C] text-xs font-extrabold border border-[#FB923C]">
            A
          </span>
          Cấu trúc 4 hoạt động CV 5512, 5 Nguyên tắc tình huống & 4 Sai lầm lồng ghép AI
        </h3>

        {/* 4 Activities CV 5512 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { num: 'HĐ 1', title: 'Mở đầu', desc: 'Tạo tình huống thực tiễn, khơi gợi câu hỏi kiểm chứng.' },
            { num: 'HĐ 2', title: 'Hình thành kiến thức', desc: 'Tích hợp bộ phận (vd HĐ 2.4: SIFT / Đối chiếu AI).' },
            { num: 'HĐ 3', title: 'Luyện tập', desc: 'Củng cố kiến thức môn kết hợp ghi nguồn / biên bản.' },
            { num: 'HĐ 4', title: 'Vận dụng', desc: 'Đề xuất biện pháp đo được & khai báo AI (PLC.6).' },
          ].map((act) => (
            <div
              key={act.num}
              className="p-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-[#7C2D12]"
            >
              <div className="text-xs font-extrabold uppercase">{act.num} · {act.title}</div>
              <p className="text-xs text-[#0F172A] mt-1 leading-snug">{act.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600">
          Mỗi hoạt động đảm bảo đủ 4 mục theo CV 5512: <strong>a) Mục tiêu</strong> · <strong>b) Nội dung</strong> · <strong>c) Sản phẩm</strong> · <strong>d) Tổ chức thực hiện (B1–B4)</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-[#FFF7ED] border border-[#FB923C] space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#7C2D12]">
              5 Nguyên tắc thiết kế tình huống an toàn số (tr. 60–61)
            </div>
            <ol className="space-y-1.5 text-xs sm:text-sm text-[#0F172A] list-decimal pl-5">
              <li><strong>Thảo luận nhóm</strong> là hình thức tổ chức chủ đạo.</li>
              <li><strong>Trao quyền</strong> (<em>“Em có thể làm gì ngay bây giờ?”</em>), không chỉ dọa nạt.</li>
              <li>Dùng <strong>tình huống gần gũi</strong> với thế giới học sinh THCS.</li>
              <li><strong>An toàn tâm lí tuyệt đối</strong> (không dùng chuyện thật trong lớp, không trùng tên HS).</li>
              <li>Có <strong>điểm quyết định rõ ràng</strong> để HS phân tích và lựa chọn.</li>
            </ol>
          </div>

          <div className="rounded-xl p-4 bg-[#FFF1F2] border border-[#FDA4AF] space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#BE123C] flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              4 Sai lầm thường gặp khi lồng ghép AI (Slide 141)
            </div>
            <ol className="space-y-1.5 text-xs sm:text-sm text-[#0F172A] list-decimal pl-5">
              <li>GV dùng AI soạn bài rồi gọi đó là <em>“lồng ghép giáo dục AI”</em> (sai đối tượng — HS mới là người thực hành/kiểm chứng).</li>
              <li>Chọn mã YCCĐ AI mà HS chưa học hoặc vượt bậc nhận thức.</li>
              <li>Nâng mức YCCĐ môn học — biến nội dung gợi ý thành yêu cầu bắt buộc.</li>
              <li>Để HS dùng tài khoản cá nhân hoặc nhập dữ liệu nhạy cảm lên công cụ AI.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Khối B: 4 Công cụ Tương tác Trực quan */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-6"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#EA580C] text-white text-xs font-extrabold">
            B
          </span>
          4 Công cụ Thiết kế Trực quan (SIFT · 6 bước AI · Thiếu thiết bị · Case Study)
        </h3>

        {/* Tool 1: Sơ đồ 4 bước SIFT tương tác + Ngữ liệu 50.000 lượt chia sẻ */}
        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0891B2]" />
              1. Sơ đồ 4 bước SIFT (ATM1) & Ngữ liệu luyện tập trên lớp
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE4E6] text-[#BE123C] text-xs font-bold">
              Bấm từng chữ S – I – F – T để xem hướng dẫn
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs sm:text-sm text-[#7C2D12]">
            <span className="font-extrabold uppercase tracking-wide block text-[13px] mb-0.5">
              Ngữ liệu luyện tập mẫu (bài tập SIFT):
            </span>
            <em>“{SIFT_PRACTICE_STIMULUS}”</em>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SIFT_STEPS_4.map((s, idx) => {
              const active = idx === activeSiftIdx;
              return (
                <button
                  key={s.letter}
                  type="button"
                  onClick={() => setActiveSiftIdx(idx)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    active ? 'shadow-sm scale-[1.01]' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  style={
                    active
                      ? { backgroundColor: s.bg, borderColor: s.color }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-base shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.letter}
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-[#0F172A] truncate">
                        {s.vietnamese}
                      </div>
                      <div className="text-[13px] text-slate-600 truncate">{s.english}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="p-4 rounded-xl border-2 space-y-2"
            style={{
              backgroundColor: SIFT_STEPS_4[activeSiftIdx].bg,
              borderColor: SIFT_STEPS_4[activeSiftIdx].color,
            }}
          >
            <div className="font-extrabold text-sm text-[#0F172A]">
              Bước {SIFT_STEPS_4[activeSiftIdx].letter} — {SIFT_STEPS_4[activeSiftIdx].vietnamese} ({SIFT_STEPS_4[activeSiftIdx].english})
            </div>
            <p className="text-xs sm:text-sm text-[#0F172A]">
              <strong>Câu hỏi hướng dẫn HS:</strong> {SIFT_STEPS_4[activeSiftIdx].action}
            </p>
            <p className="text-xs sm:text-sm text-[#0F172A] bg-white/85 p-3 rounded-lg border border-black/10">
              <strong>Áp dụng vào ngữ liệu “50.000 lượt chia sẻ”:</strong>{' '}
              {SIFT_STEPS_4[activeSiftIdx].sampleAnalysis}
            </p>
          </div>
        </div>

        {/* Tool 2: Quy trình 6 bước kiểm chứng câu trả lời AI (Slide 62) */}
        <div className="rounded-2xl p-4 bg-[#FAF5FF] border border-[#D8B4FE] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-[#581C87] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9333EA]" />
              2. Quy trình 6 bước kiểm chứng câu trả lời AI (Slide 62)
            </div>
            <span className="text-xs font-bold text-[#7E22CE]">
              Đã đánh dấu thực hành: {checkedVerifySteps.length}/6 bước
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {AI_VERIFY_STEPS_6.map((item) => {
              const checked = checkedVerifySteps.includes(item.step);
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => toggleVerifyStep(item.step)}
                  className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    checked
                      ? 'bg-white border-[#9333EA] shadow-xs'
                      : 'bg-white/75 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#9333EA] text-white text-[13px] font-extrabold">
                      Bước {item.step}
                    </span>
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        checked ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-[#0F172A] mt-1.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{item.detail}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool 3: Bộ chuyển đổi 3 Phương án Thiếu thiết bị (Trường Him Lam) */}
        <div className="rounded-2xl p-4 bg-[#FFF7ED] border-2 border-[#FB923C] space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-[#7C2D12] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#EA580C]" />
              3. Bộ chuyển đổi 3 Phương án Tổ chức khi Thiếu thiết bị (Trường PTDTNT THCS Him Lam)
            </div>
            <span className="text-xs font-bold text-[#7C2D12] bg-white px-2.5 py-1 rounded-lg border border-[#FDBA74]">
              Đang chọn: {activeLowDevice.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {LOW_DEVICE_OPTIONS_3.map((opt) => {
              const active = opt.id === draft.lowDeviceMode;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    updateDraft({
                      lowDeviceMode: opt.id,
                      lowDeviceNote: opt.draftNote,
                    });
                    notify(`Đã chọn ${opt.badge} và lưu vào KHBD nháp.`, 'success');
                  }}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#EA580C] text-white border-[#C2410C] shadow-sm'
                      : 'bg-white text-[#0F172A] border-[#FDBA74] hover:bg-orange-50'
                  }`}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wide">
                    {opt.badge}
                  </div>
                  <div className="font-bold text-sm mt-1 leading-snug">{opt.title}</div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#FDBA74] space-y-2 text-xs sm:text-sm text-[#0F172A]">
            <div className="font-bold text-[#7C2D12]">
              Phù hợp với: <span className="font-normal text-[#0F172A]">{activeLowDevice.suitableFor}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {activeLowDevice.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Editable Activity & Low-device note synced with Step 5 & Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#7C2D12]">
                Hoạt động tích hợp dự kiến trong KHBD (đồng bộ sang Bước 5 & Xuất KHBD)
              </label>
              <textarea
                rows={3}
                value={draft.activitySuggestion}
                onChange={(e) => updateDraft({ activitySuggestion: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#FDBA74] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#7C2D12]">
                Tiêu chí kiểm chứng & Ghi chú phương án thiết bị
              </label>
              <textarea
                rows={3}
                value={draft.verificationCriteria}
                onChange={(e) => updateDraft({ verificationCriteria: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#FDBA74] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
            </div>
          </div>
        </div>

        {/* Tool 4: 2 Case Study đầy đủ & Lọc KHBD mẫu cùng môn (Luồng L7) */}
        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EA580C]" />
              4. Xem trọn vẹn 2 Case Study mẫu & Kho KHBD môn {draft.subject} (Luồng L7)
            </div>
            <button
              type="button"
              onClick={() => onOpenFilesDrawer(draft.subject)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              <FolderSearch className="w-3.5 h-3.5" />
              Mở toàn bộ 31 bài AI & 54 KHBD
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CASE_STUDIES_2.map((cs) => (
              <div
                key={cs.id}
                className="p-4 rounded-xl bg-white border-2 border-[#FDBA74] flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FFEDD5] text-[#9A3412] text-xs font-extrabold">
                    {cs.badge}
                  </span>
                  <div className="font-extrabold text-sm text-[#0F172A]">{cs.title}</div>
                  <div className="text-xs font-semibold text-[#EA580C]">{cs.activityTitle}</div>
                  <div className="text-xs text-slate-600">{cs.meta}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenCaseStudy(cs.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#D97706] text-white text-xs font-bold hover:opacity-95 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Xem chi tiết Case Study đầy đủ
                </button>
              </div>
            ))}
          </div>

          {/* Filtered KHBD .docx files for current subject */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-700">
              KHBD Minh họa lọc theo môn <strong>{draft.subject}</strong> (trong 54 tệp <code className="font-mono">4. KHBD_Minh_Hoa_KHTN/</code>):
            </div>
            <DocLinkList
              items={matchingKhbdFiles.map((path) => ({
                label: path.split('/').pop() || path,
                path,
              }))}
              router={router}
              onCopyPath={onCopyPath}
              accentHex="#EA580C"
            />
          </div>
        </div>
      </section>

      {/* Khối C: Tài liệu đính kèm Bước 4 */}
      <section
        className="rounded-2xl bg-white border-2 p-5 shadow-xs space-y-3"
        style={{ borderColor: stepDef.borderHex }}
      >
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#EA580C] text-xs font-extrabold border border-[#FB923C]">
            C
          </span>
          <FileText className="w-4 h-4 text-[#EA580C]" />
          Tài liệu đính kèm Bước 4
        </h3>
        <DocLinkList
          items={stepDef.attachments}
          router={router}
          onCopyPath={onCopyPath}
          accentHex="#EA580C"
        />
      </section>
    </div>
  );
}
