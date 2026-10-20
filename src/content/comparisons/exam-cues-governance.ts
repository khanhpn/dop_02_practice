import type { ExamCue } from './types';

export const governanceExamCues: Record<string, ExamCue[]> = {
  'cloudwatch-cloudtrail-config': [
    {
      signal: 'Who made the API call? / API activity — cần tìm ai vừa sửa tài nguyên.',
      thinkOf: 'CloudTrail.',
      check: 'Kiểm tra đúng loại sự kiện đã được ghi. Log ứng dụng hoặc biểu đồ CPU chưa xác định được danh tính gọi API AWS.'
    },
    {
      signal: 'S3 object access / GetObject — cần biết ai đọc file nhạy cảm.',
      thinkOf: 'CloudTrail data events.',
      check: 'Phải bật ghi đúng bucket hoặc object từ trước. Event history chỉ có management events, không tự có lịch sử từng lần đọc file.'
    },
    {
      signal: 'Last 90 days / management events — tìm thao tác quản trị gần đây.',
      thinkOf: 'CloudTrail Event history.',
      check: 'Phạm vi là từng tài khoản và Region. Nếu cần nhiều tài khoản, data events hoặc lưu lâu hơn thì cách này chưa đủ.'
    },
    {
      signal: 'Central audit logs / all accounts — lưu lịch sử API chung cho tổ chức.',
      thinkOf: 'Organization trail và nơi lưu log tập trung.',
      check: 'Còn phải chọn Region, loại sự kiện, bucket policy và quyền mã hóa. Chỉ mở Event history không tạo lịch sử chung.'
    },
    {
      signal: 'CPU threshold / latency / error rate — cần báo khi website hoạt động bất thường.',
      thinkOf: 'CloudWatch metrics và alarms.',
      check: 'Chọn đúng chỉ số, thời gian đánh giá và hành động. CPU cao không đồng nghĩa giao dịch lỗi; tạo alarm chưa tự cấu hình người nhận.'
    },
    {
      signal: 'Memory utilization / OS metrics — cần RAM của EC2 nhưng chưa có nguồn gửi số đo.',
      thinkOf: 'CloudWatch agent hoặc nguồn custom metrics phù hợp.',
      check: 'Kiểm tra agent, quyền và cấu hình thu thập. Đừng mặc định RAM bên trong máy đã có chỉ vì đang xem được CPU.'
    },
    {
      signal: 'Search application logs / find timeout errors — cần tìm lỗi chi tiết trong log.',
      thinkOf: 'CloudWatch Logs Insights.',
      check: 'Log phải được gửi vào và còn trong thời gian lưu. CloudTrail ghi thao tác AWS, không thay toàn bộ log nghiệp vụ.'
    },
    {
      signal: 'Configuration history / before and after — cần xem security group trước khi thay đổi.',
      thinkOf: 'AWS Config recording.',
      check: 'Tài nguyên phải được hỗ trợ và đã nằm trong phạm vi ghi. Nếu hỏi ai gây thay đổi, xem thêm CloudTrail.'
    },
    {
      signal: 'Noncompliant resources / configuration rules — tìm tài nguyên sai chuẩn công ty.',
      thinkOf: 'AWS Config rules.',
      check: 'Cần rule kiểm tra đúng yêu cầu; bật recorder chưa tự có rule. Đánh giá sau thay đổi không phải chặn API ngay từ đầu.'
    },
    {
      signal: 'Automatically remediate — phát hiện cấu hình sai rồi tự sửa.',
      thinkOf: 'Config rule kết hợp remediation, thường dùng SSM Automation.',
      check: 'Phải cấu hình bước sửa và quyền thực thi, đồng thời kiểm tra trạng thái hiện tại. Recording một mình không tự sửa.'
    },
    {
      signal: 'Multi-account / multi-Region compliance view — muốn xem kết quả Config ở một nơi.',
      thinkOf: 'AWS Config aggregator.',
      check: 'Aggregator gom dữ liệu đã có, không tự bật recorder hoặc sửa tài nguyên nguồn. Cần triển khai ghi nhận ở các tài khoản liên quan.'
    },
    {
      signal: 'Errors after a configuration change — website lỗi ngay sau khi sửa mạng.',
      thinkOf: 'CloudWatch + Config + CloudTrail.',
      check: 'CloudWatch cho ảnh hưởng, Config cho thay đổi, CloudTrail cho thao tác và danh tính. Khớp đúng tài nguyên, thời gian và phạm vi thu thập.'
    }
  ],
  'scp-iam-policy': [
    {
      signal: 'Grant least privilege / application permissions — cấp quyền cho ứng dụng đọc một prefix S3.',
      thinkOf: 'IAM policy của role.',
      check: 'Chọn đúng action và object ARN. SCP không cấp quyền; GetObject cũng không tự cấp ListBucket hoặc quyền giải mã KMS.'
    },
    {
      signal: 'AdministratorAccess but AccessDenied — quản trị viên tài khoản thành viên vẫn bị chặn.',
      thinkOf: 'Deny phù hợp, đặc biệt SCP đang áp dụng.',
      check: 'Đọc Condition và xác định tài khoản của người gọi. SCP không áp dụng cho danh tính trong management account hoặc service-linked roles.'
    },
    {
      signal: 'Explicit deny — một policy có Deny khớp yêu cầu.',
      thinkOf: 'Kiểm tra Deny trước khi thêm Allow.',
      check: 'Deny phải khớp action, tài nguyên và điều kiện. Thêm Allow không vượt Deny áp dụng; thiếu Allow là trường hợp khác.'
    },
    {
      signal: 'Allowed by SCP, still denied — tổ chức cho phép S3 nhưng role chưa đọc được file.',
      thinkOf: 'Nguồn cấp quyền IAM hoặc resource policy và các giới hạn khác.',
      check: 'SCP chỉ xác định phạm vi cho phép. Kiểm tra role thực tế, bucket policy, boundary, session policy và KMS nếu liên quan.'
    },
    {
      signal: 'Permissions boundary / developers create roles — cho đội phát triển tự cấp quyền trong giới hạn.',
      thinkOf: 'Boundary và quyền quản lý role được kiểm soát.',
      check: 'Boundary không tự cấp quyền. Cần kiểm soát việc gỡ hoặc sửa boundary và iam:PassRole, không chỉ yêu cầu gắn boundary lúc tạo.'
    },
    {
      signal: 'Temporary credentials / session policy — cùng role nhưng phiên này bị giới hạn hơn.',
      thinkOf: 'Policy áp dụng cho phiên STS thực tế.',
      check: 'Quyền trên role chưa nói hết quyền của phiên. Thêm Allow vào role chưa chắc vượt được giới hạn session policy.'
    },
    {
      signal: 'Cannot assume role / trust relationship — chưa tạo được phiên của role ở tài khoản khác.',
      thinkOf: 'sts:AssumeRole và trust policy của role đích.',
      check: 'Kiểm tra quyền phía gọi và điều kiện trust phía đích. Policy cho đọc S3 không tự cho phép dùng một role bất kỳ.'
    },
    {
      signal: 'AssumeRole succeeds, deployment fails — vào được role B nhưng không cập nhật được Lambda.',
      thinkOf: 'Quyền và giới hạn của phiên role B.',
      check: 'Trust cho phép tạo phiên, không cấp UpdateFunctionCode. Thêm quyền Lambda cho role nguồn A không tự tăng quyền của phiên B.'
    },
    {
      signal: 'Cross-account resource access — role A đọc trực tiếp bucket B.',
      thinkOf: 'Quyền phía danh tính và resource policy phía tài nguyên.',
      check: 'Thông thường cả hai phía cần Allow cùng các giới hạn phù hợp. Phân biệt với cách AssumeRole sang B; KMS còn có quy tắc riêng.'
    },
    {
      signal: 'Principal is user ARN / role ARN / session ARN — đề nêu rõ bên nhận quyền trong resource policy.',
      thinkOf: 'Cách đánh giá quyền cấp trực tiếp cho đúng loại principal.',
      check: 'Trong cùng tài khoản, một số implicit deny áp dụng khác nhau theo principal. Không dùng một phép giao chung; explicit Deny và giới hạn tổ chức áp dụng vẫn còn.'
    },
    {
      signal: 'Parent OU deny / child account allow — tài khoản có Allow nhưng OU cha chặn.',
      thinkOf: 'Kế thừa SCP theo đường root → OU → account.',
      check: 'Allow cấp con không vượt Deny hay bù phần không được Allow ở cấp cha. Các Allow tại cùng một cấp có thể bổ sung nhau.'
    },
    {
      signal: 'FullAWSAccess — SCP này còn gắn nhưng ứng dụng vẫn thiếu quyền.',
      thinkOf: 'Phân biệt phạm vi SCP với quyền IAM thực sự.',
      check: 'FullAWSAccess không phải AdministratorAccess. Gỡ nó khi chưa có Allow thay thế có thể mất quyền; giữ nó cũng không tự cấp quyền cho role.'
    }
  ],
  'aws-organizations': [
    {
      signal: 'Multiple AWS accounts / central governance — quản lý nhiều tài khoản của công ty.',
      thinkOf: 'AWS Organizations.',
      check: 'Organizations quản lý các tài khoản, không hợp nhất tài nguyên hay quyền của chúng. Cần dịch vụ và cấu hình riêng cho những yêu cầu cụ thể.'
    },
    {
      signal: 'Consolidated billing / single bill — gom thanh toán nhưng vẫn theo dõi từng tài khoản.',
      thinkOf: 'Consolidated billing trong Organizations.',
      check: 'Hóa đơn chung không tự mở quyền dữ liệu, kết nối mạng hoặc quyền quản trị chéo tài khoản.'
    },
    {
      signal: 'Group accounts / apply policy to a business unit — nhóm Production, Sandbox.',
      thinkOf: 'Organizational units, tức OU.',
      check: 'OU nhóm tài khoản để quản lý, không chứa EC2 như subnet và không phải Region. Di chuyển tài khoản có thể đổi SCP kế thừa.'
    },
    {
      signal: 'Management account / member accounts — đặt ứng dụng ở đâu?',
      thinkOf: 'Tài khoản thành viên cho workload, management account cho quản trị tổ chức.',
      check: 'SCP không giới hạn danh tính trong management account. Đừng đặt ứng dụng ở đó rồi kỳ vọng SCP của OU sẽ bảo vệ như tài khoản thành viên.'
    },
    {
      signal: 'Restrict all member-account administrators — cả admin cũng không được dừng ghi log.',
      thinkOf: 'SCP gắn vào root, OU hoặc tài khoản phù hợp.',
      check: 'Cần all features và loại policy đã bật. SCP không cấp quyền và không giới hạn service-linked roles.'
    },
    {
      signal: 'Allow-list / deny-list / inherited policy — giới hạn dịch vụ dọc cây tổ chức.',
      thinkOf: 'Đường Allow của SCP và Deny kế thừa.',
      check: 'Cần Allow ở từng cấp từ root tới tài khoản và không có Deny khớp. Allow ở OU con không mở lại quyền bị thiếu ở cấp cha.'
    },
    {
      signal: 'Single sign-on / workforce access / permission sets — nhân viên vào nhiều tài khoản.',
      thinkOf: 'IAM Identity Center.',
      check: 'Cần gán người hoặc nhóm với quyền và tài khoản. Tạo OU trong Organizations chưa tự tạo quyền đăng nhập cho nhân viên.'
    },
    {
      signal: 'Landing zone / Account Factory / standardized accounts — tạo tài khoản theo cấu hình quản trị chuẩn.',
      thinkOf: 'AWS Control Tower.',
      check: 'Control Tower phối hợp Organizations và dịch vụ khác. Controls không phải tất cả đều là SCP hoặc đều chặn API ngay lập tức.'
    },
    {
      signal: 'Trusted access — dịch vụ cần làm việc ở phạm vi tổ chức.',
      thinkOf: 'Tích hợp dịch vụ được hỗ trợ với Organizations.',
      check: 'Trusted access cấp khả năng cho dịch vụ theo phạm vi hỗ trợ, không cấp quyền quản trị chung cho mọi người dùng. Cần đủ bước khởi tạo của dịch vụ.'
    },
    {
      signal: 'Delegated administrator / security account — giao quản lý một dịch vụ cho tài khoản bảo mật.',
      thinkOf: 'Delegated administrator của dịch vụ đó.',
      check: 'Ủy quyền theo khả năng và phạm vi của dịch vụ, không biến tài khoản này thành management account hoặc admin của mọi dịch vụ.'
    },
    {
      signal: 'Organization-wide API audit — lưu hoạt động API của các tài khoản thành viên.',
      thinkOf: 'CloudTrail organization trail.',
      check: 'Vẫn cần cấu hình sự kiện, Region, bucket và quyền. Chỉ tạo Organizations chưa triển khai đầy đủ việc ghi log.'
    },
    {
      signal: 'Central compliance dashboard — muốn xem kết quả cấu hình nhiều tài khoản và Region ở một nơi.',
      thinkOf: 'AWS Config aggregator.',
      check: 'Cần dữ liệu từ các tài khoản nguồn. Aggregator không tự bật recorder, triển khai rule hoặc sửa tài nguyên; tạo tổ chức chưa đủ để có kết quả.'
    }
  ],
  'deployment-strategies': [
    {
      signal: 'Brief downtime acceptable / simplest deployment — môi trường thử nghiệm chịu được dừng ngắn.',
      thinkOf: 'All-at-once.',
      check: 'Trong Beanstalk EC2, các máy cập nhật cùng lúc nên phạm vi ảnh hưởng rộng. Không chọn nếu yêu cầu bắt buộc duy trì phục vụ trong khi cập nhật.'
    },
    {
      signal: 'Deploy in batches / reduced capacity — cập nhật từng nhóm và chấp nhận giảm công suất.',
      thinkOf: 'Rolling.',
      check: 'Phần còn lại phải chịu được tải. Bản cũ và mới có thể cùng chạy; nếu lỗi giữa chừng không mặc định mọi máy tự quay về bản cũ.'
    },
    {
      signal: 'Maintain full capacity / additional batch — không giảm công suất nhưng chỉ thêm một nhóm máy.',
      thinkOf: 'Rolling with additional batch trong Beanstalk EC2.',
      check: 'Cần quota, địa chỉ mạng và chi phí cho batch thêm. Khác immutable, vốn tạo cả nhóm máy mới.'
    },
    {
      signal: 'Fresh instances / leave original instances untouched — muốn kiểm tra nhóm máy mới rồi bỏ nếu lỗi.',
      thinkOf: 'Immutable trong Beanstalk EC2.',
      check: 'Cần sức chứa chạy song song. Giữ máy cũ không tự bảo đảm dữ liệu vẫn tương thích với code cũ.'
    },
    {
      signal: 'Separate environment / switch traffic back quickly — giữ cả bản cũ và mới.',
      thinkOf: 'Blue/green.',
      check: 'Bản cũ phải còn sẵn và dữ liệu tương thích. Với Beanstalk swap URL, tính cả DNS cache; không coi mọi kết nối đổi ngay cùng lúc.'
    },
    {
      signal: 'Small percentage first / limit initial impact — thử ít lưu lượng trước.',
      thinkOf: 'Canary.',
      check: 'Cần đủ lượt gọi, chỉ số của bản mới và tiêu chí dừng. Hook, alarm và rollback phải cấu hình; tên canary không tự bảo đảm phát hiện lỗi.'
    },
    {
      signal: 'Equal increments / every few minutes — tăng phần trăm theo bước đều.',
      thinkOf: 'Linear.',
      check: '10% rồi chờ và chuyển hết là canary; 10% → 20% → 30% là linear. Kiểm tra nền tảng có hỗ trợ cơ chế chia lưu lượng đó.'
    },
    {
      signal: 'Deploy now, enable later / selected users — đưa code lên nhưng chưa mở tính năng cho mọi người.',
      thinkOf: 'Feature flags, có thể quản lý bằng AppConfig.',
      check: 'Ứng dụng phải có logic áp dụng cờ. Tắt tính năng không hoàn tác dữ liệu đã ghi hoặc tác động đã gửi ra ngoài.'
    },
    {
      signal: 'CodeDeploy ECS + Network Load Balancer — cần chọn kiểu chuyển lưu lượng.',
      thinkOf: 'CodeDeployDefault.ECSAllAtOnce.',
      check: 'Trong cơ chế CodeDeploy ECS với NLB đang xét, không chọn canary hoặc linear. Beanstalk Traffic splitting lại cần ALB.'
    },
    {
      signal: 'Lambda versions / weighted alias — chia khoảng 10% lượt gọi sang bản mới.',
      thinkOf: 'Published versions + alias routing hoặc CodeDeploy phù hợp.',
      check: 'Bên gọi phải dùng alias; hai bản cần cùng execution role và cùng cấu hình DLQ hoặc đều không có DLQ. JSON trọng số không tự tạo lịch tăng hoặc rollback.'
    },
    {
      signal: 'Rollback after schema migration — code cũ không còn đọc được database.',
      thinkOf: 'Thay đổi dữ liệu tương thích theo từng bước.',
      check: 'Chuyển lưu lượng về bản cũ không khôi phục cột đã xóa. Giữ cấu trúc cũ tới khi không còn phiên bản cần dùng rồi mới loại bỏ.'
    },
    {
      signal: 'Queue consumers / blue and green workers — hai phiên bản cùng đọc SQS.',
      thinkOf: 'Chuyển worker có kiểm soát, thông điệp tương thích và xử lý lặp an toàn.',
      check: 'Cùng queue là chia công việc, không phải mỗi bản nhận đủ mọi thông điệp. Canary HTTP không tự thành 10% công việc SQS; cần xử lý việc đang chạy.'
    }
  ]
};
