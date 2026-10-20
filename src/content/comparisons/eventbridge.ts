import type { ComparisonArticle } from './types';

export const eventBridgeArticles: Record<string, ComparisonArticle> = {
  eventbridge: {
    reading: [
      {
        title: '1. Amazon EventBridge là gì?',
        paragraphs: ['Amazon EventBridge giúp hệ thống tự phản ứng khi có sự kiện xảy ra. Bạn chọn loại sự kiện muốn theo dõi, đặt điều kiện và chỉ ra dịch vụ nào sẽ xử lý khi điều kiện khớp.'],
        quote: 'Có chuyện A xảy ra → đúng điều kiện bạn đặt → tự động thực hiện việc B.',
        bullets: [
          'ECS task chuyển sang STOPPED → gửi thông báo cho người vận hành.',
          'Có người thêm rule vào security group → gọi Lambda kiểm tra thay đổi.',
          'AWS Config báo tài nguyên không đạt yêu cầu → gửi cảnh báo hoặc chạy bước khắc phục.',
          'Đơn hàng quốc tế được tạo → chạy quy trình xử lý riêng cho đơn quốc tế.'
        ],
        after: ['Bạn không cần viết chương trình cứ vài giây lại kiểm tra xem AWS có gì thay đổi. Với nguồn được hỗ trợ, sự kiện được gửi tới EventBridge và các rule của bạn chọn việc cần làm. Nhưng bạn vẫn phải cấu hình rule, target và quyền phù hợp; EventBridge không tự biết thay đổi nào công ty coi là lỗi.']
      },
      {
        title: '2. Một sự kiện đi qua những đâu?',
        paragraphs: ['Để hiểu cách event bus và các rule hoạt động, bạn chỉ cần nắm bốn thành phần:'],
        steps: [
          '**Event source**: nơi phát sinh sự kiện, như ECS, AWS Config hoặc ứng dụng của bạn.',
          '**Event bus**: nơi nhận sự kiện.',
          '**Rule**: điều kiện chọn sự kiện. Ví dụ, chỉ chọn task đã STOPPED trong cluster cần theo dõi.',
          '**Target**: nơi nhận sự kiện để làm việc tiếp, như SNS, Lambda, SQS hoặc Step Functions.'
        ],
        diagram: 'ECS / AWS Config / ứng dụng\n             │\n             ▼\n         Event bus\n             │\n             ▼\n      Rule lọc sự kiện\n             │\n       ┌─────┼─────┐\n       ▼     ▼     ▼\n     Lambda SNS   SQS\n     xử lý  báo   chờ worker\n            tin   xử lý',
        after: ['Một sự kiện có thể khớp nhiều rule và đi tới nhiều target. Bên phát không cần biết tất cả các hệ thống sẽ nhận và xử lý sự kiện. Phần event bus trong bài dùng mô hình Classic với rule và target. Scheduler và Pipes có cách hoạt động riêng, được giải thích ở các phần sau.']
      },
      {
        title: '3. Ví dụ: báo khi ECS Fargate task bị dừng',
        paragraphs: ['Ứng dụng của bạn chạy trên ECS Fargate. Bạn muốn nhận thông báo khi một task chuyển sang STOPPED. ECS có thể gửi trực tiếp sự kiện ECS Task State Change tới EventBridge. Bạn tạo rule với event pattern sau:'],
        code: '{\n  "source": ["aws.ecs"],\n  "detail-type": ["ECS Task State Change"],\n  "detail": {\n    "lastStatus": ["STOPPED"]\n  }\n}',
        codeExplanation: [
          '`source` chỉ chọn sự kiện của ECS.',
          '`detail-type` chọn sự kiện thay đổi trạng thái task.',
          '`detail.lastStatus` chỉ khớp khi trạng thái đã là STOPPED.'
        ],
        after: ['Sau đó, bạn đặt target là SNS để gửi thông báo hoặc Lambda để kiểm tra thêm. Pattern này chỉ là phần lọc, chưa tạo SNS topic, chưa xác nhận email và chưa cấp quyền cho EventBridge gửi vào topic.', 'Task dừng không nhất thiết là lỗi. Task có thể dừng khi hệ thống giảm số task, triển khai bản mới hoặc khi task đã hoàn thành công việc. Muốn chỉ báo sự cố, hãy xem thêm stopCode, stoppedReason, exitCode của container và bối cảnh triển khai. Bạn cũng có thể lọc clusterArn để không nhận mọi task trong tài khoản.']
      },
      {
        title: '4. Muốn biết ai vừa sửa security group thì làm sao?',
        paragraphs: ['Trường hợp này khác sự kiện ECS trực tiếp. Bạn muốn bắt một thao tác API được CloudTrail ghi lại. Ví dụ dưới chọn lời gọi thêm inbound rule vào security group:'],
        code: '{\n  "source": ["aws.ec2"],\n  "detail-type": ["AWS API Call via CloudTrail"],\n  "detail": {\n    "eventSource": ["ec2.amazonaws.com"],\n    "eventName": ["AuthorizeSecurityGroupIngress"]\n  }\n}',
        codeExplanation: [
          '`AWS API Call via CloudTrail` là thông tin về lời gọi API, không phải tên một sự kiện trạng thái của EC2.',
          '`eventSource` chọn API của EC2; `eventName` chọn thao tác thêm inbound rule.',
          'Pattern này chọn mọi lời gọi phù hợp với điều kiện trên, chưa xác nhận rule mới mở cổng nào hoặc cho phép dải IP nào truy cập.'
        ],
        after: ['Bạn cần một trail đang ghi loại sự kiện tương ứng. Việc xem được thao tác trong Event history của CloudTrail không có nghĩa là bạn đã cấu hình đủ để chuyển sự kiện đó tới EventBridge.', 'Nếu chỉ muốn cảnh báo khi mở port 5432 cho 0.0.0.0/0, Lambda có thể đọc dữ liệu sự kiện và kiểm tra cấu hình hiện tại trước khi thông báo hoặc sửa. Đây cũng không phải danh sách đầy đủ mọi API thay đổi security group; chẳng hạn việc chỉnh sửa rule sẵn có có thể dùng API khác.']
      },
      {
        title: '5. CloudWatch, CloudTrail, Config và EventBridge phối hợp ra sao?',
        paragraphs: ['Bốn dịch vụ này thường xuất hiện cùng nhau vì mỗi dịch vụ giúp bạn trả lời một câu hỏi khác nhau:'],
        table: {
          columns: ['Dịch vụ', 'Việc chính trong ví dụ'],
          rows: [
            ['CloudWatch', 'Website đang lỗi gì, CPU có cao không, độ trễ có tăng không?'],
            ['CloudTrail', 'Ai đã gọi API sửa security group?'],
            ['AWS Config', 'Cấu hình hiện tại có đạt quy tắc công ty đặt ra không?'],
            ['EventBridge', 'Nhận sự kiện phù hợp và gọi nơi cần xử lý tiếp.']
          ]
        },
        after: ['Giả sử công ty không cho database mở port 5432 ra Internet. Bạn bật Config ghi nhận tài nguyên và triển khai rule kiểm tra đúng yêu cầu đó. Khi kết quả tuân thủ thay đổi, Config có thể phát sự kiện Config Rules Compliance Change. Rule EventBridge chọn kết quả mới NON_COMPLIANT rồi gửi tới SNS hoặc Lambda.'],
        diagram: 'Security group bị mở ra Internet\n               │\n               ▼\nAWS Config rule đánh giá NON_COMPLIANT\n               │\n               ▼\nEventBridge rule chọn sự kiện\n               │\n          ┌────┴────┐\n          ▼         ▼\n         SNS      Lambda\n       cảnh báo   kiểm tra rồi xử lý'
      },
      {
        title: '6. Chạy batch lúc 6 giờ sáng dùng EventBridge thế nào?',
        paragraphs: ['Với yêu cầu chạy theo giờ, bạn dùng EventBridge Scheduler. Bạn định nghĩa lịch và target, chẳng hạn gọi ECS RunTask để chạy container xử lý báo cáo. Bạn không cần duy trì một EC2 instance chỉ để chờ đến giờ chạy cron.'],
        diagram: 'EventBridge Scheduler\n06:00, giờ Việt Nam\n          │\n          ▼\n      ECS RunTask\n          │\n          ▼\nContainer chạy batch rồi kết thúc',
        code: '{\n  "ScheduleExpression": "cron(0 6 * * ? *)",\n  "ScheduleExpressionTimezone": "Asia/Ho_Chi_Minh",\n  "FlexibleTimeWindow": { "Mode": "OFF" }\n}',
        codeExplanation: [
          '`cron(0 6 * * ? *)` đặt lịch chạy hằng ngày vào phút 00 của giờ 06.',
          '`ScheduleExpressionTimezone` xác định đó là giờ Việt Nam.',
          '`FlexibleTimeWindow: OFF` tắt khoảng chạy linh hoạt rộng hơn; Scheduler vẫn có độ chính xác theo phút, không cam kết chạy đúng giây 00.'
        ],
        after: ['Đây là phần cấu hình thời gian minh họa, chưa phải toàn bộ yêu cầu CreateSchedule. Bạn còn phải chọn target và execution role có quyền gọi target. Với ECS, cần cấu hình task, cluster, mạng và những quyền liên quan phù hợp.', 'Scheduler hỗ trợ cron, rate và lịch chạy một lần. Chẳng hạn rate(15 minutes) là chạy theo chu kỳ 15 phút. Scheduled rules là cách đặt lịch cũ; với lịch mới, Scheduler là lựa chọn nên xem trước, nhất là khi cần múi giờ hoặc chạy một lần.']
      },
      {
        title: '7. EventBridge Pipes có phải event bus không?',
        paragraphs: ['Pipes dùng để nối một nguồn được hỗ trợ với một target, có thể lọc và bổ sung dữ liệu trên đường đi. Ví dụ, nhận thông điệp từ SQS, chỉ giữ các đơn cần kiểm tra, gọi Lambda lấy thêm thông tin khách hàng rồi chuyển tới nơi xử lý.'],
        diagram: 'SQS → lọc → bổ sung dữ liệu nếu cần → target',
        after: ['Bạn chọn Pipes khi cần một đường nối nguồn–đích như vậy. Event bus phù hợp hơn khi nhiều nguồn phát sự kiện và nhiều rule quyết định những nơi nhận khác nhau. Bạn cũng có thể cho Pipes gửi tới event bus nếu kiến trúc cần cả hai.']
      },
      {
        title: '8. Nếu target bị lỗi thì có mất sự kiện không?',
        paragraphs: ['Với các lỗi gửi sự kiện cho phép thử lại, EventBridge Classic mặc định thử trong tối đa 24 giờ và tối đa 185 lần, dừng khi chạm một trong hai giới hạn. Bạn có thể cấu hình retry policy của target và một SQS Standard queue làm DLQ để giữ sự kiện không giao được.'],
        bullets: ['Một số lỗi như thiếu quyền có thể được đưa thẳng vào DLQ, thay vì thử đi thử lại một cấu hình sai.', 'Nếu hết giới hạn mà không giao được và không có DLQ phù hợp, sự kiện có thể bị bỏ.', 'Nếu EventBridge đã gửi thành công vào SQS nhưng worker gặp lỗi khi xử lý, bạn cần xử lý retry và DLQ ở phía queue/worker.', 'Nếu Lambda đã nhận lời gọi bất đồng bộ rồi mới lỗi lúc chạy, kiểm tra cơ chế xử lý lỗi bất đồng bộ của Lambda.'],
        after: ['Đây là lý do cần phân biệt “giao được yêu cầu” với “làm xong công việc”. Khi thử lại hoặc chạy lại sự kiện, ứng dụng nên dùng mã nghiệp vụ ổn định để tránh tạo đơn, gửi thư hoặc trừ tiền nhiều lần.', 'Nếu muốn chạy lại lịch sử trên event bus Classic, bạn phải chuẩn bị archive rồi replay về bus nguồn. Archive lưu các sự kiện được chọn; DLQ giữ sự kiện hoặc thông điệp không xử lý được ở một bước cụ thể. Không nên coi chúng là cùng một chức năng.']
      },
      {
        title: '9. Gặp tình huống này thì nghĩ tới gì?',
        paragraphs: ['Bạn có thể nhận ra vai trò của từng dịch vụ từ việc mình đang cần làm:'],
        table: {
          columns: ['Tình huống', 'Dịch vụ nên nghĩ tới'],
          rows: [
            ['ECS task đổi trạng thái và cần gửi thông báo.', 'EventBridge rule → SNS.'],
            ['Muốn biết ai gọi API sửa tài nguyên.', 'CloudTrail; thêm EventBridge nếu cần phản ứng tự động.'],
            ['Cấu hình vi phạm rule và cần xử lý tiếp.', 'AWS Config → EventBridge → SNS/Lambda.'],
            ['CPU cao kéo dài và cần cảnh báo.', 'CloudWatch Alarm.'],
            ['Chạy báo cáo hằng ngày theo giờ.', 'EventBridge Scheduler.'],
            ['Nối một nguồn với một target, có lọc/bổ sung dữ liệu.', 'EventBridge Pipes.']
          ]
        },
        after: ['EventBridge không thay thế dịch vụ theo dõi hiệu năng hay kiểm tra cấu hình. Nó giúp nối thông tin về việc đã xảy ra với hành động mà bạn muốn hệ thống thực hiện tiếp.']
      }
    ]
  }
};
