import type { ComparisonArticle } from './types';

export const organizationDeploymentArticles: Record<string, ComparisonArticle> = {
  'aws-organizations': {
    reading: [
      {
        title: '1. AWS Organizations là gì?',
        paragraphs: ['AWS Organizations là dịch vụ giúp bạn quản lý nhiều tài khoản AWS cùng một tổ chức. Bạn có thể tạo hoặc mời tài khoản, nhóm chúng lại, đặt chính sách chung và quản lý hóa đơn tập trung.'],
        quote: 'Nói đơn giản: Organizations giúp quản lý nhiều tài khoản AWS; nó không gộp tất cả thành một tài khoản.',
        bullets: [
          'Tách tài khoản chạy thật với tài khoản thử nghiệm để giảm ảnh hưởng khi có sai sót.',
          'Đặt giới hạn chung cho một nhóm tài khoản, chẳng hạn không được dừng ghi nhật ký.',
          'Phối hợp các dịch vụ bảo mật, ghi log và kiểm tra cấu hình trên nhiều tài khoản.',
          'Xem chi phí theo từng tài khoản nhưng thanh toán tập trung.'
        ],
        after: ['Ví dụ, công ty có website bán hàng. Bạn muốn đội phát triển thử tính năng thoải mái nhưng không vô tình xóa database đang phục vụ khách. Tách môi trường vào các tài khoản khác nhau rồi quản lý bằng Organizations là một cách tổ chức phù hợp.']
      },
      {
        title: '2. Management account, member account và OU là gì?',
        paragraphs: ['Giả sử bạn bắt đầu với đúng ba tài khoản: một tài khoản quản lý, một tài khoản Production và một tài khoản Sandbox.'],
        bullets: [
          'Management account quản lý tổ chức và chịu trách nhiệm thanh toán chi phí của các tài khoản thành viên. Nên giữ tài khoản này cho công việc quản trị thay vì chạy website trong đó.',
          'Member account là tài khoản thành viên, như Production và Sandbox. Mỗi tài khoản vẫn có tài nguyên, danh tính và quyền riêng.',
          'OU là nhóm tài khoản để áp dụng cách quản lý chung. Bạn có thể có OU Workloads và OU Experiments, sau này thêm nhiều tài khoản vào từng nhóm.'
        ],
        diagram: 'Root của tổ chức\n  |\n  +-- Management account\n  |\n  +-- OU Workloads\n  |     +-- Production account\n  |\n  +-- OU Experiments\n        +-- Sandbox account',
        after: [
          'Sơ đồ thể hiện vai trò quản lý và cách nhóm các tài khoản thành viên. Root ở đây là cấp trên cùng của cây OU, không phải root user dùng để đăng nhập một tài khoản.',
          'OU không phải nơi bạn tạo EC2 hay database. Bạn tạo tài nguyên trong tài khoản; với dịch vụ theo Region, bạn còn chọn Region. Đưa tài khoản vào OU không chuyển tài nguyên sang Region khác và không hợp nhất VPC của các tài khoản.'
        ]
      },
      {
        title: '3. Chung hóa đơn có phải chung tài nguyên không?',
        paragraphs: ['Không. Consolidated billing giúp công ty thanh toán tập trung và theo dõi chi phí các tài khoản. Nó không tự cho ứng dụng Sandbox đọc database Production hay đọc mọi bucket của công ty.'],
        table: {
          columns: ['Bạn cần gì?', 'Cơ chế liên quan'],
          rows: [
            ['Nhóm và quản lý các tài khoản.', 'Organizations và OU.'],
            ['Thanh toán chung, xem chi phí từng tài khoản.', 'Consolidated billing và công cụ quản lý chi phí.'],
            ['Cho người dùng vào đúng tài khoản với đúng quyền.', 'IAM Identity Center hoặc cách cấp quyền IAM phù hợp.'],
            ['Chia sẻ tài nguyên được hỗ trợ.', 'AWS RAM hoặc cơ chế chia sẻ riêng của dịch vụ.'],
            ['Kết nối mạng giữa các tài khoản.', 'Thiết kế mạng và quyền riêng cho kết nối đó.']
          ]
        },
        after: ['Cùng tổ chức có thể giúp đơn giản hóa một số cách chia sẻ, nhưng bạn vẫn phải cấu hình chúng. Đừng hiểu “đã cùng Organizations” là tự có kết nối mạng, quyền đọc dữ liệu hay quyền quản trị chéo tài khoản.']
      },
      {
        title: '4. SCP đặt giới hạn chung thế nào?',
        paragraphs: ['SCP là chính sách giới hạn quyền tối đa cho các danh tính trong tài khoản thành viên chịu tác động. Bạn dùng nó khi một quy định phải áp dụng cả với quản trị viên của tài khoản đó. Organizations phải bật all features và loại policy tương ứng để dùng SCP.'],
        quote: 'SCP không cấp quyền. IAM cho làm được gì còn phải nằm trong giới hạn SCP áp dụng.',
        bullets: [
          'Role chưa được cấp quyền đọc S3 thì SCP cho phép S3 cũng chưa đủ để đọc.',
          'IAM có Allow nhưng SCP có Deny khớp yêu cầu thì yêu cầu bị chặn.',
          'Hành động cần có Allow ở từng cấp từ root qua các OU tới tài khoản; các Allow tại cùng một cấp có thể bổ sung cho nhau.',
          'Allow cấp con không vượt Deny hoặc bù phần không được Allow tại cấp cha.'
        ],
        after: [
          'FullAWSAccess là SCP cho phạm vi rộng ở cấp được gắn, không phải quyền quản trị cấp cho từng người. Khi chuyển sang cách chỉ cho phép một số thao tác, đừng gỡ nó trước khi có Allow thay thế cần thiết.',
          'SCP không áp dụng cho danh tính trong management account và không giới hạn service-linked roles. Đó cũng là lý do nên tách ứng dụng khỏi management account: bạn có thể áp giới hạn SCP cho tài khoản chạy ứng dụng.'
        ]
      },
      {
        title: '5. Ví dụ: không cho Production dừng ghi CloudTrail',
        paragraphs: ['Bạn có thể gắn SCP dưới đây vào OU Workloads của ví dụ ba tài khoản:'],
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
          'Version là phiên bản ngôn ngữ policy, không phải ngày ban hành.',
          'Effect: Deny từ chối thao tác khớp statement.',
          'Action chỉ chọn StopLogging, tức thao tác dừng ghi của trail.',
          'Resource: * áp dụng cho mọi tài nguyên liên quan tới thao tác trong phạm vi SCP có hiệu lực.'
        ],
        after: [
          'Danh tính trong Production chịu SCP này không dừng ghi được, dù có AdministratorAccess. Sandbox nằm ở OU khác nên không chịu riêng SCP gắn trên Workloads, nhưng vẫn chịu các SCP tại root và trên đường tới Sandbox.',
          'Ví dụ này chỉ minh họa một giới hạn hẹp. Nó không cấm DeleteTrail hay mọi cách thay đổi việc thu thập. Bạn vẫn cần phạm vi Allow thích hợp tại các cấp, thường giữ FullAWSAccess rồi thêm những Deny cần thiết.',
          'Khi chuyển tài khoản sang OU khác, các SCP kế thừa có thể đổi theo. Hãy kiểm tra các thao tác triển khai và vận hành cần thiết trước khi chuyển nhiều tài khoản cùng lúc.'
        ]
      },
      {
        title: '6. Identity Center và Control Tower có thay Organizations không?',
        paragraphs: ['Không. Chúng phối hợp với Organizations nhưng giải quyết những việc khác nhau.'],
        steps: [
          'Organizations quản lý tài khoản, OU và các chính sách tổ chức.',
          'IAM Identity Center giúp người trong công ty đăng nhập tập trung rồi truy cập các tài khoản với quyền được giao. Bạn dùng permission sets và gán cho người hoặc nhóm phù hợp; tạo OU chưa tự tạo quyền đăng nhập.',
          'Control Tower giúp thiết lập và quản trị môi trường nhiều tài khoản theo cấu hình chuẩn. Nó phối hợp Organizations, Identity Center và các dịch vụ khác, có Account Factory cùng các controls để quản lý.'
        ],
        after: [
          'Bạn có thể dùng Organizations mà tự xây các cấu hình quản trị. Nếu muốn quy trình tạo tài khoản và thiết lập nền tảng nhất quán hơn, bạn cân nhắc Control Tower. Nó xây trên Organizations chứ không tạo một loại tài khoản AWS khác.',
          'Controls trong Control Tower có nhiều cách thực thi: có loại ngăn trước, loại phát hiện và loại kiểm tra chủ động. Không nên hiểu mọi control đều là SCP hoặc mọi vi phạm đều bị chặn ngay khi gọi API.'
        ]
      },
      {
        title: '7. Trusted access và delegated administrator dùng để làm gì?',
        paragraphs: ['Khi công ty lớn hơn, bạn muốn đội bảo mật quản lý một dịch vụ cho cả tổ chức mà không phải làm mọi việc trong management account. Hai khái niệm này giúp tổ chức cách quản lý đó.'],
        bullets: [
          'Trusted access cho một dịch vụ được hỗ trợ phối hợp với Organizations để thực hiện công việc trên các tài khoản theo khả năng của dịch vụ. Nó không cấp quyền quản trị chung cho mọi người dùng.',
          'Delegated administrator của một dịch vụ là tài khoản thành viên được giao quản lý dịch vụ đó ở phạm vi tổ chức. Được giao quản lý Config không có nghĩa tự được quản trị mọi dịch vụ hay mọi tài khoản.',
          'Quyền, cách đăng ký và những thao tác được giao phụ thuộc dịch vụ. Khi có lựa chọn, nên bật tích hợp từ chính dịch vụ để nó thực hiện đủ các bước khởi tạo cần thiết.'
        ],
        after: ['Bạn có thể thêm một tài khoản Security khi cần tách trách nhiệm hơn. Đây là bước mở rộng sau ví dụ ba tài khoản, không phải cứ có Organizations là tự xuất hiện tài khoản bảo mật và tất cả cấu hình thu thập.']
      },
      {
        title: '8. Gom CloudTrail và Config về một nơi ra sao?',
        paragraphs: ['Tạo tổ chức mới chỉ là phần đầu. Bạn vẫn cần triển khai cơ chế ghi và kiểm tra.'],
        steps: [
          'Với CloudTrail, tạo organization trail từ tài khoản có quyền phù hợp, cấu hình Region và loại sự kiện cần ghi. Chuẩn bị bucket nhận log, bucket policy và quyền khóa mã hóa nếu dùng.',
          'Với Config, bật ghi nhận cho tài nguyên và Region cần theo dõi trong các tài khoản nguồn. Triển khai các rule nếu muốn kiểm tra cấu hình theo chuẩn.',
          'Thiết lập tích hợp và quyền phù hợp rồi tạo Config aggregator để xem dữ liệu nhiều tài khoản, Region. Aggregator không tự bật recorder hoặc sửa tài nguyên nguồn.',
          'Giao quyền đọc và vận hành theo trách nhiệm, rồi kiểm tra thực tế xem tài khoản mới đã gửi đủ dữ liệu chưa.'
        ],
        diagram: 'Production -- CloudTrail --> Bucket lưu log chung\nSandbox ---- CloudTrail --> Bucket lưu log chung\n\nProduction -- Config recording --+\nSandbox ---- Config recording --+--> Config aggregator',
        after: ['Trong câu hỏi DOP-C02: quản lý nhiều tài khoản thì xem Organizations; chặn một nhóm thao tác trên các tài khoản thành viên thì xem SCP; đăng nhập nhân viên thì xem Identity Center; tạo môi trường nhiều tài khoản có quản trị chuẩn thì xem Control Tower. Đề yêu cầu log hoặc kiểm tra cấu hình tập trung vẫn cần thêm CloudTrail, Config và quyền tương ứng.']
      }
    ]
  },
  'deployment-strategies': {
    reading: [
      {
        title: '1. Chiến lược deploy là gì?',
        paragraphs: ['Deploy là đưa phiên bản mới vào hệ thống đang chạy. Chiến lược deploy quyết định bạn thay phiên bản cũ theo cách nào, khách nào gặp phiên bản mới trước và nếu có lỗi thì quay lại ra sao.'],
        quote: 'Nói đơn giản: cùng một bản phát hành, cách đưa nó tới người dùng quyết định phạm vi ảnh hưởng khi có lỗi.',
        bullets: [
          'Website thử nghiệm chịu được dừng ngắn có thể chọn cách đơn giản.',
          'Website bán hàng cần duy trì khả năng phục vụ khi cập nhật từng nhóm máy.',
          'Chức năng thanh toán có thể cần đưa ít yêu cầu vào bản mới rồi theo dõi trước khi tăng.'
        ],
        after: ['Bạn cần phân biệt hai việc: thay các máy hoặc phiên bản chạy ứng dụng, và chuyển lưu lượng sang chúng. Blue/green mô tả cách duy trì bản cũ và mới; canary hoặc linear mô tả cách chuyển lưu lượng. Vì vậy, chúng có thể kết hợp, không phải lúc nào cũng là những lựa chọn loại trừ nhau.']
      },
      {
        title: '2. All-at-once, rolling và rolling thêm batch',
        paragraphs: ['Lấy ví dụ môi trường Elastic Beanstalk dùng EC2 với bốn máy. Các chính sách này áp dụng cho cách triển khai EC2 được mô tả dưới đây; không nên mang nguyên tên tùy chọn sang mọi nền tảng.'],
        steps: [
          'All-at-once cập nhật tất cả cùng lúc. Trong Beanstalk EC2, các máy có thể cùng ngừng phục vụ ngắn trong lúc triển khai. Cách này nhanh và đơn giản nhưng ảnh hưởng rộng nếu bản mới lỗi.',
          'Rolling chia máy thành từng batch. Nếu mỗi batch một máy, ba máy còn lại tiếp tục phục vụ trong lúc máy đó cập nhật. Bạn tạm giảm khả năng phục vụ và có thời gian bản cũ lẫn mới cùng chạy.',
          'Rolling with additional batch tạo thêm một batch trước khi cập nhật các batch cũ. Bạn giữ được mức tài nguyên phục vụ ban đầu nhưng cần quota, địa chỉ mạng và chi phí cho batch thêm.'
        ],
        diagram: 'Rolling, mỗi batch 1 máy:\n[v1 v1 v1 v1]\n[v2 v1 v1 v1]\n[v2 v2 v1 v1]\n[v2 v2 v2 v1]\n[v2 v2 v2 v2]',
        after: ['Nếu rolling thất bại giữa chừng, môi trường có thể đang chạy lẫn hai phiên bản. Bạn cần biết phiên bản nào đang ở đâu và cách triển khai lại bản tốt; không mặc định mọi nền tảng tự trả tất cả máy về bản cũ.']
      },
      {
        title: '3. Immutable và blue/green khác nhau chỗ nào?',
        paragraphs: ['Cả hai đều có thể giữ máy cũ trong lúc chuẩn bị máy mới, nhưng phạm vi chuẩn bị và cách chuyển phụ thuộc dịch vụ.'],
        bullets: [
          'Immutable trong Beanstalk EC2 tạo cả nhóm máy mới trong Auto Scaling group riêng để kiểm tra. Nếu máy mới không đạt health check, chúng bị bỏ đi và nhóm cũ được giữ. Bạn cần đủ tài nguyên để chạy song song.',
          'Blue/green chuẩn bị hai môi trường hoặc hai nhóm phục vụ: blue đang chạy, green chứa bản mới. Bạn kiểm tra green rồi chuyển lưu lượng, giữ blue trong khoảng cần thiết để có thể quay lại.',
          'Với Beanstalk, blue/green có thể dùng hai environment và swap URL. Cách này liên quan DNS, nên không được hiểu mọi kết nối đổi ngay tại cùng một thời điểm. Cần chờ bản ghi cũ hết hiệu lực trước khi bỏ môi trường cũ.'
        ],
        diagram: 'Trước chuyển: Người dùng --> Blue (v1)\n                             Green (v2, đang kiểm tra)\n\nSau chuyển:   Người dùng --> Green (v2)\n                             Blue (v1, giữ để quay lại)',
        after: ['Blue/green không tự sao chép hay hoàn tác database. Với Beanstalk, cần tách vòng đời database khỏi môi trường trước khi thay hoặc hủy environment. Bạn phải biết cả hai bản ứng dụng đang kết nối dữ liệu nào.']
      },
      {
        title: '4. Canary, linear và feature flag',
        paragraphs: ['Ba cách này giúp giảm phạm vi người dùng gặp thay đổi ngay từ đầu, nhưng cơ chế khác nhau.'],
        table: {
          columns: ['Cách', 'Diễn biến ví dụ', 'Điểm cần hiểu'],
          rows: [
            ['Canary', '10% bản mới -> chờ 5 phút -> 100%.', 'Thử một phần lưu lượng trước, rồi chuyển phần còn lại nếu đạt điều kiện.'],
            ['Linear', '10% -> 20% -> 30% ... -> 100%.', 'Tăng từng bước bằng nhau theo khoảng thời gian đã chọn.'],
            ['Feature flag', 'Đã deploy code, nhưng chỉ bật chức năng cho nhóm được chọn.', 'Ứng dụng phải có logic đọc và áp dụng cờ tính năng.']
          ]
        },
        after: [
          'Canary không phải “cứ 10% mỗi phút”; đó gần với linear. Tỷ lệ và thời gian chỉ có ý nghĩa khi bạn có đủ số yêu cầu để quan sát lỗi. Năm phút với hai lượt thanh toán chưa nói lên nhiều điều.',
          'Feature flag có thể được quản lý bằng AppConfig hoặc cơ chế khác. Nó tách việc đưa code lên khỏi việc mở tính năng cho người dùng. Tắt cờ có thể dừng một nhánh chức năng, nhưng không tự khôi phục dữ liệu mà nhánh đó đã sửa.'
        ]
      },
      {
        title: '5. Trên AWS, phải chọn đúng cơ chế của nền tảng',
        paragraphs: ['Đừng chỉ thấy từ canary hoặc blue/green rồi chọn cấu hình bất kỳ có cùng tên.'],
        table: {
          columns: ['Nền tảng trong ví dụ', 'Cơ chế cần phân biệt'],
          rows: [
            ['Beanstalk EC2', 'All at once, Rolling, Rolling with additional batch, Immutable, Traffic splitting; traffic splitting cần ALB.'],
            ['CodeDeploy EC2/on-premises', 'Triển khai tại chỗ cho EC2 hoặc on-premises. Blue/green trên nền tảng này chỉ hỗ trợ EC2, không hỗ trợ máy on-premises.'],
            ['CodeDeploy cho ECS', 'Thay task set và chuyển qua hai target group; có canary, linear, all-at-once theo hỗ trợ.'],
            ['CodeDeploy cho Lambda', 'Chuyển lưu lượng giữa các published versions qua alias, có canary, linear, all-at-once.']
          ]
        },
        after: [
          'Với CodeDeploy ECS, bạn cần đúng service/controller, load balancer, listener và hai target group. Nếu task dùng awsvpc, target type phải là ip. Khi dùng NLB, CodeDeploy chỉ hỗ trợ cấu hình ECSAllAtOnce; đừng chọn ECS canary với NLB rồi cho rằng dịch vụ sẽ tự đổi cách chia lưu lượng.',
          'Beanstalk Traffic splitting cũng không phải blue/green swap URL: nó tạo nhóm máy mới và chia lưu lượng bằng ALB trong cùng quy trình triển khai. Các nền tảng hoặc controller khác có thể có tính năng riêng; luôn xét đúng cơ chế mà tình huống đang dùng.'
        ]
      },
      {
        title: '6. Ví dụ Lambda: đưa khoảng 10% vào bản mới',
        paragraphs: ['Giả sử function checkout có hai phiên bản đã publish là 1 và 2. Đây là đầu vào JSON cho lệnh AWS CLI create-alias để alias live trỏ chính tới bản 1 và chia một phần sang bản 2:'],
        code: `{
  "FunctionName": "checkout",
  "Name": "live",
  "FunctionVersion": "1",
  "RoutingConfig": {
    "AdditionalVersionWeights": {
      "2": 0.1
    }
  }
}`,
        codeExplanation: [
          'FunctionName chọn function; Name là tên alias mà bên gọi cần sử dụng.',
          'FunctionVersion: 1 là phiên bản chính, nhận phần lưu lượng còn lại.',
          'AdditionalVersionWeights gán trọng số 0.1 cho bản 2, tương ứng khoảng 10% các lượt gọi qua alias.',
          'Hai bản phải đã publish, không dùng $LATEST; chúng cần cùng execution role và cấu hình DLQ giống nhau hoặc đều không có DLQ.'
        ],
        after: [
          'Lệnh tạo alias truyền FunctionName để xác định function; nếu gọi REST API trực tiếp, FunctionName nằm trên đường dẫn và phần JSON body chứa các trường còn lại. Ví dụ chưa tạo function, publish version hay cấu hình bên gọi.',
          'Phân phối dùng xác suất, nên ít lượt gọi có thể lệch khá nhiều khỏi 10%. Gọi thẳng ARN bản 1 hoặc bản 2 sẽ không đi qua cách chia của alias.',
          'Đây mới là chia lưu lượng; JSON không tự đặt thời gian chờ, tăng lên 100% hoặc rollback theo alarm. Bạn phải tổ chức các bước đó hoặc dùng công cụ triển khai như CodeDeploy/SAM. Muốn quay về bản 1, cập nhật alias và bỏ trọng số bản 2; điều này không hoàn tác giao dịch bản 2 đã thực hiện.'
        ]
      },
      {
        title: '7. Biết bản mới chạy tốt bằng cách nào?',
        paragraphs: ['Máy mở được cổng mạng chưa chắc khách đã thanh toán được. Trước khi chọn chiến lược, bạn phải xác định thế nào là một bản phát hành đạt yêu cầu.'],
        steps: [
          'Health check xác nhận ứng dụng sẵn sàng nhận việc, với đường kiểm tra phù hợp và thời gian khởi động đủ.',
          'Hook kiểm tra trước hoặc sau bước chuyển lưu lượng thực hiện những xác nhận cần thiết. Với CodeDeploy ECS/Lambda, cần dùng đúng lifecycle hook và báo kết quả theo cơ chế dịch vụ.',
          'Theo dõi lỗi, độ trễ và kết quả nghiệp vụ của bản mới. Nếu tổng hợp chung cả hai bản, một tỷ lệ lỗi nhỏ có thể che lỗi nặng chỉ xảy ra ở canary.',
          'Cấu hình dừng và rollback rõ ràng. CodeDeploy có thể dừng theo alarm đã gắn, nhưng cần cấu hình hành vi rollback và quyền liên quan; chỉ tạo một alarm chưa khiến mọi deployment tự quay lại.'
        ],
        after: ['Blue/green hoặc immutable cần quota, tài nguyên mạng và sức chứa đủ cho bản mới chạy cạnh bản cũ. Phần có thể nghẽn còn gồm database và dịch vụ phụ thuộc; gấp đôi số máy web không tự làm database chịu được gấp đôi tải.']
      },
      {
        title: '8. Rollback code chưa chắc rollback được dữ liệu',
        paragraphs: ['Giả sử bản 2 đổi cột total thành total_amount rồi xóa cột cũ ngay. Nếu lỗi xảy ra, bạn chuyển lưu lượng về bản 1 nhưng bản 1 vẫn đọc total. Khi đó máy cũ còn sống cũng không giúp ứng dụng chạy lại.'],
        steps: [
          'Thêm cấu trúc mới mà vẫn giữ khả năng chạy của bản cũ.',
          'Triển khai code tương thích trong giai đoạn hai phiên bản cùng tồn tại; chuyển hoặc bổ sung dữ liệu theo kế hoạch.',
          'Theo dõi, chuyển hẳn sang cách mới và giữ khoảng thời gian cần thiết để quay lại.',
          'Chỉ bỏ cấu trúc cũ khi không còn phiên bản hay bên xử lý nào cần dùng.'
        ],
        after: [
          'Các định dạng API và thông điệp hàng đợi cũng cần tương thích. Nếu blue và green cùng đọc một SQS queue, chúng chia công việc chứ không tự tạo hai bản của mỗi thông điệp để so sánh.',
          'Với worker, cần xử lý công việc đang chạy khi dừng máy, visibility timeout (thời gian thông điệp tạm ẩn) và thông điệp nhận lại. Canary của HTTP không tự tương đương chia đúng 10% công việc SQS. Nếu dùng bản sao để quan sát, phải ngăn tác động như gửi thư hoặc trừ tiền hai lần.'
        ]
      },
      {
        title: '9. Chọn theo tình huống nào?',
        paragraphs: ['Với website bán hàng, bạn có thể đối chiếu yêu cầu như sau:'],
        table: {
          columns: ['Yêu cầu chính', 'Hướng nên xem', 'Điều kiện cần nhớ'],
          rows: [
            ['Môi trường thử nghiệm chịu được dừng ngắn.', 'All-at-once.', 'Chấp nhận ảnh hưởng rộng trong lúc cập nhật.'],
            ['Cập nhật từng phần, ngân sách không đủ chạy cả hai hệ thống.', 'Rolling.', 'Phần còn lại chịu được tải, hai bản tương thích.'],
            ['Giữ công suất nhưng chỉ thêm một batch.', 'Rolling with additional batch.', 'Đúng nền tảng hỗ trợ và đủ quota batch thêm.'],
            ['Muốn máy mới sạch, bỏ được nhóm mới nếu kiểm tra thất bại.', 'Immutable.', 'Đủ tài nguyên chạy song song.'],
            ['Cần giữ bản cũ để chuyển lưu lượng lại nhanh.', 'Blue/green.', 'Bản cũ còn sẵn và dữ liệu vẫn tương thích.'],
            ['Thử ít lưu lượng trước rồi chuyển phần còn lại.', 'Canary.', 'Đủ lượt gọi, chỉ số và tiêu chí dừng phù hợp.'],
            ['Tăng lưu lượng theo bước đều.', 'Linear.', 'Đúng cơ chế chia lưu lượng của nền tảng.'],
            ['Deploy trước, chỉ mở tính năng cho một nhóm.', 'Feature flag.', 'Ứng dụng có logic áp dụng cờ và kiểm soát tác động dữ liệu.']
          ]
        },
        after: ['Trong câu hỏi DOP-C02, hãy đọc cả ngân sách tài nguyên, khả năng chấp nhận gián đoạn, cách rollback và nền tảng. Một phương án có tên “an toàn” vẫn sai nếu cần ALB mà bạn đang dùng NLB, thiếu sức chứa cho nhóm mới, hoặc code cũ không còn đọc được dữ liệu sau migration.']
      }
    ]
  }
};
