export const comparisonSections = [
  { id: "overview", title: "Khác nhau thế nào?" },
  { id: "conditions", title: "Khi nào dùng cái nào?" },
  { id: "scenarios", title: "Thử với vài ví dụ" },
  { id: "pitfalls", title: "Những chỗ dễ nhầm" },
  { id: "comparison", title: "Bảng so sánh nhanh" },
  { id: "sources", title: "Đọc thêm" },
] as const;

export const comparisons = [
  {
    id: "cloudwatch-cloudtrail-config", number: "01", group: "Giám sát & quản trị",
    title: "CloudWatch – CloudTrail – AWS Config", services: ["CloudWatch", "CloudTrail", "AWS Config"],
    description: "So sánh cách theo dõi hoạt động, tra cứu thao tác và kiểm tra cấu hình tài nguyên.",
    focus: ["Thông tin mỗi dịch vụ ghi nhận", "Cách phối hợp khi điều tra sự cố", "Giám sát và đánh giá tuân thủ"],
    question: "Khi hệ thống có thay đổi bất thường, cần tìm thông tin ở đâu?",
    color: "#925b24", relatedLessonIds: ["d4-l01", "d4-l05", "d5-l05", "d6-l09"],
  },
  {
    id: "scp-iam-policy", number: "02", group: "Quyền truy cập",
    title: "SCP – IAM policy", services: ["SCP", "IAM policy"],
    description: "Phân biệt giới hạn quyền trong tổ chức với các chính sách quyền IAM.",
    focus: ["Cách xét quyền và quy tắc từ chối tường minh (explicit deny)", "Kế thừa chính sách trong Organizations", "Phân tích lỗi AccessDenied"],
    question: "Vì sao một thao tác vẫn bị từ chối dù đã có chính sách cho phép?",
    color: "#6e5aa6", relatedLessonIds: ["d6-l01", "d2-l07", "d1-l04"],
  },
  {
    id: "multi-az-read-replica", number: "03", group: "Cơ sở dữ liệu",
    title: "Multi-AZ – read replica", services: ["Multi-AZ", "Read replica"],
    description: "So sánh các mô hình triển khai RDS theo nhu cầu sẵn sàng cao và mở rộng đọc.",
    focus: ["Các mô hình Multi-AZ của RDS", "Sao chép, chuyển đổi dự phòng và chuyển bản sao thành cơ sở dữ liệu chính", "Đối chiếu với kiến trúc Aurora"],
    question: "Chọn mô hình nào khi cần giảm gián đoạn hoặc phục vụ thêm truy vấn đọc?",
    color: "#34759a", relatedLessonIds: ["d3-l01", "d3-l09"],
  },
  {
    id: "eventbridge-sns-sqs", number: "04", group: "Sự kiện & thông điệp",
    title: "EventBridge – SNS – SQS", services: ["EventBridge", "SNS", "SQS"],
    description: "So sánh định tuyến sự kiện, phân phối thông báo và xử lý qua hàng đợi.",
    focus: ["Mô hình gửi và nhận thông điệp", "Thử lại, hàng đợi thông điệp lỗi (DLQ), thứ tự và xử lý trùng", "Kết hợp nhiều dịch vụ trong một luồng"],
    question: "Khi nào chọn một dịch vụ, khi nào cần kết hợp để xử lý bất đồng bộ?",
    color: "#327b64", relatedLessonIds: ["d4-l09", "d5-l01"],
  },
] as const;
