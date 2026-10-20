export const comparisons = [
  {
    id: "cloudwatch-cloudtrail-config", number: "01", group: "Giám sát & quản trị",
    title: "CloudWatch – CloudTrail – AWS Config", services: ["CloudWatch", "CloudTrail", "AWS Config"],
    description: "CloudWatch, CloudTrail và Config là gì? Mỗi cái giúp bạn làm gì và khi nào cần dùng chung?",
    focus: ["Thông tin mỗi dịch vụ ghi nhận", "Cách phối hợp khi điều tra sự cố", "Giám sát và đánh giá tuân thủ"],
    question: "Khi hệ thống có thay đổi bất thường, cần tìm thông tin ở đâu?",
    color: "#925b24",
  },
  {
    id: "scp-iam-policy", number: "02", group: "Quyền truy cập",
    title: "SCP – IAM policy", services: ["SCP", "IAM policy"],
    description: "IAM policy cấp quyền ra sao? SCP giới hạn những gì, và vì sao có quyền admin vẫn bị chặn?",
    focus: ["Cách xét quyền và quy tắc từ chối tường minh (explicit deny)", "Kế thừa chính sách trong Organizations", "Phân tích lỗi AccessDenied"],
    question: "Vì sao một thao tác vẫn bị từ chối dù đã có chính sách cho phép?",
    color: "#6e5aa6",
  },
  {
    id: "multi-az-read-replica", number: "03", group: "Cơ sở dữ liệu",
    title: "Multi-AZ – read replica", services: ["Multi-AZ", "Read replica"],
    description: "Hiểu máy dự phòng, máy đọc dữ liệu và cách chọn khi database cần chịu lỗi hoặc bớt tải.",
    focus: ["Các mô hình Multi-AZ của RDS", "Sao chép, chuyển đổi dự phòng và chuyển bản sao thành cơ sở dữ liệu chính", "Đối chiếu với kiến trúc Aurora"],
    question: "Chọn mô hình nào khi cần giảm gián đoạn hoặc phục vụ thêm truy vấn đọc?",
    color: "#34759a",
  },
  {
    id: "eventbridge-sns-sqs", number: "04", group: "Sự kiện & thông điệp",
    title: "EventBridge – SNS – SQS", services: ["EventBridge", "SNS", "SQS"],
    description: "Hiểu từng dịch vụ qua ví dụ gửi thông báo, xử lý đơn hàng và chia việc cho nhiều hệ thống.",
    focus: ["Mô hình gửi và nhận thông điệp", "Thử lại, hàng đợi thông điệp lỗi (DLQ), thứ tự và xử lý trùng", "Kết hợp nhiều dịch vụ trong một luồng"],
    question: "Khi nào chọn một dịch vụ, khi nào cần kết hợp để xử lý bất đồng bộ?",
    color: "#327b64",
  },
] as const;
