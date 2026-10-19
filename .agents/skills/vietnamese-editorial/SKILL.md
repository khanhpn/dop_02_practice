---
name: vietnamese-editorial
description: Use when writing, translating, supplementing, or reviewing Vietnamese lessons, questions, explanations, labs, diagrams, and learner-facing copy in the dop.study AWS DOP-C02 repository.
---

# Biên tập tiếng Việt cho dop.study

Đọc [quy ước biên tập](../../../docs/vietnamese-editorial-guide.md) trước khi làm việc.

## Chuyên gia ngôn ngữ là bước bắt buộc

Khi soạn mới, dịch, bổ sung hoặc sửa nội dung tiếng Việt, **bắt buộc giao cho một tác nhân đóng vai chuyên gia ngôn ngữ tiếng Việt dịch theo ngữ nghĩa và biên tập câu chữ**. Sau đó, **một tác nhân khác phải đọc duyệt độc lập** phần đã sửa. Người viết không được tự duyệt bản của mình. Có thể phân chia nhiều nhóm bài và đọc chéo giữa các chuyên gia sau khi hoàn tất lượt viết.

Giao rõ cho chuyên gia: phạm vi file, đối tượng học, ngữ cảnh DOP-C02, nội dung cần bảo vệ và yêu cầu đọc toàn bộ câu tiếng Việt. Người duyệt độc lập phải kiểm cả tính tự nhiên lẫn việc giữ đủ điều kiện kỹ thuật, không chỉ tìm từ khóa hay xem báo cáo của người viết. Tác nhân biên tập không tự giao tiếp một chuỗi chuyên gia vô hạn: người điều phối chịu trách nhiệm tổ chức một lượt viết và một lượt duyệt độc lập cho mỗi phần.

Nếu không có công cụ tác nhân, vẫn có thể chuẩn bị bản thảo và tự rà, nhưng phải ghi rõ chưa hoàn tất bước chuyên gia độc lập; không tuyên bố đã được chuyên gia duyệt hoặc giả danh người thật.

## Tiêu chuẩn bản tiếng Việt

- Dịch ý trọn vẹn theo ngữ cảnh, không thay từng từ Anh–Việt. Câu có chủ thể, hành động và đối tượng rõ; đoạn có mạch giải thích từ khái niệm đến cơ chế, điều kiện và hệ quả.
- Trau chuốt từ ngữ, nhịp câu và chuyển ý như biên tập một cuốn sách hướng dẫn dễ đọc. Với giáo trình kỹ thuật, vẻ đẹp của câu nằm ở sự chính xác và sáng rõ; tránh văn hoa, ví von hoặc kéo dài câu làm che mất cơ chế AWS.
- Rà mọi trường hiển thị: tiêu đề, tóm tắt, mục tiêu, kiến thức nền, đoạn giảng, gạch đầu dòng, sơ đồ, tình huống, điểm cần nhớ, điểm dễ nhầm, giải thích mã, thực hành, dọn tài nguyên, bản dịch câu hỏi và lựa chọn, lời giải từng lựa chọn, cùng hướng dẫn giao diện.
- Bổ sung lời giải thích khi đoạn thiếu bước suy luận, chủ thể hoặc liên hệ giữa nguyên nhân và kết quả. Dựa vào nội dung và nguồn hiện có; không thêm khẳng định kỹ thuật mới chỉ để câu đầy đặn. Nghi vấn về AWS phải được đối chiếu nguồn AWS chính thức trước khi sửa kiến thức.
- Giữ tên dịch vụ, API, thuộc tính và giá trị cấu hình; giải nghĩa thuật ngữ khi cần. Bản dịch câu hỏi phải giữ đủ điều kiện, phạm vi, mức ưu tiên và số đáp án cần chọn. Lời giải cần chỉ ra cơ chế và lý do phù hợp hoặc chưa đáp ứng yêu cầu.

## Bảo vệ nội dung và xác minh

Không thay tên thuộc tính trong mã nguồn, ID, ánh xạ chương/Task Statement, neo mục, câu hỏi và lựa chọn tiếng Anh, đáp án, thẻ phân loại, liên kết ôn tập, nguồn, ngày đối chiếu, mã CloudFormation/Terraform hoặc câu lệnh trong một đợt biên tập ngôn ngữ. Chỉnh từng chuỗi hoặc từng đoạn có ngữ cảnh; **không thay thuật ngữ hàng loạt trên toàn file mã nguồn**.

Người điều phối lưu bản đối chiếu của trạng thái làm việc hiện tại trước khi sửa, bảo toàn cả thay đổi chưa commit. Dùng `scripts/editorial-invariants.mjs` để đối chiếu các trường kỹ thuật sau biên tập. Theo skill `no-automated-tests` và AGENTS.md: dùng `pnpm check`, kiểm kê nội dung khi cần; không thêm hoặc chạy unit/e2e tests.

Chỉ ghi hoàn tất khi người duyệt đã đọc hết phạm vi được giao, các góp ý đã được xử lý và các bước xác minh phù hợp đã đạt. Báo cáo ngắn: file/phần đã đọc, ví dụ câu đã chỉnh, phần đã bổ sung, kết quả duyệt và vấn đề còn tồn tại. Kiểm tra cấu trúc đạt không đồng nghĩa văn phong đã đạt.
