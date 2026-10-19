# Lượt biên tập tiếng Việt D2/D3

## Phạm vi

- Domain 2: l01, l02, l03, l07, l10.
- Domain 3: l01, l05, l09.
- Mỗi bài gồm toàn bộ tiêu đề, tóm tắt, mục tiêu, kiến thức nền, 10 đoạn giảng, sơ đồ, tình huống, điểm cần nhớ/dễ nhầm, giải thích mã, thực hành và dọn tài nguyên.
- Đã biên tập bản tiếng Việt của 160 câu hỏi, toàn bộ lựa chọn, lời giải từng lựa chọn và lời giải chung. Không sửa nội dung tiếng Anh hoặc đáp án để làm câu dễ viết hơn.

## Những vấn đề lặp lại và cách xử lý

1. **Ghép danh từ Anh–Việt thay vì giải thích hành động.** Ví dụ cũ: “Database phải được replacement trong update đã duyệt.” Bản biên tập: “Một cập nhật đã được duyệt phải tạo cơ sở dữ liệu mới để thay cơ sở dữ liệu cũ.” Câu mới chỉ rõ thao tác và đối tượng thay vì yêu cầu người học tự nối các thuật ngữ.
2. **Nêu thuật ngữ nhưng chưa có khái niệm nền.** Các mục nay giới thiệu khái niệm trước, giải thích tác dụng rồi mới nêu điều kiện. Ví dụ ở d2-l01: stack được giải thích là nhóm tài nguyên do CloudFormation quản lý cùng nhau. Ở d3-l09, RTO và RPO được giới thiệu riêng để người đọc phân biệt thời gian phục hồi với điểm dữ liệu.
3. **Dịch sát khiến chủ thể hoặc điều kiện mơ hồ.** “Producer thay đổi” được viết theo ngữ cảnh thành “stack cung cấp đổi giá trị đầu ra”. “Đích khỏe” ở d3-l05 được đổi theo từng chỗ thành “máy vượt qua kiểm tra sức khỏe” hoặc “máy sẵn sàng phục vụ”, không thay mọi từ healthy theo một mẫu.
4. **Lời giải chỉ kết luận đúng/sai mà thiếu cơ chế.** Mỗi lời giải nay nói lựa chọn làm được gì và vì sao đủ hoặc chưa đủ trong tình huống. Ví dụ d2-l07-q19 phân biệt quyền nhạy cảm ở tài khoản quản lý với phạm vi SCP, thay vì chỉ nhắc lại đáp án.
5. **Chỉ dẫn thao tác thiếu mạch trước–sau.** Các bước thực hành nay tách việc gửi yêu cầu, chờ kết quả, kiểm tra tài nguyên và xác minh ứng dụng. Không dùng phản hồi API ban đầu thay bằng chứng đã hoàn tất.
6. **Cụm rút gọn gây giọng ra lệnh hoặc cảm giác dịch máy.** Ví dụ “chữa bằng thử lại mù” được đổi thành “gửi lại yêu cầu khi chưa kiểm tra nguyên nhân”. Những câu dạng “scope đúng”, “current state”, “verification rõ” được diễn đạt bằng chủ thể và việc cần kiểm tra cụ thể.

## Bảo toàn và xác minh

- Đối chiếu bằng `scripts/editorial-invariants.mjs` trên mốc hiện tại của tám bài: `technicalChanges: []`.
- `pnpm check`: đạt.
- `pnpm audit:content`: đạt kiểm kê; hiện toàn kho có 28 bài/560 câu, bao phủ 19 Task Statements. Đây chưa phải chương trình đủ 72 bài.
- Không chạy hoặc thêm unit/e2e tests theo AGENTS.md và skill no-automated-tests.
- Không thực hiện hành động AWS. Các bài thực hành chưa được chạy trên tài khoản AWS trong lượt biên tập.

## Duyệt độc lập

Tác giả đã hoàn tất biên tập và tự rà phạm vi trên. Chưa tự ghi nhận là đã được duyệt độc lập. Người điều phối sẽ giao một tác nhân khác đọc trực tiếp toàn bộ tám bài và 160 câu, gửi nhận xét theo ID; các góp ý cần được xử lý trước khi ghi hoàn tất vòng biên tập.
