# Không gian ghi chú — thiết kế ngày 20/10/2026

## Mục tiêu và phạm vi

Người học DOP-C02 cần ghi lại nhiều kiến thức theo cách hiểu của mình, chia theo category, và tìm lại nhanh khi ôn thi. Ghi chú chỉ ở trên máy/trình duyệt của người học; website vẫn là ứng dụng tĩnh chạy local hoặc GitHub Pages, không có tài khoản hay máy chủ đồng bộ. Người học đã chọn IndexedDB để tự lưu và file JSON để xuất/nhập. Ô soạn thảo phải hỗ trợ Markdown với bản xem trước dễ đọc. Không thêm chức năng xuất bản hay chia sẻ ghi chú.

Một khu vực **Ghi chú** riêng xuất hiện trong điều hướng chính. Ghi chú có thể độc lập hoặc liên kết với một bài học. Ô ghi chú cũ ở trang bài học phải được chuyển sang cùng hệ thống mới, không để lại hai nơi lưu khác nhau.

## Lựa chọn lưu trữ

Không mở rộng `StudyState.notes` trong `localStorage`: ứng dụng hiện ghi lại toàn bộ `StudyState` theo mỗi thay đổi và giới hạn bản sao lưu cũ ở 10 MB. Khi ghi chú dài hoặc nhiều, cách này dễ vượt quota và làm chậm giao diện. Dùng một IndexedDB riêng, có `categories` và `notes` object stores; khóa chính là ID ổn định. Ghi chú lưu `id`, `categoryId | null`, `lessonId | null`, `title`, `bodyMarkdown`, `createdAt`, `updatedAt`; category lưu `id`, `name`, `createdAt`, `updatedAt`. Tạo index cho `categoryId`, `lessonId`, `updatedAt`. Nội dung Markdown được lưu dưới dạng văn bản thuần, không lưu HTML đã render.

Mỗi lần chỉnh sửa ghi vào IndexedDB sau khoảng ngừng gõ ngắn; khi rời ô soạn thảo hoặc ẩn tab thì đẩy phần thay đổi đang chờ. UI có trạng thái **Đang lưu… / Đã lưu / Chưa lưu được** dựa vào kết quả transaction, không chỉ dựa vào state React. Nếu trình duyệt chặn IndexedDB hoặc hết quota, giữ bản nháp trong bộ nhớ của phiên, hiện cảnh báo nổi bật và cho xuất nội dung hiện có; không âm thầm báo thành công. Không hứa IndexedDB tồn tại sau khi người dùng xóa dữ liệu trang hoặc dùng chế độ riêng tư.

## Giao diện và thao tác

### Nâng cấp workspace ôn thi — 21/10/2026

Người học yêu cầu nâng chức năng hiện có thành một giao diện chuyên nghiệp, dễ dùng và nhiều tính năng hơn, không sao chép nguyên sản phẩm khác. Cấu trúc giáo trình DOP-C02 là lối vào chính; category vẫn do người học tự tạo. Mỗi ghi chú có thể gắn bài học, gắn nhiều tag, ghim, và đánh dấu **Cần ôn**. Các bộ lọc nhanh gồm Tất cả, Đã ghim, Cần ôn, Chưa phân loại; tìm kiếm phải kết hợp được với category, tag và bài học. Thẻ ghi chú cho thấy tiêu đề, trích đoạn, tag và trạng thái; có sắp xếp theo lần sửa hoặc tiêu đề. Trên đầu workspace có vài con số có ích (tổng ghi chú, cần ôn, gắn bài học), không biến trang thành dashboard dày đặc.

Có các mẫu Markdown một cú nhấp cho **Khái niệm**, **Bẫy đề**, **Lab**, **Lỗi từng gặp**. Mẫu chỉ điền khung câu hỏi/gợi ý, không tự tạo nội dung AWS. Khi ghi chú dài, bản xem trước có mục lục theo heading. Thanh công cụ có phím tắt dễ nhớ, trạng thái lưu rõ và nút xuất JSON luôn tìm được. UI dùng một ngôn ngữ thiết kế nhất quán, khoảng trắng đủ rộng, màu trạng thái vừa phải, khả năng dùng bàn phím và bố cục mobile thật sự một cột.

Định dạng JSON mới thêm tag, ghim và trạng thái cần ôn. Import file phiên bản 1 cũ phải tự điền giá trị mặc định cho ba trường này, không làm mất note. Bản sao lưu tiến độ chung cũng chứa toàn bộ các thuộc tính mới.

Trên desktop, trang dùng ba vùng rõ ràng: category ở trái, danh sách ghi chú ở giữa, trình soạn thảo ở phải. Màn hình nhỏ chuyển thành luồng category → danh sách → ghi chú, có đường quay lại và không làm mất bản nháp. Thanh trên cùng có tìm kiếm theo tiêu đề/nội dung, tạo category, tạo ghi chú và Xuất/Nhập JSON. Danh sách hiển thị tiêu đề, trích đoạn ngắn, bài học liên kết, thời điểm sửa; có lọc category và sắp theo lần sửa gần nhất. Category mặc định **Tất cả ghi chú** là bộ lọc, không phải bản ghi có thể xóa.

Trình soạn thảo Markdown có ô tiêu đề, chọn category, chọn/đi đến bài học liên kết, thanh công cụ tối thiểu (tiêu đề, đậm, danh sách, đoạn mã, liên kết), hai chế độ **Viết / Xem trước** và trên màn rộng có thể xem song song. Phím tắt thông dụng được hỗ trợ nếu không xung đột trình duyệt. Xem trước trình bày tiêu đề, bảng, danh sách và khối mã nhất quán với giao diện đọc bài. Không render HTML thô do người dùng gõ; liên kết được giới hạn giao thức an toàn để tránh script trong Markdown. Ô nhập vẫn là plain text, nên luôn có thể sửa và xuất nội dung gốc.

Tạo/xóa/đổi tên category và ghi chú đều có phản hồi rõ. Xóa ghi chú cần xác nhận; xóa category cần báo số ghi chú bên trong và mặc định chuyển chúng về **Chưa phân loại**, không xóa dây chuyền. Hành động nhập hoặc xóa dữ liệu lớn cần xác nhận và nút xuất bản sao lưu trước.

Ở trang bài học, ô ghi chú cũ được thay bằng lối vào cùng bản ghi liên kết bài đó (có thể tạo nhiều ghi chú cho một bài). Không tạo bản sao âm thầm khi người dùng qua lại giữa bài học và trang Ghi chú.

## Chuyển dữ liệu cũ

Khi lần đầu mở hệ thống mới, đọc `StudyState.notes` cũ và chuyển từng ghi chú không rỗng thành một bản ghi IndexedDB liên kết với `lessonId` tương ứng. Chỉ đánh dấu migration hoàn tất sau khi transaction ghi thành công. Dùng ID xác định từ lesson ID để chạy lại không tạo bản sao. Giữ dữ liệu `StudyState.notes` cũ cho tới khi đã đối chiếu đủ số bản ghi và có bản sao lưu mới; không xóa dữ liệu người dùng ngay trong đợt nâng cấp. Trên giao diện chỉ hiển thị bản IndexedDB khi chuyển thành công, tránh ghi chú trùng.

## Xuất/nhập JSON và sao lưu chung

Nút trên trang Ghi chú xuất file JSON versioned chứa category và ghi chú với mọi ID, liên kết bài, thời gian và nội dung Markdown. File chỉ được tải xuống theo thao tác người dùng; trình duyệt không thể tự ghi đè một file tùy ý trên máy. Nhập file: kiểm tra định dạng, kích thước hợp lý, version, ID duy nhất, category tham chiếu hợp lệ và kiểu dữ liệu; hiển thị bản xem trước gồm số category/ghi chú trước khi xác nhận. Mặc định nhập theo chế độ **thay thế ghi chú** để tránh gộp trùng hoặc ghi đè mơ hồ; trước khi xác nhận có nút xuất dữ liệu hiện tại. Nếu import lỗi, dữ liệu cũ không đổi. Thao tác thay thế category và note nằm trong cùng một transaction IndexedDB.

Trang Cài đặt hiện có bản sao lưu toàn bộ tiến độ. Mở rộng file sao lưu này để chứa cả dữ liệu ghi chú IndexedDB, nhưng vẫn đọc được file v1 cũ và các ghi chú theo bài học trong đó. Khi nhập bản sao lưu toàn bộ, cho xem trước cả tiến độ lẫn số ghi chú. Vì `localStorage` và IndexedDB không thể dùng chung một transaction, quy trình khôi phục phải chụp trạng thái hiện tại, ghi kho ghi chú, rồi thay tiến độ; nếu bước sau thất bại, khôi phục kho ghi chú từ bản chụp và báo rõ lỗi. Không báo “đã nhập” trước khi cả hai nơi lưu xác nhận. Reset toàn bộ dữ liệu phải xóa cả hai kho sau xác nhận; reset thất bại từng phần phải được báo thật, không giả định đã xóa hết.

## Ranh giới kỹ thuật và xác minh

Giữ React/TypeScript/MUI và HashRouter. Ưu tiên một renderer Markdown được duy trì, không bật raw HTML, thay vì tự viết parser. Tránh nhúng ảnh nhị phân vào IndexedDB ở phiên bản này; có thể dùng liên kết ảnh an toàn trong Markdown, nhưng không hỗ trợ upload ảnh. Nội dung chỉ nằm trên origin hiện tại: `localhost` và GitHub Pages là hai kho tách biệt; chuyển giữa chúng bằng JSON.

Xác minh bằng `pnpm check`; chạy `pnpm build` vì có route, thư viện và bundle mới. Không thêm/chạy Vitest hoặc Playwright theo `AGENTS.md`. Kiểm thủ công các luồng tạo/sửa/tải lại/tìm/xóa category/import/export/migration và lỗi quota khi có quyền xem local preview. Nếu browser preview bị từ chối, báo rõ giới hạn; không đi vòng qua bề mặt khác. Chữ tiếng Việt mới qua người biên tập ngôn ngữ và một người duyệt độc lập theo skill của repository.

## Không thuộc thay đổi này

Không đồng bộ đám mây, không truy cập file JSON trực tiếp mỗi lần gõ, không cộng tác nhiều người, không OCR/AI tóm tắt ghi chú. Việc viết lại nội dung Chương 01 là luồng công việc khác và không được coi là đã hoàn tất nhờ tính năng Ghi chú.
