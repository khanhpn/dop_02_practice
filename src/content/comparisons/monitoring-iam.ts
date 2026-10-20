import type { ComparisonArticle } from './types';

export const monitoringIamArticles: Record<string, ComparisonArticle> = {
  'cloudwatch-cloudtrail-config': {
    reading: [
      {
        title: '1. CloudWatch là gì?',
        paragraphs: [
          'CloudWatch là dịch vụ theo dõi hoạt động của hệ thống trên AWS. Bạn dùng nó để xem máy chủ có quá tải không, website có chậm không và ứng dụng đang báo lỗi gì.'
        ],
        quote: 'Nói đơn giản: CloudWatch giúp bạn biết hệ thống đang chạy thế nào.',
        bullets: [
          'Website trả lỗi nhiều hơn bình thường: xem số lỗi và log ứng dụng.',
          'Máy EC2 chạy chậm: xem CPU và những thông số bạn đã thu thập.',
          'Database nhiều kết nối: xem chỉ số kết nối và đối chiếu thời điểm website chậm.',
          'Muốn được báo khi có dấu hiệu bất thường: đặt CloudWatch alarm.'
        ],
        after: ['Ví dụ xuyên suốt bài này là một website bán hàng chạy trên EC2, dùng RDS làm database. Khi khách báo không đặt hàng được, CloudWatch là nơi bạn bắt đầu xem ảnh hưởng và tìm dấu hiệu lỗi.']
      },
      {
        title: '2. Metrics, logs và alarms khác nhau thế nào?',
        paragraphs: ['Ba phần này thường được dùng cùng nhau, nhưng mỗi phần làm một việc:'],
        steps: [
          'Metrics là số đo theo thời gian. Ví dụ CPU của EC2, số kết nối database hoặc số yêu cầu lỗi. Bạn xem biểu đồ để biết vấn đề bắt đầu lúc nào và tăng mạnh đến đâu.',
          'Logs là nhật ký chi tiết. Chỉ số cho biết có nhiều giao dịch lỗi; log giúp đọc lỗi cụ thể, chẳng hạn kết nối database hết thời gian chờ. Logs Insights giúp tìm các dòng liên quan trong lượng log lớn.',
          'Alarms theo dõi điều kiện trên dữ liệu rồi chuyển trạng thái khi điều kiện được đáp ứng. Bạn có thể gắn hành động như gửi thông báo qua SNS hoặc một hành động được hỗ trợ khác.'
        ],
        diagram: 'EC2 / RDS / ứng dụng\n        |\n        +-- số đo ----> CloudWatch Metrics ---> Alarm ---> SNS\n        |\n        +-- nhật ký --> CloudWatch Logs ------> tìm lỗi',
        after: [
          'Không phải mọi dữ liệu đều có sẵn. Thông số bên trong hệ điều hành hoặc số thanh toán thất bại có thể cần agent hay ứng dụng gửi thêm. Log cũng cần nguồn gửi và quyền ghi; tạo log group chưa khiến CloudWatch tự đọc được log website.',
          'CPU thấp không chứng minh khách đặt hàng được. Bạn nên theo dõi cả kết quả người dùng nhận được, chẳng hạn tỷ lệ lỗi và thời gian phản hồi, thay vì chỉ nhìn tài nguyên máy chủ.'
        ]
      },
      {
        title: '3. Một alarm cụ thể trông như thế nào?',
        paragraphs: [
          'Giả sử bạn muốn phát hiện EC2 dùng CPU cao kéo dài. Đây là cấu hình minh họa cho PutMetricAlarm, theo dõi CPU trung bình vượt 80% ở cả ba khoảng đánh giá, mỗi khoảng năm phút. Instance ID là giá trị ví dụ, phải thay bằng máy thực tế.'
        ],
        code: `{
  "AlarmName": "web-cpu-high",
  "Namespace": "AWS/EC2",
  "MetricName": "CPUUtilization",
  "Dimensions": [
    { "Name": "InstanceId", "Value": "i-0123456789abcdef0" }
  ],
  "Statistic": "Average",
  "Period": 300,
  "EvaluationPeriods": 3,
  "DatapointsToAlarm": 3,
  "Threshold": 80,
  "ComparisonOperator": "GreaterThanThreshold",
  "TreatMissingData": "missing"
}`,
        codeExplanation: [
          'Namespace và MetricName chọn chỉ số CPU của EC2. Dimensions chọn đúng instance; nếu nhầm ID, bạn đang theo dõi nhầm máy hoặc không có dữ liệu.',
          'Statistic: Average và Period: 300 nghĩa là dùng CPU trung bình trong từng khoảng 300 giây, không phải chỉ cần một lần CPU chạm 81%.',
          'EvaluationPeriods: 3 và DatapointsToAlarm: 3 nghĩa là cần cả ba điểm đánh giá vượt ngưỡng. Với dữ liệu đầy đủ, đó là ba khoảng năm phút vượt 80%.',
          'GreaterThanThreshold nghĩa là lớn hơn 80, không bao gồm đúng 80. TreatMissingData: missing không tự coi dữ liệu thiếu là bình thường; khi không đủ dữ liệu để đánh giá, alarm có thể ở trạng thái INSUFFICIENT_DATA.',
          'Ví dụ chưa có AlarmActions. Muốn gửi thông báo, bạn cần cấu hình thêm hành động, chẳng hạn topic SNS có quyền và subscription phù hợp.'
        ],
        after: ['Alarm này chỉ phát hiện CPU cao. Nó không đo lỗi HTTP, không tự đếm đơn hàng thất bại và cũng không chứng minh website đã hỏng. Nếu mục tiêu là phát hiện lỗi đặt hàng, bạn cần chỉ số phản ánh đúng lỗi đó.']
      },
      {
        title: '4. CloudTrail là gì?',
        paragraphs: [
          'CloudTrail ghi lại hoạt động trong tài khoản AWS, đặc biệt là những thao tác gọi API. Bạn dùng nó để tìm danh tính nào đã thực hiện thao tác gì, lúc nào và liên quan tài nguyên nào.'
        ],
        quote: 'Nói đơn giản: CloudTrail giúp bạn tìm ai đã làm gì trên AWS.',
        bullets: [
          'Ai vừa sửa security group của database?',
          'Role nào đã gọi API dừng một EC2 instance?',
          'Lệnh được gọi vào thời điểm nào, từ đâu và có báo lỗi không?'
        ],
        after: [
          'Người gọi có thể thao tác trên console, dùng dòng lệnh hoặc là ứng dụng đang dùng IAM role. Các cách này đều có thể tạo hoạt động API được CloudTrail ghi nhận khi nằm trong phạm vi hỗ trợ và cấu hình.',
          'Nếu website dùng chung một role để truy cập S3 cho nhiều khách hàng, CloudTrail có thể chỉ cho thấy phiên của role. Muốn tìm khách hàng cụ thể, bạn còn cần log và mã đối chiếu từ ứng dụng.'
        ]
      },
      {
        title: '5. CloudTrail có ghi mọi lần đọc file S3 không?',
        paragraphs: ['Không mặc định như vậy. Có hai nhóm bạn cần phân biệt:'],
        bullets: [
          'Management events: thao tác quản lý tài nguyên, như tạo EC2, đổi cấu hình bucket hoặc sửa security group.',
          'Data events: thao tác trên dữ liệu, như S3 GetObject, PutObject, DeleteObject hoặc Lambda Invoke.'
        ],
        after: [
          'Event history có sẵn cho bạn xem management events trong 90 ngày gần nhất, theo từng tài khoản và Region. Nó không hiển thị data events. Vì vậy, tìm ở đây không thấy lần tải file chưa có nghĩa là chưa ai tải.',
          'Muốn theo dõi đọc file nhạy cảm, bạn phải bật data events cho đúng tài nguyên và phạm vi cần ghi; phần này có chi phí riêng. Bật hôm nay không tạo lại được lịch sử đọc file của tháng trước.',
          'Muốn lưu lâu hơn, bạn cần trail hoặc kho sự kiện thích hợp. Với nhiều tài khoản, organization trail giúp ghi hoạt động toàn tổ chức theo cấu hình đã chọn. Bạn vẫn phải chọn phạm vi Region, nơi lưu và quyền truy cập; Event history không tự gom cả công ty.'
        ]
      },
      {
        title: '6. AWS Config là gì?',
        paragraphs: [
          'AWS Config theo dõi cấu hình của tài nguyên và những thay đổi của cấu hình đó. Ví dụ, security group hôm qua cho phép kết nối từ đâu, hôm nay có thêm rule gì, hoặc tài nguyên có bật mã hóa theo yêu cầu không.'
        ],
        quote: 'Nói đơn giản: Config giúp bạn xem tài nguyên được cấu hình ra sao và có đúng yêu cầu không.',
        steps: [
          'Bật ghi nhận cho những loại tài nguyên được hỗ trợ mà bạn cần theo dõi. Config lưu thông tin cấu hình và quan hệ của chúng.',
          'Thêm Config rule nếu muốn kiểm tra một yêu cầu cụ thể, chẳng hạn tài nguyên phải bật mã hóa. Ghi nhận cấu hình và đánh giá bằng rule là hai việc riêng.',
          'Nếu muốn tự sửa vi phạm, cấu hình thêm bước khắc phục, thường dùng Systems Manager Automation, và role có quyền phù hợp.'
        ],
        after: [
          'Config không mặc định chặn thay đổi sai ngay lúc người dùng gọi API. Việc ghi và đánh giá có thể theo thay đổi hoặc theo lịch tùy tài nguyên, chế độ ghi và rule; dữ liệu có thể đến chậm. Bước tự sửa nên kiểm tra lại cấu hình hiện tại trước khi chạy vì kết quả đánh giá có thể đã cũ.',
          'Nếu có nhiều tài khoản và Region, aggregator giúp xem chung dữ liệu đã có. Nó không tự bật ghi nhận ở tài khoản nguồn và cũng không tự sửa tài nguyên. Muốn biết ai gây ra thay đổi cấu hình, bạn vẫn đối chiếu CloudTrail.'
        ]
      },
      {
        title: '7. Website mất kết nối database: ghép cả ba ra sao?',
        paragraphs: ['Giả sử từ 10 giờ sáng khách bắt đầu không đặt hàng được. Bạn kiểm tra theo diễn biến này:'],
        steps: [
          'CloudWatch: số lỗi kết nối tăng. Log ứng dụng cho thấy lỗi khi kết nối database, giúp bạn khoanh vùng vấn đề.',
          'Config: security group của database vừa mất rule cho phép ứng dụng kết nối. Bạn xem được cấu hình trước và sau thay đổi.',
          'CloudTrail: tìm sự kiện sửa rule, biết role nào gọi API và thời điểm gọi.',
          'Sau khi sửa, quay lại CloudWatch xem giao dịch đã bình thường chưa. Nếu có Config rule liên quan, kiểm tra thêm lần đánh giá mới.'
        ],
        diagram: 'Khách không đặt hàng được\n          |\n          v\nCloudWatch: lỗi gì, ảnh hưởng thế nào?\n          |\n          v\nConfig: cấu hình nào đã đổi?\n          |\n          v\nCloudTrail: ai gọi API thay đổi?\n          |\n          v\nSửa nguyên nhân -> kiểm tra ứng dụng',
        after: ['Bạn cần khớp đúng tài nguyên và khoảng thời gian, vì bản ghi từ ba dịch vụ không nhất thiết xuất hiện cùng lúc. Ví dụ này cũng giả sử bạn đã thu thập log, cấu hình và sự kiện cần thiết từ trước.']
      },
      {
        title: '8. So sánh nhanh và cách nhận ra trong câu hỏi',
        paragraphs: ['Bạn có thể đối chiếu nhanh bằng bảng này:'],
        table: {
          columns: ['Bạn cần biết', 'Dịch vụ chính', 'Lý do'],
          rows: [
            ['Website chậm hay lỗi tăng?', 'CloudWatch', 'Xem số đo, log và cảnh báo.'],
            ['Ai sửa security group?', 'CloudTrail', 'Tìm API và danh tính liên quan.'],
            ['Security group trước đó cấu hình thế nào?', 'AWS Config', 'Xem lịch sử cấu hình đã ghi.'],
            ['Tài nguyên nào sai quy tắc?', 'AWS Config', 'Đánh giá bằng Config rules.'],
            ['Ai đọc object nhạy cảm?', 'CloudTrail data events', 'Cần bật đúng phạm vi từ trước.']
          ]
        },
        after: [
          'Trong câu hỏi DOP-C02: theo dõi hiệu năng, số lỗi, cảnh báo thì nghĩ tới CloudWatch; truy cứu thao tác thì nghĩ tới CloudTrail; lịch sử cấu hình và kiểm tra quy tắc thì nghĩ tới Config. Nếu yêu cầu có nhiều phần, giải pháp có thể phải phối hợp cả ba.',
          'CloudTrail có thể chuyển log vào CloudWatch Logs. Khi đó CloudTrail tạo dữ liệu, CloudWatch Logs lưu và hỗ trợ tìm dữ liệu được chuyển tới. Hai dịch vụ nối với nhau không có nghĩa chúng làm cùng một việc.',
          'Khi không thấy bản ghi, kiểm tra tài khoản, Region, phạm vi đã bật, thời gian lưu và độ trễ trước khi kết luận. Với tài nguyên toàn cục, cách ghi nhận còn có quy định riêng.'
        ]
      }
    ]
  },
  'scp-iam-policy': {
    reading: [
      {
        title: '1. IAM policy là gì?',
        paragraphs: ['IAM policy là tài liệu mô tả quyền trong AWS: được làm gì, trên tài nguyên nào và với điều kiện nào. Bạn thường gắn policy vào user, group hoặc role để cấp quyền cho công việc.'],
        quote: 'Nói đơn giản: IAM policy mô tả quyền làm việc của bạn hoặc ứng dụng.',
        bullets: [
          'Ứng dụng đọc ảnh sản phẩm: cấp quyền đọc đúng nhóm object trong S3.',
          'Pipeline cập nhật Lambda: cấp quyền cập nhật những function cần triển khai.',
          'Người vận hành xem log: cấp quyền đọc những log group cần dùng.'
        ],
        after: ['Trong policy, Allow là cho phép, Deny là từ chối. Nhưng nhìn thấy một Allow chưa đủ để biết yêu cầu sẽ thành công: AWS còn xét các policy và giới hạn áp dụng cho lần gọi đó.']
      },
      {
        title: '2. Ví dụ: chỉ cho ứng dụng đọc ảnh trong một prefix',
        paragraphs: ['Bạn có bucket dop-study-assets, ảnh sản phẩm nằm dưới prefix products/. Policy dưới đây có thể gắn vào role ứng dụng để cho đọc các object đó:'],
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dop-study-assets/products/*"
    }
  ]
}`,
        codeExplanation: [
          'Version là phiên bản ngôn ngữ policy, không phải ngày tạo tài liệu.',
          'Effect: Allow cho phép thao tác được nêu trong statement.',
          'Action: s3:GetObject cho đọc nội dung object, không cấp quyền ghi hoặc xóa.',
          'Resource chọn các object dưới products/ trong bucket minh họa. Dấu * cho phép khớp các tên object bên dưới prefix đó.'
        ],
        after: [
          'Bạn phải thay tên bucket bằng tài nguyên thực tế. Prefix giúp nhóm tên object; nó không phải một thư mục vật lý tách riêng trong S3.',
          'Policy này chưa cấp s3:ListBucket để liệt kê tên object. Đọc object đã biết tên và liệt kê bucket là hai quyền khác nhau. Nếu dữ liệu mã hóa bằng SSE-KMS, bạn còn cần quyền giải mã và key policy phù hợp.',
          'Đây là quyền mà statement này cấp. Các policy khác có thể cấp thêm hoặc chặn quyền, nên không thể chỉ nhìn ví dụ này rồi kết luận toàn bộ quyền của role.'
        ]
      },
      {
        title: '3. SCP là gì?',
        paragraphs: ['SCP là chính sách của AWS Organizations dùng để giới hạn quyền của các tài khoản thành viên. Ví dụ, công ty muốn quản trị viên trong các tài khoản ứng dụng cũng không được dừng ghi nhật ký CloudTrail.'],
        quote: 'Nói đơn giản: SCP đặt giới hạn chung cho tài khoản; nó không tự cấp quyền làm việc.',
        bullets: [
          'IAM cho phép nhưng SCP có Deny khớp yêu cầu: yêu cầu bị chặn.',
          'SCP cho phép S3 nhưng role chưa được cấp quyền đọc: chưa đủ để đọc file.',
          'AdministratorAccess trong tài khoản thành viên không vượt được SCP đang áp dụng.'
        ],
        after: ['Bạn thường dùng cả hai: IAM cấp quyền cần cho công việc, SCP giữ giới hạn chung giữa các tài khoản. Muốn dùng SCP, Organizations phải bật chế độ đầy đủ tính năng.']
      },
      {
        title: '4. Ví dụ SCP cấm dừng ghi CloudTrail',
        paragraphs: ['Giả sử bạn gắn SCP sau vào OU chứa các tài khoản chạy ứng dụng:'],
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "cloudtrail:StopLogging",
      "Resource": "*"
    }
  ]
}`,
        codeExplanation: [
          'Effect: Deny từ chối thao tác được nêu, dù IAM có Allow.',
          'Action chỉ là cloudtrail:StopLogging. Ví dụ này cấm dừng ghi, không cấm toàn bộ thao tác CloudTrail.',
          'Resource: * làm statement áp dụng cho mọi tài nguyên liên quan tới thao tác này trong phạm vi mà SCP có hiệu lực.'
        ],
        after: [
          'Quản trị viên thuộc tài khoản thành viên chịu SCP này vẫn bị từ chối khi gọi StopLogging. Thêm Allow vào role hoặc SCP của tài khoản không vượt qua Deny đó.',
          'Đây là ví dụ hẹp để hiểu cơ chế, chưa phải chính sách bảo vệ kiểm toán hoàn chỉnh. Nó không cấm DeleteTrail hay mọi cách thay đổi cấu hình thu thập. Với SCP chỉ chứa Deny như ví dụ, bạn vẫn cần có phạm vi Allow thích hợp ở các cấp, thường duy trì bằng FullAWSAccess cùng những giới hạn cần thiết.',
          'SCP không áp dụng cho danh tính trong management account và không giới hạn service-linked roles. Nếu người gọi thuộc các trường hợp đó, bạn phải xét lớp quyền khác.'
        ]
      },
      {
        title: '5. OU và kế thừa SCP hoạt động thế nào?',
        paragraphs: ['OU là nhóm tài khoản trong Organizations. Bạn có thể chia Production và Sandbox, hoặc đặt OU bên trong OU khác. Cấp trên cùng gọi là root của tổ chức; đây không phải root user của tài khoản.'],
        diagram: 'Organization root\n        |\n        v\nOU Production\n        |\n        v\nTài khoản ứng dụng\n        |\n        v\nIAM role của ứng dụng',
        after: [
          'Bạn gắn SCP ở root, OU hoặc tài khoản. AWS xét dọc đường tới tài khoản: hành động phải được Allow ở từng cấp và không gặp Deny phù hợp. Nhiều SCP tại cùng một cấp có thể bổ sung Allow cho nhau, nhưng Allow cấp con không mở lại được quyền bị thiếu hoặc bị Deny ở cấp cha.',
          'FullAWSAccess là SCP giữ phạm vi cho phép rộng ở cấp được gắn. Nó không cấp AdministratorAccess cho từng role. Gỡ nó khi chưa có Allow thay thế có thể khiến tài khoản bên dưới mất quyền dù IAM không thay đổi.',
          'Bạn nên kiểm tra thay đổi trên OU nhỏ trước khi áp dụng rộng. Đặc biệt, đừng hiểu rằng gắn một Allow mới tại tài khoản sẽ sửa được mọi lỗi do SCP kế thừa từ phía trên.'
        ]
      },
      {
        title: '6. Không bị SCP chặn mà vẫn AccessDenied?',
        paragraphs: ['Bạn cần tìm đúng quyền đang thiếu hoặc bị giới hạn, thay vì chỉ nhìn SCP.'],
        steps: [
          'Xác định ai đang gọi: user, role hay phiên tạm thời của role. Nếu dùng nhầm role, policy bạn đang đọc có thể không liên quan tới lần gọi lỗi.',
          'Kiểm tra action, tài nguyên và điều kiện. s3:GetObject trên prefix này không cấp quyền đọc prefix khác; một Deny có Condition cũng chưa chắc khớp mọi yêu cầu.',
          'Xem permissions boundary nếu có. Boundary giới hạn quyền mà policy gắn với user hoặc role có thể cấp; nó không tự cấp quyền.',
          'Xem session policy nếu phiên tạm thời có dùng. Phiên có thể bị giới hạn thêm so với quyền bạn nhìn thấy trên role.'
        ],
        after: [
          'Ví dụ, policy của role cho đọc và xóa S3 nhưng boundary chỉ cho đọc thì quyền xóa từ policy đó vẫn bị giới hạn. Đừng sửa bằng cách gắn thêm một Allow xóa giống hệt vào role.',
          'Nếu cho đội phát triển tự tạo role với boundary, bạn còn phải kiểm soát quyền sửa hoặc gỡ boundary và iam:PassRole. Nếu họ tự bỏ được giới hạn, việc yêu cầu gắn boundary chưa đạt mục tiêu.'
        ]
      },
      {
        title: '7. Bucket policy và truy cập khác tài khoản',
        paragraphs: [
          'Một số tài nguyên có policy riêng, như bucket policy của S3. Trong đó, Principal chỉ ra ai được cấp quyền. Nhóm này gọi là resource-based policy, khác với policy gắn vào user hoặc role.',
          'Nếu role ở tài khoản A truy cập thẳng bucket ở B, thông thường bạn cần Allow ở phía danh tính A và policy của tài nguyên B, cùng các giới hạn tương ứng. Một số dịch vụ như KMS có thêm quy tắc riêng.'
        ],
        bullets: [
          'SCP của tài khoản chứa bucket không tự làm bucket trở thành riêng tư. Bạn phải kiểm tra cả quyền đã cấp cho danh tính bên ngoài.',
          'Trong cùng tài khoản, quyền cấp trực tiếp cho user ARN không bị từ chối chỉ vì identity policy hoặc boundary thiếu Allow.',
          'Quyền cấp trực tiếp cho role session ARN không bị giới hạn bởi phần thiếu Allow trong identity policy, boundary hoặc session policy. Cấp cho role ARN thì boundary và session policy vẫn giới hạn quyền.'
        ],
        after: ['Những chi tiết trên giải thích vì sao không nên áp một công thức giao quyền cho mọi resource policy. Deny tường minh phù hợp và các giới hạn tổ chức đang áp dụng vẫn phải được tôn trọng; chúng không biến mất chỉ vì quyền được cấp trực tiếp trong bucket policy.']
      },
      {
        title: '8. Trust policy trả lời một câu hỏi khác',
        paragraphs: ['Pipeline ở tài khoản A có thể gọi sts:AssumeRole để tạo phiên bằng role triển khai ở B. Bạn cần tách bước được dùng role với bước làm việc bằng role đó.'],
        steps: [
          'Để tạo phiên: phía A cần quyền sts:AssumeRole; trust policy của role B phải chấp nhận người gọi và các điều kiện kèm theo.',
          'Để cập nhật Lambda sau khi có phiên: phiên role B cần quyền lambda:UpdateFunctionCode và thỏa các giới hạn áp dụng tại B.'
        ],
        diagram: 'Pipeline ở A\n     | sts:AssumeRole + trust policy của B\n     v\nPhiên của role B\n     | quyền Lambda + các giới hạn tại B\n     v\nCập nhật function',
        after: [
          'AssumeRole thành công không chứng minh role B có quyền cập nhật Lambda. Nếu lỗi ở bước hai, mở rộng trust policy hoặc thêm quyền Lambda cho role nguồn A không tự cấp thêm quyền cho phiên B.',
          'Bạn có thể dùng CloudTrail để tìm đúng phiên và API lỗi đã được ghi. Kiểm tra chính xác danh tính, tài nguyên và điều kiện thường giúp sửa ít quyền hơn và đúng chỗ hơn.'
        ]
      },
      {
        title: '9. So sánh nhanh và cách nhận ra trong câu hỏi',
        paragraphs: ['Các loại policy này thường xuất hiện cùng nhau nhưng trả lời những câu hỏi khác nhau:'],
        table: {
          columns: ['Loại', 'Trả lời câu hỏi', 'Ví dụ'],
          rows: [
            ['IAM policy gắn với danh tính', 'User hoặc role được làm gì?', 'Được đọc products/* trong S3.'],
            ['SCP', 'Tổ chức cho phép quyền tới đâu?', 'Cấm tài khoản thành viên gọi StopLogging.'],
            ['Trust policy', 'Ai được AssumeRole?', 'Cho pipeline A dùng role triển khai B.'],
            ['Bucket policy', 'Ai được truy cập bucket?', 'Cho role A đọc object được chỉ định.']
          ]
        },
        after: [
          'Trong câu hỏi DOP-C02: giới hạn chung nhiều tài khoản, kể cả quản trị viên tài khoản thành viên, thì nghĩ tới SCP. Cấp quyền cụ thể cho ứng dụng thì nghĩ tới IAM policy. Kiểm soát ai được dùng role thì xem trust policy.',
          'Khi gặp AccessDenied, đừng chỉ hỏi “có Allow chưa?”. Hãy hỏi “ai đang gọi thao tác nào trên tài nguyên nào, và còn policy nào đang áp dụng?”. Một Allow đúng tên dịch vụ vẫn có thể sai tài nguyên hoặc không vượt được Deny.'
        ]
      }
    ]
  }
};
