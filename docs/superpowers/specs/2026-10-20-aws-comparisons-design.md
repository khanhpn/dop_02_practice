# So sánh AWS — phạm vi ngày 20/10/2026

## Phạm vi mở rộng theo yêu cầu tiếp theo

Yêu cầu tiếp theo bổ sung keyword và tình huống để khoanh vùng phương án khi đọc đề DOP-C02. Áp dụng cho cả tám chuyên đề, đặt cuối từng bài và có nút đi nhanh từ đầu bài. Mỗi dòng gồm dấu hiệu/cụm tiếng Anh, dịch vụ hoặc cách xử lý nên nghĩ tới và điều kiện cần kiểm tra để tránh chọn nhầm. Đây là phần ôn cách suy luận từ dữ kiện, không sao chép câu hỏi thi hoặc khẳng định rằng một keyword luôn quyết định đáp án. Trên mobile, từng dòng xếp dọc để không cần kéo ngang.

Đã bổ sung 92 dòng: bốn chuyên đề giám sát/IAM/Organizations/deploy có 12 dòng mỗi bài; bốn chuyên đề database/sự kiện/EventBridge/networking có 11 dòng mỗi bài. Hai tác nhân viết và đọc duyệt chéo toàn bộ nội dung. `pnpm check` đạt; kiểm kê xác nhận đủ tám ID và mọi dòng có đủ ba trường. Đã kiểm tra trong trình duyệt việc nhấn nút ôn nhanh ở bài Networking và hiển thị phần gợi nhớ. Không thay route/dependency hoặc dữ liệu bài/câu hỏi của lộ trình; không chạy bộ kiểm thử tự động.

Yêu cầu tiếp theo bổ sung một bài **Networking trong AWS**, ID `aws-networking`, thành bài thứ tám trong Chuyên đề AWS. Bài đi từ VPC/CIDR/subnet/route tới Internet Gateway, NAT, Security Group/NACL, kiến trúc ALB–ứng dụng–database, endpoint, kết nối VPC và cách tìm lỗi mạng. Cách viết giữ chuẩn giải thích trực tiếp, ví dụ cụ thể, sơ đồ và bảng ngắn; không có mục nguồn tham khảo trên giao diện.

Đã hoàn tất 12 mục của bài Networking, gồm cả ví dụ JSON rule cho ALB gọi ứng dụng và tình huống CodeBuild trong VPC. Bản viết đã qua tác nhân chuyên tiếng Việt và một lượt đọc độc lập toàn văn. `pnpm check` đạt; kiểm kê xác nhận bài thứ tám đã đăng ký, bảng đủ ô và JSON minh họa hợp lệ. Không thay route, dependency hoặc bộ kiểm kê bài/câu hỏi của lộ trình; không cần chạy lại production build cho lần bổ sung nội dung này.

Người dùng yêu cầu tiếp tục thêm **AWS Organizations**, **Amazon EventBridge** và **các chiến lược deploy**, theo đúng mẫu giải thích trực tiếp đã cung cấp. Khu vực này mở rộng từ bốn bài so sánh thành bảy bài; menu và trang danh sách dùng tên **Chuyên đề AWS**, giữ đường dẫn `/comparisons` và những đường dẫn cũ để không làm mất liên kết đã có.

Ba bài mới dùng ID `aws-organizations`, `eventbridge`, `deployment-strategies`. Bài EventBridge riêng giải thích từ nguồn/bus/rule/target đến ECS STOPPED, CloudTrail/Config, Scheduler, Pipes và lỗi giao/xử lý; bài so sánh EventBridge–SNS–SQS vẫn giữ vai trò đối chiếu ba dịch vụ. Bài deploy phải tách chiến lược chung với khả năng cụ thể của từng nền tảng, giải thích rollback ứng dụng và dữ liệu riêng. Bài Organizations phải phân biệt nhóm tài khoản, quyền truy cập, giới hạn tổ chức và thiết lập dịch vụ tập trung.

Đã viết đủ ba bài mới, đồng thời rà lại bốn bài trước theo mẫu người dùng gửi. Nội dung mới đã qua biên tập tiếng Việt và đọc duyệt độc lập. Khi tự rà kỹ thuật, đã làm rõ CodeDeploy blue/green trên nền tảng EC2/on-premises chỉ hỗ trợ EC2, không hỗ trợ máy on-premises. TypeScript và production build đạt; kiểm kê đọc dữ liệu xác nhận đủ bảy bài, các bảng đủ ô và các ví dụ JSON đúng cú pháp. Đã mở danh sách và bài deploy trong trình duyệt, xác nhận tìm “canary” ra đúng bài. Không chạy lab AWS hoặc bộ kiểm thử tự động.

## Chỉ dẫn mới nhất của người dùng — ưu tiên hơn bố cục ban đầu

Người dùng đã gửi một câu trả lời mẫu về EventBridge làm chuẩn cụ thể: định nghĩa trực tiếp, một câu dễ nhớ, ví dụ gạch đầu dòng, giải thích thành phần, sơ đồ luồng, đoạn JSON kèm ý nghĩa từng trường, bảng so sánh ngắn và các tình huống lựa chọn. Áp dụng nhịp giải thích này cho cả bốn bài, không chỉ thay tên các đoạn thành câu hỏi. Các bảng/sơ đồ/đoạn cấu hình hữu ích được trình bày ngay trong bài; không sao chép rác trích dẫn, biểu tượng nguồn hoặc bảng lỗi từ nội dung dán. Vẫn không có mục tài liệu tham khảo hay ngày đối chiếu trên trang đọc.

Kiểu dữ liệu `reading` cho phép mỗi mục có lời giải thích, câu nhấn mạnh, danh sách, sơ đồ, mã với phần giải thích và bảng khi phù hợp. Không bắt buộc mọi bài có cùng số mục hoặc dùng một khuôn sáu phần. Những quyết định bỏ toàn bộ bảng ở lượt trước được thay bằng hướng dẫn mới này: bỏ sự rườm rà, giữ các ví dụ và hình thức trình bày giúp hiểu rõ.

Người dùng tiếp tục yêu cầu bỏ toàn bộ phần tài liệu tham khảo và cách viết giống bản dịch tài liệu tiếng Anh. Bài phải giải thích như câu trả lời trong chat, bắt đầu từ những câu hỏi cơ bản như “CloudWatch là gì?”, dịch vụ dùng làm gì và ví dụ cụ thể, rồi mới nối sang các dịch vụ còn lại và so sánh.

Bỏ cấu trúc ép mọi bài vào sáu phần chung. Dữ liệu bài chỉ còn một danh sách các mục giải thích liên tiếp (`reading`), không có bảng, quy trình đóng/mở, phần nguồn, ngày đối chiếu hay danh sách bài liên quan trên trang đọc. Menu riêng và bốn đường dẫn bài vẫn giữ. Phần thiết kế ban đầu bên dưới lưu lại quá trình thay đổi, không được dùng để đưa các thành phần đã bỏ trở lại.

Đã áp dụng cho cả bốn bài, đọc duyệt chéo toàn bộ bản viết mới và kiểm tra trang CloudWatch trong trình duyệt. TypeScript và production build đạt sau thay đổi này. Không thêm hoặc chạy bộ kiểm thử tự động.

## Yêu cầu đã chốt

Người dùng muốn bổ sung nội dung đọc sâu, tập trung giải thích cơ chế, điểm khác nhau, điều kiện áp dụng và cách lựa chọn trong tình huống thực tế của AWS DOP-C02.

Giai đoạn đầu **chỉ làm bốn bài so sánh xuyên chuyên đề**:

1. **CloudWatch – CloudTrail – AWS Config**.
2. **SCP – IAM policy**.
3. **Multi-AZ – read replica**.
4. **EventBridge – SNS – SQS**.

**Tách thành một mục menu chính riêng**, không đặt dưới Ghi chú hoặc Bản đồ kiến thức. Tên menu đề xuất: **So sánh AWS**. Tên menu và đường dẫn cụ thể có thể điều chỉnh khi triển khai, nhưng phải giữ lối vào riêng ở menu trái.

Yêu cầu ở lượt này là ghi lại phạm vi trong docs; tài liệu này chưa đồng nghĩa giao diện hoặc bài viết đã được triển khai.

## Tiến độ triển khai giao diện

Theo yêu cầu tiếp theo của người dùng, đã bổ sung menu riêng **So sánh AWS**, trang danh sách tại `/comparisons` và bốn trang đọc tại `/comparisons/:id`. Danh sách có tìm kiếm; mỗi trang đọc có mục lục, liên kết đến từng mục và điều hướng bài trước/sau. Giao diện hỗ trợ màn hình nhỏ và dùng màu theo theme hiện tại.

Sau yêu cầu tiếp theo, đã điền nội dung chuyên sâu cho cả bốn bài: có giải thích cơ chế, bảng so sánh, điều kiện lựa chọn, tình huống thực tế, điểm dễ nhầm và quy trình phân tích theo bước. Có liên kết về bài học liên quan. Bốn bài nằm trong mục So sánh AWS, không cộng vào số bài học hoặc câu hỏi của lộ trình hiện có. Lượt chỉnh tiếp theo chuyển cách diễn đạt sang giọng giải thích tự nhiên như trong chat, theo phản hồi của người dùng bên dưới.

Đã đối chiếu tài liệu AWS ngày 20/10/2026, ghi 35 liên kết nguồn theo từng bài (một số nguồn có thể trùng giữa các bài). Hai tác nhân chuyên tiếng Việt viết theo hai nhóm bài và đọc duyệt chéo toàn bộ phần của nhau; đã xử lý góp ý về RPO, thuật ngữ và phạm vi EventBridge Classic rules/targets. Bài IAM giải thích riêng ngoại lệ theo principal thay vì áp dụng phép giao quyền cho mọi trường hợp; bài database phân biệt Multi-AZ DB instance, Multi-AZ DB cluster và Aurora.

Đã cài đủ dependency từ lockfile, giải quyết lỗi thiếu hai thư viện Markdown của lần kiểm tra trước. `pnpm check`, `pnpm build` và kiểm tra định dạng diff đều đạt. Kiểm kê đọc dữ liệu xác nhận đủ bốn bài, 32 dòng bảng với số ô khớp cột và 12 tình huống. Đã mở trang danh sách và trang Multi-AZ trong trình duyệt, xác nhận nội dung, bảng, mục lục và nguồn được render. Chưa kiểm tra riêng từng kích thước mobile hoặc chạy lab AWS. Không thêm/chạy bộ kiểm thử tự động.

## Mục tiêu nội dung

### Cách viết và trình bày theo phản hồi người dùng

Người dùng muốn bài viết giống câu trả lời trong chat: trả lời thẳng câu hỏi, giải thích bằng lời quen thuộc, đưa ví dụ cụ thể rồi nói khi nào dùng từng phương án. Không viết theo giọng giáo trình với nhiều thuật ngữ, nhiều lớp tiêu đề hoặc khung chia vụn. Yêu cầu này áp dụng cho cả bốn bài.

Giữ độ sâu và các điều kiện kỹ thuật, nhưng đưa phần dễ hiểu lên trước, giải thích ngoại lệ tại đúng chỗ cần dùng. Không dùng giọng xưng hô thô hoặc dựng hội thoại giả. Trang đọc dùng một cột có chiều rộng vừa phải; mục lục, bảng tra nhanh, quy trình tóm tắt và nguồn có thể mở khi cần. Không bắt người học phải đọc bảng mới hiểu phần giải thích.

Đã áp dụng cho cả bốn bài và được đọc duyệt chéo toàn văn. Giữ nguyên ID, URL nguồn, ngày đối chiếu và các ngoại lệ kỹ thuật; đã kiểm tra lại số ô bảng khớp số cột. Bản build đạt. Đã xem trang CloudWatch trong trình duyệt và kiểm tra mở/đóng bảng qua mục lục, kể cả chọn lại đúng mục vừa đóng. Bố cục đọc mới bỏ mục lục bên cạnh và các khung bao quanh từng phần, giới hạn cột chữ ở 820px.

Mỗi bài giúp người học trả lời:

- Mỗi dịch vụ hoặc cơ chế giải quyết vấn đề gì, hoạt động như thế nào?
- Khác nhau ở đâu về dữ liệu đầu vào, kết quả, phạm vi và cách vận hành?
- Trường hợp nào nên chọn từng phương án? Cần những điều kiện gì?
- Khi nào phải kết hợp nhiều dịch vụ thay vì chọn một?
- Những hiểu nhầm nào dẫn đến lựa chọn sai trong thực tế hoặc câu hỏi DOP-C02?

Giải thích kỹ bằng tiếng Việt, giữ tên dịch vụ và thuật ngữ kỹ thuật cần thiết. Không chỉ lập bảng tính năng hoặc đưa mẹo nhận diện từ khóa.

## Phạm vi từng bài

### 1. CloudWatch – CloudTrail – AWS Config

So sánh giám sát hoạt động, theo dõi hành động API và ghi nhận/đánh giá cấu hình tài nguyên. Làm rõ loại thông tin mỗi dịch vụ cung cấp, cách tìm thông tin khi có sự cố và cách phối hợp cả ba trong một tình huống điều tra hoặc tự động khắc phục.

### 2. SCP – IAM policy

Giải thích giới hạn quyền ở cấp tổ chức và chính sách quyền IAM; phân biệt chính sách gắn với danh tính và chính sách gắn với tài nguyên khi cần để tránh hiểu sai. Có ví dụ xét quyền, explicit deny, kế thừa trong Organizations và cross-account. Không mô tả SCP như một cơ chế tự cấp quyền; các ngoại lệ và điều kiện phải đối chiếu tài liệu AWS.

### 3. Multi-AZ – read replica

Tập trung vào Amazon RDS, liên hệ Aurora khi cần. So sánh mục tiêu sẵn sàng cao, mở rộng đọc, cơ chế sao chép, endpoint, failover và promotion. Phân biệt rõ RDS Multi-AZ DB instance deployment với Multi-AZ DB cluster deployment, tránh kết luận chung rằng mọi cấu hình Multi-AZ đều không phục vụ đọc. Không đánh đồng mô hình RDS với Aurora.

### 4. EventBridge – SNS – SQS

So sánh định tuyến sự kiện, pub/sub và hàng đợi; giải thích mô hình gửi/nhận, lọc, lưu giữ, retry, DLQ, thứ tự và xử lý trùng theo từng loại dịch vụ/cấu hình. Có tình huống chọn riêng và kết hợp, đặc biệt SNS → SQS và EventBridge → SQS. Không gán một bảo đảm giao nhận hoặc thứ tự chung cho mọi cấu hình.

## Cách tổ chức dự kiến

- Menu chính **So sánh AWS** dẫn đến trang danh sách bốn bài.
- Mỗi bài có đường dẫn riêng để mở trực tiếp và chia sẻ liên kết.
- Trang đọc có mục lục, giải thích từng phương án, bảng so sánh, sơ đồ luồng khi hữu ích, tình huống lựa chọn và lỗi thường gặp.
- Liên kết về các bài học liên quan trong lộ trình hiện có.
- Mỗi bài ghi nguồn AWS chính thức và ngày đối chiếu thực tế.
- Hỗ trợ desktop/mobile, dùng cấu trúc giao diện React/TypeScript/MUI và HashRouter hiện có.

Đây là hướng tổ chức đề xuất để lập kế hoạch triển khai; chưa chốt cấu trúc dữ liệu, route hoặc thành phần mã nguồn trong tài liệu này.

## Những phần chưa làm trong giai đoạn đầu

Chưa triển khai toàn bộ bộ chuyên đề theo dịch vụ. Danh sách ý tưởng để xem xét sau:

- CloudWatch; CloudTrail; AWS Config; Systems Manager (SSM); AWS Organizations; EventBridge.
- Chiến lược triển khai: all-at-once, rolling, immutable, blue/green, canary, linear; điều kiện, so sánh và rollback.
- RDS/Aurora; mạng AWS với VPC, subnet, route table, NAT, Internet Gateway và các thành phần liên quan.
- IAM; CloudFormation; CI/CD; High Availability/Disaster Recovery; S3.
- Load Balancer/Auto Scaling; SQS/SNS; Lambda/Step Functions; container trên AWS.
- Secrets/KMS; tự động xử lý sự cố và bảo mật.

Không mở rộng sang các phần này trước khi hoàn thiện phạm vi bốn bài so sánh hoặc có yêu cầu mới của người dùng. Không mặc định thêm bộ câu hỏi hoặc lab triển khai AWS trong đợt đầu.

## Xác minh khi triển khai

- Đối chiếu các khẳng định kỹ thuật với tài liệu AWS chính thức tại thời điểm viết.
- Thực hiện quy trình nội dung tiếng Việt theo AGENTS.md, trừ khi người dùng có chỉ dẫn khác cho phạm vi này. Việc miễn biên tập ở trang Ghi chú trước đó chỉ áp dụng cho trang đó.
- Chạy `pnpm check`; chạy `pnpm build` vì thêm menu và route.
- Chỉ chạy `pnpm audit:content` nếu thay đổi có tác động tới cấu trúc hoặc số lượng bài/câu hỏi đang được kiểm kê.
- Không thêm hoặc chạy unit/e2e tests theo quy tắc repository.
- Kiểm tra thủ công menu, mở trực tiếp từng bài, mục lục và bố cục mobile khi có môi trường xem trước.
