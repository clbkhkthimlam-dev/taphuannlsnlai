import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '2mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

type AnalysisMode = 'map_nls' | 'sift_verify' | 'boarding_plan' | 'legal_atm';

const MODE_PROMPTS: Record<AnalysisMode, string> = {
  map_nls: `Bạn là chuyên gia giáo dục phổ thông Việt Nam am hiểu Thông tư 02/2025/TT-BGDĐT (Khung năng lực số cho người học), Công văn 3456/BGDĐT-GDPT, Quyết định 2422/QĐ-BGDĐT (Khung nội dung giáo dục AI từ 2026–2027), Công văn 5588/BGDĐT-GDPT, Công văn 6206/BGDĐT-GDPT (ATMTD) và Công văn 5512/BGDĐT-GDTrH.
Nhiệm vụ: Rà soát mục tiêu (a)+(b)+(c) hoặc bài học do giáo viên Trường PTDTNT THCS Him Lam gửi lên và trả lời có cấu trúc rõ ràng bằng tiếng Việt:
1. Kiểm tra đúng bậc NLS áp dụng (TC1 cho lớp 6–7, TC2 cho lớp 8–9) và giới hạn 1–2 mã chỉ báo NLS (dạng chuẩn 1.2TC1a, 6.3TC2a) cùng 1–2 nhóm ATM1–ATM8 phù hợp.
2. Soát 4 lỗi thường gặp ở Bước 3 (chỉ ghi mã không diễn đạt hành vi; ghép quá nhiều nhóm ATM; dùng động từ không đo được như "hiểu", "có ý thức"; mục tiêu ATM tách rời nội dung bài học) và đề xuất câu mục tiêu (a)+(b)+(c) hoàn chỉnh dán vào KHBD Word.
3. Gợi ý hoạt động kiểm chứng SIFT (4 bước) hoặc 6 bước kiểm chứng AI phù hợp học sinh nội trú ít/không có thiết bị (phiếu in sẵn / GV trình diễn / phòng máy 4 vai).
4. Minh chứng đánh giá quá trình (Gate 2 câu, không lập đầu điểm riêng theo CV 5588) và lưu ý Khai báo AI (PLC.6).
Tuyệt đối không bịa đặt số hiệu văn bản pháp lý không có thật; chỉ trích dẫn đúng các văn bản xác minh (NQ 57-NQ/TW, TT 02/2025, CV 3456, NQ 71-NQ/TW, QĐ 2422/QĐ-BGDĐT, CV 5588, CV 6206, CV 7179, CV 5512).`,

  sift_verify: `Bạn là chuyên gia kiểm chứng thông tin khoa học KHTN THCS theo quy trình 4 bước SIFT (Stop - Investigate - Find better coverage - Trace claims) và 6 bước kiểm chứng câu trả lời AI.
Nhiệm vụ: Phân tích nội dung/câu trả lời do AI tạo ra hoặc tình huống thông tin mà giáo viên gửi lên, sau đó trình bày rõ ràng theo 4 bước SIFT và các điểm cần đối chiếu SGK CTGDPT 2018. Trình bày súc tích, thực tế, dễ dùng trực tiếp trên lớp.`,

  boarding_plan: `Bạn là chuyên gia tổ chức dạy học tích hợp NLS – ATM – AI cho Trường PTDTNT THCS Him Lam (học sinh nội trú, hạn chế thiết bị cá nhân).
Nhiệm vụ: Thiết kế kịch bản dạy học 45 phút khả thi 100% theo 3 phương án (0 thiết bị phiếu in sẵn / 1 thiết bị GV trình diễn / Phòng máy nhóm 4 vai) theo cấu trúc 4 hoạt động CV 5512 và đánh giá quá trình PLC.5 (không lập đầu điểm riêng).`,

  legal_atm: `Bạn là cố vấn chuyên môn về NLS, ATMTD (ATM1–ATM8) và Giáo dục AI cấp THCS dựa trên TT 02/2025/TT-BGDĐT, CV 3456/BGDĐT-GDPT, QĐ 2422/QĐ-BGDĐT, CV 5588/BGDĐT-GDPT, CV 6206/BGDĐT-GDPT và quy trình an toàn tâm lí PLC.4.
Nhiệm vụ: Giải đáp câu hỏi nghiệp vụ của GV một cách chính xác, rõ ràng, tuyệt đối không bịa số hiệu văn bản.`,
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(getGeminiClient()) });
});

app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { mode, query, context } = req.body as {
      mode?: AnalysisMode;
      query?: string;
      context?: string;
    };

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Vui lòng nhập nội dung cần phân tích.' });
      return;
    }

    const validMode: AnalysisMode =
      mode && mode in MODE_PROMPTS ? mode : 'map_nls';

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra khóa API trong phần Settings > Secrets của AI Studio.',
      });
      return;
    }

    const composedPrompt = context
      ? `Ngữ cảnh từ hệ thống:\n${context}\n\nYêu cầu của người dùng:\n${query.trim()}`
      : query.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: composedPrompt,
      config: {
        systemInstruction: MODE_PROMPTS[validMode],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.status(502).json({
        error: 'Mô hình AI không trả về nội dung. Vui lòng thử lại.',
      });
      return;
    }

    res.json({
      result: text,
      model: 'gemini-4-hydrogen',
      thinkingLevel: 'HIGH',
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Lỗi không xác định khi gọi Gemini API.';
    const status =
      message.includes('403') || message.includes('PERMISSION_DENIED')
        ? 403
        : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
        ? 429
        : 500;
    res.status(status).json({
      error: `Không thể hoàn tất phân tích AI (${status}): ${message}`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NLS & AI THCS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
