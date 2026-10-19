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

## Những lỗi cần rà trong mỗi lần cập nhật

- Không dịch rời từng từ rồi ghép lại: “Exit mã” phải là “mã thoát”; “Release tập tin mô tả” cần nêu rõ đó là tập tin mô tả bản phát hành và chứa thông tin gì.
- Với câu mô tả quy trình, nêu rõ dịch vụ hoặc thành phần thực hiện từng bước. Thay “đẩy sang đích rồi kiểm tra” bằng tên bên gửi, bên nhận và kết quả cần kiểm tra trong tình huống cụ thể.
- Diễn giải thuật ngữ theo ngữ cảnh. Health của ứng dụng là trạng thái hoạt động; target có thể là tài nguyên đích hoặc bên nhận; không áp dụng một bản dịch máy móc cho mọi trường hợp.
- Với câu hỏi và lời giải, giữ đủ các ràng buộc như phạm vi tài khoản, Region, thời gian phục hồi, mức mất dữ liệu và quyền truy cập. Câu trôi chảy nhưng thiếu một điều kiện có thể làm thay đổi đáp án.
- Trên giao diện, ưu tiên “bản sao lưu”, “bài đã lưu”, “thi thử”, “câu hỏi ôn tập” và “nhóm kiến thức (domain)” thay cho việc trộn các từ thông dụng tiếng Anh vào câu tiếng Việt.
- Sau khi biên tập, đối chiếu câu hỏi và lựa chọn tiếng Anh, đáp án, mã cấu hình, câu lệnh, ID và liên kết ôn tập với phiên bản trước. Kiểm tra cấu trúc không thay thế việc đọc lại câu văn.

## Dịch và đọc duyệt bởi chuyên gia ngôn ngữ

Mọi nội dung tiếng Việt được soạn mới hoặc chỉnh sửa phải đi qua chuyên gia ngôn ngữ tiếng Việt và một người duyệt độc lập, theo skill `vietnamese-editorial` của repository. Trong phiên làm việc của tác nhân, đây là hai vai trò do hai tác nhân khác nhau đảm nhiệm; không diễn đạt thành việc đã thuê hoặc được một chuyên gia là người thật chứng nhận. Người viết tự rà trước khi bàn giao; người duyệt đọc trực tiếp toàn bộ phần được giao và đối chiếu ngữ nghĩa với nội dung gốc.

Chuyên gia cần trau chuốt câu văn như biên tập một cuốn sách hướng dẫn: lựa từ chính xác, nhịp câu vừa phải, các ý nối với nhau tự nhiên. Không đánh đổi điều kiện kỹ thuật lấy câu ngắn hoặc lời văn bóng bẩy. Ví dụ, “khôi phục phiên bản” cần nói rõ đang khôi phục mã ứng dụng hay cả dữ liệu; “quyền cho phép” cần nêu quyền của chủ thể nào, với thao tác và tài nguyên nào nếu đó là điểm quyết định của tình huống.

## Cách làm rõ và bổ sung một đoạn

1. Xác định câu hỏi người học cần trả lời sau đoạn đó. Nếu chưa rõ dịch vụ nào làm gì, bổ sung chủ thể và thao tác cụ thể trước khi thêm thuật ngữ.
2. Kiểm tra mối nối giữa các ý. Khi chuyển từ một trạng thái sang một quyết định, giải thích vì sao dữ kiện đó dẫn tới quyết định và điều kiện nào có thể làm kết luận thay đổi.
3. Dùng một ví dụ ngắn hoặc câu đối chiếu khi cơ chế còn trừu tượng. Ví dụ phải minh họa nội dung đã có, không tự thêm giới hạn, bảo đảm hoặc hành vi AWS chưa được kiểm chứng.
4. Đọc lại cả đoạn để bỏ lặp ý, câu rút gọn và chuỗi danh từ. Không biến mọi đoạn thành một mẫu văn cứng nhắc; giữ diễn tiến phù hợp với bài học.
5. Với lựa chọn sai, nêu nó thực sự giải quyết việc gì và còn thiếu điều kiện nào. Nếu lựa chọn mô tả cơ chế không tồn tại, chỉ rõ điểm sai thay vì gán cho nó một chức năng có vẻ hợp lý.

## Tiêu chí bàn giao

- Đọc toàn bộ nội dung hiển thị trong từng bài, gồm cả sơ đồ, chú thích, tình huống, hướng dẫn thực hành, dọn tài nguyên, câu hỏi dịch và từng lời giải. Không chỉ rà phần thân bài hoặc vài từ khóa dễ nhận thấy.
- Mỗi câu hỏi tiếng Việt phải tương đương câu tiếng Anh về điều kiện, phủ định, ưu tiên tối ưu, phạm vi tài khoản/Region và số đáp án phải chọn. Không thêm gợi ý đáp án vào bản dịch.
- Những từ như “nó”, “đích”, “trạng thái”, “quyền” và “phiên bản” phải có đối tượng tham chiếu rõ trong ngữ cảnh. Không dùng “sức khỏe” một cách máy móc cho mọi trạng thái dịch vụ hoặc tài nguyên.
- Người duyệt độc lập ghi lại phạm vi đã đọc và các góp ý thực tế. Người viết hoặc người điều phối xử lý góp ý trước khi kết luận hoàn tất; số lượng từ hoặc kiểm tra cấu trúc không thay thế bước này.
