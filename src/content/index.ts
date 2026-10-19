import type { Chapter, Domain, Lesson } from "./types";
export const SNAPSHOT_DATE = "19/10/2026";
export const EXAM_GUIDE =
  "https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html";
export const domains: Domain[] = [
  {
    id: 1,
    title: "SDLC Automation",
    shortLabel: "Tự động hóa phát hành",
    subtitle: "Tự động hoá vòng đời phần mềm",
    weight: 22,
    color: "#be7335",
    description:
      "Xây dựng quy trình tự động từ lúc thay đổi mã nguồn đến khi kiểm thử, đóng gói và triển khai ứng dụng cho người dùng.",
  },
  {
    id: 2,
    title: "Configuration Management & IaC",
    shortLabel: "Cấu hình và IaC",
    subtitle: "Quản lý cấu hình và hạ tầng bằng mã",
    weight: 17,
    color: "#426bb8",
    description:
      "Mô tả hạ tầng bằng mã để triển khai nhất quán, quản lý nhiều tài khoản AWS và tự động hoá cấu hình trên quy mô lớn.",
  },
  {
    id: 3,
    title: "Resilient Cloud Solutions",
    shortLabel: "Khả năng phục hồi",
    subtitle: "Giải pháp đám mây có khả năng phục hồi",
    weight: 15,
    color: "#43856a",
    description:
      "Duy trì hoạt động khi thành phần gặp lỗi, mở rộng theo nhu cầu và phục hồi trong thời gian cho phép, với mức mất dữ liệu mà doanh nghiệp chấp nhận.",
  },
  {
    id: 4,
    title: "Monitoring & Logging",
    shortLabel: "Giám sát và nhật ký",
    subtitle: "Giám sát & ghi nhật ký",
    weight: 15,
    color: "#8b6bb3",
    description:
      "Thu thập chỉ số, nhật ký và dấu vết xử lý yêu cầu để hiểu trạng thái hoạt động của hệ thống, phát hiện vấn đề và tìm nguyên nhân.",
  },
  {
    id: 5,
    title: "Incident & Event Response",
    shortLabel: "Ứng phó sự cố",
    subtitle: "Ứng phó sự cố và xử lý sự kiện",
    weight: 14,
    color: "#bc6658",
    description:
      "Tiếp nhận sự kiện, tự động thực hiện biện pháp khắc phục và điều tra nguyên nhân sự cố để khôi phục hoạt động của hệ thống.",
  },
  {
    id: 6,
    title: "Security & Compliance",
    shortLabel: "Bảo mật và tuân thủ",
    subtitle: "Bảo mật & tuân thủ",
    weight: 17,
    color: "#29888d",
    description:
      "Chỉ cấp những quyền cần thiết, bảo vệ dữ liệu và tự động kiểm tra việc tuân thủ trên nhiều tài khoản AWS.",
  },
];
export const chapters: Chapter[] = [
  {
    id: "1.1",
    domainId: 1,
    title: "Thiết kế và vận hành quy trình CI/CD",
    examTask: "Implement CI/CD pipelines.",
  },
  {
    id: "1.2",
    domainId: 1,
    title: "Tích hợp kiểm thử tự động",
    examTask: "Integrate automated testing into CI/CD pipelines.",
  },
  {
    id: "1.3",
    domainId: 1,
    title: "Xây dựng và quản lý gói triển khai",
    examTask: "Build and manage artifacts.",
  },
  {
    id: "1.4",
    domainId: 1,
    title: "Chiến lược triển khai ứng dụng",
    examTask:
      "Implement deployment strategies for instance, container, and serverless environments.",
  },
  {
    id: "2.1",
    domainId: 2,
    title: "Khai báo hạ tầng và xây dựng thành phần tái sử dụng",
    examTask:
      "Define cloud infrastructure and reusable components to provision and manage systems throughout their lifecycle.",
  },
  {
    id: "2.2",
    domainId: 2,
    title: "Tự động hoá quản trị nhiều tài khoản",
    examTask:
      "Deploy automation to create, onboard, and secure AWS accounts in a multi-account or multi-Region environment.",
  },
  {
    id: "2.3",
    domainId: 2,
    title: "Tự động hoá tác vụ trên quy mô lớn",
    examTask:
      "Design and build automated solutions for complex tasks and large-scale environments.",
  },
  {
    id: "3.1",
    domainId: 3,
    title: "Thiết kế hệ thống có tính sẵn sàng cao",
    examTask:
      "Implement highly available solutions to meet resilience and business requirements.",
  },
  {
    id: "3.2",
    domainId: 3,
    title: "Thiết kế hệ thống có khả năng mở rộng",
    examTask:
      "Implement solutions that are scalable to meet business requirements.",
  },
  {
    id: "3.3",
    domainId: 3,
    title: "Tự động phục hồi theo RTO/RPO",
    examTask:
      "Implement automated recovery processes to meet RTO and RPO requirements.",
  },
  {
    id: "4.1",
    domainId: 4,
    title: "Thu thập và lưu trữ nhật ký, số liệu",
    examTask:
      "Configure the collection, aggregation, and storage of logs and metrics.",
  },
  {
    id: "4.2",
    domainId: 4,
    title: "Phân tích nhật ký và số liệu để phát hiện lỗi",
    examTask: "Audit, monitor, and analyze logs and metrics to detect issues.",
  },
  {
    id: "4.3",
    domainId: 4,
    title: "Tự động hoá giám sát và xử lý sự kiện",
    examTask:
      "Automate monitoring and event management of complex environments.",
  },
  {
    id: "5.1",
    domainId: 5,
    title: "Tiếp nhận, xử lý và thực hiện hành động theo sự kiện",
    examTask:
      "Manage event sources to process, notify, and take action in response to events.",
  },
  {
    id: "5.2",
    domainId: 5,
    title: "Thay đổi cấu hình để khắc phục sự cố",
    examTask: "Implement configuration changes in response to events.",
  },
  {
    id: "5.3",
    domainId: 5,
    title: "Chẩn đoán và xử lý lỗi hệ thống, ứng dụng",
    examTask: "Troubleshoot system and application failures.",
  },
  {
    id: "6.1",
    domainId: 6,
    title: "Quản lý danh tính và quyền truy cập",
    examTask:
      "Implement techniques for identity and access management at scale.",
  },
  {
    id: "6.2",
    domainId: 6,
    title: "Tự động hoá bảo mật và bảo vệ dữ liệu",
    examTask: "Apply automation for security controls and data protection.",
  },
  {
    id: "6.3",
    domainId: 6,
    title: "Giám sát và kiểm toán bảo mật",
    examTask: "Implement security monitoring and auditing solutions.",
  },
];
const modules = import.meta.glob("./domain[1-6].ts", { eager: true });
export const lessons: Lesson[] = Object.values(modules)
  .flatMap((mod) =>
    Object.values(mod as Record<string, unknown>).flatMap((value) =>
      Array.isArray(value) ? (value as Lesson[]) : [],
    ),
  )
  .sort((a, b) => a.number - b.number);
export const questions = lessons.flatMap((l) => l.questions);
export const lessonById = new Map(lessons.map((l) => [l.id, l]));
export const questionById = new Map(questions.map((q) => [q.id, q]));
export const lessonPath = (id: string, section?: string) =>
  `/lesson/${id}${section ? `?section=${encodeURIComponent(section)}` : ""}`;
