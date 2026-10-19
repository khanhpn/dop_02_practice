# dop.study · DOP-C02 Study Lab

Không gian học AWS DevOps Engineer – Professional bằng tiếng Việt. React + TypeScript + MUI, Vite; chạy local và GitHub Pages, không backend.

## Chạy trên máy

Cài Node.js 24 LTS và pnpm 11.25.0 (`npm install -g pnpm@11.25.0`), sau đó:

```sh
pnpm install
pnpm dev
```

Mở URL Vite in ra, mặc định `http://127.0.0.1:5173`. Không mở `index.html` trực tiếp qua `file://`.

```sh
pnpm check        # TypeScript
pnpm audit:content # số bài/câu/tasks thực tế, không sửa dữ liệu
pnpm build        # static production → dist/
pnpm preview      # xem bản production
```

## Học như thế nào

1. Mở Cài đặt, nhập ngày thi mục tiêu và ngày bắt đầu. Mặc định ngày thi tạm là **15/12/2026**, 4 giờ/ngày; đây không phải ngày thi đã đặt.
2. Đọc bài tiếng Việt. Thuật ngữ chuyên ngành giữ tiếng Anh kèm giải nghĩa; API/service/property/code không dịch.
3. Xem sơ đồ và tình huống thực tế; so sánh CloudFormation (mặc định) với Terraform.
4. Làm lab từng bước, xác minh kết quả rồi cleanup tài nguyên. Website không truy cập AWS account hoặc triển khai tài nguyên thay bạn. Snippet thiếu tài nguyên phụ thuộc được ghi rõ.
   Trong Bản đồ kiến thức có **Mở lab tích hợp**: template CloudFormation đầy đủ, bản Terraform đối chiếu và hướng dẫn từ structured logs → metric/alarm → SNS, EventBridge → SQS với hai DLQ riêng. Có nút tạo file dữ liệu giả với timestamp hiện tại. Template chưa được triển khai lên AWS trong quá trình xây website; các bước kiểm chứng trong lab giúp bạn xác nhận kết quả trong sandbox của mình.
5. Làm bộ câu hỏi dưới bài. EN là mặc định; VI là bản tham khảo. Giải thích từng lựa chọn bằng tiếng Việt, kèm link quay đúng section kiến thức.
6. Dùng Practice Center để ôn câu sai, câu đến hạn, luyện domain hoặc thi thử 75 câu trong 180 phút. Multiple response chỉ đúng khi chọn chính xác toàn bộ tập đáp án. Câu bỏ trống tính sai. Mock lấy số câu theo domain **17/13/11/11/10/13** (largest remainder của trọng số chính thức).
7. Ghi chú bằng cách hiểu của mình và export backup định kỳ.

Điểm phần trăm luyện tập không quy đổi thành scaled score AWS 750/1000. Câu hỏi do dự án biên soạn, không phải đề thi chính thức hoặc exam dump.

## Triển khai GitHub Pages

Workflow `.github/workflows/pages.yml`:

- **Pull request vào `master`:** install bằng lockfile → typecheck → build. Không tag/deploy.
- **Push/merge vào `master`:** sau khi verify thành công, tự tạo tag `v0.0`, `v0.1`, … và deploy artifact `dist/` qua official Pages Actions.
- Tag sort bằng số nên `v0.10` lớn hơn `v0.9`. Rerun cùng commit tái sử dụng tag; push tag không trigger lại workflow.
- Tag allocation thử lại khi hai build cùng tranh một version; không force-push. Deploy kiểm tra `master` để tránh build cũ ghi đè build mới.

Lần đầu trên GitHub:

1. Đưa source vào repository của bạn trên nhánh **`master`**. Chưa có remote nào được cấu hình tự động trong source này.
   Nếu repository đang dùng `main`, bạn có thể đổi tên nhánh local bằng `git branch -M master` rồi đặt default branch tương ứng trên GitHub. Việc khởi tạo/đổi nhánh/push chưa được thực hiện thay bạn.
2. Vào **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Kiểm tra repository/organization cho phép `GITHUB_TOKEN` ghi contents (để tạo tag), environment `github-pages` cho phép nhánh `master` và GitHub Pages được bật cho loại repository của bạn.
4. Push hoặc merge vào `master`, xem tab **Actions → Verify, version & deploy Pages**. URL thật nằm ở environment `github-pages` và workflow summary sau khi deploy.

Vite `base: './'` và HashRouter hỗ trợ cả `https://USER.github.io/REPO/` lẫn user site. Deep link dạng `/REPO/#/lesson/d1-l01?section=...` không cần fallback server/404.html. Chuyển domain/origin sẽ có vùng localStorage khác; export/import để chuyển tiến độ.

Không cần AWS credentials, personal access token hoặc secret frontend. Quyền ghi tag và deploy chỉ được cấp cho từng job cần chúng.

## Cấu trúc dự án

```text
src/content/types.ts         Hợp đồng dữ liệu bài học/câu hỏi/lab
src/content/domain1..6.ts     Nội dung tách theo domain và bài
src/content/index.ts         Exam metadata, chapter mapping, index
src/core/                    Chấm bài, mock sampling, persistence, planner
src/components/              QuizRunner, code tabs, flow diagram, cards
src/pages/                   Dashboard, curriculum, lesson, practice, plan, settings
scripts/version.mjs          Version v0.N và push tag an toàn khi rerun
docs/                        Thiết kế, kế hoạch và trạng thái nội dung
```

## Nội dung và kiểm định

Exam guide snapshot được đối chiếu ngày **19/10/2026** tại [AWS DOP-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html). 6 domain có trọng số **22/17/15/15/14/17**. Mỗi bài có `reviewedAt`, nguồn AWS, mapping `chapterId` về Task Statement chính thức. Terraform là đối chiếu thực hành.

Mục tiêu nội dung đầy đủ: **72 bài, 19 Task Statements, ≥1.440 câu**. `pnpm audit:content` báo số bài/câu/tasks thực tế. Kiểm tra tự động chỉ bắt lỗi cấu trúc; không thay thế đọc và đánh giá chuyên môn từng tình huống.

Trạng thái thực tế và phần tiếp tục nằm trong `docs/progress.md` và `src/content/domain*/PROGRESS.md` nếu có. UI báo số bài/câu đã biên soạn thực tế. Không dùng bài rỗng hoặc câu hỏi biến thể chỉ đổi tên công ty để làm đủ số lượng.

## Backup và riêng tư

LocalStorage key `dop-study-lab:v1`, schema version 1. Notes, bookmarks, lab checklist, lịch sử kết quả và phiên luyện dở được lưu trên máy. Import validate toàn bộ dữ liệu trước, hỏi xác nhận thay thế và có nút export dữ liệu cũ. Backup lỗi hoặc khác schema không ghi đè tiến độ. Nếu storage bị chặn/đầy, app báo lỗi và giữ dữ liệu trong phiên để export.

Không ghi secrets AWS vào ghi chú hoặc backup. Website không gửi tiến độ ra dịch vụ bên ngoài.
