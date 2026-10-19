# DOP-C02 Study Lab — thiết kế

## Mục tiêu đã thống nhất

Website cá nhân học và ôn AWS Certified DevOps Engineer – Professional, cho người đã có Associate và cần ôn lại sau 4 tháng. Mục tiêu thi khoảng giữa tháng 12/2026, 4 giờ/ngày. Toàn bộ chương trình có ngay trong phiên bản đầu.

## Phạm vi

- React + TypeScript + Vite + MUI, static, chạy local và GitHub Pages.
- 6 domains, 19 Task Statements, 72 bài. Phân bổ số bài theo domain: 16, 13, 11, 11, 10, 11.
- Kiến thức chính bằng tiếng Việt dễ hiểu, thuật ngữ English (nghĩa tiếng Việt), service/API/code giữ nguyên.
- Mỗi bài: refresher, cơ chế hoạt động, thiết kế/trade-off, tình huống thực tế, lỗi/bẫy, sơ đồ, lab chi tiết, ví dụ CloudFormation ưu tiên và Terraform đối chiếu.
- Ít nhất 20 câu/bài; original practice questions, không nhận là câu thi thật hoặc được AWS chứng nhận. Câu hỏi/lựa chọn EN mặc định, toggle VI. Giải thích chỉ cần VI, giải thích từng lựa chọn và link đến section kiến thức.
- Dashboard, curriculum/search/filter, lesson, practice/mock 75 câu 180 phút, review câu sai, kế hoạch học, bookmark, notes, export/import.
- Mock lấy theo tỷ trọng 22/17/15/15/14/17 bằng largest remainder; raw percentage là chỉ số luyện tập, không quy đổi điểm scaled AWS 750.
- Tiến độ ở localStorage có schema version, validate import; ghi lỗi storage rõ ràng và vẫn học được. Không có tài khoản hoặc backend.
- Ngày thi mặc định tạm 2026-12-15, chỉnh trong Settings. Lịch cá nhân có thể dồn 72 bài vào 6 tuần + 2 tuần ôn, không khẳng định ngày thi đã đặt.

## Nguồn và độ chính xác

Snapshot kiểm tra 2026-10-19: https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html và 6 trang domain trực thuộc. Lưu Task Statements, mapping bài → task, nguồn AWS mỗi bài và ngày review. Exam guide là outline không phải toàn bộ câu hỏi hoặc bảo đảm nội dung đề. Terraform bổ trợ triển khai, không nâng thành trọng tâm exam. Phân biệt snippet minh hoạ và lab deploy được; không deploy AWS từ website.

## UI

MUI, light mặc định như study workspace: sidebar navy, nền giấy xám nhạt, cam đất, teal, typography rõ, khoảng trắng rộng; dark mode. Responsive sidebar/drawer; keyboard focus, radio/checkbox có label, trạng thái không chỉ dựa màu. Sơ đồ SVG/CSS đọc được cả bằng văn bản.

## Data / modules

src/content/types.ts định nghĩa Lesson/Question/Lab/Source; src/content/domain1..6.ts là dữ liệu tách biệt; src/content/index.ts gom và kiểm tra content. src/core/quiz.ts tạo đề/chấm, src/core/storage.ts import/export và persist, src/core/planner.ts lộ trình. src/pages riêng dashboard/curriculum/lesson/practice/plan/settings. HashRouter cho deep link và section query, Vite base './' cho project pages.

## CI/CD

PR vào master chỉ verify. Push master chạy typecheck/content/unit/browser smoke/build, tạo tag v0.0 lần đầu rồi v0.N tăng 1 (hai phần). Tag đã trỏ cùng commit được reuse khi rerun. Không trigger workflow bằng tag. Deploy cùng artifact đã build qua official Pages Actions; concurrency deployment tuần tự, không bỏ giữa deploy. GITHUB_TOKEN contents:write chỉ cho tag job; pages:write/id-token:write chỉ cho deploy. Không có remote hiện tại: cung cấp cấu hình và hướng dẫn bật Pages → GitHub Actions; chỉ xác nhận deploy khi thực sự có kết quả GitHub.

## Kiểm thử

Kiểm content: 72 bài/19 tasks, IDs unique, >=20 câu mỗi bài, EN/VI đủ, đáp án hợp lệ, mỗi option có rationale VI, reviewLink resolve đúng bài/section, source HTTPS AWS, lab đủ bước và cleanup. Core tests: exact set grading cho multi-select, phân bố mock, thiếu pool, loại câu trùng, corrupted backup, storage schema. Browser: navigation, deep link, locale, đáp án/review link, notes persist, export/import, mobile overflow, mock timer/resume. Production build và preview kiểm trực quan.

## Ranh giới

Không publish qua Sites; user đã chọn GitHub Pages. Không tạo GitHub repository hay push nếu chưa xác định remote đích. Không chạy lab vào AWS account. Không tự ước lượng phí thành giá hiện tại; lab nêu tài nguyên tính phí và dọn dẹp.
