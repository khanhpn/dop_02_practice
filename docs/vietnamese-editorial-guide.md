# Quy ước biên tập tiếng Việt cho giáo trình DOP-C02

Người học đã có nền tảng Associate nhưng có thể chưa hiểu chắc cơ chế. Mục tiêu của mỗi đoạn là giúp họ giải thích được một quyết định thiết kế, không chỉ nhận ra từ khóa trong đề thi.

- Giới thiệu khái niệm trước, giải thích tác dụng hoặc nguyên nhân, rồi dùng điều kiện và ví dụ để làm rõ. Mỗi đoạn phát triển một ý; mỗi mục có ít nhất hai đoạn có nội dung riêng.
- Viết câu đủ chủ ngữ và vị ngữ. Nêu rõ dịch vụ, người vận hành hoặc bước xử lý nào thực hiện hành động. Dùng câu nối để thể hiện quan hệ nguyên nhân, thứ tự và điều kiện.
- Lần đầu gặp thuật ngữ, ghi English (nghĩa tiếng Việt), sau đó ưu tiên cách gọi tiếng Việt đã giải thích. Giữ nguyên tên dịch vụ, API, thuộc tính, chế độ và giá trị cấu hình để người học đối chiếu với AWS.
- Dịch theo ý nghĩa kỹ thuật. Ví dụ, execution là lần thực thi hoặc lần chạy; artifact là gói dữ liệu đầu ra; health criteria là tiêu chí xác nhận ứng dụng hoạt động bình thường. Tránh câu ghép nhiều danh từ tiếng Anh khi có thể diễn đạt bằng một hành động rõ ràng.
- Tránh ẩn dụ khó giải thích như “dòng bằng chứng”, “hợp đồng artifact”, “release có trách nhiệm”. Thay bằng thông tin cụ thể: ai tạo gói, gói chứa gì, bước nào nhận và cách xác định phiên bản.
- Lời giải phải giải thích cơ chế và điều kiện của tình huống. Với phương án sai, nêu điều phương án thực sự làm được và vì sao nó chưa đáp ứng yêu cầu. Không dừng ở “Sai: không phù hợp”.
- Giữ nguyên câu hỏi và lựa chọn tiếng Anh, đáp án, ID, quan hệ ôn tập, nguồn tham khảo, mã hạ tầng và câu lệnh. Nếu phát hiện vấn đề kỹ thuật, chuyển riêng cho người rà soát AWS; không tự đổi kiến thức để câu trôi chảy.
- Giữ độ sâu cần thiết để người học hiểu và vận dụng. Ngưỡng từ là kiểm tra tối thiểu cho toàn phần nội dung của bài; không kéo dài câu hoặc lặp ý để đạt số lượng.

## Ví dụ 1: giải thích thao tác thay cho ghép thuật ngữ

Trước: “Promote đúng artifact đã test và giữ danh tính release.”

Sau: “Đưa chính gói đã kiểm thử qua các môi trường và lưu đủ thông tin để xác định nguồn gốc từng bản phát hành.”

## Ví dụ 2: giải thích nguyên nhân trong lời giải

Trước: “Sai: approval không bảo đảm binary mới giống gói đã test.”

Sau: “Sai. Người duyệt có thể cho phép phát hành, nhưng sự phê duyệt không bảo đảm gói build lại có cùng nội dung với gói đã kiểm thử.”
