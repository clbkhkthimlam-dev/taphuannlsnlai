import { useCallback, useEffect, useRef, useState } from 'react';
import { VERIFIED_FILES_142 } from '../data/verifiedV21Datasets';

const STORAGE_SETTINGS_KEY = 'himlam_v21_doc_router_settings';

export interface DocRouterSettings {
  localRelativeMode: boolean;
  customBaseUrl: string;
  perFileUrls: Record<string, string>;
}

const DEFAULT_SETTINGS: DocRouterSettings = {
  localRelativeMode: false,
  customBaseUrl: '',
  perFileUrls: {},
};

export interface PreviewModalState {
  title: string;
  relativePath: string;
  kind: 'pdf' | 'text';
  blobUrl?: string;
  textContent?: string;
}

export interface FallbackModalState {
  relativePath: string;
  label?: string;
  reason: 'not_connected' | 'configure_file';
}

function normalizePathKey(p: string): string {
  return p
    .replace(/\\/g, '/')
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
    .toLowerCase()
    .normalize('NFC')
    .trim();
}

function getFileNameOnly(p: string): string {
  const norm = p.replace(/\\/g, '/');
  const idx = norm.lastIndexOf('/');
  return idx >= 0 ? norm.slice(idx + 1) : norm;
}

export function getFileExtension(p: string): string {
  const name = getFileNameOnly(p).toLowerCase();
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1) : '';
}

function loadSettings(): DocRouterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<DocRouterSettings>;
    return {
      localRelativeMode: Boolean(parsed.localRelativeMode),
      customBaseUrl: typeof parsed.customBaseUrl === 'string' ? parsed.customBaseUrl : '',
      perFileUrls:
        parsed.perFileUrls && typeof parsed.perFileUrls === 'object'
          ? parsed.perFileUrls
          : {},
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export interface DocumentRouterApi {
  settings: DocRouterSettings;
  folderName: string | null;
  indexedFileCount: number;
  matchedVerifiedCount: number;
  previewModal: PreviewModalState | null;
  fallbackModal: FallbackModalState | null;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  closePreviewModal: () => void;
  closeFallbackModal: () => void;
  pickRootFolder: () => Promise<void>;
  handleFolderInputFiles: (files: FileList | null) => void;
  setLocalRelativeMode: (enabled: boolean) => void;
  setCustomBaseUrl: (url: string) => void;
  setPerFileUrl: (relativePath: string, url: string) => void;
  removePerFileUrl: (relativePath: string) => void;
  attachSingleLocalFile: (relativePath: string, file: File) => void;
  getFileConnectionStatus: (relativePath: string) => 'local_override' | 'url_override' | 'folder' | 'base_url' | 'relative' | 'unconnected';
  openDocument: (relativePath: string, label?: string) => Promise<void>;
  openConfigureForFile: (relativePath: string, label?: string) => void;
  folderInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useDocumentRouter(
  notify: (message: string, tone?: 'success' | 'info' | 'warning') => void
): DocumentRouterApi {
  const [settings, setSettings] = useState<DocRouterSettings>(loadSettings);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [indexedFileCount, setIndexedFileCount] = useState(0);
  const [matchedVerifiedCount, setMatchedVerifiedCount] = useState(0);
  const [previewModal, setPreviewModal] = useState<PreviewModalState | null>(null);
  const [fallbackModal, setFallbackModal] = useState<FallbackModalState | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Maps normalized relative path -> File, and filename -> File (fallback match)
  const folderByPathRef = useRef<Map<string, File>>(new Map());
  const folderByNameRef = useRef<Map<string, File>>(new Map());
  const singleFileOverridesRef = useRef<Map<string, File>>(new Map());
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [, setOverrideVersion] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  const closePreviewModal = useCallback(() => {
    setPreviewModal((prev) => {
      if (prev?.blobUrl) {
        URL.revokeObjectURL(prev.blobUrl);
      }
      return null;
    });
  }, []);

  const closeFallbackModal = useCallback(() => {
    setFallbackModal(null);
  }, []);

  const recalculateMatchedCount = useCallback(() => {
    let matched = 0;
    for (const rel of VERIFIED_FILES_142) {
      const normRel = normalizePathKey(rel);
      const fileName = normalizePathKey(getFileNameOnly(rel));
      if (
        folderByPathRef.current.has(normRel) ||
        folderByNameRef.current.has(fileName)
      ) {
        matched += 1;
      }
    }
    setMatchedVerifiedCount(matched);
    return matched;
  }, []);

  const indexCollectedFiles = useCallback(
    (entries: { relPath: string; file: File }[], rootLabel: string) => {
      const byPath = new Map<string, File>();
      const byName = new Map<string, File>();

      for (const { relPath, file } of entries) {
        const norm = normalizePathKey(relPath);
        byPath.set(norm, file);
        // Also strip top root folder prefix if present (e.g. "0.TONG_HOP.../1. Phap_ly/...")
        const firstSlash = norm.indexOf('/');
        if (firstSlash > 0) {
          const stripped = norm.slice(firstSlash + 1);
          if (stripped) byPath.set(stripped, file);
        }
        byName.set(normalizePathKey(file.name), file);
      }

      folderByPathRef.current = byPath;
      folderByNameRef.current = byName;
      setFolderName(rootLabel);
      setIndexedFileCount(entries.length);
      const matched = recalculateMatchedCount();
      notify(
        `Đã kết nối thư mục "${rootLabel}" (${matched}/${VERIFIED_FILES_142.length} tệp chuẩn khớp, tổng ${entries.length} tệp).`,
        'success'
      );
    },
    [notify, recalculateMatchedCount]
  );

  const pickRootFolder = useCallback(async () => {
    const pickerFn = (
      window as unknown as {
        showDirectoryPicker?: (opts?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
      }
    ).showDirectoryPicker;

    if (typeof pickerFn === 'function') {
      try {
        const dirHandle = await pickerFn({ mode: 'read' });
        const collected: { relPath: string; file: File }[] = [];

        async function walk(
          handle: FileSystemDirectoryHandle,
          prefix: string
        ): Promise<void> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const iter = (handle as any).values() as AsyncIterable<FileSystemHandle>;
          for await (const entry of iter) {
            const nextPath = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (entry.kind === 'file') {
              try {
                const file = await (entry as FileSystemFileHandle).getFile();
                collected.push({ relPath: nextPath, file });
              } catch {
                // Skip unreadable file
              }
            } else if (entry.kind === 'directory') {
              await walk(entry as FileSystemDirectoryHandle, nextPath);
            }
          }
        }

        await walk(dirHandle, '');
        indexCollectedFiles(collected, dirHandle.name);
        return;
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        // Fallback to hidden webkitdirectory input if iframe blocks showDirectoryPicker
      }
    }

    if (folderInputRef.current) {
      folderInputRef.current.value = '';
      folderInputRef.current.click();
    } else {
      notify(
        'Trình duyệt không hỗ trợ chọn thư mục trực tiếp. Hãy dùng Cài đặt đường dẫn (Chế độ 2 hoặc 3).',
        'warning'
      );
    }
  }, [indexCollectedFiles, notify]);

  const handleFolderInputFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const entries: { relPath: string; file: File }[] = [];
      let detectedRoot = 'Thư mục tài liệu';
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const rel =
          (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
          file.name;
        if (i === 0 && rel.includes('/')) {
          detectedRoot = rel.split('/')[0];
        }
        entries.push({ relPath: rel, file });
      }
      indexCollectedFiles(entries, detectedRoot);
    },
    [indexCollectedFiles]
  );

  const findIndexedFile = useCallback((relativePath: string): File | undefined => {
    const normRel = normalizePathKey(relativePath);
    const single = singleFileOverridesRef.current.get(normRel);
    if (single) return single;

    const exact = folderByPathRef.current.get(normRel);
    if (exact) return exact;

    const byName = folderByNameRef.current.get(normalizePathKey(getFileNameOnly(relativePath)));
    if (byName) return byName;

    return undefined;
  }, []);

  const openFileObject = useCallback(
    async (file: File, relativePath: string, label?: string) => {
      const ext = getFileExtension(file.name || relativePath);
      const displayTitle = label || getFileNameOnly(relativePath);

      if (ext === 'pdf') {
        const blobUrl = URL.createObjectURL(file);
        setPreviewModal((prev) => {
          if (prev?.blobUrl) URL.revokeObjectURL(prev.blobUrl);
          return {
            title: displayTitle,
            relativePath,
            kind: 'pdf',
            blobUrl,
          };
        });
        return;
      }

      if (ext === 'md' || ext === 'txt' || ext === 'json' || ext === 'csv') {
        const textContent = await file.text();
        setPreviewModal((prev) => {
          if (prev?.blobUrl) URL.revokeObjectURL(prev.blobUrl);
          return {
            title: displayTitle,
            relativePath,
            kind: 'text',
            textContent,
          };
        });
        return;
      }

      // Office files (.docx, .xlsx, .pptx) -> download / open via Blob URL
      const blobUrl = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name || getFileNameOnly(relativePath);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      notify(
        `Đang tải/mở tệp Office "${file.name}" qua Blob URL. Bạn có thể mở trực tiếp bằng Word / Excel / PowerPoint.`,
        'success'
      );
    },
    [notify]
  );

  const triggerSafeLinkNavigation = useCallback((href: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const getFileConnectionStatus = useCallback(
    (relativePath: string) => {
      const norm = normalizePathKey(relativePath);
      if (singleFileOverridesRef.current.has(norm)) return 'local_override' as const;
      if (settings.perFileUrls[relativePath]) return 'url_override' as const;
      if (
        folderByPathRef.current.has(norm) ||
        folderByNameRef.current.has(normalizePathKey(getFileNameOnly(relativePath)))
      ) {
        return 'folder' as const;
      }
      if (settings.customBaseUrl.trim()) return 'base_url' as const;
      if (settings.localRelativeMode) return 'relative' as const;
      return 'unconnected' as const;
    },
    [settings.customBaseUrl, settings.localRelativeMode, settings.perFileUrls]
  );

  const openDocument = useCallback(
    async (relativePath: string, label?: string) => {
      // 1. Per-file local File override
      const norm = normalizePathKey(relativePath);
      const localOverride = singleFileOverridesRef.current.get(norm);
      if (localOverride) {
        await openFileObject(localOverride, relativePath, label);
        return;
      }

      // 2. Per-file custom URL override
      const customUrl = settings.perFileUrls[relativePath]?.trim();
      if (customUrl) {
        triggerSafeLinkNavigation(customUrl);
        notify(`Đang mở liên kết tùy chỉnh cho "${getFileNameOnly(relativePath)}".`, 'info');
        return;
      }

      // 3. Mode 1: Folder Picker indexed File
      const indexed = findIndexedFile(relativePath);
      if (indexed) {
        await openFileObject(indexed, relativePath, label);
        return;
      }

      // 4. Mode 3: Custom Base URL
      if (settings.customBaseUrl.trim()) {
        const base = settings.customBaseUrl.trim().replace(/\/+$/, '');
        const encodedRel = relativePath
          .split('/')
          .map((seg) => encodeURIComponent(seg))
          .join('/');
        triggerSafeLinkNavigation(`${base}/${encodedRel}`);
        notify(`Đang mở qua Base URL tùy chỉnh: ${getFileNameOnly(relativePath)}`, 'info');
        return;
      }

      // 5. Mode 2: Local HTML relative path (./)
      if (settings.localRelativeMode) {
        const relUrl = encodeURI(`./${relativePath}`);
        triggerSafeLinkNavigation(relUrl);
        notify(`Đang mở đường dẫn tương đối ./${relativePath}`, 'info');
        return;
      }

      // 6. Fallback Modal (Copy path + instant connect/override)
      setFallbackModal({
        relativePath,
        label: label || getFileNameOnly(relativePath),
        reason: 'not_connected',
      });
    },
    [
      findIndexedFile,
      notify,
      openFileObject,
      settings.customBaseUrl,
      settings.localRelativeMode,
      settings.perFileUrls,
      triggerSafeLinkNavigation,
    ]
  );

  const openConfigureForFile = useCallback((relativePath: string, label?: string) => {
    setFallbackModal({
      relativePath,
      label: label || getFileNameOnly(relativePath),
      reason: 'configure_file',
    });
  }, []);

  const setLocalRelativeMode = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, localRelativeMode: enabled }));
  }, []);

  const setCustomBaseUrl = useCallback((url: string) => {
    setSettings((prev) => ({ ...prev, customBaseUrl: url }));
  }, []);

  const setPerFileUrl = useCallback((relativePath: string, url: string) => {
    setSettings((prev) => ({
      ...prev,
      perFileUrls: {
        ...prev.perFileUrls,
        [relativePath]: url.trim(),
      },
    }));
  }, []);

  const removePerFileUrl = useCallback((relativePath: string) => {
    setSettings((prev) => {
      const next = { ...prev.perFileUrls };
      delete next[relativePath];
      return { ...prev, perFileUrls: next };
    });
  }, []);

  const attachSingleLocalFile = useCallback(
    (relativePath: string, file: File) => {
      singleFileOverridesRef.current.set(normalizePathKey(relativePath), file);
      setOverrideVersion((v) => v + 1);
      notify(`Đã gắn tệp lẻ "${file.name}" cho đường dẫn này.`, 'success');
    },
    [notify]
  );

  return {
    settings,
    folderName,
    indexedFileCount,
    matchedVerifiedCount,
    previewModal,
    fallbackModal,
    isSettingsOpen,
    setIsSettingsOpen,
    closePreviewModal,
    closeFallbackModal,
    pickRootFolder,
    handleFolderInputFiles,
    setLocalRelativeMode,
    setCustomBaseUrl,
    setPerFileUrl,
    removePerFileUrl,
    attachSingleLocalFile,
    getFileConnectionStatus,
    openDocument,
    openConfigureForFile,
    folderInputRef,
  };
}
