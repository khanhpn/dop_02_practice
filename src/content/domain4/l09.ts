import { lesson } from './author';

export const d4l09 = lesson({
  id: 'd4-l09', number: 49, domainId: 4, chapterId: '4.3',
  title: 'EventBridge: tự động hóa monitoring bằng event có kiểm soát',
  summary: 'Thiết kế rule chính xác, quyền target, retry/DLQ và consumer idempotent để phản ứng tự động trong môi trường nhiều account.',
  duration: 65, objectives: ['Viết event pattern có positive/negative tests.', 'Phân biệt lỗi giao target và lỗi xử lý trong target.', 'Bảo vệ remediation khỏi lặp vô hạn, sự kiện cũ và phạm vi ngoài ý muốn.'],
  prerequisites: ['Biết JSON, Lambda, SQS và IAM resource policies.', 'Đã hiểu state transition của alarm trong bài 45.'],
  sections: [
    { id: 'd4-l09-pattern', title: '1. Event bus và pattern là bộ định tuyến', paragraphs: [
      'Event (sự kiện) mô tả điều đã xảy ra, không phải luôn một command (mệnh lệnh) phải thực hiện. EventBridge event bus (bus sự kiện) nhận event rồi so với rules (quy tắc). Pattern (mẫu khớp) chọn theo source, detail-type, account, Region và các field trong detail. Ví dụ EC2 state-change notification có detail.state khác với CloudTrail API event có detail.eventName; viết pattern của loại này cho loại kia khiến rule không match. Hãy lấy một sample event đúng từ nguồn dự kiến và kiểm cấu trúc trước khi nghĩ tới target. Không suy từ tên dịch vụ rằng mọi API của nó có cùng event shape.',
      'Trong một field pattern, danh sách giá trị thường thể hiện lựa chọn OR; các field được nêu cùng phải thỏa điều kiện tương ứng. Field không được nêu thường không hạn chế matching. Match string có phân biệt hoa thường và cú pháp operators phải được dùng đúng; event field arrays có semantics riêng cần test. Dùng EventBridge Sandbox hoặc TestEventPattern với mẫu cần match và mẫu gần giống nhưng không được match. Scope càng rõ càng giảm noise và blast radius (phạm vi tác động) của remediation: account, resource identity và trạng thái bất thường cần được giới hạn theo nhu cầu, thay vì bắt mọi event của cả organization.'
    ] },
    { id: 'd4-l09-permission', title: '2. Match thành công chưa có nghĩa target chạy', paragraphs: [
      'Rule match và target invocation (gọi đích) là các chặng riêng. Lambda target cần resource-based permission cho events.amazonaws.com với SourceArn phù hợp; execution role của Lambda chỉ điều khiển API function gọi sau đó. SQS hoặc SNS target cần resource policy tương ứng; một số target khác dùng role để EventBridge gọi service. Kiểm tra loại target thay vì gắn cùng một IAM role cho mọi tích hợp. Khi event được chuyển sang bus account khác, bus policy của bên nhận và quyền sender tham gia kiểm soát. Cùng một organization không làm mọi quyền tự xuất hiện.',
      'Một request PutEvents thành công ở cấp HTTP không nên khiến publisher bỏ qua kết quả từng entry; response có thể cho biết một phần batch thất bại. Giữ correlation ID (mã tương quan), schema version và resource context để truy dấu từ publisher đến target. Input transformer (bộ biến đổi đầu vào) có thể giảm payload xuống các trường cần thiết, nhưng làm mất event ID hoặc account nguồn sẽ khó dedup và audit. Đừng chuyển chuỗi không được kiểm chứng trực tiếp thành lệnh shell hay tên resource cần xóa. Target phải xác minh phạm vi ủy quyền và trạng thái hiện tại trước khi làm thay đổi có ảnh hưởng.'
    ] },
    { id: 'd4-l09-delivery', title: '3. Retry và dead-letter queue thuộc chặng nào', paragraphs: [
      'Retry policy (chính sách thử lại) của rule target xử lý retriable delivery errors (lỗi giao có thể thử lại), với giới hạn tuổi event và số lần thử. Theo tài liệu hiện tại, mặc định có cửa sổ 24 giờ và tới 185 attempts dùng exponential backoff cùng jitter; cấu hình theo thời gian sự kiện còn có ý nghĩa nghiệp vụ, không chỉ tăng mọi giá trị tối đa. Khi hết giới hạn, event có thể bị bỏ nếu không có DLQ. Một số lỗi như thiếu quyền hoặc resource không tồn tại có thể đi trực tiếp tới DLQ theo cơ chế dịch vụ thay vì được retry như throttling. Phải sửa nguyên nhân, không chờ retry chữa policy sai.',
      'Dead-letter queue, viết tắt DLQ (hàng đợi sự kiện giao thất bại), của EventBridge target dùng SQS standard queue được hỗ trợ, trong Region của rule. Queue policy phải cho EventBridge SendMessage, giới hạn rule ARN hợp lý; có queue ARN trong cấu hình chưa chứng minh dịch vụ ghi được. Monitor InvocationsSentToDLQ và InvocationsFailedToBeSentToDLQ để biết cả đường cứu lỗi có hỏng không. Message attributes chứa error code, target/rule ARN và retry context giúp phân loại nguyên nhân. Nếu EventBridge đã giao Lambda thành công nhưng code Lambda thất bại sau đó, cần cơ chế lỗi/retry của invocation Lambda tương ứng; target DLQ không tự thay mọi lớp xử lý ứng dụng.'
    ] },
    { id: 'd4-l09-remediation', title: '4. Consumer phải chịu trùng và kiểm tra trạng thái hiện tại', paragraphs: [
      'Event-driven automation (tự động hóa theo sự kiện) phải chịu duplicate delivery (giao trùng), out-of-order events (sự kiện đến sai thứ tự) và stale events (sự kiện cũ). Một event báo resource không compliant có thể đến sau khi người vận hành đã sửa. Trước remediation, đọc trạng thái hiện tại và chỉ thay đổi nếu điều kiện còn tồn tại. Idempotent operation (thao tác chạy lặp vẫn cho kết quả tương đương) giúp tránh tạo nhiều ticket, nhân đôi cảnh báo hoặc scale sai nhiều lần. Khi thao tác không tự idempotent, dùng event/business key và kho trạng thái bền vững với conditional write hoặc workflow kiểm soát.',
      'Feedback loop (vòng phản hồi) xuất hiện khi việc sửa resource lại phát event khớp cùng rule. Ví dụ rule bắt mọi thay đổi ACL rồi function luôn ghi ACL dù đã đúng. Giới hạn pattern vào trạng thái sai, kiểm tra trước khi sửa và loại nguồn thay đổi theo thiết kế nếu cần; đặt giới hạn concurrency và alarm invocation bất thường như lớp bảo vệ bổ sung. Có thể dùng Step Functions hoặc Systems Manager Automation để có các bước kiểm chứng, phân nhánh và kiểm soát quyền rõ. Tự động hóa đầy đủ không có nghĩa luôn được phép hành động phá hủy: phân loại severity, scope và điều kiện dừng trong runbook trước khi bật.'
    ] },
    { id: 'd4-l09-operations', title: '5. Multi-account, replay và kiểm chứng đầu cuối', paragraphs: [
      'Central event bus (bus tập trung) có thể gom sự kiện từ nhiều account, nhưng rule ở bên nhận nên kiểm account nguồn và pattern cụ thể. Bus policy giới hạn account hoặc organization được gửi; sender role phải có quyền và destination phải được cấu hình theo cách tích hợp hiện hành. Đừng giả định có thể nối bus qua bất kỳ số account/Region nào vì service có giới hạn forwarding/hop. Giữ event metadata để vận hành biết resource thuộc account nào và chọn role xử lý đúng account. Một tag Owner trong event chỉ là dữ liệu; nó không thay điều kiện IAM cho tài nguyên đích.',
      'Archive/replay (lưu và phát lại) giúp thử hoặc phục hồi event theo cơ chế EventBridge được cấu hình, không bảo đảm không có side effect khi replay. Consumer phải phân biệt replay có chủ đích, dedup theo nghiệp vụ và tránh chạy lại hành động đã hoàn tất. Lab tốt dùng custom source như study.monitoring trên bus riêng, target chỉ ghi dữ liệu giả hoặc SQS, với DLQ thử. Đo số event gửi, số rule match, target invocations, failed invocations và đầu ra nhận được; một dashboard chỉ có MatchedEvents không đủ chứng minh action thành công. Khi dọn lab, disable rule trước rồi gỡ targets/permissions và queue riêng để không tiếp tục tạo tài nguyên trong lúc teardown.'
    ] }
  ],
  diagram: { title: 'Event đến automation có kiểm chứng', steps: [
    { label: 'Publisher', detail: 'Schema/version và từng PutEvents entry được kiểm tra.' },
    { label: 'Rule match', detail: 'Source, detail-type, account và detail được test positive/negative.' },
    { label: 'Giao target', detail: 'Permission, retry policy và DLQ riêng của delivery.' },
    { label: 'Xử lý an toàn', detail: 'Kiểm current state, dedup và phạm vi trước remediation.' },
    { label: 'Đối soát', detail: 'So metrics với target output, xử lý DLQ sau khi sửa nguyên nhân.' }
  ], caption: 'Match, delivery và xử lý nghiệp vụ là ba kết quả khác nhau cần quan sát.' },
  scenarios: [
    { title: 'Rule match nhưng Lambda không chạy', context: 'MatchedEvents tăng sau state-change EC2, FailedInvocations tăng; function execution role đã có quyền đọc EC2.', solution: 'Kiểm resource permission invoke Lambda từ EventBridge và rule ARN, sau đó xem retry/DLQ; quyền execution role đọc EC2 không cấp invocation.', tradeoff: 'Quyền invoke phải hẹp đúng rule; wildcard rộng chữa triệu chứng nhưng tăng bề mặt gọi function.' },
    { title: 'Sự kiện cũ đến sau khi đã sửa', context: 'Event compliance báo security group public nhưng automation chạy chậm và con người đã thu hẹp rule.', solution: 'Đọc current state và chỉ sửa phần còn vi phạm; ghi event ID và kết quả no-op nếu đã compliant.', tradeoff: 'Thêm API đọc và state handling nhưng tránh thay đổi không cần thiết hoặc ghi đè ý định mới hợp lệ.' }
  ],
  keyTakeaways: ['Event pattern phụ thuộc đúng loại event và cấu trúc JSON.', 'Target resource permission khác execution role.', 'Retry/DLQ của EventBridge giải quyết delivery, không mọi lỗi downstream.', 'Idempotency và current-state check giảm tác động duplicate/stale events.', 'Theo dõi cả DLQ delivery failure và tránh feedback loop.'],
  examTraps: ['Dùng detail.eventName của CloudTrail cho EC2 state notification.', 'Cho rằng PutEvents HTTP thành công chứng minh mọi entry thành công.', 'Dùng SQS FIFO làm EventBridge target DLQ.', 'Coi MatchedEvents là bằng chứng remediation xong.', 'Replay mà không xét tác dụng phụ đã thực hiện.'],
  code: { title: 'Rule custom bus chỉ nhận trạng thái unhealthy (snippet)', deployable: false,
    cloudformation: `Resources:
  StudyBus:
    Type: AWS::Events::EventBus
    Properties: { Name: study-monitoring }
  UnhealthyRule:
    Type: AWS::Events::Rule
    Properties:
      EventBusName: !Ref StudyBus
      State: DISABLED
      EventPattern:
        source: [study.monitoring]
        detail-type: [Service Health Sample]
        detail:
          status: [unhealthy]`,
    terraform: `resource "aws_cloudwatch_event_bus" "study" { name = "study-monitoring" }
resource "aws_cloudwatch_event_rule" "unhealthy" {
  name = "study-unhealthy"
  event_bus_name = aws_cloudwatch_event_bus.study.name
  state = "DISABLED"
  event_pattern = jsonencode({
    source = ["study.monitoring"], "detail-type" = ["Service Health Sample"],
    detail = { status = ["unhealthy"] }
  })
}`,
    explanation: 'Rule chủ ý disabled và chưa có target, permissions, retry hoặc DLQ. Custom source không giả mạo nguồn aws.*. Hoàn thiện lab trong sandbox rồi enable; snippet không thực hiện remediation thật.'
  },
  lab: { title: 'Test event pattern và routing tới queue sandbox', duration: 45,
    prerequisites: ['Sandbox với quyền EventBridge, SQS và quản lý queue policy.', 'Chỉ custom event giả; không chọn AWS account/resource production làm remediation target.', 'Tên bus/queue riêng, ghi lại ARN và Region trước khi bắt đầu.'],
    cost: 'Custom EventBridge events, SQS requests, lưu message và archive nếu bật có thể tính phí. Không cần EC2; gửi vài event giả và dọn rule/queues sau lab.',
    steps: [
      { title: 'Tạo phạm vi', detail: 'Kiểm account/Region; tạo custom bus study-monitoring bằng cấu hình đầy đủ từ snippet. Chưa enable rule.', command: 'aws sts get-caller-identity', expected: 'Bus sandbox riêng và rule disabled, chưa có action thay đổi AWS resource.' },
      { title: 'Test ba mẫu', detail: 'Trong Sandbox test source study.monitoring, detail-type Service Health Sample, detail.status unhealthy. Lặp với healthy và source khác.', expected: 'Chỉ đúng unhealthy/source/detail-type khớp; hai mẫu còn lại không match.' },
      { title: 'Nối target và DLQ', detail: 'Tạo queue target standard và queue DLQ standard riêng; thêm policy cho EventBridge theo đúng rule ARN, cấu hình target với retry/age có giới hạn và DLQ rồi enable rule.', expected: 'Target được chấp nhận và queue policies không mở SendMessage cho mọi principal.' },
      { title: 'Gửi event giả', detail: 'Dùng EventBridge console Send events vào custom bus, gửi unhealthy và healthy có correlation ID. Kiểm kết quả gửi và nhận target queue; không dùng source aws.*.', expected: 'Unhealthy tới target; healthy không được rule này giao. Payload giữ context cần đối soát.' },
      { title: 'Thử lỗi có giới hạn', detail: 'Trong lab riêng tạm bỏ quyền SendMessage của target, giữ DLQ permission. Gửi một event giả và xem failed invocation/DLQ attributes; sau đó khôi phục target policy trước xử lý lại.', expected: 'Có bằng chứng lỗi delivery và thông tin nguyên nhân; nếu DLQ không nhận thì kiểm cả metric failed-to-DLQ và queue policy.' },
      { title: 'Dừng và dọn', detail: 'Disable rule, xóa target và rule, rồi bus và hai queues chỉ của lab. Không replay DLQ vào rule đang tự tạo loop; ghi quy trình xử lý lại có dedup.', expected: 'Không còn routing hoặc queue lab, không có event production bị tác động.' }
    ], cleanup: ['Disable rule trước khi gỡ target, sau đó xóa rule và bus riêng.', 'Xóa target/DLQ queues và policy chỉ của lab sau khi xem dữ liệu giả.', 'Xóa archive/replay thử nếu có tạo; không gỡ bus policy dùng chung.'],
    challenge: 'Thiết kế automation sửa tag thiếu theo EventBridge nhưng có current-state check và không tự kích hoạt vô hạn khi chính nó sửa tag.'
  },
  sources: [
    { title: 'EventBridge event patterns', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html' },
    { title: 'EventBridge delivery retry', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html' },
    { title: 'EventBridge dead-letter queues', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html' },
    { title: 'Cross-account event buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cross-account.html' },
    { title: 'Event pattern array matching', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns-arrays.html' }
  ], reviewedAt: '2026-10-19'
}, [
  { en: 'A rule written for CloudTrail detail.eventName does not match an EC2 state-change notification. What should be corrected?', vi: 'Rule dùng CloudTrail detail.eventName không match EC2 state-change notification. Cần sửa gì?', section: 'pattern', answers: [0], explanation: 'Hai event types có schema khác; pattern phải theo sample đúng nguồn.', choices: [
    ['Match the EC2 state-change detail-type and detail.state fields.', 'Match detail-type EC2 state-change và field detail.state.', 'Đúng: dùng trường thực có trong event cần bắt.'],
    ['Increase Lambda memory only.', 'Chỉ tăng RAM Lambda.', 'Sai: target chưa được gọi vì pattern không match.'],
    ['Make the event bus public.', 'Làm event bus public.', 'Sai: không sửa schema mismatch.'],
    ['Change the SQS retention period.', 'Đổi retention SQS.', 'Sai: không tác động matching event fields.'] ] },
  { en: 'A rule pattern lists source aws.ec2 and aws.rds in one source array. What does this normally mean?', vi: 'Pattern liệt kê aws.ec2 và aws.rds trong cùng source array. Thông thường nghĩa gì?', section: 'pattern', answers: [2], refresh: true, explanation: 'Các giá trị lựa chọn trong cùng field thể hiện OR theo semantics matching.', choices: [
    ['The source must equal both strings simultaneously.', 'Source phải đồng thời bằng cả hai chuỗi.', 'Sai: không là nghĩa của danh sách lựa chọn này.'],
    ['No events can ever match an array.', 'Không event nào match được array.', 'Sai: pattern dùng arrays để mô tả lựa chọn giá trị.'],
    ['Either listed source can satisfy that field.', 'Một trong hai source có thể thỏa field đó.', 'Đúng: vẫn phải thỏa các field khác được nêu trong pattern.'],
    ['Only events from the second account match.', 'Chỉ event từ account thứ hai match.', 'Sai: source service không phải account list.'] ] },
  { en: 'MatchedEvents rises, but the Lambda target is not invoked. Its execution role already allows EC2 reads. What permission should be checked?', vi: 'MatchedEvents tăng nhưng Lambda target không được invoke, execution role đã cho đọc EC2. Cần xem quyền gì?', section: 'permission', answers: [1], explanation: 'Execution role cho code gọi EC2; EventBridge invoke function cần resource permission khác.', choices: [
    ['The EC2 instance SSH key.', 'SSH key của EC2.', 'Sai: không cấp quyền EventBridge invoke Lambda.'],
    ['The Lambda resource policy allowing EventBridge invocation from the intended rule.', 'Lambda resource policy cho EventBridge invoke từ rule dự định.', 'Đúng: kiểm events.amazonaws.com và SourceArn rule phù hợp.'],
    ['Only the CloudWatch graph statistic.', 'Chỉ graph statistic CloudWatch.', 'Sai: đồ thị không cấp quyền gọi target.'],
    ['The Lambda function description.', 'Description của function Lambda.', 'Sai: metadata không là grant invoke.'] ] },
  { en: 'A PutEvents batch returns HTTP success. Why should the publisher still inspect every entry result?', vi: 'PutEvents batch trả HTTP success. Vì sao publisher vẫn phải kiểm từng entry?', section: 'permission', answers: [3], explanation: 'Kết quả cấp request không luôn đồng nghĩa mọi entry được chấp nhận.', choices: [
    ['Every success response means all target actions completed.', 'Mọi success response nghĩa mọi target action xong.', 'Sai: còn nhiều chặng và có thể có lỗi từng entry.'],
    ['EventBridge has no per-entry results.', 'EventBridge không có kết quả từng entry.', 'Sai: publisher cần xem entry errors trong response.'],
    ['HTTP success guarantees exactly-once processing.', 'HTTP success bảo đảm exactly-once processing.', 'Sai: không chứng minh semantics xử lý downstream.'],
    ['Some entries may have failed even though the request was processed.', 'Một số entry có thể lỗi dù request đã được xử lý.', 'Đúng: retry có chọn lọc và theo dõi entry thất bại.'] ] },
  { en: 'Which TWO tests improve confidence in an automatic-remediation event pattern? (Choose TWO.)', vi: 'Hai phép thử nào tăng độ tin cậy pattern tự động remediation? (Chọn HAI.)', section: 'pattern', answers: [0, 4], explanation: 'Cần chứng minh bắt sự kiện cần và loại sự kiện gần giống ngoài phạm vi.', choices: [
    ['Test a real-shaped sample that must match.', 'Test sample đúng shape phải match.', 'Đúng: kiểm tích cực cho nguồn và condition mong muốn.'],
    ['Test only that the JSON parses.', 'Chỉ test JSON parse được.', 'Sai: cú pháp không chứng minh matching semantics.'],
    ['Enable every production action before testing.', 'Bật mọi production action trước khi test.', 'Sai: gây tác động chưa có bằng chứng pattern đúng.'],
    ['Use an unrestricted wildcard to avoid negative cases.', 'Dùng wildcard không hạn chế để tránh negative cases.', 'Sai: tăng blast radius và không kiểm phạm vi.'],
    ['Test similar events from another account or a healthy state that must not match.', 'Test event gần giống từ account khác hoặc trạng thái healthy không được match.', 'Đúng: kiểm ranh giới routing ngoài ý muốn.'] ] },
  { en: 'A target is temporarily unavailable and returns retriable delivery errors. Which EventBridge setting controls retry duration and attempts?', vi: 'Target tạm không sẵn sàng và trả retriable delivery errors. Thiết lập nào điều khiển thời gian/số lần thử?', section: 'delivery', answers: [2], explanation: 'Retry policy đặt theo target; không cần giả định giữ vô hạn.', choices: [
    ['The source log-group retention alone.', 'Chỉ retention log group nguồn.', 'Sai: lưu log nguồn không đặt tuổi/số lần retry target EventBridge và không tự replay delivery đã hết cửa sổ.'],
    ['Only S3 object expiration.', 'Chỉ S3 object expiration.', 'Sai: lifecycle object không điều khiển delivery retry EventBridge.'],
    ['The target retry policy and maximum event age.', 'Target retry policy và maximum event age.', 'Đúng: giới hạn số lần và tuổi event trong quá trình delivery.'],
    ['The SQS target visibility timeout without an EventBridge retry policy.', 'Visibility timeout SQS target mà không xét retry policy EventBridge.', 'Sai: visibility timeout điều khiển message sau khi được SQS consumer nhận; không đặt retry của chặng EventBridge giao tới target.'] ] },
  { en: 'A team configures an EventBridge rule target DLQ using an SQS FIFO queue. What is the issue?', vi: 'Đội cấu hình target DLQ rule EventBridge bằng SQS FIFO. Vấn đề gì?', section: 'delivery', answers: [1], explanation: 'Target DLQ EventBridge hỗ trợ SQS standard theo tài liệu hiện hành.', choices: [
    ['FIFO is mandatory for every EventBridge target DLQ.', 'FIFO bắt buộc cho mọi EventBridge target DLQ.', 'Sai: trái yêu cầu tích hợp target DLQ.'],
    ['Use a supported standard SQS queue for the DLQ.', 'Dùng SQS standard queue được hỗ trợ cho DLQ.', 'Đúng: và phải kiểm Region/queue policy phù hợp.'],
    ['All SQS queues are invalid DLQ destinations.', 'Mọi SQS queue đều không hợp lệ làm DLQ.', 'Sai: standard SQS queue là tích hợp được hỗ trợ.'],
    ['A FIFO target automatically converts its FIFO DLQ into a standard queue.', 'FIFO target tự chuyển FIFO DLQ thành standard queue.', 'Sai: không có chuyển đổi loại queue ngầm như vậy; target DLQ phải được tạo đúng loại hỗ trợ.'] ] },
  { en: 'A target permission error occurs, and the team waits for all normal retries before investigating. What should be clarified?', vi: 'Target gặp lỗi permission nhưng đội chờ hết retry thường rồi mới điều tra. Cần làm rõ gì?', section: 'delivery', answers: [0], explanation: 'Một số lỗi không thể chữa bằng retry và có thể chuyển thẳng DLQ theo cơ chế dịch vụ.', choices: [
    ['Some non-retriable errors can go directly to a configured DLQ; fix the permission issue.', 'Một số lỗi không retry được có thể vào DLQ ngay; cần sửa quyền.', 'Đúng: không giả định mọi lỗi có cùng retry schedule.'],
    ['Permission errors are always fixed automatically by backoff.', 'Permission errors luôn tự được backoff sửa.', 'Sai: retry không tự cấp IAM permission.'],
    ['A larger event payload grants more permissions.', 'Payload event lớn hơn cấp thêm quyền.', 'Sai: dữ liệu không thay policy authorization.'],
    ['Every target error guarantees no data loss without a DLQ.', 'Mọi target error bảo đảm không mất dữ liệu dù không DLQ.', 'Sai: hết giới hạn có thể bị bỏ.'] ] },
  { en: 'Which TWO metrics help verify the failure-capture path itself? (Choose TWO.)', vi: 'Hai metric nào giúp kiểm chứng chính đường thu giữ lỗi? (Chọn HAI.)', section: 'delivery', answers: [1, 3], explanation: 'Phải quan sát cả gửi vào DLQ thành công lẫn thất bại, không chỉ có ARN cấu hình.', choices: [
    ['Only EC2 NetworkPacketsOut.', 'Chỉ EC2 NetworkPacketsOut.', 'Sai: không trực tiếp phản ánh EventBridge DLQ delivery.'],
    ['InvocationsSentToDLQ.', 'InvocationsSentToDLQ.', 'Đúng: cho biết invocation/event lỗi đã được gửi DLQ.'],
    ['Only MatchedEvents without any failed-delivery metrics.', 'Chỉ MatchedEvents không có failed-delivery metrics.', 'Sai: matching diễn ra trước delivery; không chứng minh event lỗi đã được cứu vào DLQ.'],
    ['InvocationsFailedToBeSentToDLQ.', 'InvocationsFailedToBeSentToDLQ.', 'Đúng: phát hiện chính đường lưu lỗi bị hỏng.'],
    ['Only the DLQ retention setting without message/delivery metrics.', 'Chỉ retention setting DLQ không có message/delivery metrics.', 'Sai: retention định thời gian giữ khi message đã vào queue, không chứng minh EventBridge có thể ghi vào queue.'] ] },
  { en: 'EventBridge successfully invokes Lambda, but the handler later fails. Why might the EventBridge target DLQ be empty?', vi: 'EventBridge invoke Lambda thành công nhưng handler lỗi sau đó. Vì sao target DLQ EventBridge có thể rỗng?', section: 'delivery', answers: [2], explanation: 'Delivery được chấp nhận khác kết quả xử lý bên trong target; phải xét Lambda invocation error handling.', choices: [
    ['A DLQ proves that handlers can never fail.', 'DLQ chứng minh handler không thể lỗi.', 'Sai: không có bảo đảm nghiệp vụ như vậy.'],
    ['EventBridge automatically ignores all Lambda functions.', 'EventBridge tự bỏ qua mọi Lambda function.', 'Sai: đây là target được hỗ trợ.'],
    ['The failure belongs to Lambda processing after accepted delivery, requiring the relevant Lambda failure mechanism.', 'Lỗi thuộc xử lý Lambda sau khi nhận delivery, cần cơ chế lỗi Lambda tương ứng.', 'Đúng: không gom mọi chặng lỗi vào target delivery DLQ.'],
    ['SQS cannot store JSON.', 'SQS không lưu JSON được.', 'Sai: JSON message không là nguyên nhân.'] ] },
  { en: 'A remediation event describes a public rule that has already been fixed manually. What should the automation do first?', vi: 'Event remediation mô tả public rule đã được sửa tay. Automation nên làm gì trước?', section: 'remediation', answers: [3], explanation: 'Sự kiện có thể cũ; current-state check tránh thay đổi không cần hoặc ghi đè trạng thái hợp lệ mới.', choices: [
    ['Always overwrite current settings with the old event payload.', 'Luôn ghi đè cấu hình hiện tại theo payload cũ.', 'Sai: có thể khôi phục trạng thái không còn phù hợp.'],
    ['Delete the entire account.', 'Xóa toàn account.', 'Sai: phá hủy vượt mục tiêu remediation.'],
    ['Assume events always arrive in perfect order.', 'Cho rằng events luôn đến đúng thứ tự tuyệt đối.', 'Sai: thiết kế phải chịu stale/out-of-order events.'],
    ['Read the current resource state and make a scoped change only if still needed.', 'Đọc trạng thái hiện tại và chỉ sửa trong phạm vi nếu vẫn cần.', 'Đúng: có thể ghi no-op khi đã compliant.'] ] },
  { en: 'A rule reacts to every ACL update, and its function writes the same ACL each time. What can cause a runaway loop?', vi: 'Rule bắt mọi ACL update, function lần nào cũng ghi lại cùng ACL. Điều gì gây loop không dừng?', section: 'remediation', answers: [0], explanation: 'Side effect của remediation tự phát event match rule và tiếp tục gọi lại.', choices: [
    ['The remediation generates another matching event.', 'Remediation tạo event khác lại match.', 'Đúng: cần filter/state check và giới hạn bảo vệ.'],
    ['EventBridge cannot match ACL events at all.', 'EventBridge không match được bất kỳ ACL event nào.', 'Sai: không giải thích vòng phản hồi mô tả.'],
    ['A long retry age guarantees one new invocation per second after success.', 'Retry age dài bảo đảm một invocation mới mỗi giây sau thành công.', 'Sai: retry age giới hạn thử giao thất bại, không tạo lịch chạy mới sau delivery thành công; event từ side effect mới là vòng phản hồi.'],
    ['Lambda concurrency automatically creates a new ACL update before code runs.', 'Lambda concurrency tự tạo ACL update trước khi code chạy.', 'Sai: concurrency giới hạn thực thi; side effect do code/cấu hình mới tạo API update và event tiếp theo.'] ] },
  { en: 'Which TWO protections matter for a consumer that creates external tickets from events? (Choose TWO.)', vi: 'Hai bảo vệ nào quan trọng cho consumer tạo ticket từ event? (Chọn HAI.)', section: 'remediation', answers: [0, 4], explanation: 'Tạo ticket có side effect, nên dedup bền và kiểm nghiệp vụ trước khi lặp.', choices: [
    ['Use a stable event/business key with durable idempotency handling.', 'Dùng event/business key ổn định với idempotency bền vững.', 'Đúng: tránh tạo ticket trùng do retry/replay.'],
    ['Assume every event is delivered exactly once.', 'Giả định mọi event giao đúng một lần.', 'Sai: không phải giả định an toàn cho workflow.'],
    ['Use only a local variable that disappears after each invocation.', 'Chỉ dùng biến local mất sau invocation.', 'Sai: không giữ trạng thái dedup qua các lần xử lý.'],
    ['Treat every payload string as a shell command.', 'Coi mọi chuỗi payload là lệnh shell.', 'Sai: tạo đường thực thi không được kiểm soát.'],
    ['Validate scope and whether the incident already has the intended ticket.', 'Xác minh phạm vi và sự cố đã có ticket mong muốn chưa.', 'Đúng: kiểm trạng thái nghiệp vụ giúp tránh side effect lặp.'] ] },
  { en: 'A central bus receives events from many accounts. Why should recipient rules retain and check account context?', vi: 'Bus trung tâm nhận nhiều account. Vì sao rule nhận nên giữ và kiểm account context?', section: 'operations', answers: [2], explanation: 'Cần đúng nguồn và đúng resource account để tránh remediation sai phạm vi.', choices: [
    ['Account IDs are only cosmetic and never matter.', 'Account ID chỉ trang trí, không bao giờ quan trọng.', 'Sai: ranh giới account là cơ sở authorization và ownership.'],
    ['All organization accounts automatically have identical rights.', 'Mọi account organization tự có quyền giống hệt.', 'Sai: bus/resource/role policies vẫn kiểm soát.'],
    ['It supports source validation, audit and selection of the correct account for action.', 'Hỗ trợ xác minh nguồn, audit và chọn account đúng để hành động.', 'Đúng: tránh trộn event tương tự từ tài nguyên khác account.'],
    ['It automatically bypasses every SCP.', 'Tự bypass mọi SCP.', 'Sai: metadata không loại guardrails.'] ] },
  { en: 'An input transformer removes event ID and source account before forwarding to a central processor. What tradeoff is introduced?', vi: 'Input transformer bỏ event ID và source account trước processor trung tâm. Tradeoff gì xuất hiện?', section: 'permission', answers: [1], explanation: 'Giảm payload có thể làm mất context quan trọng cho dedup, truy vết và scope.', choices: [
    ['The processor gains administrator permissions automatically.', 'Processor tự có quyền quản trị.', 'Sai: input transform không cấp quyền IAM.'],
    ['Deduplication and source attribution become harder unless equivalent context is preserved.', 'Dedup và xác định nguồn khó hơn nếu không giữ context tương đương.', 'Đúng: cần thiết kế input contract theo nhu cầu vận hành.'],
    ['All target retries are disabled automatically.', 'Mọi target retry tự bị tắt.', 'Sai: retry policy là cấu hình riêng.'],
    ['S3 encryption becomes impossible.', 'S3 encryption trở nên không thể.', 'Sai: không liên quan trực tiếp input fields này.'] ] },
  { en: 'A replay reintroduces events whose remediation already succeeded. What must the design consider?', vi: 'Replay đưa lại event đã remediation thành công. Thiết kế phải xét gì?', section: 'operations', answers: [3], explanation: 'Replay phục hồi dữ liệu không tự bảo đảm side effects chỉ chạy một lần.', choices: [
    ['Replay automatically reverses every previous action.', 'Replay tự đảo mọi hành động trước đó.', 'Sai: không là semantics archive/replay.'],
    ['Archived events never reach targets.', 'Archived event không bao giờ tới targets.', 'Sai: mục đích replay là đưa lại event cho processing theo cơ chế.'],
    ['No monitoring is needed because the events are historical.', 'Không cần monitoring vì event là lịch sử.', 'Sai: vẫn có thể tạo side effect lặp hoặc quá tải.'],
    ['Idempotency, current state and intentional replay behavior.', 'Idempotency, current state và hành vi replay có chủ đích.', 'Đúng: tránh duplicate ticket/remediation và kiểm phạm vi replay.'] ] },
  { en: 'Which TWO checks are needed when configuring an EventBridge target DLQ through an API? (Choose TWO.)', vi: 'Hai kiểm tra nào cần khi cấu hình target DLQ EventBridge qua API? (Chọn HAI.)', section: 'delivery', answers: [1, 3], explanation: 'DLQ phải là resource phù hợp và policy cho phép dịch vụ ghi; API không nên được giả định tự thêm policy như console.', choices: [
    ['The queue must be a FIFO queue in any arbitrary Region.', 'Queue phải FIFO ở Region tùy ý.', 'Sai: target DLQ dùng standard và ràng buộc Region phù hợp rule.'],
    ['The standard queue is in the supported Region for the rule.', 'Standard queue ở Region được hỗ trợ cho rule.', 'Đúng: kiểm yêu cầu cùng Region theo tài liệu target DLQ.'],
    ['The queue description contains the word retry.', 'Queue description có từ retry.', 'Sai: description không tạo permission hoặc delivery semantics.'],
    ['The queue policy grants EventBridge SendMessage for the intended rule.', 'Queue policy cho EventBridge SendMessage từ rule dự định.', 'Đúng: không có quyền thì chính failure capture cũng thất bại.'],
    ['The queue is publicly writable by everyone.', 'Queue cho mọi người ghi public.', 'Sai: quá rộng và không cần thiết cho tích hợp.'] ] },
  { en: 'A monitoring dashboard shows MatchedEvents only. Why is it insufficient to claim remediation success?', vi: 'Dashboard chỉ có MatchedEvents. Vì sao chưa đủ kết luận remediation thành công?', section: 'operations', answers: [0], explanation: 'Matching chưa chứng minh delivery, target execution hay trạng thái resource sau sửa.', choices: [
    ['Matching is only one stage; verify target delivery, processing output and resource state.', 'Matching chỉ một chặng; phải kiểm delivery, output xử lý và trạng thái resource.', 'Đúng: end-to-end success cần bằng chứng ở kết quả mong muốn.'],
    ['MatchedEvents always proves all downstream actions completed.', 'MatchedEvents luôn chứng minh mọi action downstream hoàn tất.', 'Sai: không bao phủ các chặng sau.'],
    ['Dashboards can never display any EventBridge data.', 'Dashboard không thể hiển thị dữ liệu EventBridge.', 'Sai: có thể hiển thị metrics phù hợp.'],
    ['Only changing the dashboard title fixes target failures.', 'Chỉ đổi tiêu đề dashboard sẽ sửa target lỗi.', 'Sai: tiêu đề không điều khiển processing.'] ] },
  { en: 'A lab cleanup deletes the target queue while a rule still routes new events. What is the better teardown order?', vi: 'Cleanup lab xóa queue target khi rule còn route event mới. Thứ tự teardown tốt hơn?', section: 'operations', answers: [2], explanation: 'Dừng nguồn routing trước rồi gỡ dependencies để tránh phát lỗi trong lúc dọn.', choices: [
    ['Delete the target first and rely on retries while cleaning up the rule later.', 'Xóa target trước rồi dựa retry trong lúc dọn rule sau.', 'Sai: rule còn hoạt động có thể tạo delivery failures/DLQ không cần thiết; disable routing trước mới kiểm soát teardown.'],
    ['Leave the rule enabled forever.', 'Giữ rule enabled mãi.', 'Sai: tiếp tục nhận event và lỗi target không tồn tại.'],
    ['Disable the lab rule, remove its targets, then delete lab rule/bus and queues.', 'Disable rule lab, gỡ targets rồi xóa rule/bus và queues của lab.', 'Đúng: dừng routing trước khi phá đích riêng.'],
    ['Remove all organization SCPs.', 'Gỡ mọi SCP organization.', 'Sai: không liên quan cleanup và mở rộng rủi ro.'] ] },
  { en: 'A remediation design trusts a payload Owner tag to authorize deleting a resource. What is missing?', vi: 'Thiết kế remediation tin Owner tag trong payload để cho phép xóa resource. Thiếu gì?', section: 'permission', answers: [1], explanation: 'Payload data không tự là authority; cần kiểm current state và IAM scope đúng.', choices: [
    ['A longer event description only.', 'Chỉ description event dài hơn.', 'Sai: không tạo authorization đáng tin.'],
    ['Trusted source validation, current-resource checks and least-privilege authorization for the actual action.', 'Xác minh nguồn đáng tin, kiểm resource hiện tại và quyền tối thiểu cho action thực.', 'Đúng: không dùng dữ liệu event chưa kiểm làm quyền xóa tùy ý.'],
    ['A public administrator access key.', 'Access key quản trị public.', 'Sai: làm lộ bí mật và phá kiểm soát quyền.'],
    ['A target role with wildcard delete permissions and no resource validation.', 'Target role có wildcard delete permissions và không kiểm resource.', 'Sai: càng mở rộng blast radius; cần IAM scope và current-state/source validation chứ không tin dữ liệu payload làm authority.'] ] }
]);
