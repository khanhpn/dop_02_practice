import type { ComparisonArticle } from './types';

export const monitoringIamArticles: Record<string, ComparisonArticle> = {
  'cloudwatch-cloudtrail-config': {
    reading: [
      {
        title: 'CloudWatch là gì?',
        paragraphs: [
          'CloudWatch là dịch vụ giúp bạn theo dõi hệ thống đang chạy thế nào. Website có chậm không, máy chủ có quá tải không, ứng dụng đang báo lỗi gì — những việc như vậy bạn thường xem trong CloudWatch.',
          'Giả sử bạn có một website bán hàng chạy trên EC2 và dùng RDS làm database. Bình thường khách mở trang mất nửa giây, hôm nay lại mất năm giây. Bạn cần biết máy chủ có hết tài nguyên không, database có quá nhiều kết nối không, hay ứng dụng đang lỗi ở bước nào. CloudWatch là nơi bạn tập hợp những thông tin đó để kiểm tra.',
          'Trong CloudWatch, bạn sẽ gặp ba phần rất thường dùng: metrics để xem các số đo, logs để đọc nhật ký và alarms để nhận cảnh báo. Chúng liên quan với nhau nhưng không phải cùng một thứ.'
        ]
      },
      {
        title: 'Metrics, logs và alarms dùng thế nào?',
        paragraphs: [
          'Metrics là các số đo được ghi theo thời gian. Ví dụ, CPU của EC2 đang dùng 80%, database có bao nhiêu kết nối, hoặc website có bao nhiêu phản hồi lỗi. Bạn nhìn biểu đồ để thấy số đo tăng từ lúc nào và có trùng với thời điểm website chậm hay không.',
          'Logs là nhật ký chi tiết. Một số đo có thể cho biết có 200 yêu cầu lỗi, còn log giúp bạn đọc lỗi cụ thể: truy vấn database bị quá thời gian chờ, thiếu quyền đọc S3 hay ứng dụng ném ra lỗi xử lý đơn hàng. Bạn có thể dùng Logs Insights để tìm những dòng liên quan trong lượng log lớn.',
          'Alarm là phần bạn cấu hình để CloudWatch tự theo dõi một điều kiện rồi cảnh báo hoặc thực hiện hành động được hỗ trợ. Ví dụ, nếu tỷ lệ lỗi cao liên tiếp trong một khoảng thời gian, bạn muốn nhận thông báo. Bạn cần chọn ngưỡng, khoảng đánh giá và cách xử lý khi thiếu dữ liệu; một lần CPU tăng ngắn chưa chắc là sự cố cần đánh thức người trực.',
          'Một số chỉ số AWS có sẵn, nhưng không phải mọi thông tin đều tự xuất hiện. Thông số bên trong hệ điều hành hoặc số giao dịch thanh toán lỗi có thể cần agent hay ứng dụng gửi thêm. Log cũng cần nguồn gửi và quyền ghi. Tạo log group rồi để đó không khiến CloudWatch tự đọc được log của website.',
          'Với website bán hàng, bạn nên nhìn cả kết quả người dùng nhận được. CPU thấp mà khách không thanh toán được thì hệ thống vẫn có vấn đề. Chỉ số thời gian phản hồi và tỷ lệ thanh toán thành công thường giúp bạn hiểu tình hình hơn việc chỉ theo dõi CPU.'
        ]
      },
      {
        title: 'CloudTrail là gì?',
        paragraphs: [
          'CloudTrail là dịch vụ ghi lại hoạt động trong tài khoản AWS, nhất là các thao tác gọi API. Nó giúp bạn tìm ai đã làm gì, vào lúc nào và với tài nguyên nào. Người đó có thể bấm trên console, dùng dòng lệnh, hoặc là một ứng dụng đang chạy bằng IAM role.',
          'Vẫn là website bán hàng lúc nãy: một người vừa sửa security group khiến ứng dụng không kết nối được database. CloudWatch cho bạn thấy lỗi kết nối tăng. Còn muốn tìm role nào đã sửa security group và gọi API gì, bạn xem CloudTrail.',
          'CloudTrail không phải nhật ký chi tiết của mọi hành động bên trong ứng dụng. Nếu nhiều khách hàng dùng website và website dùng chung một role để gọi AWS, sự kiện AWS có thể chỉ cho thấy role hoặc phiên làm việc đó. Muốn biết khách hàng cụ thể nào thực hiện thao tác, bạn còn cần log và mã đối chiếu từ ứng dụng.'
        ]
      },
      {
        title: 'CloudTrail có ghi mọi lần đọc file trong S3 không?',
        paragraphs: [
          'Không mặc định như vậy. Bạn cần phân biệt thao tác quản lý tài nguyên với thao tác trên dữ liệu. Tạo EC2, đổi cấu hình bucket hoặc sửa security group là những ví dụ về management events. Đọc object S3 bằng GetObject, ghi bằng PutObject, xóa bằng DeleteObject hoặc gọi Lambda Invoke thuộc nhóm data events.',
          'Mục Event history có sẵn cho bạn xem management events trong 90 ngày gần nhất, theo từng tài khoản và Region. Nó không hiển thị data events. Vì thế, bạn tìm trong đó mà không thấy lần tải file chưa có nghĩa là chưa ai tải.',
          'Nếu cần biết ai đọc các file nhạy cảm, bạn phải cấu hình ghi data events cho đúng tài nguyên và phạm vi cần theo dõi. Phần này có chi phí riêng. Nếu hôm nay mới bật thì nó không tạo lại được lịch sử đọc file của tháng trước.',
          'Muốn giữ lịch sử lâu hơn, bạn cần trail hoặc kho sự kiện phù hợp. Nếu có nhiều tài khoản, organization trail giúp ghi hoạt động trong tổ chức theo cấu hình của bạn. Bạn vẫn phải chọn phạm vi Region, nơi lưu và quyền truy cập log; Event history không tự biến thành lịch sử chung của cả công ty.'
        ]
      },
      {
        title: 'AWS Config là gì?',
        paragraphs: [
          'AWS Config là dịch vụ giúp bạn theo dõi cấu hình tài nguyên và những thay đổi của cấu hình đó. Chẳng hạn, security group hôm qua cho phép kết nối từ đâu, hôm nay có thêm rule gì, hoặc một tài nguyên có đang bật mã hóa theo yêu cầu hay không.',
          'Bạn bật ghi nhận cho những loại tài nguyên cần theo dõi. Config lưu thông tin cấu hình và quan hệ giữa các tài nguyên được hỗ trợ. Nhờ vậy, khi security group của database đổi, bạn có thể xem cấu hình trước và sau để biết phần nào đã thay đổi.',
          'Nếu muốn kiểm tra tài nguyên có đúng yêu cầu không, bạn tạo Config rule. Ví dụ, công ty yêu cầu một loại tài nguyên phải bật mã hóa thì rule sẽ đánh giá cấu hình đó. Chỉ bật ghi nhận chưa có nghĩa đã có các quy tắc kiểm tra.',
          'Config cũng không chặn ngay mọi thay đổi sai. Việc ghi nhận và đánh giá có thể diễn ra theo thay đổi hoặc theo lịch tùy loại tài nguyên, chế độ ghi và rule; dữ liệu có thể đến chậm. Config giúp xem cấu hình, còn tìm ai đã gọi API gây ra thay đổi thì bạn đối chiếu CloudTrail.'
        ]
      },
      {
        title: 'Config thấy sai thì tự sửa được không?',
        paragraphs: [
          'Có thể cấu hình để tự sửa, nhưng bạn phải thêm bước khắc phục. Ví dụ, Config rule phát hiện tài nguyên không đạt yêu cầu, rồi một quy trình Systems Manager Automation thực hiện việc sửa. Quy trình đó cần role có quyền phù hợp; bật Config một mình không tự cấp quyền hay tự tạo việc sửa.',
          'Trước khi sửa, quy trình nên kiểm tra lại trạng thái hiện tại. Có thể kết quả đánh giá được tạo vài phút trước nhưng người vận hành đã sửa xong rồi. Với thay đổi ảnh hưởng lớn, bạn cũng có thể yêu cầu duyệt thay vì chạy tự động ngay.',
          'Nếu công ty có nhiều tài khoản và Region, Config aggregator giúp bạn xem chung dữ liệu cấu hình và kết quả kiểm tra. Nhưng nó chỉ gom dữ liệu đã có: bạn vẫn cần bật ghi nhận ở tài khoản nguồn. Aggregator cũng không tự đi sửa tài nguyên ở các tài khoản đó.'
        ]
      },
      {
        title: 'Khi website mất kết nối database, dùng cả ba ra sao?',
        paragraphs: [
          'Đầu tiên, CloudWatch cho thấy số lỗi kết nối tăng từ 10 giờ và khách bắt đầu không đặt hàng được. Bạn xem log ứng dụng để xác định lỗi xảy ra lúc kết nối database, thay vì đoán máy web đang thiếu CPU.',
          'Tiếp theo, Config cho thấy security group của database vừa mất rule cho phép máy ứng dụng kết nối. Bạn đã biết cấu hình nào thay đổi. Sau đó, CloudTrail giúp tìm yêu cầu API đổi rule đó và role đã thực hiện.',
          'Sau khi sửa lại rule, bạn quay về CloudWatch để xem kết nối và giao dịch đã bình thường chưa. Nếu có Config rule liên quan, bạn kiểm tra thêm kết quả đánh giá mới. Khi nối các thông tin này, cần khớp đúng tài nguyên và khoảng thời gian vì dữ liệu ở ba dịch vụ không nhất thiết xuất hiện cùng lúc.'
        ]
      },
      {
        title: 'Những chỗ nào dễ chọn nhầm?',
        paragraphs: [
          'Website chậm thì bắt đầu từ CloudWatch, không phải ngồi đọc toàn bộ CloudTrail để đo tốc độ phản hồi. Nhưng nếu bạn muốn biết ai vừa đổi cấu hình khiến website chậm, CloudTrail lại là phần cần thiết.',
          'Muốn xem security group đã thay đổi từ cấu hình nào sang cấu hình nào, bạn dùng Config nếu tài nguyên đã nằm trong phạm vi ghi nhận. Muốn tìm người sửa, bạn xem CloudTrail. Hai câu hỏi này thường đi cùng nhau nhưng không nên coi là một.',
          'Muốn tìm ai tải file S3, bạn cần đúng loại CloudTrail data events đã được bật từ trước. Config không ghi lịch sử từng lần tải; Event history mặc định cũng không có data events. Không thấy dữ liệu thì kiểm tra thêm tài khoản, Region, phạm vi ghi và thời gian lưu trước khi kết luận.',
          'CloudTrail còn có thể gửi log tới CloudWatch Logs. Khi đó bạn đang dùng CloudWatch để lưu và tìm dữ liệu do CloudTrail tạo ra. Việc hai dịch vụ nối được với nhau không khiến vai trò của chúng giống nhau.'
        ]
      }
    ]
  },
  'scp-iam-policy': {
    reading: [
      {
        title: 'IAM policy là gì?',
        paragraphs: [
          'IAM policy là tài liệu mô tả quyền trong AWS: được làm gì, với tài nguyên nào và trong điều kiện nào. Ví dụ, ứng dụng cần đọc ảnh sản phẩm trong S3 thì bạn cấp s3:GetObject trên những object cần đọc. Ứng dụng không tự có quyền đọc chỉ vì nó đang chạy trong tài khoản AWS của bạn.',
          'Thông thường, bạn gắn policy vào user, group hoặc role. Với ứng dụng chạy trên AWS, bạn thường cấp quyền qua role rồi để ứng dụng dùng role đó. Một ứng dụng chỉ đọc ảnh không cần được cấp cả quyền xóa bucket hay quản trị IAM.',
          'Trong policy, Allow là cho phép và Deny là từ chối. Nhưng một Allow không phải lúc nào cũng đủ để yêu cầu thành công, vì AWS còn kiểm tra những giới hạn và policy liên quan khác. SCP là một trong số đó.'
        ]
      },
      {
        title: 'SCP là gì?',
        paragraphs: [
          'SCP là chính sách của AWS Organizations dùng để đặt giới hạn quyền cho các tài khoản thành viên. Bạn dùng nó khi muốn có một quy định chung, chẳng hạn các tài khoản vận hành ứng dụng không được dừng ghi nhật ký CloudTrail, kể cả người đang thao tác có quyền quản trị IAM.',
          'Điểm quan trọng nhất là SCP không cấp quyền. Nếu SCP cho phép dùng S3 nhưng role của ứng dụng chưa được cấp quyền đọc file, ứng dụng vẫn không đọc được. SCP cho biết tổ chức cho phép quyền đó tồn tại; policy và các cơ chế cấp quyền phù hợp mới cho role quyền thực sự sử dụng nó.',
          'Vì vậy, IAM policy và SCP thường cùng dùng. Bạn cấp quyền cần cho công việc bằng IAM, rồi dùng SCP để giữ những giới hạn chung giữa các tài khoản. Muốn dùng SCP, AWS Organizations phải bật chế độ đầy đủ tính năng.'
        ]
      },
      {
        title: 'OU là gì, và SCP ảnh hưởng tới tài khoản thế nào?',
        paragraphs: [
          'OU là cách bạn nhóm các tài khoản trong Organizations. Ví dụ, bạn có OU Production chứa tài khoản chạy thật và OU Sandbox chứa tài khoản thử nghiệm. OU có thể nằm trong OU khác; phía trên cùng là root của tổ chức. Root ở đây là cấp trong cây tổ chức, không phải root user của một tài khoản.',
          'Bạn gắn SCP ở root, OU hoặc từng tài khoản. AWS xét quyền dọc đường từ root qua các OU tới tài khoản. Nếu SCP ở OU Production có Deny khớp thao tác dừng CloudTrail thì tài khoản bên dưới chịu giới hạn đó; gắn Allow ở tài khoản không vượt qua Deny từ OU cha.',
          'Ngoài việc không có Deny phù hợp, hành động còn cần được Allow ở từng cấp trên đường đó. Nhiều SCP cùng gắn tại một cấp có thể bổ sung Allow cho nhau. Nhưng nếu cấp cha không cho phép một hành động, cấp con không tự mở lại được.',
          'Bạn sẽ gặp SCP tên FullAWSAccess. Nó giữ phạm vi cho phép rộng ở cấp được gắn, chứ không cấp quyền quản trị cho từng role. Nếu gỡ nó mà chưa có Allow thay thế cần thiết, các tài khoản bên dưới có thể mất quyền dù policy IAM của họ vẫn chưa đổi.'
        ]
      },
      {
        title: 'Có AdministratorAccess rồi, sao vẫn bị từ chối?',
        paragraphs: [
          'Giả sử bạn là quản trị viên trong tài khoản thành viên, có AdministratorAccess, nhưng gọi cloudtrail:StopLogging thì gặp AccessDenied. Bạn kiểm tra thấy SCP ở OU cấm thao tác này và điều kiện của Deny cũng khớp yêu cầu. Khi đó, quyền quản trị IAM không vượt được SCP.',
          'Thêm một Allow nữa vào role không giải quyết được. Bạn phải xem lại giới hạn của tổ chức hoặc dùng ngoại lệ đã được thiết kế cho trường hợp đó. Khi đọc Deny, nhớ xem cả tài nguyên và Condition: một statement có ngoại lệ chưa chắc chặn mọi người gọi.',
          'SCP cũng có phạm vi riêng. Nó không áp dụng cho danh tính trong management account và không giới hạn service-linked roles. Nếu người gọi nằm trong nhóm ngoại lệ đó, bạn cần tìm nguyên nhân ở các policy khác, thay vì mặc định lỗi do SCP.'
        ]
      },
      {
        title: 'SCP không chặn thì vì sao vẫn thiếu quyền?',
        paragraphs: [
          'Vì “không bị SCP chặn” chưa có nghĩa là “đã được cấp đủ quyền”. Với ứng dụng đọc ảnh S3, bạn vẫn cần quyền s3:GetObject trên đúng object ARN. Nếu file được mã hóa bằng SSE-KMS, bạn còn phải xem quyền giải mã và key policy. Mở rộng quyền S3 không tự giải quyết được lỗi thiếu quyền KMS.',
          'Bạn có thể gặp thêm permissions boundary của user hoặc role. Nó giới hạn quyền mà policy gắn với danh tính có thể cấp, nhưng không tự cấp quyền. Ví dụ, policy của role cho cả đọc lẫn xóa S3, còn boundary chỉ cho đọc, thì quyền xóa từ policy đó vẫn bị giới hạn.',
          'Một phiên tạm thời còn có thể bị giới hạn bằng session policy. Khi xem lỗi, bạn cần biết ứng dụng đang dùng đúng role nào và phiên nào, vì quyền nhìn thấy trên role chưa chắc là toàn bộ điều kiện áp dụng cho lần gọi đó.',
          'Nếu cho đội phát triển tự tạo role, bạn có thể yêu cầu họ gắn boundary. Đồng thời, cần kiểm soát quyền sửa hoặc gỡ boundary và quyền iam:PassRole để giao role cho dịch vụ; nếu họ tự gỡ được giới hạn thì việc đặt boundary chưa đạt mục tiêu.'
        ]
      },
      {
        title: 'Bucket policy có liên quan gì tới IAM policy?',
        paragraphs: [
          'Ngoài policy gắn vào role, một số tài nguyên có policy riêng. Bucket policy là ví dụ quen thuộc: bạn đặt trên bucket và ghi ai được truy cập. AWS gọi nhóm này là resource-based policy. Người hoặc phiên được nhắc tới trong trường Principal là bên đang được cấp quyền.',
          'Bạn không nên hiểu SCP của tài khoản chứa bucket là tự chặn được mọi người bên ngoài. Nếu một danh tính bên ngoài được bucket policy cấp quyền, phải kiểm tra đường truy cập và các giới hạn thực sự áp dụng cho danh tính đó. SCP không tự biến bucket được chia sẻ thành bucket riêng tư.',
          'Có một chi tiết nâng cao khi cấp trực tiếp trong cùng tài khoản: policy ghi user ARN, role ARN hay ARN của một phiên role có thể dẫn tới cách đánh giá khác nhau. Chẳng hạn, quyền cấp thẳng cho user ARN không bị từ chối chỉ vì identity policy hoặc boundary thiếu Allow. Cấp thẳng cho phiên role cũng không bị giới hạn bởi phần thiếu Allow trong identity policy, boundary hoặc session policy; cấp cho role ARN thì boundary và session policy vẫn giới hạn quyền.',
          'Điều này không có nghĩa mọi giới hạn đều bị bỏ qua. Deny tường minh phù hợp và các giới hạn tổ chức áp dụng vẫn cần được tôn trọng. Bạn chỉ cần nhớ: với resource policy, phải đọc rõ nó cấp cho ai, đừng dùng một công thức giao quyền đơn giản cho mọi trường hợp.'
        ]
      },
      {
        title: 'Muốn dùng role ở tài khoản khác thì cần gì?',
        paragraphs: [
          'Ví dụ, pipeline ở tài khoản A cần triển khai ứng dụng sang tài khoản B. Bạn có thể cho pipeline gọi sts:AssumeRole để tạo phiên làm việc bằng role triển khai ở B. Phía A cần quyền gọi AssumeRole, còn trust policy của role B phải chấp nhận người gọi cùng các điều kiện đã đặt.',
          'Trust policy trả lời ai được dùng role. Nó khác policy cấp quyền làm việc cho role. Bạn được dùng role B chưa có nghĩa role B được cập nhật Lambda hay đọc mọi bucket trong B.',
          'Nếu AssumeRole thành công rồi mà cập nhật Lambda vẫn lỗi, bạn kiểm tra quyền của phiên role B: policy của role, SCP áp dụng cho B, boundary và session policy nếu có, cùng những quyền liên quan tới thao tác. Thêm quyền Lambda cho role nguồn ở A hoặc mở rộng trust policy không tự cấp thêm lambda:UpdateFunctionCode cho phiên B.',
          'Bạn cũng có thể thiết kế role ở A truy cập thẳng tài nguyên ở B mà không đổi sang role B. Khi đó, thông thường cần Allow ở phía danh tính A và policy của tài nguyên B, cùng các giới hạn tương ứng. Một số dịch vụ như KMS có quy tắc thêm. Trước khi sửa quyền, hãy xác định mình đang dùng cách nào.'
        ]
      },
      {
        title: 'Gặp AccessDenied thì nên bắt đầu từ đâu?',
        paragraphs: [
          'Bạn tìm đúng lần gọi bị lỗi trước: ai gọi, đang dùng phiên của role nào, gọi API nào và tác động tài nguyên nào. CloudTrail có thể giúp xác định những thông tin này cho sự kiện được ghi. Một API giống nhau vẫn có thể được phép trên tài nguyên này nhưng bị chặn trên tài nguyên khác vì ARN, tag, Region hoặc điều kiện phiên.',
          'Sau đó, bạn xem đây là lỗi tạo phiên AssumeRole hay lỗi làm việc sau khi đã có phiên. Với lỗi làm việc, tìm nguồn cấp quyền rồi kiểm tra Deny, SCP và những giới hạn đang áp dụng. Không nên chỉ tìm thấy một Allow là dừng, cũng không nên mở rộng mọi policy trước khi biết đang thiếu quyền ở đâu.',
          'Cách phân biệt dễ giữ nhất là: IAM policy mô tả quyền làm việc; SCP đặt giới hạn chung của tổ chức; trust policy quyết định ai được dùng role. Khi một yêu cầu thất bại, bạn cần xem đúng phần tham gia vào yêu cầu đó.'
        ]
      }
    ]
  }
};
