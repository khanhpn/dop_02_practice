# Rà soát tiếng Việt và cách trình bày — 19/10/2026

## Phạm vi

Đọc và biên tập 28 bài hiện có, 560 câu hỏi và phần chữ hướng dẫn trên giao diện. Mỗi bài cần được rà từ tiêu đề đến phần dọn tài nguyên, bản dịch câu hỏi và lời giải của từng lựa chọn. Một người biên tập theo nghĩa; người thứ hai đọc duyệt độc lập toàn bộ phạm vi được giao. Không dùng số từ hoặc kết quả kiểm tra cấu trúc để thay thế việc đọc.

Giữ nguyên câu hỏi và lựa chọn tiếng Anh, đáp án, ID, liên kết ôn tập, nguồn AWS, mã CloudFormation/Terraform và câu lệnh. Dùng `scripts/editorial-invariants.mjs` để đối chiếu các trường đó với bản trước đợt biên tập.

## Nhận định từ lượt đọc đầu

1. Phần giảng đã có nhiều câu giải thích cơ chế hơn, nhưng một số trường phụ vẫn ghép danh từ Anh–Việt, chẳng hạn tiêu đề câu hỏi cũ ở d1-l09 là “Release nên ghi định danh nào” và một câu mô tả cũ ở d1-l12 là “Target tình trạng hoạt động”. Người đọc cần biết đối tượng cụ thể và hành động của nó, thay vì giải mã một chuỗi thuật ngữ.
2. Sơ đồ và bước thực hành đôi khi bỏ chủ thể hoặc kết quả cần quan sát. Những cụm như “raw export” hay “từ điều kiện kiểm tra tới điều kiện kiểm tra” không giúp người học hình dung phải làm gì. Lượt biên tập đang thay bằng câu nêu dịch vụ nào chuyển dữ liệu, người học kiểm tra ở đâu và kết quả nào xác nhận bước đã đạt.
3. Một số lời giải cũ chỉ kết luận lựa chọn đúng hoặc sai. Lời giải cần nối điều kiện trong đề với cơ chế AWS: lựa chọn đó thực hiện được việc gì, còn thiếu yêu cầu nào, và khi gặp tình huống tương tự nên kiểm tra dữ kiện nào.
4. Trên màn hình rộng, phần giảng trước đây trải thành dòng quá dài; mục lục cạnh bài chỉ hiện ở màn rất lớn. Lời giải từng lựa chọn cũng dùng cỡ chữ nhỏ. Việc đọc liên tục dễ mệt ngay cả khi câu đã được biên tập tốt.

## Thay đổi trình bày đã thực hiện

- Giới hạn chiều dài dòng giảng, tăng cỡ chữ và khoảng cách giữa các đoạn; tăng cỡ chữ của lựa chọn và lời giải.
- Hiển thị mục lục bên cạnh từ cỡ laptop, cho mục lục cuộn riêng khi chiều cao màn hình hạn chế.
- Tách kiến thức cần nắm trước thành từng ý; tăng độ tương phản của chữ phụ trong giao diện sáng.

## Trạng thái duyệt độc lập

Đang thực hiện. Nhóm D1/D5 do biên tập viên tiếng Việt viết sẽ được người phụ trách D2/D3 đọc duyệt. Nhóm D2/D3 sẽ được người phụ trách D4/D6 đọc duyệt. Nhóm D4/D6 sẽ được biên tập viên tiếng Việt đọc duyệt. Các bài D5 còn lại, gồm bài do người điều phối biên tập, sẽ được người phụ trách D4/D6 đọc duyệt. Người duyệt gửi góp ý theo ID, tác giả xử lý rồi người duyệt kiểm tra lại trước khi đánh dấu hoàn tất.

Đọc duyệt độc lập D4 đã hoàn tất 6 bài/120 câu. Một góp ý ở d4-l03-q13 yêu cầu dịch rõ “delivery pressure” là nghẽn tại bước giao dữ liệu, để không đánh đồng với mọi loại lỗi giao. Với d6-l01-q09, người duyệt phát hiện bản Việt thêm đường dẫn `releases/` ngay trong câu hỏi dù bản Anh chỉ nhắc phạm vi ở lựa chọn. Câu hỏi Việt đã được sửa để giữ đúng lượng thông tin và tránh gợi ý đáp án; đang chờ người duyệt xác nhận lại.

## Giới hạn xác minh hiện tại

Lệnh TypeScript và kiểm kê nội dung đã chạy thành công. Đối chiếu kỹ thuật hiện chưa phát hiện thay đổi các trường được bảo vệ. Quyền mở bản local trong trình duyệt của phiên này bị từ chối, nên thay đổi trình bày chưa được xác nhận bằng quan sát trực tiếp trên màn hình. Không dùng đường trình duyệt khác để đi vòng sự từ chối đó.

Phạm vi 28 bài/560 câu là giáo trình đang có; mục tiêu ban đầu 72 bài/1.440 câu vẫn là phần biên soạn tiếp theo.
