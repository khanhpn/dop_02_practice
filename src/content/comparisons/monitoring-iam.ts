import type { ComparisonArticle } from './types';

export const monitoringIamArticles: Record<string, ComparisonArticle> = {
  'cloudwatch-cloudtrail-config': {
    reviewedAt: '2026-10-20',
    overview: [
      { title: 'Ba dịch vụ này khác nhau chỗ nào?', paragraphs: [
        'Bạn có thể nhớ bằng ba câu hỏi: hệ thống có đang chạy ổn không thì xem CloudWatch; ai vừa thay đổi gì thì xem CloudTrail; tài nguyên đang cấu hình thế nào, có đúng yêu cầu không thì xem AWS Config. Cả ba thường cùng xuất hiện trong một hệ thống vì mỗi dịch vụ trả lời một phần khác nhau.',
        'Ví dụ, website đang chạy bình thường thì mất kết nối database. Bạn xem CloudWatch để biết lỗi bắt đầu lúc nào và ảnh hưởng bao nhiêu yêu cầu. Config cho bạn xem security group trước và sau khi đổi. CloudTrail giúp tìm role nào đã gọi API đổi security group đó. Ghép ba thông tin lại, bạn mới có thể giải thích chuyện gì đã xảy ra.'
      ] },
      { title: 'Khi nào bạn mở CloudWatch?', paragraphs: [
        'Khi muốn biết CPU có cao không, website có chậm không hoặc số lỗi có tăng không, bạn bắt đầu từ CloudWatch. Những số đo theo thời gian này được gọi là metrics. Chẳng hạn, CPUUtilization cho biết mức dùng CPU của EC2 instance. Bạn đặt alarm để CloudWatch cảnh báo khi dữ liệu thỏa điều kiện đã chọn.',
        'CloudWatch còn có Logs để lưu nhật ký và Logs Insights để tìm lỗi trong các nhật ký đó. Nhưng bạn phải cấu hình ứng dụng, dịch vụ hoặc agent gửi log vào, cấp quyền ghi và chọn thời gian lưu. Tạo một log group không khiến mọi log tự xuất hiện. Tương tự, CPU thấp chưa nói lên thanh toán đang thành công; bạn cần theo dõi cả số giao dịch lỗi hoặc thời gian phản hồi.'
      ] },
      { title: 'CloudTrail ghi ai làm gì, nhưng có ghi hết mọi thứ không?', paragraphs: [
        'CloudTrail ghi các sự kiện liên quan đến thao tác AWS. Bạn cần phân biệt hai nhóm quan trọng: management events là những việc quản lý tài nguyên, như tạo EC2 hoặc đổi cấu hình bucket; data events là thao tác trên dữ liệu, như đọc object bằng S3 GetObject, ghi bằng PutObject, xóa bằng DeleteObject hoặc gọi Lambda Invoke.',
        'Mục Event history có sẵn cho bạn xem management events trong 90 ngày gần nhất, theo từng tài khoản và Region. Nó không hiển thị data events, không tự gom cả tổ chức và không phụ thuộc trail bạn tạo thêm. Nếu muốn lưu lâu hơn, bạn cần trail hoặc kho sự kiện phù hợp. Muốn biết ai đọc object S3, bạn phải bật data events cho đúng phạm vi; phần này có chi phí riêng.'
      ] },
      { title: 'AWS Config giúp bạn thấy điều gì?', paragraphs: [
        'Config giúp bạn xem tài nguyên đã được cấu hình ra sao và cấu hình thay đổi thế nào. Mỗi lần ghi nhận tạo ra thông tin về thuộc tính và quan hệ của tài nguyên, gọi là configuration item. Bạn có thể thêm Config rule để kiểm tra một yêu cầu cụ thể, chẳng hạn loại tài nguyên đó phải bật mã hóa. Bật ghi nhận cấu hình và tạo rule là hai việc riêng.',
        'Bạn cũng đừng hiểu Config là cứ đổi sai thì bị chặn ngay. Tùy loại tài nguyên, chế độ ghi và rule, Config ghi hoặc đánh giá khi có thay đổi hay theo lịch; dữ liệu có thể đến chậm. Nếu muốn biết ai gây ra thay đổi, hãy đối chiếu CloudTrail. Thời điểm Config ghi nhận thay đổi chưa đủ để xác định người thực hiện.'
      ] }
    ],
    table: { columns: ['CloudWatch', 'CloudTrail', 'AWS Config'], rows: [
      { label: 'Câu hỏi chính', cells: ['Hệ thống đang hoạt động ra sao?', 'Ai gọi API nào, lúc nào?', 'Tài nguyên cấu hình ra sao, có đúng yêu cầu không?'] },
      { label: 'Bạn xem được gì?', cells: ['Chỉ số vận hành, log và trạng thái cảnh báo.', 'API đã gọi, danh tính, tham số và kết quả được ghi.', 'Cấu hình, quan hệ giữa tài nguyên và kết quả kiểm tra rule.'] },
      { label: 'Ví dụ', cells: ['Cảnh báo tỷ lệ HTTP 5xx tăng.', 'Điều tra yêu cầu đổi security group.', 'Tìm security group vi phạm quy tắc cấu hình.'] },
      { label: 'Bạn cần cấu hình gì?', cells: ['Nguồn chỉ số và log, dimensions để phân biệt chuỗi chỉ số, quyền gửi dữ liệu.', 'Loại sự kiện, bộ chọn sự kiện, tài khoản và Region.', 'Loại tài nguyên, recorder để ghi cấu hình, Region và rules.'] },
      { label: 'Thời điểm xử lý', cells: ['Theo chu kỳ gửi số đo và đánh giá cảnh báo.', 'Ghi nhận và chuyển sự kiện có độ trễ.', 'Khi có thay đổi hoặc theo lịch tùy cấu hình; có độ trễ.'] },
      { label: 'Lưu dữ liệu', cells: ['Bạn chọn thời gian lưu log; chỉ số có quy định lưu riêng.', 'Event history giữ 90 ngày management events theo Region; muốn lâu hơn cần cấu hình thêm.', 'Bạn chọn thời gian lưu lịch sử và tài nguyên cần ghi.'] },
      { label: 'Nhiều tài khoản thì sao?', cells: ['Có cách giám sát chung nhiều tài khoản và Region.', 'Dùng organization trail và nơi lưu chung.', 'Dùng aggregator để xem chung dữ liệu nhiều tài khoản, Region.'] },
      { label: 'Tự khắc phục', cells: ['Alarm chạy hành động bạn đã cấu hình.', 'Bạn nối sự kiện với quy trình xử lý khác.', 'Bạn cấu hình thêm bước khắc phục và quyền chạy.'] }
    ] },
    conditions: [
      { title: 'Website chậm hoặc lỗi tăng thì chọn gì?', paragraphs: [
        'Bạn chọn CloudWatch để theo dõi độ trễ, tỷ lệ lỗi, số kết nối hoặc lượng công việc còn chờ trong hàng đợi. Trước khi đặt cảnh báo, hãy kiểm tra chỉ số đó đã có chưa. Nhiều thông số bên trong hệ điều hành hoặc ứng dụng cần agent thu thập hoặc cần ứng dụng tự gửi thêm.',
        'Tiếp theo, bạn chọn ngưỡng, khoảng thời gian đánh giá, cách xử lý dữ liệu thiếu và việc cần làm khi có cảnh báo. Ngưỡng quá nhạy sẽ báo liên tục; chỉ nhìn CPU lại dễ bỏ sót lỗi từ database hoặc dịch vụ khác. Khi nghi sự cố bắt đầu từ một thay đổi cấu hình, bạn xem thêm Config và CloudTrail.'
      ] },
      { title: 'Muốn tìm ai đã sửa hoặc truy cập tài nguyên thì sao?', paragraphs: [
        'Bạn dùng CloudTrail để tìm danh tính, API, địa chỉ nguồn và thời điểm thao tác. Nhưng trước hết phải hỏi: loại sự kiện đó có được ghi lúc sự việc xảy ra không? Nếu hôm nay bạn mới bật S3 data events thì không thể lấy lại lịch sử đọc object của tháng trước từ cấu hình vừa bật.',
        'Nếu công ty có nhiều tài khoản và Region, bạn có thể dùng organization trail để ghi hoạt động toàn tổ chức theo phạm vi đã cấu hình. Bạn vẫn phải chọn nơi lưu, bảo vệ bucket chứa log và kiểm soát quyền đọc, quyền dùng khóa mã hóa. Mở Event history trong một tài khoản sẽ không tự cho bạn toàn bộ dữ liệu đó.'
      ] },
      { title: 'Muốn biết tài nguyên nào cấu hình sai và tự sửa được không?', paragraphs: [
        'Bạn dùng Config để xem lịch sử cấu hình và kiểm tra tài nguyên có đúng quy tắc không. Hãy kiểm tra loại tài nguyên, rule và Region có được hỗ trợ, rồi bật recorder để ghi nhận cấu hình. Nếu muốn xem nhiều tài khoản ở một nơi, bạn thêm aggregator. Thành phần này chỉ gom dữ liệu đã có, không tự bật ghi nhận ở các tài khoản nguồn.',
        'Config có thể phối hợp với bước khắc phục gọi là remediation, thường dùng Systems Manager Automation. Bạn phải cấu hình bước này và role có quyền sửa; chỉ bật Config là chưa đủ. Trước khi sửa, quy trình nên kiểm tra lại cấu hình hiện tại vì kết quả đánh giá có thể đã cũ. Với thay đổi nhạy cảm, bạn có thể thêm bước duyệt.'
      ] }
    ],
    scenarios: [
      { title: 'Website mất kết nối database: dùng cả ba thế nào?', paragraphs: [
        'Giả sử bạn nhận cảnh báo lỗi kết nối database tăng. Bạn mở CloudWatch để xem lỗi bắt đầu từ đâu, ảnh hưởng dịch vụ nào. Sau đó xem Config: security group của database vừa bị bỏ rule cho phép ứng dụng kết nối. Bạn tìm tiếp trong CloudTrail để xác định role và API đã đổi rule đó.',
        'Mỗi bước trả lời thêm một câu hỏi: CloudWatch cho thấy ảnh hưởng; Config cho thấy thay đổi cấu hình; CloudTrail cho thấy thao tác và danh tính liên quan. Khi ghép dữ liệu, bạn cần khớp đúng tài nguyên và khoảng thời gian, vì bản ghi từ các dịch vụ có thể xuất hiện không cùng lúc.'
      ] },
      { title: 'Có người tải file nhạy cảm trong S3, tìm ở đâu?', paragraphs: [
        'Bạn cần tìm S3 GetObject trong CloudTrail data events, với điều kiện bucket hoặc object đó nằm trong phạm vi đã chọn để ghi. Nếu nhiều người dùng ứng dụng cùng truy cập S3 qua một role, CloudTrail có thể chỉ cho bạn biết phiên của role. Bạn cần ghép thêm log ứng dụng để xác định người dùng cụ thể.',
        'Event history mặc định không có câu trả lời này vì chỉ chứa management events. Config cũng không ghi lịch sử từng lần tải file; nó có thể giúp bạn xem bucket policy hoặc cấu hình mã hóa đã đổi ra sao. Muốn điều tra được về sau, bạn phải chuẩn bị thu thập đúng dữ liệu từ trước.'
      ] },
      { title: 'Có một trăm tài khoản thì quản lý chung thế nào?', paragraphs: [
        'Bạn bật ghi nhận cấu hình và triển khai Config rules ở những tài khoản, Region cần quản lý. Sau đó dùng aggregator để nhóm bảo mật xem kết quả chung. Song song, organization trail ghi hoạt động API; CloudWatch theo dõi vận hành và giúp bạn phát hiện khi việc thu thập dữ liệu gặp vấn đề.',
        'Nếu muốn tự sửa vi phạm, bạn bổ sung remediation với quyền vừa đủ và cách xử lý ngoại lệ. Aggregator chỉ giúp xem chung, không tự đi sửa tài nguyên. CloudTrail giúp điều tra thao tác nhưng cũng không tự kết luận mọi tài nguyên hiện tại có đạt chuẩn cấu hình của công ty hay chưa.'
      ] }
    ],
    pitfalls: [
      { title: 'Có log group rồi mà vẫn không thấy log?', paragraphs: ['Bạn vẫn cần cấu hình nguồn gửi log và cấp quyền. CloudWatch Logs có thể nhận log từ CloudTrail, nhưng CloudTrail tạo dữ liệu còn CloudWatch Logs lưu dữ liệu được chuyển tới. Hãy kiểm tra cả đường chuyển và thời gian lưu; log group trống chưa nói lên tài khoản không có hoạt động.'] },
      { title: 'Không thấy trong Event history nghĩa là chưa ai truy cập?', paragraphs: ['Chưa thể kết luận như vậy. Bạn có thể đang tìm thao tác dữ liệu trong nơi chỉ hiển thị management events. Hãy kiểm tra loại sự kiện, phạm vi đã chọn để ghi và thời điểm bật thu thập trước khi kết luận không có truy cập.'] },
      { title: 'Bật Config rồi có cần cấu hình gì nữa không?', paragraphs: ['Có. Ghi nhận cấu hình, đánh giá bằng rule và khắc phục là ba bước riêng. Bạn cần cấu hình từng bước theo mục tiêu. Rule phát hiện lỗi sau thay đổi cũng không thay thế policy dùng để ngăn người không có quyền thực hiện thao tác ngay từ đầu.'] },
      { title: 'Sao vừa đổi mà chưa thấy bản ghi?', paragraphs: ['Bạn kiểm tra đúng tài khoản, Region và phạm vi ghi trước, rồi xem dữ liệu có đang đến chậm không. Với tài nguyên toàn cục, cách ghi nhận còn có quy định riêng. Đừng mặc định cứ triển khai cùng một cấu hình vào mọi Region là sẽ có dữ liệu đúng và đầy đủ.'] }
    ],
    flow: { title: 'Nếu gặp sự cố, bạn kiểm tra theo thứ tự nào?', steps: [
      'Bạn đang cần xem lỗi vận hành, tìm thao tác API hay kiểm tra cấu hình?',
      'Kiểm tra đúng tài khoản, Region, nguồn dữ liệu và thời điểm bắt đầu ghi.',
      'Xem ảnh hưởng trong CloudWatch và thay đổi cấu hình trong Config.',
      'Tìm API và danh tính liên quan trong CloudTrail.',
      'Sửa nguyên nhân rồi xem ứng dụng đã ổn và rule đã đánh giá lại chưa.'
    ], caption: 'Bạn có thể đi qua lại giữa ba dịch vụ để nối các thông tin của cùng một sự cố.' },
    sources: [
      { title: 'CloudWatch — Tổng quan', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' },
      { title: 'CloudTrail — Giới hạn Event history', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html' },
      { title: 'CloudTrail — Data events', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html' },
      { title: 'CloudTrail — Organization trail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html' },
      { title: 'AWS Config — Tổng quan', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' },
      { title: 'AWS Config — Đánh giá bằng rules và độ trễ ghi nhận', url: 'https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html' },
      { title: 'AWS Config — Remediation', url: 'https://docs.aws.amazon.com/config/latest/developerguide/remediation.html' },
      { title: 'AWS Config — Tổng hợp nhiều tài khoản và Region', url: 'https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html' },
      { title: 'CloudWatch — Giám sát nhiều tài khoản và Region', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Cross-Account-Methods.html' }
    ]
  },
  'scp-iam-policy': {
    reviewedAt: '2026-10-20',
    overview: [
      { title: 'SCP khác IAM policy ở đâu?', paragraphs: [
        'SCP đặt giới hạn chung cho các tài khoản thành viên trong AWS Organizations; IAM policy thường là nơi bạn cấp quyền làm việc cho user hoặc role. Ví dụ, role triển khai có AdministratorAccess nhưng SCP của công ty cấm dừng CloudTrail thì role đó vẫn không dừng được. Ngược lại, SCP cho phép S3 cũng chưa khiến một role tự có quyền đọc S3.',
        'Khi nói IAM policy, bạn cần hỏi policy gắn ở đâu. Policy gắn với user, group hoặc role gọi là identity-based policy. Policy gắn trên tài nguyên, chẳng hạn bucket policy của S3, gọi là resource-based policy. Cả hai đều có thể tham gia cấp hoặc từ chối quyền, nhưng AWS đánh giá chúng khác nhau trong một số trường hợp.'
      ] },
      { title: 'Gắn SCP ở OU thì tài khoản bên dưới chịu ảnh hưởng thế nào?', paragraphs: [
        'Bạn có thể gắn SCP ở root của tổ chức, ở OU để nhóm tài khoản hoặc ở từng tài khoản. AWS xét dọc đường từ root qua các OU tới tài khoản. Một hành động phải được Allow ở từng cấp trên đường đó; nếu có Deny khớp yêu cầu ở bất kỳ cấp nào thì hành động đó bị chặn.',
        'Nếu một cấp có nhiều SCP, các Allow ở cùng cấp có thể bổ sung cho nhau. Nhưng Allow ở tài khoản không bù được quyền bị thiếu hay bị Deny ở OU cha. FullAWSAccess giữ phạm vi cho phép rộng tại cấp được gắn. Đây là SCP, nên nó vẫn không cấp quyền làm việc cho role như AdministratorAccess.'
      ] },
      { title: 'Không có Allow và có Deny khác nhau thế nào?', paragraphs: [
        'Nếu không có Allow phù hợp, yêu cầu có thể bị từ chối vì chưa được cấp quyền; đây là implicit deny. Nếu có statement Deny khớp thao tác, tài nguyên và điều kiện, đó là explicit deny. Deny này có thể chặn một quyền được Allow ở nơi khác. Bạn phải đọc cả Condition, vì Deny có ngoại lệ chưa chắc áp dụng cho người đang gọi.',
        'Ngoài SCP, bạn có thể gặp permissions boundary của user hoặc role, và session policy của phiên tạm thời. Boundary giới hạn quyền mà policy gắn với danh tính có thể cấp; session policy giới hạn quyền của phiên. Chúng không tự cấp quyền. Vì vậy, thêm Allow vào role vẫn có thể chưa đủ nếu quyền đó nằm ngoài giới hạn đang áp dụng.'
      ] },
      { title: 'Vậy quyền có phải lúc nào cũng là giao của tất cả policy?', paragraphs: [
        'Bạn có thể dùng cách hiểu “quyền được cấp phải nằm trong các giới hạn” để đọc policy của role. Nhưng đừng áp dụng một công thức cho mọi trường hợp. Với resource policy trong cùng tài khoản, AWS còn xét policy cấp trực tiếp cho ai: IAM user, role hay một phiên của role. Đối tượng được cấp quyền trong policy này gọi là principal.',
        'Cụ thể, quyền cấp trực tiếp cho user ARN trong cùng tài khoản không bị chặn chỉ vì thiếu Allow trong identity policy hoặc boundary. Quyền cấp trực tiếp cho role session ARN cũng không bị giới hạn bởi implicit deny trong identity policy, boundary hoặc session policy. Cấp cho role ARN thì boundary và session policy vẫn giới hạn quyền. Các Deny tường minh và giới hạn tổ chức áp dụng vẫn phải được kiểm tra; các ngoại lệ này không có nghĩa bạn được vượt SCP.'
      ] }
    ],
    table: { columns: ['SCP', 'IAM identity-based policy', 'Resource-based policy / trust policy'], rows: [
      { label: 'Dùng để làm gì?', cells: ['Đặt giới hạn quyền chung của tổ chức.', 'Cấp hoặc chặn quyền của user, group, role.', 'Cho ai truy cập tài nguyên; trust policy cho ai dùng role.'] },
      { label: 'Nơi gắn', cells: ['Root, OU hoặc tài khoản của Organizations.', 'User, group hoặc role.', 'Tài nguyên có hỗ trợ policy đó.'] },
      { label: 'Có tự cấp quyền không?', cells: ['Không.', 'Allow có thể cấp quyền, nhưng còn chịu giới hạn áp dụng.', 'Allow có thể cấp quyền; cách xét còn tùy dịch vụ và người được cấp.'] },
      { label: 'Trường Principal', cells: ['Không có trường Principal như bucket policy.', 'Không có Principal; policy áp dụng cho danh tính được gắn.', 'Thường ghi ai được truy cập và điều kiện kèm theo.'] },
      { label: 'Có ảnh hưởng xuống OU con không?', cells: ['Có, AWS xét dọc đường root → OU → account.', 'Không.', 'Không.'] },
      { label: 'Nếu Deny khớp yêu cầu?', cells: ['Chặn được cả quản trị viên tài khoản thành viên.', 'Có thể chặn dù nơi khác có Allow.', 'Có thể chặn truy cập thuộc phạm vi áp dụng.'] },
      { label: 'Ví dụ', cells: ['Cấm tài khoản thành viên dừng ghi nhật ký.', 'Cho role triển khai cập nhật một nhóm Lambda.', 'Cho role khác tài khoản đọc một prefix S3 hoặc được AssumeRole.'] },
      { label: 'Điểm cần nhớ', cells: ['Không áp dụng cho danh tính trong management account hay service-linked roles.', 'Allow không vượt SCP hoặc Deny tường minh đang áp dụng.', 'Cần đọc đúng user ARN, role ARN, session ARN và cách truy cập chéo tài khoản.'] }
    ] },
    conditions: [
      { title: 'Khi nào bạn nên dùng SCP?', paragraphs: [
        'Bạn dùng SCP khi muốn đặt một giới hạn chung mà quản trị viên của tài khoản thành viên cũng phải tuân theo. Chẳng hạn, công ty không cho các tài khoản đó tắt ghi nhật ký, hoặc chỉ cho OU thử nghiệm dùng một nhóm dịch vụ. Để sử dụng SCP, Organizations phải bật chế độ đầy đủ tính năng.',
        'Có hai ngoại lệ bạn cần nhớ: SCP không áp dụng cho danh tính trong management account và không giới hạn service-linked roles. SCP cũng không tự làm bucket trở thành riêng tư. Nếu principal bên ngoài được bucket policy cấp quyền, bạn phải kiểm soát đường truy cập đó bằng chính sách phù hợp; SCP của tài khoản chứa bucket chưa đủ để kết luận không ai bên ngoài truy cập được.'
      ] },
      { title: 'Còn quyền của từng ứng dụng thì đặt ở đâu?', paragraphs: [
        'Bạn thường đặt quyền cụ thể trong policy của role. Ví dụ, một worker chỉ cần đọc một thư mục theo prefix trong S3 và gửi vào một SQS queue. Bạn cấp đúng các thao tác và tài nguyên đó cho role; không cần mở toàn bộ S3 chỉ vì SCP của tổ chức đang cho phép S3.',
        'Nếu đội phát triển được tự tạo role, bạn có thể yêu cầu gắn permissions boundary để giới hạn quyền họ cấp tiếp. Nhưng cần kiểm soát cả việc sửa, gỡ boundary và quyền iam:PassRole để giao role cho dịch vụ. Đặt giới hạn rồi lại cho phép tự gỡ giới hạn thì cách phân quyền đó chưa đạt mục tiêu.'
      ] },
      { title: 'Pipeline ở tài khoản A muốn triển khai sang B thì cần gì?', paragraphs: [
        'Bạn thường cho pipeline ở A gọi sts:AssumeRole để tạo phiên làm việc bằng role ở B. Phía A cần quyền gọi thao tác đó; trust policy của role B phải chấp nhận người gọi và các điều kiện kèm theo. Trust policy chỉ trả lời ai được dùng role. Sau khi tạo phiên, role B được làm gì lại phụ thuộc quyền và giới hạn của role B.',
        'Một cách khác là role ở A truy cập thẳng tài nguyên ở B. Với cách này, thông thường bạn cần Allow ở phía danh tính A và ở policy của tài nguyên B, đồng thời thỏa các giới hạn tương ứng. Một số dịch vụ như KMS có quy tắc thêm. Vì thế, bạn nên xác định đang dùng cách nào trước khi sửa policy.'
      ] }
    ],
    scenarios: [
      { title: 'Có AdministratorAccess rồi, sao vẫn bị từ chối?', paragraphs: [
        'Giả sử bạn có AdministratorAccess trong một tài khoản thành viên nhưng không gọi được cloudtrail:StopLogging. Bạn tìm thấy SCP ở OU có Deny khớp thao tác đó. Nếu các điều kiện cũng khớp, SCP sẽ chặn yêu cầu dù policy IAM cho phép. Đây chính là lý do công ty dùng SCP để giữ một số giới hạn chung.',
        'Bạn thêm một Allow nữa vào IAM hoặc SCP của tài khoản cũng không vượt qua Deny đó. Bạn cần xem lại chính sách tổ chức hoặc dùng ngoại lệ đã được thiết kế. Tuy nhiên, nếu người gọi là danh tính trong management account thì đừng đổ lỗi cho SCP; bạn phải tìm nguyên nhân ở lớp quyền khác.'
      ] },
      { title: 'SCP cho phép S3 rồi, sao ứng dụng vẫn không đọc được file?', paragraphs: [
        'Vì SCP không cấp quyền đọc file. Nó chỉ cho biết thao tác đó nằm trong phạm vi tổ chức cho phép. Nếu role chưa có quyền s3:GetObject trên đúng object ARN và không có đường cấp quyền khác phù hợp, bạn vẫn bị từ chối. Bạn cần xem policy của role và bucket policy để biết quyền đang được cấp từ đâu.',
        'Nếu object mã hóa bằng SSE-KMS, bạn còn phải kiểm tra quyền giải mã và key policy. Nếu role có boundary hoặc phiên có session policy, hãy xem các giới hạn đó. Bạn cần kiểm tra đúng yêu cầu đọc file; chỉ thấy s3:* xuất hiện trong một SCP chưa đủ để xác nhận quyền.'
      ] },
      { title: 'AssumeRole được rồi mà cập nhật Lambda vẫn lỗi?', paragraphs: [
        'Bạn đã tạo được phiên của role B, nhưng khi gọi cập nhật Lambda thì bị AccessDenied. Hai bước này kiểm tra hai quyền khác nhau. AssumeRole thành công chỉ cho biết bạn được tạo phiên tại thời điểm đó; nó không chứng minh phiên đã có quyền lambda:UpdateFunctionCode.',
        'Lúc này, bạn kiểm tra policy của role B, SCP áp dụng cho B, boundary và session policy nếu có, cùng quyền tài nguyên liên quan. Sửa trust policy hay cấp quyền Lambda cho role nguồn ở A không tự thêm quyền cho phiên B. Bạn có thể dùng CloudTrail để xác định chính xác phiên nào gọi API thất bại.'
      ] }
    ],
    pitfalls: [
      { title: 'Có nên nhớ một công thức quyền duy nhất không?', paragraphs: ['Bạn có thể dùng công thức đơn giản để nhớ rằng Allow của role còn chịu các giới hạn. Nhưng khi gặp bucket policy hoặc resource policy khác, hãy xem nó cấp trực tiếp cho user, role hay phiên của role. Như phần trên đã giải thích, cách xử lý implicit deny khác nhau; bỏ qua chi tiết này dễ dẫn tới kết luận sai.'] },
      { title: 'Gỡ FullAWSAccess có thể làm mất quyền gì?', paragraphs: ['Nếu bạn gỡ FullAWSAccess ở một cấp mà chưa có Allow thay thế, tài khoản bên dưới có thể mất quyền dù IAM vẫn đang cấp rất rộng. Bạn nên thử trên OU nhỏ và kiểm tra những thao tác quản trị cần giữ trước khi áp dụng rộng hơn. Allow ở tài khoản không bù được phần bị thiếu ở cấp cha.'] },
      { title: 'Mở rộng trust policy có sửa được lỗi thiếu quyền không?', paragraphs: ['Chỉ khi lỗi nằm ở bước tạo phiên. Nếu bạn đã AssumeRole thành công và đang bị từ chối khi gọi S3, Lambda hay CloudFormation, cần kiểm tra quyền của phiên đó. Mở trust cho thêm người gọi vừa không sửa đúng lỗi vừa khiến nhiều danh tính hơn có thể dùng role.'] },
      { title: 'Thấy AccessDenied thì kiểm tra gì trước?', paragraphs: ['Bạn ghi lại ai đang gọi, dùng phiên nào, ở tài khoản nào, gọi API nào và tác động tài nguyên nào. Cùng một action vẫn có thể thành công với tài nguyên này nhưng bị chặn với tài nguyên khác vì ARN, tag, Region hoặc điều kiện phiên. Đọc đúng yêu cầu sẽ giúp bạn tránh cấp thêm quyền ở sai chỗ.'] }
    ],
    flow: { title: 'Bạn có thể kiểm tra lỗi quyền theo thứ tự nào?', steps: [
      'Xác định user, role hoặc phiên STS thực sự đang gọi API.',
      'Tách lỗi AssumeRole khỏi lỗi gọi dịch vụ sau khi đã tạo phiên.',
      'Xem Deny và các Allow cần có trên đường SCP từ root tới tài khoản.',
      'Xem quyền đến từ policy của danh tính, của tài nguyên hay cả hai tài khoản.',
      'Kiểm tra boundary, session policy và điều kiện theo đúng người hoặc phiên được cấp quyền.',
      'Sửa đúng thao tác và tài nguyên cần thiết, rồi thử lại bằng danh tính thực tế.'
    ], caption: 'Nếu dịch vụ có quy tắc riêng, như KMS, bạn xem thêm tài liệu của dịch vụ đó khi kiểm tra.' },
    sources: [
      { title: 'Organizations — SCP và các ngoại lệ', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' },
      { title: 'Organizations — Đánh giá SCP theo cây tổ chức', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html' },
      { title: 'IAM — Logic đánh giá policy', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' },
      { title: 'IAM — Permissions boundaries và resource-based grants', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html' },
      { title: 'IAM — Đánh giá Allow và Deny theo principal', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html' },
      { title: 'IAM — Đánh giá truy cập chéo tài khoản', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html' },
      { title: 'IAM — Tạo role và trust cho truy cập', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html' }
    ]
  }
};
