import type { Lesson } from "../types";
import { questions } from "../domain1/shared";

const id = "d5-l01";
export const lesson: Lesson = {
  id,
  number: 52,
  domainId: 5,
  chapterId: "5.1",
  title: "EventBridge: chọn đúng sự kiện và xử lý lỗi ở từng bước",
  summary:
    "Chọn đúng nguồn sự kiện, lọc đúng tình huống cần xử lý và gửi đến các bên nhận độc lập. Hiểu cách thử lại, giữ sự kiện lỗi và tránh thực hiện cùng một hành động nhiều lần.",
  duration: 105,
  objectives: [
    "Phân biệt số liệu và cảnh báo với sự kiện dịch vụ, sự kiện API trong CloudTrail.",
    "Viết và kiểm chứng mẫu lọc, đồng thời cấp đúng quyền để gửi sự kiện đến đích.",
    "Phân biệt lỗi khi giao sự kiện với lỗi xử lý sau khi đích đã nhận.",
  ],
  prerequisites: [
    "Biết JSON, chính sách gắn với tài nguyên IAM, SQS/SNS và Lambda.",
    "Hiểu cảnh báo CloudWatch và CloudTrail ở mức Associate.",
  ],
  sections: [
    {
      id: `${id}-sources`,
      title: "1. Chọn tín hiệu phù hợp câu hỏi vận hành",
      paragraphs: [
        "Event (sự kiện) mô tả điều vừa xảy ra, chẳng hạn EC2 chuyển sang stopped hoặc một API thay đổi cấu hình được gọi. Metric (chỉ số) là số đo theo thời gian; alarm (cảnh báo) đánh giá số đo theo điều kiện và chuyển trạng thái khi cần. Nếu muốn biết máy đã dừng, sự kiện thay đổi trạng thái trực tiếp từ EC2 thường rõ hơn việc suy đoán qua CPU thấp. Nếu muốn biết ai gọi StopInstances và gọi từ đâu, cần ngữ cảnh danh tính, yêu cầu trong sự kiện API của CloudTrail. AWS Health lại cung cấp thông tin bảo trì hoặc vấn đề của dịch vụ AWS và tác động liên quan tùy loại sự kiện. Hãy bắt đầu bằng câu hỏi vận hành cần trả lời, rồi chọn nguồn mang đúng thông tin.",
        "Các API AWS không có cùng cách ghi nhận, phân phối hoặc độ trễ sự kiện. Trước khi viết mẫu lọc theo eventName, cần xác nhận dịch vụ có phát thông tin đó và đã cấu hình CloudTrail hay data event theo yêu cầu chưa. Với thông báo riêng cho tài khoản, đọc tài nguyên bị ảnh hưởng và thời điểm xảy ra để xác định tác động thực tế. Một thông báo sức khỏe dịch vụ công cộng chưa chứng minh mọi yêu cầu của ứng dụng đều thất bại. Vì vậy, hệ thống ứng cứu nên kết hợp sự kiện dịch vụ với chỉ số người dùng. Giữ thời gian, tài khoản, Region và mã tài nguyên giúp tránh xử lý nhầm đích hoặc coi một sự kiện đến muộn là trạng thái hiện tại.",
      ],
    },
    {
      id: `${id}-patterns`,
      title: "2. Event bus, quy tắc và mẫu lọc có thể kiểm chứng",
      paragraphs: [
        "Event bus (bus sự kiện) tiếp nhận sự kiện; rule (quy tắc định tuyến) dùng event pattern (mẫu lọc sự kiện) để chọn những sự kiện cần gửi đến target (đích nhận). Mẫu lọc là JSON phản ánh cấu trúc sự kiện, thường gồm source, detail-type và các thuộc tính trong detail. Nó không phải truy vấn tìm một chuỗi bất kỳ trong nhật ký. Quy tắc chỉ lọc source là aws.ec2 sẽ rộng hơn quy tắc chỉ lấy sự kiện đổi trạng thái sang stopped. Phạm vi quá rộng làm tăng thông báo, số lần gọi và nguy cơ tự động tác động nhầm tài nguyên. Hãy thử cả mẫu cần nhận lẫn mẫu gần giống nhưng phải loại; một ví dụ khớp chưa chứng minh bộ lọc đã đủ chính xác.",
        "Cần phòng feedback loop (vòng lặp phản hồi): sự kiện đổi cấu hình gọi Lambda để sửa, rồi chính thao tác sửa lại sinh sự kiện khớp quy tắc ban đầu. Thu hẹp mẫu lọc và yêu cầu bộ xử lý đọc trạng thái hiện tại, chỉ thay đổi khi còn cần. Event ID giúp truy vết, nhưng khóa chống xử lý lặp nên phản ánh thao tác, tài nguyên và phiên bản phù hợp nghiệp vụ. Việc nhận sự kiện và sửa tài nguyên không diễn ra trong cùng một giao dịch nguyên tử; tài nguyên có thể đã đổi trong lúc sự kiện đang được chuyển đi. Vì vậy, trước hành động như dừng máy, cô lập tài nguyên hoặc đổi chính sách, phải kiểm tra điều kiện hiện tại, đặc biệt khi nhận sự kiện cũ hoặc được phát lại.",
      ],
    },
    {
      id: `${id}-topology`,
      title: "3. Fan-out, hàng đợi, stream và quy trình",
      paragraphs: [
        "Fan-out (gửi bản sao của một sự kiện đến nhiều bên xử lý) phù hợp khi thông báo, ghi kiểm toán và khắc phục cần hoạt động độc lập. Có thể phân phối bằng SNS hoặc nhiều đích, nhiều quy tắc EventBridge. Đặt SQS trước bộ xử lý giúp đệm khi sự kiện đến dồn hoặc bên nhận xử lý chậm. Lưu ý, nhiều worker (tiến trình xử lý) đọc chung một hàng đợi thường chia nhau công việc; mỗi hệ thống không tự nhận một bản sao đầy đủ. Nếu hai nhóm đều phải xử lý mọi sự kiện, cấp hàng đợi riêng rồi phân phối vào cả hai. Cách này còn tách thời hạn lưu, việc thử lại và tốc độ tiêu thụ để một bên bị lỗi không cản bên khác.",
        "Kinesis phù hợp với luồng dữ liệu cần thứ tự theo partition và nhiều bên đọc giữ vị trí riêng, nhưng cũng đòi hỏi quản lý thông lượng, thời hạn lưu và checkpoint. Step Functions mô tả quy trình nhiều bước có trạng thái, nhánh rẽ, thời gian chờ và cách xử lý lỗi; Lambda phù hợp với từng bước xử lý ngắn. Nếu cần chờ phê duyệt hoặc đợi tài nguyên sẵn sàng, hãy dùng cơ chế chờ của quy trình thay vì giữ Lambda chạy sleep lâu. Chọn cấu trúc theo yêu cầu, không cần ghép mọi dịch vụ vào cùng một thiết kế. Dù dùng hàng đợi hay quy trình, hãy theo dõi tuổi công việc, lượng tồn đọng, tỷ lệ lỗi và số sự kiện đã xử lý để phát hiện sự cố ngay trong hệ thống ứng cứu.",
      ],
    },
    {
      id: `${id}-delivery`,
      title: "4. Retry, DLQ và ranh giới lỗi",
      paragraphs: [
        "Retry policy (chính sách thử lại) của EventBridge áp dụng khi giao sự kiện đến đích gặp lỗi có thể thử lại. Dịch vụ giãn khoảng thử và thêm độ lệch ngẫu nhiên trong giới hạn cấu hình. Nếu hết giới hạn mà không có DLQ (hàng đợi giữ sự kiện giao thất bại), sự kiện có thể không còn được giữ trong quá trình này. Một số lỗi không sửa được bằng chờ, chẳng hạn thiếu quyền, có thể được đưa thẳng vào DLQ đã cấu hình. EventBridge target DLQ phải là SQS Standard ở cùng Region với quy tắc; SQS FIFO không được hỗ trợ cho vai trò này. Chính sách của hàng đợi phải cho EventBridge gọi SendMessage từ đúng quy tắc, và đường đưa vào DLQ cũng cần được giám sát.",
        "Giao thành công và xử lý nghiệp vụ thành công là hai mốc khác nhau. Khi Lambda nhận lời gọi bất đồng bộ rồi hàm mới thất bại, EventBridge đã hoàn thành việc giao; phần thử lại và nơi lưu lỗi thuộc cơ chế Lambda được cấu hình tương ứng. Nếu đích là SQS, EventBridge thành công khi đưa được thông điệp vào hàng đợi, còn lỗi ở worker cần cơ chế redrive và quan sát của hàng đợi. Theo dõi FailedInvocations, InvocationsSentToDLQ và InvocationsFailedToBeSentToDLQ để biết sự kiện có bị lỗi và có được giữ lại hay không. Trước khi gửi lại sau sửa lỗi, kiểm tra trạng thái và khả năng xử lý lặp an toàn: một phần hành động có thể đã hoàn tất ở lần đầu.",
      ],
    },
    {
      id: `${id}-boundaries`,
      title: "5. Xuyên tài khoản, audit và replay an toàn",
      paragraphs: [
        "Một tài khoản vận hành trung tâm có thể nhận sự kiện từ nhiều tài khoản qua resource policy của bus và quy tắc, role bên gửi được cấp PutEvents phù hợp. Phía nhận vẫn phải có quy tắc lọc đúng tài khoản, nguồn và quyền gọi đích xử lý; cho phép gửi vào bus chưa tự tạo hành động khắc phục. Với đích bus liên tài khoản mới, thiết kế role IAM ở bên gửi theo yêu cầu hiện hành và giới hạn tài khoản hoặc tổ chức được phép. Với custom event, không dùng riêng chuỗi source làm bằng chứng xác thực. Publisher có quyền có thể gửi dữ liệu theo schema, còn mức tin cậy phải dựa vào principal, chính sách và những thông tin đáng tin trong phần bao sự kiện.",
        "Archive và replay lưu rồi phát lại sự kiện để phục hồi hoặc kiểm tra bên nhận, nhưng không bảo đảm mọi hành động được chạy lại an toàn. Sự kiện cũ có thể nói về tài nguyên đã đổi hoặc đã bị xóa; tác động của lần xử lý trước cũng có thể đã xảy ra. Trước khi phát lại, chọn khoảng thời gian, bên nhận, tiêu chí chống trùng và cách quan sát; dùng môi trường thử nếu phù hợp. Với DLQ, đọc thông tin lỗi để sửa quyền hoặc đích trước khi redrive, và chỉ xóa thông điệp khi đã xác nhận xử lý theo thiết kế. Sau sự cố, cần đối chiếu số sự kiện cùng kết quả nghiệp vụ. Hàng đợi trống chưa chứng minh mọi việc hoàn tất nếu thông điệp chỉ vừa bị xóa hàng loạt.",
      ],
    },
  ],
  diagram: {
    title: "Đường sự kiện và đường lỗi tách biệt",
    steps: [
      {
        label: "Sự kiện dịch vụ hoặc API",
        detail: "Xác định tài khoản, Region, tài nguyên và điều vừa xảy ra.",
      },
      {
        label: "Mẫu lọc EventBridge",
        detail: "Chọn đúng nguồn, loại sự kiện và trạng thái cần phản ứng.",
      },
      {
        label: "Giao sự kiện đến đích",
        detail:
          "Thử lại theo loại lỗi; dùng DLQ để giữ sự kiện không giao được.",
      },
      {
        label: "Hàng đợi và bộ xử lý",
        detail:
          "Đệm công việc, điều phối các bước và tránh lặp lại tác động đã thực hiện.",
      },
      {
        label: "Kiểm chứng kết quả",
        detail:
          "Đối chiếu kết quả nghiệp vụ, công việc tồn đọng và lỗi ở từng lớp.",
      },
    ],
    caption:
      "Thu sự kiện → Lọc → Giao đến đích → Xử lý → Kiểm chứng. DLQ của EventBridge giữ lỗi giao đến đích; lỗi xử lý sau đó cần cơ chế riêng.",
  },
  scenarios: [
    {
      title: "Một sự kiện cần được ba nhóm xử lý",
      context:
        "Khi EC2 dừng, hệ thống phải ghi nhật ký kiểm toán, báo cho người trực và mở quy trình điều tra. Nhóm ghi nhật ký đôi khi xử lý chậm.",
      solution:
        "Gửi bản sao sự kiện đến các bên nhận riêng. Nhóm kiểm toán có hàng đợi, thời hạn lưu và bộ xử lý riêng, nên việc điều tra không phải đợi ghi nhật ký hoàn tất.",
      tradeoff:
        "Phải quản lý thêm hàng đợi và giám sát từng đường xử lý, nhưng lỗi hay công việc tồn đọng ở một nhóm không làm các nhóm khác ngừng theo.",
    },
    {
      title: "Lambda nhận được sự kiện nhưng xử lý thất bại",
      context:
        "Quy tắc không báo lỗi giao sự kiện, nhưng hàm Lambda gửi thông báo phát sinh ngoại lệ. DLQ của EventBridge vẫn rỗng.",
      solution:
        "Kiểm tra số liệu gọi bất đồng bộ của Lambda và nơi nhận lỗi hoặc DLQ đã cấu hình cho Lambda. Sửa hàm, rồi gửi lại có kiểm soát để tránh gửi trùng thông báo đã thành công ở lần trước.",
      tradeoff:
        "Cần giám sát riêng việc giao và việc xử lý, nhưng sẽ xác định đúng nguyên nhân thay vì sửa quyền EventBridge vốn đang hoạt động.",
    },
  ],
  keyTakeaways: [
    "Sự kiện, số liệu, cảnh báo, CloudTrail và AWS Health trả lời những câu hỏi khác nhau.",
    "Thử mẫu lọc với cả sự kiện phải nhận lẫn sự kiện gần giống nhưng phải loại.",
    "Các bộ xử lý chung hàng đợi chia nhau công việc; muốn mỗi nhóm nhận đủ sự kiện thì cần gửi bản sao đến từng nhóm.",
    "DLQ giữ lỗi giao sự kiện không thay thế cơ chế xử lý lỗi của hàm hoặc tiến trình nhận.",
  ],
  examTraps: [
    "Đưa thông điệp vào hàng đợi thành công chưa chứng minh công việc nghiệp vụ đã hoàn tất.",
    "DLQ của đích EventBridge dùng SQS Standard, không dùng hàng đợi FIFO.",
    "Tăng số lần thử lại không tự cấp quyền còn thiếu.",
    "Phát lại sự kiện có thể lặp tác động hoặc dựa vào trạng thái đã cũ; phải kiểm tra trước khi thực hiện.",
  ],
  code: {
    title: "Quy tắc đưa sự kiện EC2 dừng vào hàng đợi điều tra",
    deployable: false,
    cloudformation: `Resources:
  InvestigationQueue:
    Type: AWS::SQS::Queue
    Properties: {SqsManagedSseEnabled: true}
  StoppedRule:
    Type: AWS::Events::Rule
    Properties:
      EventPattern:
        source: [aws.ec2]
        detail-type: [EC2 Instance State-change Notification]
        detail: {state: [stopped]}
      Targets:
        - Id: Investigation
          Arn: !GetAtt InvestigationQueue.Arn
  QueuePolicy:
    Type: AWS::SQS::QueuePolicy
    Properties:
      Queues: [!Ref InvestigationQueue]
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal: {Service: events.amazonaws.com}
            Action: sqs:SendMessage
            Resource: !GetAtt InvestigationQueue.Arn
            Condition:
              ArnEquals: {aws:SourceArn: !GetAtt StoppedRule.Arn}
# Add target DLQ, queue redrive, consumer and alarms before operational use.`,
    terraform: `resource "aws_cloudwatch_event_rule" "stopped" {
  name = "study-ec2-stopped"
  event_pattern = jsonencode({
    source = ["aws.ec2"]
    "detail-type" = ["EC2 Instance State-change Notification"]
    detail = { state = ["stopped"] }
  })
}
resource "aws_cloudwatch_event_target" "queue" {
  rule = aws_cloudwatch_event_rule.stopped.name
  arn  = aws_sqs_queue.investigation.arn
}
# Define aws_sqs_queue, scoped queue policy, target DLQ and consumer.`,
    explanation:
      "Đây là đoạn minh hoạ, chưa có đầy đủ bộ xử lý, DLQ, chính sách chuyển thông điệp lỗi và cảnh báo. QueuePolicy chỉ cho EventBridge gửi từ đúng ARN của quy tắc, thay vì cho mọi danh tính gửi. Bản Terraform cần bổ sung hàng đợi và chính sách tương ứng. Bài thực hành bên dưới dùng sự kiện tự tạo và bus riêng, không yêu cầu dừng EC2 thật hoặc thay đổi nguồn của môi trường chính thức.",
  },
  lab: {
    title: "Dùng sự kiện tự tạo để thử bộ lọc, hàng đợi và lỗi giao sự kiện",
    duration: 70,
    prerequisites: [
      "Có tài khoản thử nghiệm với quyền tạo bus riêng, quy tắc và các hàng đợi SQS Standard.",
      "Chuẩn bị tập tin JSON chứa sự kiện giả, không đưa dữ liệu nhạy cảm vào mẫu.",
      "Không dừng máy thật để tạo sự kiện và không kết nối quy trình có quyền sửa môi trường chính thức.",
    ],
    cost: "Sự kiện tự tạo EventBridge, yêu cầu SQS và dữ liệu giám sát có thể tính phí. Bài chỉ gửi vài sự kiện nhỏ, không tạo EC2 hoặc bộ xử lý chạy liên tục.",
    steps: [
      {
        title: "Tách tài nguyên thử nghiệm",
        detail:
          "Tạo bus riêng tên study-incidents, hàng đợi đích và DLQ riêng. Ghi lại tài khoản, Region và ARN trước khi thêm quy tắc; xác nhận không đích nào gọi quy trình của môi trường chính thức.",
        expected:
          "Mọi tài nguyên nằm trong phạm vi thử nghiệm và không có đường tự động thay đổi hệ thống thật.",
      },
      {
        title: "Viết bộ lọc và hai sự kiện đối chiếu",
        detail:
          "Dùng source là study.incident, detail-type là DemoIncident và trường severity trong detail có giá trị high. Chuẩn bị một sự kiện high cần được nhận và một sự kiện low cần bị loại.",
        expected:
          "Mẫu lọc dùng đúng cấu trúc JSON, bao gồm vị trí lồng của trường severity trong detail.",
      },
      {
        title: "Thử bộ lọc trước khi gửi đến đích",
        detail:
          "Dùng EventBridge Sandbox hoặc test-event-pattern để kiểm tra từng sự kiện mẫu. Ở bước này chỉ kiểm tra điều kiện khớp, chưa cần bật quy tắc để thực hiện hành động.",
        command:
          "aws events test-event-pattern --event-pattern file://pattern.json --event file://sample-event.json",
        expected:
          "Sự kiện high khớp và low không khớp; chưa có sự kiện được chuyển tới hàng đợi đích.",
      },
      {
        title: "Cấu hình đường giao sự kiện",
        detail:
          "Thêm hàng đợi đích và chính sách chỉ cho phép đúng ARN quy tắc gửi. Cấu hình DLQ Standard cùng Region, kèm quyền nhận từ EventBridge. Rà lại cấu hình rồi dùng PutEvents gửi các sự kiện tự tạo.",
        expected:
          "Chỉ sự kiện high được đưa vào hàng đợi; sự kiện low không kích hoạt đích.",
      },
      {
        title: "Thử lỗi thiếu quyền trong phạm vi bài học",
        detail:
          "Tạm thu hồi quyền SendMessage của quy tắc trên đúng hàng đợi thử nghiệm. Gửi một sự kiện high và kiểm tra thông điệp trong DLQ cùng thông tin lỗi. Khôi phục chính sách trước khi gửi lại.",
        expected:
          "Nhận diện được NO_PERMISSIONS hoặc thông tin chẩn đoán tương ứng, và phân biệt lỗi giao này với lỗi bộ xử lý sau khi hàng đợi đã nhận.",
      },
      {
        title: "Gửi lại có kiểm soát và xác nhận kết quả",
        detail:
          "Đọc sự kiện lỗi, ghi mã sự kiện hoặc khoá nghiệp vụ và kiểm tra trạng thái hiện tại. Khi đã sửa đích, chỉ gửi lại một lần, xác nhận hàng đợi nhận đúng thông điệp rồi xử lý thông điệp thử nghiệm.",
        expected:
          "Ghi được nguyên nhân lỗi, thay đổi đã sửa và kết quả gửi lại. Không dùng thao tác xoá sạch DLQ để thay cho việc chứng minh đã xử lý thành công.",
      },
    ],
    cleanup: [
      "Gỡ đích và xoá quy tắc thử nghiệm, sau đó xoá bus study-incidents.",
      "Xác nhận đúng ARN trước khi xoá hàng đợi và DLQ riêng của bài; giữ thông tin lỗi cần dùng cho việc học.",
      "Xoá nhóm nhật ký, cảnh báo và tập tin giả không còn cần. Không dừng hoặc sửa EC2 thật.",
    ],
    challenge:
      "Vẽ hai trường hợp: EventBridge gọi Lambda bất đồng bộ trực tiếp, và EventBridge đưa vào SQS rồi Lambda đọc hàng đợi. Với mỗi trường hợp, chỉ rõ cơ chế thử lại và nơi giữ lỗi khi giao thành công nhưng hàm xử lý thất bại.",
  },
  sources: [
    {
      title: "Domain 5 event source requirements",
      url: "https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02-domain5.html",
    },
    {
      title: "EventBridge event patterns",
      url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html",
    },
    {
      title: "EventBridge target retry policy",
      url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html",
    },
    {
      title: "EventBridge DLQ types and failure metadata",
      url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html",
    },
    {
      title: "Cross-account event buses",
      url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cross-account.html",
    },
  ],
  reviewedAt: "2026-10-19",
  questions: questions(
    id,
    "5.1",
    [
      {
        section: "sources",
        en: "Operations needs to know who called StopInstances, including the calling identity and request context. Which source is most directly relevant?",
        vi: "Nhóm vận hành cần biết ai đã gọi StopInstances, gồm danh tính và thông tin của yêu cầu. Nguồn nào phù hợp trực tiếp nhất?",
        options: [
          [
            "Only EC2 CPUUtilization metrics",
            "Chỉ số liệu EC2 CPUUtilization.",
            "Sai. CPU phản ánh mức sử dụng tài nguyên, không chứa danh tính gọi StopInstances hoặc nội dung yêu cầu.",
          ],
          [
            "CloudTrail API activity for the operation",
            "Hoạt động API tương ứng trong CloudTrail.",
            "Đúng. Sự kiện CloudTrail chứa thông tin danh tính, thao tác và ngữ cảnh yêu cầu để điều tra.",
          ],
          [
            "Only an EC2 stopped state-change notification",
            "Chỉ thông báo EC2 chuyển sang stopped.",
            "Sai. Thông báo cho biết trạng thái thay đổi, nhưng không cung cấp đầy đủ danh tính và ngữ cảnh API mà đề yêu cầu.",
          ],
          [
            "Only an AWS Health public event",
            "Chỉ sự kiện công khai của AWS Health.",
            "Sai. Thông tin tình trạng dịch vụ AWS không xác định người đã gọi API dừng máy này.",
          ],
        ],
        correct: ["B"],
        explanation:
          "Câu hỏi cần truy danh tính gọi API, không chỉ xác nhận máy đã dừng. CloudTrail cung cấp ngữ cảnh của thao tác quản lý; thông báo trạng thái và số liệu CPU không thay thế thông tin đó.",
        tags: ["CloudTrail", "event-source"],
      },
      {
        section: "sources",
        en: "A team wants immediate routing when an EC2 instance reaches stopped, without inferring it from low CPU. Which signal best fits?",
        vi: "Nhóm muốn định tuyến sự kiện ngay khi EC2 chuyển sang stopped, thay vì suy đoán từ CPU thấp. Tín hiệu nào phù hợp nhất?",
        options: [
          [
            "A daily S3 inventory report",
            "Báo cáo S3 Inventory hằng ngày.",
            "Sai. Báo cáo kiểm kê S3 không theo dõi trạng thái EC2 và cũng không đáp ứng nhu cầu phản ứng kịp thời.",
          ],
          [
            "A CPU alarm alone",
            "Chỉ dùng cảnh báo CPU.",
            "Sai. Máy vẫn đang chạy có thể có CPU thấp; số liệu này không xác nhận trạng thái stopped.",
          ],
          [
            "The EC2 instance state-change event",
            "Sự kiện thay đổi trạng thái EC2 instance.",
            "Đúng. Sự kiện mang trạng thái của máy, nên có thể lọc đúng lúc máy chuyển sang stopped.",
          ],
          [
            "A scheduled monthly asset review",
            "Đợt rà soát tài sản theo lịch hằng tháng.",
            "Sai. Rà soát định kỳ phục vụ kiểm kê, không phải tín hiệu để định tuyến ngay khi trạng thái thay đổi.",
          ],
        ],
        correct: ["C"],
        explanation:
          "Sự kiện thay đổi trạng thái trực tiếp mô tả điều cần phản ứng. CPU thấp chỉ là số đo có nhiều nguyên nhân, nên không đáng tin để kết luận máy đã dừng.",
        tags: ["EC2-event", "state-change"],
      },
      {
        section: "patterns",
        en: "A rule matching only source aws.ec2 invokes remediation for unrelated EC2 events. What is the strongest correction?",
        vi: "Quy tắc chỉ lọc source là aws.ec2 nên kích hoạt khắc phục cả những sự kiện EC2 không liên quan. Cách sửa nào phù hợp nhất?",
        options: [
          [
            "Match source, detail-type, and the specific detail state with positive and negative tests",
            "Lọc source, detail-type và trạng thái cụ thể trong detail, rồi thử cả mẫu phải khớp và không được khớp.",
            "Đúng. Kết hợp đúng trường giúp giới hạn phạm vi; các mẫu đối chiếu chứng minh quy tắc không nhận nhầm sự kiện gần giống.",
          ],
          [
            "Increase retry attempts without changing the pattern",
            "Tăng số lần thử lại nhưng giữ nguyên bộ lọc.",
            "Sai. Thử lại chỉ hỗ trợ việc giao sự kiện, không ngăn những sự kiện không liên quan bị chọn.",
          ],
          [
            "Add a longer queue retention period only",
            "Chỉ tăng thời hạn lưu hàng đợi.",
            "Sai. Giữ thông điệp lâu hơn không thay đổi điều kiện định tuyến ban đầu.",
          ],
          [
            "Let the worker modify every EC2 resource and decide later",
            "Cho bộ xử lý sửa mọi tài nguyên EC2 rồi mới quyết định sau.",
            "Sai. Thực hiện thay đổi trước khi xác định phạm vi làm tăng nguy cơ tác động nhầm tài nguyên.",
          ],
        ],
        correct: ["A"],
        explanation:
          "Cần thu hẹp điều kiện để mô tả đúng tình huống nghiệp vụ, rồi kiểm chứng cả sự kiện phải nhận và sự kiện gần giống phải loại. Tăng thời gian lưu hay thử lại không sửa được lỗi chọn sai đầu vào.",
        tags: ["event-pattern", "filtering"],
      },
      {
        section: "patterns",
        en: "A remediation changes an S3 ACL, which generates another event matching the same rule indefinitely. What design best breaks the loop?",
        vi: "Thao tác khắc phục sửa ACL của S3 lại tạo sự kiện khớp cùng quy tắc, khiến hệ thống lặp vô hạn. Thiết kế nào ngắt vòng lặp tốt nhất?",
        options: [
          [
            "Increase Lambda reserved concurrency",
            "Tăng reserved concurrency của Lambda.",
            "Sai. Cho phép chạy đồng thời nhiều hơn không loại nguyên nhân vòng lặp, thậm chí có thể làm chi phí tăng nhanh.",
          ],
          [
            "Remove every event timestamp",
            "Xoá mọi dấu thời gian trong sự kiện.",
            "Sai. Bỏ thời gian làm mất thông tin điều tra nhưng không ngăn thao tác sửa tiếp tục tạo sự kiện khớp.",
          ],
          [
            "Replay the event more frequently",
            "Phát lại sự kiện thường xuyên hơn.",
            "Sai. Thêm sự kiện chỉ cung cấp thêm đầu vào cho vòng lặp đang có.",
          ],
          [
            "Narrow the rule and make remediation conditional on an actual undesired current state",
            "Thu hẹp quy tắc và chỉ khắc phục khi trạng thái hiện tại thực sự chưa đúng.",
            "Đúng. Bộ xử lý kiểm tra điều kiện trước khi thay đổi, tránh ghi lại cấu hình đã đạt yêu cầu và tự kích hoạt lặp.",
          ],
        ],
        correct: ["D"],
        explanation:
          "Cần sửa điều kiện kích hoạt và điều kiện thực hiện hành động: chỉ khắc phục khi trạng thái hiện tại còn sai. Khi cấu hình đã đúng, bộ xử lý không nên tiếp tục ghi lại cùng thay đổi.",
        tags: ["feedback-loop", "idempotency"],
      },
      {
        section: "patterns",
        en: "Which TWO tests are most useful before enabling a remediation event pattern? Choose two.",
        vi: "Hai kiểm tra nào hữu ích nhất trước khi bật mẫu lọc cho quy trình khắc phục? (Chọn HAI.)",
        options: [
          [
            "A sample representing the exact event that must trigger",
            "Thử mẫu đại diện cho đúng sự kiện bắt buộc phải kích hoạt.",
            "Đúng. Mẫu này kiểm tra quy tắc có nhận được trường hợp nghiệp vụ mong muốn hay không.",
          ],
          [
            "Only a count of all historical CloudWatch metrics",
            "Chỉ đếm toàn bộ số liệu CloudWatch từng được thu.",
            "Sai. Số lượng số liệu không kiểm tra điều kiện khớp giữa JSON sự kiện và mẫu lọc.",
          ],
          [
            "Only a successful IAM login unrelated to target execution",
            "Chỉ thử đăng nhập IAM thành công mà không liên quan đến đích xử lý.",
            "Sai. Đăng nhập thành công không chứng minh bộ lọc nhận đúng loại sự kiện cần xử lý.",
          ],
          [
            "Near-miss samples with the wrong account, type, or state",
            "Thử mẫu gần giống nhưng sai tài khoản, loại sự kiện hoặc trạng thái.",
            "Đúng. Các trường hợp phải bị loại giúp phát hiện điều kiện quá rộng trước khi tự động thay đổi tài nguyên.",
          ],
          [
            "A test that suppresses all target logs",
            "Thử bằng cách tắt toàn bộ nhật ký của đích.",
            "Sai. Tắt quan sát không kiểm chứng bộ lọc và còn làm việc tìm nguyên nhân khó hơn.",
          ],
        ],
        correct: ["A", "D"],
        explanation:
          "Một mẫu khớp chỉ chứng minh quy tắc nhận được trường hợp đó. Cần thêm các mẫu gần giống nhưng sai tài khoản, loại hoặc trạng thái để biết phạm vi lọc có quá rộng không.",
        tags: ["pattern-test", "scope"],
      },
      {
        section: "topology",
        en: "Two independent teams must each receive every incident event and process at different speeds. Which queue topology best fits?",
        vi: "Hai nhóm độc lập đều phải nhận mọi sự kiện sự cố nhưng xử lý với tốc độ khác nhau. Cách tổ chức hàng đợi nào phù hợp nhất?",
        options: [
          [
            "One shared SQS queue with both teams competing for messages",
            "Dùng chung một hàng đợi SQS để hai nhóm cạnh tranh nhận thông điệp.",
            "Sai. Một thông điệp không được bảo đảm giao đầy đủ cho cả hai nhóm; các bộ xử lý chung hàng đợi chia nhau việc.",
          ],
          [
            "Fan-out to a dedicated queue per team",
            "Phân phối bản sao sự kiện vào hàng đợi riêng của từng nhóm.",
            "Đúng. Mỗi nhóm có thông điệp, công việc tồn đọng và cơ chế thử lại riêng, không phải chờ nhóm kia.",
          ],
          [
            "A single synchronous function that calls both teams without buffering",
            "Dùng một hàm đồng bộ gọi cả hai nhóm, không có bộ đệm.",
            "Sai. Bên chậm hoặc lỗi có thể kéo dài cả lần xử lý và làm giảm khả năng tách biệt lỗi.",
          ],
          [
            "One FIFO message group shared by all consumers",
            "Dùng một nhóm thông điệp FIFO chung cho mọi bên nhận.",
            "Sai. Kiểm soát thứ tự không tạo bản sao độc lập để mọi nhóm đều nhận được mỗi sự kiện.",
          ],
        ],
        correct: ["B"],
        explanation:
          "Nhiều bên đọc chung một hàng đợi thường chia nhau công việc, không nhận mỗi bên một bản sao. Gửi bản sao vào hàng đợi riêng cho từng nhóm giúp mỗi nhóm nhận đủ và xử lý theo tốc độ của mình.",
        tags: ["fan-out", "SQS"],
      },
      {
        section: "topology",
        en: "An incident workflow waits for approval, checks recovery, and branches to escalation. Which orchestration choice best avoids long-running sleep loops?",
        vi: "Quy trình xử lý sự cố phải chờ phê duyệt, kiểm tra khôi phục và chuyển cấp khi cần. Cách điều phối nào tránh việc giữ hàm chạy vòng lặp chờ quá lâu?",
        options: [
          [
            "A Lambda invocation that sleeps until a human responds",
            "Cho một lần gọi Lambda ngủ chờ đến khi có người trả lời.",
            "Sai. Lambda có giới hạn thời gian chạy và không phù hợp để giữ tài nguyên tính toán chỉ nhằm chờ phê duyệt lâu.",
          ],
          [
            "Only an SNS topic with no state tracking",
            "Chỉ dùng SNS topic, không theo dõi trạng thái.",
            "Sai. Gửi thông báo không mô tả hay quản lý toàn bộ quá trình chờ, kiểm tra và rẽ nhánh.",
          ],
          [
            "A Step Functions state machine with waits, branches, and error handling",
            "Dùng máy trạng thái Step Functions với bước chờ, nhánh rẽ và xử lý lỗi.",
            "Đúng. Dịch vụ giữ trạng thái tiến trình và điều phối các bước mà không cần một hàm ngủ chờ xuyên suốt.",
          ],
          [
            "A single SQS visibility timeout used as the entire business state",
            "Dùng một visibility timeout của SQS để biểu diễn toàn bộ trạng thái nghiệp vụ.",
            "Sai. Tạm ẩn thông điệp không thay thế việc quản lý quyết định phê duyệt, kiểm tra khôi phục và chuyển cấp.",
          ],
        ],
        correct: ["C"],
        explanation:
          "Step Functions quản lý trạng thái và điều phối các bước chờ, rẽ nhánh, xử lý lỗi. Lambda có thể thực hiện từng công việc ngắn, không cần chạy liên tục chỉ để đợi người phê duyệt.",
        tags: ["Step-Functions", "workflow"],
      },
      {
        section: "topology",
        en: "Which TWO signals help detect failure in the event-processing system itself? Choose two.",
        vi: "Hai tín hiệu nào giúp phát hiện lỗi trong chính hệ thống xử lý sự kiện? (Chọn HAI.)",
        options: [
          [
            "Queue backlog age and depth",
            "Tuổi thông điệp cũ nhất và số thông điệp đang tồn trong hàng đợi.",
            "Đúng. Lượng tồn hoặc thời gian chờ tăng có thể cho thấy bộ xử lý không theo kịp, bị lỗi hoặc ngừng hoạt động.",
          ],
          [
            "Only the number of source repositories",
            "Chỉ số lượng kho mã nguồn.",
            "Sai. Số kho mã không phản ánh sự kiện đang được xử lý hay bị mắc lại trong hệ thống.",
          ],
          [
            "Target invocation failures and failed delivery-to-DLQ metrics",
            "Lỗi gọi đích và số liệu giao vào DLQ thất bại.",
            "Đúng. Cần quan sát cả đường chính lẫn đường lưu sự kiện lỗi để phát hiện thất bại không được giữ lại.",
          ],
          [
            "Only the CPU of an unrelated application fleet",
            "Chỉ CPU của một nhóm ứng dụng không liên quan.",
            "Sai. Số liệu của hệ thống khác không phản ánh trực tiếp tình trạng đường xử lý sự kiện này.",
          ],
          [
            "Only the date the rule was created",
            "Chỉ ngày quy tắc được tạo.",
            "Sai. Thời điểm tạo cấu hình không chứng minh quy tắc hiện đang giao và xử lý sự kiện bình thường.",
          ],
        ],
        correct: ["A", "C"],
        explanation:
          "Hệ thống ứng cứu cũng cần được giám sát. Tuổi và số công việc tồn cho biết xử lý có bị kẹt; số liệu lỗi giao và lỗi đưa vào DLQ cho biết sự kiện có mất đường xử lý hoặc đường giữ lỗi không.",
        tags: ["backlog", "observability"],
      },
      {
        section: "delivery",
        en: "An EventBridge target is temporarily throttled. Which mechanism directly handles retriable delivery failures?",
        vi: "Đích EventBridge tạm thời bị giới hạn tốc độ gọi. Cơ chế nào trực tiếp xử lý lỗi giao sự kiện có thể thử lại?",
        options: [
          [
            "Only a worker database rollback",
            "Chỉ hoàn tác cơ sở dữ liệu của bộ xử lý.",
            "Sai. Sự kiện chưa được giao đến đích; hoàn tác nghiệp vụ không giải quyết việc đích đang giới hạn tốc độ.",
          ],
          [
            "Deleting the rule as the first response",
            "Xoá quy tắc ngay từ phản ứng đầu tiên.",
            "Sai. Xoá quy tắc cắt đường định tuyến thay vì giúp chịu lỗi tạm thời có thể thử lại.",
          ],
          [
            "Changing every event to a permanent success status",
            "Gắn trạng thái thành công vĩnh viễn cho mọi sự kiện.",
            "Sai. Thay nhãn trạng thái không làm sự kiện thực sự đến nơi nhận và che giấu lỗi còn tồn tại.",
          ],
          [
            "The target retry policy with bounded backoff and jitter",
            "Dùng chính sách thử lại của đích, có giới hạn, giãn khoảng thử và độ lệch ngẫu nhiên.",
            "Đúng. Cơ chế này trực tiếp thử giao lại khi lỗi có thể hồi phục, như giới hạn tốc độ tạm thời.",
          ],
        ],
        correct: ["D"],
        explanation:
          "Chính sách thử lại của đích xử lý lỗi giao tạm thời bằng cách giãn khoảng thử và thêm độ lệch ngẫu nhiên trong giới hạn. Cần giới hạn rõ và cơ chế giữ lỗi khi không thể giao, thay vì thử vô hạn.",
        tags: ["retry-policy", "throttling"],
      },
      {
        section: "delivery",
        en: "A rule target denies permission and events appear in its DLQ without repeated retries. What is the best interpretation?",
        vi: "Đích của quy tắc từ chối quyền, và sự kiện vào DLQ mà không được thử lại nhiều lần. Nên hiểu thế nào?",
        options: [
          [
            "Missing target permissions can be non-retriable until configuration is repaired",
            "Thiếu quyền ở đích có thể là lỗi không thử lại được cho đến khi sửa cấu hình.",
            "Đúng. Thời gian chờ không tự bổ sung quyền, nên sự kiện có thể được chuyển thẳng đến DLQ đã cấu hình.",
          ],
          [
            "Every DLQ message proves application business logic completed",
            "Mọi thông điệp trong DLQ đều chứng minh nghiệp vụ đã hoàn tất.",
            "Sai. DLQ của EventBridge giữ sự kiện giao thất bại, không xác nhận bộ xử lý đã hoàn thành công việc.",
          ],
          [
            "EventBridge never supports retry for any error",
            "EventBridge hoàn toàn không hỗ trợ thử lại với bất kỳ lỗi nào.",
            "Sai. Dịch vụ vẫn áp dụng chính sách thử lại cho những lỗi được phân loại là có thể thử lại.",
          ],
          [
            "The fix is always a longer Lambda execution timeout",
            "Cách sửa luôn là tăng thời gian chạy tối đa của Lambda.",
            "Sai. Thời gian thực thi hàm không cấp quyền còn thiếu để EventBridge giao sự kiện.",
          ],
        ],
        correct: ["A"],
        explanation:
          "Một số lỗi cấu hình, như thiếu quyền ở đích, không được khắc phục chỉ bằng chờ thêm. Hãy đọc mã lỗi và sửa chính sách liên quan trước khi gửi lại; không mặc định tăng số lần thử sẽ giải quyết được.",
        tags: ["NO_PERMISSIONS", "DLQ"],
      },
      {
        section: "delivery",
        en: "A target DLQ is configured with an SQS FIFO queue and cannot be used as expected. What is the correct replacement?",
        vi: "DLQ của một đích EventBridge đang dùng SQS FIFO và không hoạt động như mong muốn. Cần thay bằng gì?",
        options: [
          [
            "A FIFO queue in another Region with a longer name",
            "Hàng đợi FIFO ở Region khác với tên dài hơn.",
            "Sai. Đổi tên không sửa việc dùng sai loại hàng đợi, còn khác Region cũng không đáp ứng yêu cầu của DLQ này.",
          ],
          [
            "An SQS Standard queue in the rule Region with the required policy",
            "Hàng đợi SQS Standard cùng Region với quy tắc, kèm chính sách cần thiết.",
            "Đúng. Đây là loại và phạm vi Region được hỗ trợ, đồng thời cần quyền SendMessage phù hợp.",
          ],
          [
            "Only a Lambda asynchronous DLQ setting on an unrelated function",
            "Chỉ cấu hình DLQ bất đồng bộ cho một hàm Lambda không liên quan.",
            "Sai. Cơ chế lỗi của hàm khác không giữ sự kiện mà đích EventBridge này giao thất bại.",
          ],
          [
            "Only a CloudWatch Logs stream without a queue",
            "Chỉ dùng luồng CloudWatch Logs, không có hàng đợi.",
            "Sai. Nhật ký giúp chẩn đoán nhưng không thay thế hàng đợi DLQ được cấu hình cho đích EventBridge.",
          ],
        ],
        correct: ["B"],
        explanation:
          "DLQ của đích EventBridge hỗ trợ hàng đợi SQS Standard cùng Region với quy tắc. Ngoài đúng loại và vị trí, hàng đợi còn phải có chính sách cho phép EventBridge gửi thông điệp.",
        tags: ["DLQ-type", "SQS-Standard"],
      },
      {
        section: "delivery",
        en: "Which TWO permissions or metrics should be checked when failed events cannot reach the configured DLQ? Choose two.",
        vi: "Hai quyền hoặc số liệu nào cần kiểm tra khi sự kiện lỗi không đến được DLQ đã cấu hình? (Chọn HAI.)",
        options: [
          [
            "Only the business worker database credentials",
            "Chỉ thông tin đăng nhập cơ sở dữ liệu của bộ xử lý nghiệp vụ.",
            "Sai. Quyền truy cập cơ sở dữ liệu ở bước xử lý sau đó không cấp quyền EventBridge gửi thông điệp vào DLQ.",
          ],
          [
            "The queue resource policy granting EventBridge SendMessage for the rule",
            "Chính sách hàng đợi cho phép EventBridge gọi SendMessage từ đúng quy tắc.",
            "Đúng. Nếu hàng đợi từ chối gửi, sự kiện không thể được giữ lại trong DLQ dù ARN đã được cấu hình.",
          ],
          [
            "Only the source application unit-test percentage",
            "Chỉ tỷ lệ kiểm thử đơn vị của ứng dụng nguồn.",
            "Sai. Tỷ lệ kiểm thử không chứng minh chính sách hoặc đường giao sự kiện tới DLQ đang đúng.",
          ],
          [
            "InvocationsFailedToBeSentToDLQ and related delivery error metadata",
            "InvocationsFailedToBeSentToDLQ và thông tin lỗi giao liên quan.",
            "Đúng. Số liệu này giúp phát hiện chính đường dự phòng giữ sự kiện lỗi cũng đang thất bại.",
          ],
          [
            "Only whether every consumer shares one queue",
            "Chỉ xem mọi bên nhận có dùng chung một hàng đợi không.",
            "Sai. Cách chia hàng đợi cho bộ xử lý không thay thế việc kiểm tra quyền SendMessage của DLQ.",
          ],
        ],
        correct: ["B", "D"],
        explanation:
          "DLQ cũng là một nơi nhận cần được cấp quyền. Phải kiểm tra chính sách hàng đợi và số liệu lỗi chuyển vào DLQ, không chỉ thấy đã cấu hình ARN rồi cho rằng đường lưu lỗi hoạt động.",
        tags: ["DLQ-policy", "failed-delivery"],
      },
      {
        section: "delivery",
        en: "EventBridge successfully invokes Lambda asynchronously, then the handler throws an exception. Which failure handling should be investigated?",
        vi: "EventBridge đã gọi Lambda bất đồng bộ thành công, nhưng sau đó hàm phát sinh ngoại lệ. Nên kiểm tra cơ chế lỗi ở đâu?",
        options: [
          [
            "Only the EventBridge target permission, which already accepted delivery",
            "Chỉ kiểm tra lại quyền đích EventBridge dù việc giao đã thành công.",
            "Sai. Quyền đang cho phép giao không giải thích ngoại lệ bên trong hàm sau khi Lambda nhận sự kiện.",
          ],
          [
            "Only the rule event pattern, since no function ran",
            "Chỉ kiểm tra bộ lọc quy tắc vì chưa có hàm nào chạy.",
            "Sai. Tình huống đã nêu hàm chạy và phát sinh lỗi, nên không thể kết luận sự kiện chưa qua bộ lọc.",
          ],
          [
            "Lambda asynchronous invocation retries and error destination or DLQ",
            "Kiểm tra thử lại bất đồng bộ và nơi nhận lỗi hoặc DLQ của Lambda.",
            "Đúng. Đây là lớp chịu trách nhiệm cho thất bại của hàm sau khi nhận lời gọi bất đồng bộ.",
          ],
          [
            "Only a new source event timestamp",
            "Chỉ tạo dấu thời gian mới cho sự kiện nguồn.",
            "Sai. Thời gian giúp truy vết, nhưng không sửa lỗi hàm hoặc cấu hình nơi giữ kết quả thất bại.",
          ],
        ],
        correct: ["C"],
        explanation:
          "Lambda đã nhận yêu cầu bất đồng bộ thì EventBridge hoàn thành bước giao. Lỗi xảy ra khi hàm chạy thuộc cơ chế thử lại và lưu kết quả lỗi của Lambda, không mặc nhiên xuất hiện trong DLQ của EventBridge.",
        tags: ["Lambda-async", "failure-boundary"],
      },
      {
        section: "delivery",
        en: "EventBridge puts an event onto SQS successfully, but the worker repeatedly fails. Which control belongs closest to this new failure?",
        vi: "EventBridge đã đưa sự kiện vào SQS thành công nhưng bộ xử lý liên tục thất bại. Cơ chế nào gần lỗi này nhất?",
        options: [
          [
            "Only increasing EventBridge delivery attempts",
            "Chỉ tăng số lần thử giao của EventBridge.",
            "Sai. EventBridge đã đưa thông điệp vào SQS, nên thử giao thêm không sửa lỗi xử lý sau đó.",
          ],
          [
            "Only changing the event source string",
            "Chỉ đổi chuỗi source của sự kiện.",
            "Sai. Đổi nhãn nguồn không sửa bộ xử lý và cũng không quản lý số lần thông điệp được nhận lại.",
          ],
          [
            "Recreating the successful rule on every worker failure",
            "Tạo lại quy tắc sau mỗi lần bộ xử lý thất bại.",
            "Sai. Quy tắc đang giao thành công; thay đổi nó tác động sai lớp và có thể làm phát sinh đầu vào trùng.",
          ],
          [
            "Worker error handling, visibility timeout, and SQS redrive policy",
            "Xử lý lỗi trong bộ xử lý, visibility timeout và redrive policy của SQS.",
            "Đúng. Những cơ chế này quản lý việc xử lý sau khi hàng đợi đã nhận, và đưa thông điệp lỗi sang nơi giữ riêng khi cần.",
          ],
        ],
        correct: ["D"],
        explanation:
          "Đường giao vào hàng đợi đã thành công. Việc nhận lại và xử lý thông điệp cần được kiểm soát ở bộ xử lý và SQS, gồm thời gian tạm ẩn cùng chính sách chuyển thông điệp lỗi.",
        tags: ["SQS-redrive", "worker-failure"],
      },
      {
        section: "boundaries",
        en: "A central account grants event-bus PutEvents permission to a workload account. What is still required to process the events centrally?",
        vi: "Tài khoản trung tâm cho phép tài khoản ứng dụng gọi PutEvents vào bus. Vẫn cần gì để xử lý sự kiện tại trung tâm?",
        options: [
          [
            "A sender forwarding rule and role, receiver matching rule, and target permissions",
            "Quy tắc chuyển tiếp và role bên gửi, quy tắc khớp bên nhận, cùng quyền gọi đích.",
            "Đúng. Các phần này tạo đường đi đầy đủ từ tài khoản nguồn đến bộ xử lý ở tài khoản trung tâm.",
          ],
          [
            "Only the receiver bus policy with no sender configuration",
            "Chỉ chính sách bus bên nhận, không cấu hình bên gửi.",
            "Sai. Cho phép gửi không đồng nghĩa tài khoản nguồn đã có quy tắc chủ động chuyển sự kiện.",
          ],
          [
            "Only an SNS subscription in the source account",
            "Chỉ một đăng ký SNS trong tài khoản nguồn.",
            "Sai. Đăng ký đó không tự tạo đường chuyển tiếp tới bus trung tâm như tình huống yêu cầu.",
          ],
          [
            "A shared administrator key embedded in each event",
            "Nhúng khoá quản trị dùng chung vào từng sự kiện.",
            "Sai. Cách này làm lộ thông tin xác thực và không phải cơ chế cấp quyền định tuyến liên tài khoản.",
          ],
        ],
        correct: ["A"],
        explanation:
          "Chính sách bus chỉ cấp quyền tiếp nhận, không tự chuyển sự kiện từ nguồn hay thực thi hành động. Cần cấu hình cả bên gửi, bộ lọc bên nhận và quyền gọi đích.",
        tags: ["cross-account", "bus-policy"],
      },
      {
        section: "boundaries",
        en: "A receiver accepts events from several accounts but remediation should only affect its own resources. What rule improvement is most appropriate?",
        vi: "Bus nhận sự kiện từ nhiều tài khoản, nhưng quy trình khắc phục chỉ được tác động tài nguyên của chính tài khoản nhận. Nên cải thiện quy tắc thế nào?",
        options: [
          [
            "Match only source and ignore the envelope account",
            "Chỉ lọc source và bỏ qua trường account trong phần bao sự kiện.",
            "Sai. Sự kiện từ tài khoản khác có thể dùng cùng nguồn và loại, nên bộ lọc này chưa giới hạn đúng phạm vi.",
          ],
          [
            "Include the intended account ID and precise resource/state constraints",
            "Thêm mã tài khoản dự kiến và điều kiện chính xác về tài nguyên, trạng thái.",
            "Đúng. Điều kiện rõ giúp chọn đúng sự kiện được phép kích hoạt khắc phục trong tài khoản của bên nhận.",
          ],
          [
            "Increase queue retention while leaving scope broad",
            "Tăng thời hạn lưu hàng đợi nhưng giữ bộ lọc rộng.",
            "Sai. Thời hạn lưu không giới hạn tài khoản hoặc tài nguyên được chọn để hành động.",
          ],
          [
            "Assume all accepted accounts own identical resources",
            "Cho rằng mọi tài khoản được chấp nhận đều sở hữu tài nguyên giống nhau.",
            "Sai. Tài khoản là ranh giới cần phân biệt; chấp nhận sự kiện không làm tài nguyên ở các tài khoản trở thành một.",
          ],
        ],
        correct: ["B"],
        explanation:
          "Cho phép sự kiện vào bus và chọn sự kiện để hành động là hai lớp khác nhau. Cần lọc đúng tài khoản cùng tài nguyên, trạng thái để sự kiện chuyển tiếp từ nơi khác không vô tình kích hoạt hành động nội bộ.",
        tags: ["account-filter", "event-scope"],
      },
      {
        section: "boundaries",
        en: "Which TWO checks should precede replaying archived remediation events into production? Choose two.",
        vi: "Hai kiểm tra nào cần thực hiện trước khi phát lại sự kiện khắc phục đã lưu vào môi trường chính thức? (Chọn HAI.)",
        options: [
          [
            "Assume archived events always describe the current resource state",
            "Cho rằng sự kiện lưu trữ luôn mô tả đúng trạng thái hiện tại.",
            "Sai. Sự kiện mô tả một thời điểm trong quá khứ; tài nguyên có thể đã thay đổi hoặc bị xoá.",
          ],
          [
            "Remove all deduplication state to maximize repeated actions",
            "Xoá mọi trạng thái chống trùng để hành động được lặp tối đa.",
            "Sai. Làm vậy có thể lặp những tác động đã hoàn tất, như gửi thông báo hoặc sửa tài nguyên thêm lần nữa.",
          ],
          [
            "Define the replay scope and idempotency or deduplication behavior",
            "Xác định phạm vi phát lại và cách xử lý lặp an toàn hoặc chống trùng.",
            "Đúng. Cần biết sự kiện nào được đưa lại vào hệ thống và tránh lặp tác động không mong muốn.",
          ],
          [
            "Verify current resource state and whether prior side effects already happened",
            "Kiểm tra trạng thái tài nguyên hiện tại và tác động trước đó đã xảy ra chưa.",
            "Đúng. Quyết định khắc phục phải dựa vào điều kiện hiện tại, không chỉ nội dung sự kiện cũ.",
          ],
          [
            "Purge all audit records before replaying",
            "Xoá sạch dữ liệu kiểm toán trước khi phát lại.",
            "Sai. Mất lịch sử sẽ làm việc phân biệt lần xử lý đầu với lần phát lại và đối chiếu kết quả khó hơn.",
          ],
        ],
        correct: ["C", "D"],
        explanation:
          "Phát lại chỉ cung cấp lại đầu vào. Trạng thái tài nguyên có thể đã khác và hành động trước có thể đã xảy ra, nên phải kiểm soát phạm vi, chống trùng và kiểm tra điều kiện hiện tại.",
        tags: ["replay", "idempotency"],
      },
      {
        section: "patterns",
        en: "A delayed event says an instance was stopped, but it is running again when the worker executes. What should the worker do before applying remediation?",
        vi: "Sự kiện đến muộn cho biết máy đã stopped, nhưng lúc bộ xử lý chạy thì máy lại đang running. Trước khi khắc phục, bộ xử lý nên làm gì?",
        options: [
          [
            "Always force it back to the historical stopped state",
            "Luôn ép máy trở lại trạng thái stopped trong quá khứ.",
            "Sai. Máy có thể đã được khởi động hợp lệ; ép về trạng thái cũ có thể gây gián đoạn mới.",
          ],
          [
            "Ignore all future state-change events permanently",
            "Bỏ vĩnh viễn mọi sự kiện thay đổi trạng thái trong tương lai.",
            "Sai. Một sự kiện đến muộn không phải lý do tắt hoàn toàn khả năng phản ứng với các thay đổi hợp lệ khác.",
          ],
          [
            "Treat event arrival order as a complete state database",
            "Coi thứ tự sự kiện đến là cơ sở dữ liệu trạng thái đầy đủ.",
            "Sai. Sự kiện có thể đến chậm hoặc trùng, nên thứ tự nhận không bảo đảm phản ánh trạng thái hiện tại.",
          ],
          [
            "Read current state and evaluate the remediation precondition",
            "Đọc trạng thái hiện tại và đánh giá lại điều kiện cần khắc phục.",
            "Đúng. Sự kiện kích hoạt việc kiểm tra; chỉ thực hiện thay đổi khi điều kiện hiện tại còn phù hợp.",
          ],
        ],
        correct: ["D"],
        explanation:
          "Sự kiện cho biết điều đã xảy ra, không thay thế việc đọc trạng thái mới nhất. Trước thao tác thay đổi tài nguyên, hãy xác nhận điều kiện khắc phục còn đúng để tránh phá một trạng thái mới hợp lệ.",
        tags: ["stale-event", "conditional-remediation"],
      },
      {
        section: "delivery",
        en: "A DLQ becomes empty after an operator purges it, but there is no record of successful processing. What is the correct incident assessment?",
        vi: "DLQ trống sau khi người vận hành xoá sạch thông điệp, nhưng không có bằng chứng xử lý thành công. Nên đánh giá sự cố thế nào?",
        options: [
          [
            "Queue emptiness alone does not prove business recovery; reconcile event outcomes",
            "DLQ trống chưa chứng minh nghiệp vụ đã phục hồi; cần đối chiếu kết quả của các sự kiện.",
            "Đúng. Thao tác xoá sạch có thể loại cả công việc chưa xử lý và bằng chứng, nên số lượng bằng không chưa đủ kết luận thành công.",
          ],
          [
            "All messages must have completed successfully",
            "Mọi thông điệp chắc chắn đã được xử lý thành công.",
            "Sai. Purge có thể xoá thông điệp chưa từng được xử lý, không đòi hỏi nghiệp vụ đã hoàn tất.",
          ],
          [
            "EventBridge automatically recreates every purged message",
            "EventBridge tự tạo lại mọi thông điệp vừa bị xoá.",
            "Sai. Không có bảo đảm mọi thông điệp bị purge sẽ được dịch vụ tự động khôi phục và gửi lại.",
          ],
          [
            "The original target permissions are guaranteed repaired",
            "Quyền của đích ban đầu chắc chắn đã được sửa.",
            "Sai. Xoá thông điệp trong DLQ không thay đổi chính sách gây lỗi ở đích ban đầu.",
          ],
        ],
        correct: ["A"],
        explanation:
          "Xoá thông điệp làm giảm lượng tồn, không thực hiện công việc nghiệp vụ. Cần đối chiếu từng kết quả cần đạt và bằng chứng xử lý trước khi tuyên bố đã khôi phục.",
        tags: ["DLQ-operations", "reconciliation"],
      },
      {
        section: "sources",
        en: "An AWS Health public service event appears, but application latency and errors remain normal. What is the most reasonable response?",
        vi: "AWS Health có sự kiện công khai về dịch vụ, nhưng độ trễ và tỷ lệ lỗi ứng dụng vẫn bình thường. Phản ứng nào hợp lý nhất?",
        options: [
          [
            "Immediately rebuild every artifact because the event proves all binaries are corrupt",
            "Build lại mọi gói phần mềm ngay vì sự kiện chứng minh toàn bộ chương trình đã hỏng.",
            "Sai. Sự kiện tình trạng dịch vụ không chứng minh nội dung mọi gói phần mềm bị thay đổi hoặc hỏng.",
          ],
          [
            "Inspect affected services, Regions, and entities and correlate with application impact",
            "Xem dịch vụ, Region và đối tượng bị ảnh hưởng rồi đối chiếu tác động đến ứng dụng.",
            "Đúng. Phạm vi sự kiện cùng số liệu ứng dụng giúp quyết định mức độ ưu tiên và hành động phù hợp.",
          ],
          [
            "Ignore every Health event because current metrics are normal",
            "Bỏ qua mọi sự kiện Health vì số liệu hiện vẫn bình thường.",
            "Sai. Một số sự kiện báo bảo trì hoặc ảnh hưởng sắp tới, nên vẫn cần xem phạm vi và chuẩn bị nếu liên quan.",
          ],
          [
            "Fail over all workloads without checking their scope or dependencies",
            "Chuyển toàn bộ ứng dụng sang nơi dự phòng mà không kiểm tra phạm vi hoặc phụ thuộc.",
            "Sai. Hành động quá rộng khi chưa xác minh có thể tự gây gián đoạn hoặc chuyển sang nơi không đáp ứng yêu cầu.",
          ],
        ],
        correct: ["B"],
        explanation:
          "Thông tin Health cần được đối chiếu với dịch vụ, Region, tài nguyên và tác động thực tế. Không nên mặc định mọi ứng dụng đã lỗi, nhưng cũng không bỏ qua nguy cơ bảo trì hoặc ảnh hưởng sắp tới.",
        tags: ["AWS-Health", "impact-analysis"],
      },
    ],
    5,
  ),
};
