import React, { useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  FileCode2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Link2,
  Presentation,
  Settings2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { DocumentRouterApi } from '../hooks/useDocumentRouter';
import { getFileExtension } from '../hooks/useDocumentRouter';
import { VERIFIED_FILES_142 } from '../data/verifiedV21Datasets';

export function FileTypeIcon({ path, className = 'w-4 h-4' }: { path: string; className?: string }) {
  const ext = getFileExtension(path);
  if (ext === 'pdf') return <FileText className={`${className} text-[#DC2626]`} />;
  if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet className={`${className} text-[#059669]`} />;
  if (ext === 'pptx' || ext === 'ppt') return <Presentation className={`${className} text-[#EA580C]`} />;
  if (ext === 'md' || ext === 'txt') return <FileCode2 className={`${className} text-[#7C3AED]`} />;
  return <FileText className={`${className} text-[#2563EB]`} />;
}

export interface DocLinkItem {
  label: string;
  path: string;
  note?: string;
}

export function DocLinkList({
  items,
  router,
  onCopyPath,
  accentHex = '#2563EB',
}: {
  items: DocLinkItem[];
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
  accentHex?: string;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const status = router.getFileConnectionStatus(item.path);
        const isReady = status !== 'unconnected';
        const statusLabel =
          status === 'local_override'
            ? 'Tệp lẻ đã gắn'
            : status === 'url_override'
            ? 'Link tùy chỉnh'
            : status === 'folder'
            ? 'Đã kết nối thư mục'
            : status === 'base_url'
            ? 'Base URL'
            : status === 'relative'
            ? 'Chế độ ./'
            : 'Chưa gắn đường dẫn';

        return (
          <div
            key={item.path}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">
                  <FileTypeIcon path={item.path} className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#0F172A] leading-snug break-words">
                    {item.label}
                  </div>
                  {item.note && (
                    <div className="text-xs text-slate-600 mt-0.5">{item.note}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <code className="text-[13px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded break-all">
                      {item.path}
                    </code>
                    <span
                      className={`text-[13px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                        isReady
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => void router.openDocument(item.path, item.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity whitespace-nowrap cursor-pointer"
                style={{ backgroundColor: accentHex }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở tài liệu
              </button>
              <button
                type="button"
                onClick={() => router.openConfigureForFile(item.path, item.label)}
                title="Đổi đường dẫn hoặc gắn link Google Drive / file lẻ"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                Đổi đường dẫn
              </button>
              <button
                type="button"
                onClick={() => onCopyPath(item.path)}
                title="Copy đường dẫn tương đối"
                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DocumentModals({
  router,
  onCopyPath,
}: {
  router: DocumentRouterApi;
  onCopyPath: (path: string) => void;
}) {
  const [urlDraft, setUrlDraft] = useState('');
  const [baseUrlInput, setBaseUrlInput] = useState(router.settings.customBaseUrl);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCopyLocal = (text: string, key: string) => {
    onCopyPath(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <>
      {/* 1. PDF / MD / TXT In-App Preview Modal */}
      {router.previewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-6"
          onClick={router.closePreviewModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between gap-3 text-white"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #EC4899 100%)',
              }}
            >
              <div className="min-w-0">
                <div className="font-bold text-sm sm:text-base truncate">
                  {router.previewModal.title}
                </div>
                <div className="text-xs text-white/85 font-mono truncate">
                  {router.previewModal.relativePath}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyLocal(router.previewModal!.relativePath, 'preview')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy đường dẫn
                </button>
                <button
                  type="button"
                  onClick={router.closePreviewModal}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  aria-label="Đóng xem trước"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 overflow-hidden">
              {router.previewModal.kind === 'pdf' && router.previewModal.blobUrl ? (
                <iframe
                  src={router.previewModal.blobUrl}
                  title={router.previewModal.title}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="h-full overflow-y-auto p-6 bg-white">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[#0F172A] leading-relaxed max-w-4xl mx-auto">
                    {router.previewModal.textContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Per-File Fallback / Override Modal */}
      {router.fallbackModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={router.closeFallbackModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 py-4 flex items-center justify-between text-white"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #EC4899 100%)',
              }}
            >
              <div className="min-w-0 pr-3">
                <h3 className="font-bold text-base truncate">
                  {router.fallbackModal.reason === 'configure_file'
                    ? 'Đổi đường dẫn tài liệu (Chế độ 3)'
                    : 'Kết nối tài liệu để mở trực tiếp'}
                </h3>
                <p className="text-xs text-white/90 truncate mt-0.5">
                  {router.fallbackModal.label}
                </p>
              </div>
              <button
                type="button"
                onClick={router.closeFallbackModal}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Đường dẫn chuẩn trong kho (142 tệp)
                </div>
                <code className="block text-xs font-mono text-[#0F172A] bg-white p-2.5 rounded-lg border border-slate-200 break-all">
                  {router.fallbackModal.relativePath}
                </code>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLocal(router.fallbackModal!.relativePath, 'rel')
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                  >
                    {copiedKey === 'rel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'rel' ? 'Đã copy' : 'Copy đường dẫn tương đối'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLocal(
                        `0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026\\${router.fallbackModal!.relativePath.replace(
                          /\//g,
                          '\\'
                        )}`,
                        'win'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    {copiedKey === 'win' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy đường dẫn Windows
                  </button>
                </div>
              </div>

              {/* Mode 1 quick connect */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-emerald-900">
                    Cách 1 (Khuyên dùng): Chọn thư mục gốc 1 lần cho cả 142 tệp
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Chọn thư mục <code className="font-mono font-semibold">0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026</code> trên máy tính để xem trước PDF/MD ngay trong web và tải mở Word/Excel/PPTX.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.closeFallbackModal();
                    void router.pickRootFolder();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  Chọn thư mục gốc
                </button>
              </div>

              {/* Mode 3a: Single local file */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2.5">
                <div className="text-sm font-bold text-blue-950">
                  Cách 2: Chọn tệp lẻ trên máy tính cho riêng tài liệu này
                </div>
                <input
                  ref={singleFileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && router.fallbackModal) {
                      const targetPath = router.fallbackModal.relativePath;
                      const targetLabel = router.fallbackModal.label;
                      router.attachSingleLocalFile(targetPath, file);
                      router.closeFallbackModal();
                      void router.openDocument(targetPath, targetLabel);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => singleFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Chọn file lẻ từ máy và mở ngay
                </button>
              </div>

              {/* Mode 3b: Custom URL (Google Drive / SharePoint / Web) */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2.5">
                <div className="text-sm font-bold text-purple-950">
                  Cách 3: Gắn link Google Drive / URL tùy chỉnh cho tệp này (lưu trình duyệt)
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={
                      urlDraft ||
                      router.settings.perFileUrls[router.fallbackModal.relativePath] ||
                      ''
                    }
                    onChange={(e) => setUrlDraft(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="flex-1 px-3 py-2 rounded-lg border border-purple-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val =
                        urlDraft.trim() ||
                        router.settings.perFileUrls[router.fallbackModal!.relativePath] ||
                        '';
                      if (!val) return;
                      router.setPerFileUrl(router.fallbackModal!.relativePath, val);
                      setUrlDraft('');
                      router.closeFallbackModal();
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Lưu link
                  </button>
                  {router.settings.perFileUrls[router.fallbackModal.relativePath] && (
                    <button
                      type="button"
                      onClick={() => {
                        router.removePerFileUrl(router.fallbackModal!.relativePath);
                        setUrlDraft('');
                      }}
                      className="px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
                      title="Xóa link tùy chỉnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Global 3-Mode Path Settings Modal */}
      {router.isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => router.setIsSettingsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 py-4 flex items-center justify-between text-white"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">
                    Bộ định tuyến Tài liệu 3 Chế độ (142 tệp thật)
                  </h3>
                  <p className="text-xs text-white/90">
                    Khắc phục lỗi trình duyệt chặn file:/// và hỗ trợ mở PDF/MD/Office mọi nơi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
              {/* Mode 1 */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-sm text-emerald-950">
                    Chế độ 1 — Chọn Thư mục Gốc (Folder Picker)
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      router.matchedVerifiedCount > 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {router.matchedVerifiedCount > 0
                      ? `Đã kết nối ${router.matchedVerifiedCount}/${VERIFIED_FILES_142.length} tệp`
                      : 'Chưa kết nối'}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Trỏ vào thư mục <code className="font-mono font-semibold">0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026</code> trên máy tính. Tệp <strong>.pdf</strong> và <strong>.md/.txt</strong> mở xem trước ngay trong Modal; tệp <strong>.docx/.xlsx/.pptx</strong> mở/tải qua Blob URL.
                </p>
                <button
                  type="button"
                  onClick={() => void router.pickRootFolder()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  {router.folderName
                    ? `Đổi thư mục (đang nối: ${router.folderName})`
                    : 'Chọn thư mục 0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026'}
                </button>
              </div>

              {/* Mode 2 */}
              <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-cyan-950">
                    Chế độ 2 — Chế độ HTML cục bộ (Đường dẫn tương đối ./)
                  </div>
                  <p className="text-xs text-cyan-900 mt-0.5 leading-relaxed">
                    Bật khi đặt bản web ngay trong thư mục gốc <code className="font-mono">0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026/</code> để mở thẳng <code className="font-mono">./1. Phap_ly_va_Chinh_sach/...</code>.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={router.settings.localRelativeMode}
                    onChange={(e) => router.setLocalRelativeMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>

              {/* Mode 3 */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2.5">
                <div className="font-bold text-sm text-purple-950">
                  Chế độ 3 — Gắn Base URL / Kho lưu trữ trực tuyến (lưu localStorage)
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  Nhập đường dẫn gốc máy chủ nội bộ hoặc kho tài liệu trực tuyến (ví dụ <code className="font-mono">https://school.edu.vn/nls-2026</code>). Ngoài ra, mọi tệp đều có nút <strong>Đổi đường dẫn</strong> riêng để gắn link Google Drive từng tệp.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={baseUrlInput}
                    onChange={(e) => setBaseUrlInput(e.target.value)}
                    placeholder="https://ten-mien-truong.edu.vn/0.TONG_HOP_TRIEN_KHAI_NLS_AI_2026"
                    className="flex-1 px-3 py-2 rounded-lg border border-purple-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      router.setCustomBaseUrl(baseUrlInput.trim());
                      router.setIsSettingsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Lưu Base URL
                  </button>
                </div>
              </div>

              {/* Summary of per-file overrides */}
              {Object.keys(router.settings.perFileUrls).length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wide text-slate-600">
                    Các tệp đã gắn URL riêng ({Object.keys(router.settings.perFileUrls).length})
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {Object.entries(router.settings.perFileUrls).map(([rel, url]) => (
                      <div
                        key={rel}
                        className="flex items-center justify-between gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-slate-800 truncate">{rel}</div>
                          <div className="text-indigo-600 truncate">{url}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.removePerFileUrl(rel)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
