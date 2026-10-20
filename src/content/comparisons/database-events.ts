import type { ComparisonArticle } from './types';

export const databaseEventArticles: Record<string, ComparisonArticle> = {
  'multi-az-read-replica': {
    reviewedAt: '2026-10-20',
    overview: [
      { title: 'Multi-AZ và read replica khác nhau ở đâu?', paragraphs: [
        'Bạn muốn database tự có máy khác tiếp quản khi máy chính hỏng? Đó là lý do thường chọn Multi-AZ. Bạn muốn bớt truy vấn đọc trên máy chính? Đó là lý do thường thêm read replica. Cả hai đều có bản sao dữ liệu, nhưng công việc của những bản sao ấy khác nhau.',
        'Ví dụ, trang bán hàng vẫn chạy nhưng báo cáo cuối ngày làm database quá tải. Thêm một read replica rồi chuyển báo cáo sang đó có thể giúp máy chính nhẹ hơn. Còn nếu bạn lo máy chính ngừng hoạt động giữa giờ bán hàng, điều cần xem là cơ chế chuyển sang máy dự phòng. Chỉ đếm số bản sao chưa trả lời được cả hai vấn đề.'
      ] },
      { title: 'Multi-AZ có giúp đọc nhanh hơn không?', paragraphs: [
        'Cần xem bạn đang dùng loại Multi-AZ nào. Với Multi-AZ DB instance, RDS duy trì một máy chính, gọi là primary, và một máy dự phòng, gọi là standby, ở hai Availability Zone khác nhau. Dữ liệu được sao chép đồng bộ sang standby, nhưng ứng dụng không gửi truy vấn đọc tới standby này được. Vì vậy, bật cấu hình đó không chia bớt việc đọc cho primary.',
        'Khi xảy ra sự cố thuộc phạm vi RDS có thể tự xử lý, standby sẽ tiếp quản. Quá trình này gọi là failover. RDS cập nhật DNS của endpoint để ứng dụng tìm tới máy mới, nhưng các kết nối đang mở vẫn có thể bị đứt. Bạn cần để ứng dụng mở lại kết nối và thử lại an toàn; không thể coi mọi giao dịch đang chạy đều đã thành công.'
      ] },
      { title: 'Vậy Multi-AZ DB cluster có gì khác?', paragraphs: [
        'Multi-AZ DB cluster của RDS có một writer nhận ghi và hai reader có thể nhận đọc, nằm ở ba Availability Zone. Các reader còn có thể tiếp quản writer khi cần. Nếu bạn nghe hai câu “Multi-AZ không đọc được” và “Multi-AZ có reader”, hãy kiểm tra người nói đang chỉ DB instance hay DB cluster: hai cấu hình này khác nhau.',
        'DB cluster dùng sao chép bán đồng bộ: ít nhất một reader phải xác nhận thay đổi theo cơ chế của cụm trước khi writer xác nhận commit. Tuy nhiên, điều đó không có nghĩa mọi reader đã áp dụng xong dữ liệu mới. Một lần đọc ngay sau khi ghi vẫn cần chọn nơi đọc phù hợp. Bạn cũng phải kiểm tra engine, phiên bản, Region và cấu hình AWS hỗ trợ trước khi chọn loại cụm này.'
      ] },
      { title: 'Read replica nhận dữ liệu và nhận truy vấn thế nào?', paragraphs: [
        'Read replica thông thường của RDS DB instance nhận thay đổi bất đồng bộ: máy chính ghi trước, replica cập nhật theo sau. Khoảng chậm đó gọi là replication lag. Báo cáo có thể chấp nhận số liệu chậm vài giây, nhưng màn hình vừa thanh toán xong mà đọc số dư cũ thì có thể gây nhầm lẫn. Bạn cần phân loại truy vấn, không chuyển mọi câu SELECT sang replica một cách máy móc.',
        'Ứng dụng phải kết nối tới endpoint của replica để đọc; tạo replica không khiến truy vấn tự chuyển sang đó. Nếu muốn cho replica nhận vai trò database độc lập, bạn có thể thực hiện promote theo khả năng của engine. Đây là một thao tác cần kế hoạch chuyển ứng dụng và kiểm tra dữ liệu, không phải cơ chế tự tiếp quản giống Multi-AZ. Một số chế độ replica của Db2 và Oracle không nhận truy vấn người dùng, nên vẫn phải kiểm tra cấu hình cụ thể.'
      ] },
      { title: 'Aurora có giống read replica vừa nói không?', paragraphs: [
        'Aurora có kiến trúc riêng. Writer và Aurora Replicas dùng chung lớp lưu trữ phân tán của cụm; không nên lấy cơ chế sao chép của RDS DB instance để suy ra cách Aurora hoạt động. Aurora reader có thể phục vụ đọc và tham gia cơ chế tiếp quản writer của cụm.',
        'Một điểm dễ hiểu nhầm là reader endpoint của Aurora phân phối các kết nối mới tới các replica. Nó không chia từng câu SQL trong cùng một kết nối sang nhiều máy. Nếu ứng dụng giữ một kết nối rất lâu và gửi nhiều truy vấn qua đó, một reader vẫn có thể bận hơn các reader còn lại. Khi failover, ứng dụng cũng phải xử lý kết nối đứt và kết nối lại.'
      ] }
    ],
    table: {
      columns: ['Multi-AZ DB instance', 'Multi-AZ DB cluster', 'RDS read replica'],
      rows: [
        { label: 'Bạn thường dùng để làm gì?', cells: ['Tự chuyển sang standby khi primary lỗi.', 'Vừa dự phòng, vừa có máy nhận đọc.', 'Chia bớt truy vấn đọc; có thể dùng trong kế hoạch phục hồi.'] },
        { label: 'Có những máy nào?', cells: ['Một primary, một standby, ở hai AZ.', 'Một writer, hai reader, ở ba AZ.', 'Một nguồn và các replica theo khả năng của engine.'] },
        { label: 'Dữ liệu được sao chép ra sao?', cells: ['Đồng bộ tới standby.', 'Bán đồng bộ trong cụm.', 'Bất đồng bộ từ nguồn.'] },
        { label: 'Bản sao có nhận đọc không?', cells: ['Standby không nhận đọc.', 'Hai reader có nhận đọc.', 'Thường có; cần xem ngoại lệ engine và chế độ.'] },
        { label: 'Máy chính hỏng thì sao?', cells: ['RDS tự cho standby tiếp quản.', 'RDS chọn reader phù hợp để tiếp quản.', 'Bạn cần promote và chuyển ứng dụng theo kế hoạch.'] },
        { label: 'Đọc có thể gặp dữ liệu cũ không?', cells: ['Ứng dụng đọc primary, không đọc standby.', 'Reader có thể chưa áp dụng xong thay đổi.', 'Có, do độ trễ sao chép.'] },
        { label: 'Có sang Region khác không?', cells: ['Cấu hình này nằm trong một Region.', 'Cấu hình này nằm trong một Region.', 'Có thể, nếu engine hỗ trợ.'] },
        { label: 'Bạn cần chuẩn bị thêm gì?', cells: ['Chi phí dự phòng và xử lý kết nối lại.', 'Chi phí ba máy và tách nơi đọc/ghi.', 'Chi phí replica, chuyển truy vấn đọc và theo dõi độ trễ.'] }
      ]
    },
    conditions: [
      { title: 'Cần cả dự phòng lẫn đọc nhanh hơn thì chọn sao?', paragraphs: [
        'Bạn có thể kết hợp hai nhu cầu. Chẳng hạn, primary chạy Multi-AZ DB instance để có standby, rồi thêm read replica cho báo cáo. Nếu engine và cấu hình phù hợp, bạn cũng có thể cân nhắc Multi-AZ DB cluster vì các reader vừa phục vụ đọc vừa có thể tiếp quản writer.',
        'Lúc này, đừng chỉ so số lượng máy. Hãy tính chi phí, khả năng ứng dụng tách kết nối đọc/ghi và mức dữ liệu cũ bạn chấp nhận. Nếu replica chậm, xem cả CPU, I/O, lượng ghi và truy vấn nặng; tăng thêm replica không tự giải quyết mọi nguyên nhân gây trễ.'
      ] },
      { title: 'Bạn chấp nhận ngừng bao lâu và mất dữ liệu đến đâu?', paragraphs: [
        'Đây là hai câu hỏi riêng. RTO nói về thời gian gián đoạn có thể chấp nhận. RPO nói về khoảng thời gian dữ liệu có thể bị mất khi khôi phục. Ví dụ, yêu cầu phục hồi trong vài phút và chỉ chấp nhận mất dữ liệu của vài giây gần nhất sẽ dẫn tới lựa chọn khác với việc có thể chờ khôi phục bản sao lưu qua đêm.',
        'Sao chép đồng bộ giúp bảo vệ dữ liệu khi chuyển máy trong phạm vi thiết kế, nhưng bạn không nên tự gán RPO bằng không cho mọi loại sự cố. Cần xem loại lỗi, giao dịch nào đã được xác nhận và cơ chế khôi phục của engine. Giao dịch ứng dụng chưa nhận kết quả cũng cần được kiểm tra trước khi gửi lại.'
      ] },
      { title: 'Nếu cả Region gặp sự cố thì sao?', paragraphs: [
        'Multi-AZ đặt các máy ở nhiều AZ trong cùng Region. Nó không tự tạo nơi tiếp quản ở Region khác. Nếu yêu cầu của bạn bao gồm sự cố Region, cần thêm giải pháp liên Region được engine hỗ trợ và quy trình chuyển ứng dụng sang nơi mới.',
        'Một cross-Region read replica có thể là một phần của kế hoạch đó, nhưng sao chép bất đồng bộ vẫn có thể để lại dữ liệu chưa đến đích. Bạn cần theo dõi độ trễ, chuẩn bị bước promote và kiểm tra dữ liệu trước khi cho nơi mới nhận ghi. Bản sao lưu và khả năng khôi phục cũng cần được xem riêng.'
      ] }
    ],
    scenarios: [
      { title: 'Báo cáo làm chậm trang bán hàng: làm gì trước?', paragraphs: [
        'Nếu máy chính vẫn ổn nhưng truy vấn tổng hợp chiếm nhiều tài nguyên, bạn có thể đưa báo cáo sang read replica, miễn là người dùng chấp nhận số liệu chậm hơn một chút. Việc quan trọng là sửa kết nối của ứng dụng báo cáo để nó thực sự đọc replica.',
        'Bật Multi-AZ DB instance trong tình huống này chỉ bổ sung khả năng dự phòng; standby vẫn không chạy báo cáo giúp bạn. Nếu bạn cũng cần chịu lỗi AZ, hãy giữ hai yêu cầu riêng khi thiết kế: một phần lo tiếp quản, một phần lo chia tải đọc.'
      ] },
      { title: 'RDS đã chuyển máy rồi, vì sao ứng dụng vẫn lỗi?', paragraphs: [
        'Có thể ứng dụng còn giữ kết nối tới máy cũ hoặc còn dùng địa chỉ đã lưu trong bộ nhớ đệm DNS. Hãy kiểm tra nhóm kết nối dùng lại, thời gian chờ và cách ứng dụng mở kết nối mới. Thời gian RDS hoàn thành failover không đồng nghĩa người dùng đã thao tác thành công trở lại.',
        'Bạn cũng cần xử lý giao dịch dang dở. Nếu ứng dụng mất kết nối sau khi gửi lệnh ghi, chưa chắc lệnh đó chưa commit. Với thao tác nhạy cảm, hãy dùng mã nghiệp vụ ổn định và kiểm tra kết quả trước khi gửi lại để tránh ghi trùng. Diễn tập failover nên đo tới lúc ứng dụng hoạt động trở lại, không dừng ở trạng thái database.'
      ] },
      { title: 'Aurora có nhiều reader mà một máy vẫn quá tải?', paragraphs: [
        'Trước tiên, xem ứng dụng có giữ một số kết nối lâu dài qua reader endpoint hay không. Nhiều truy vấn trong cùng phiên vẫn chạy ở reader đã nhận kết nối đó. Kiểm tra cách tạo, tái sử dụng và đóng kết nối sẽ có ích hơn việc cho rằng endpoint phải tự cân bằng từng câu SQL.',
        'Đồng thời, xem truy vấn nặng có dồn vào một phiên hay một nhóm người dùng không. Thêm reader chỉ có tác dụng khi các kết nối và truy vấn thực sự sử dụng được chúng. Những truy vấn cần thấy ngay dữ liệu vừa ghi cũng cần đường đọc phù hợp, thay vì chuyển tất cả sang reader để giảm tải bằng mọi giá.'
      ] }
    ],
    pitfalls: [
      { title: 'Thấy chữ Multi-AZ là đủ biết bản sao làm được gì?', paragraphs: ['Chưa đủ. Bạn cần đọc tiếp “DB instance” hay “DB cluster”. Standby của cấu hình thứ nhất không phục vụ đọc, còn reader của cấu hình thứ hai có thể phục vụ đọc. Đây là khác biệt quyết định khi bạn muốn giảm tải máy chính.'] },
      { title: 'Promote xong là ứng dụng tự chạy tiếp?', paragraphs: ['Không nên mặc định như vậy. Promote tạo database độc lập và thay đổi quan hệ sao chép. Bạn còn phải chuyển ứng dụng tới nơi nhận ghi mới, kiểm tra phần dữ liệu có thể chưa tới và xử lý máy nguồn cũ để tránh hai nơi cùng nhận ghi ngoài ý muốn.'] },
      { title: 'Có bản sao rồi thì bỏ backup được không?', paragraphs: ['Không. Nếu bạn chạy nhầm một lệnh xóa hợp lệ, thay đổi đó có thể được sao chép sang cả các bản sao. Backup và point-in-time recovery giúp quay về dữ liệu trước lỗi; máy dự phòng giúp tiếp tục chạy khi hạ tầng hỏng. Hai việc này cần được chuẩn bị riêng.'] },
      { title: 'Chỉ theo dõi máy chính có đủ không?', paragraphs: ['Bạn nên theo dõi cả độ trễ và tài nguyên của replica, lỗi kết nối của ứng dụng và kết quả diễn tập phục hồi. Máy chính hoạt động bình thường không chứng minh báo cáo đang đọc dữ liệu đủ mới, cũng không chứng minh ứng dụng sẽ kết nối lại được khi failover.'] }
    ],
    flow: { title: 'Bạn có thể chọn theo thứ tự này', steps: ['Xác định lỗi cần chịu được: một máy, một AZ hay cả Region.', 'Ghi rõ thời gian gián đoạn và khoảng dữ liệu có thể mất.', 'Tách nhu cầu tự tiếp quản khỏi nhu cầu chia tải đọc.', 'Kiểm tra engine, loại Multi-AZ và nơi ứng dụng sẽ đọc/ghi.', 'Diễn tập chuyển máy, kiểm tra dữ liệu và đo lúc ứng dụng phục hồi.'], caption: 'Bảng và các bước này để xem lại nhanh. Quyết định vẫn dựa trên việc bạn cần bản sao làm gì.' },
    sources: [
      { title: 'AWS: Các loại triển khai Multi-AZ', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
      { title: 'AWS: Multi-AZ DB instance', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html' },
      { title: 'AWS: Multi-AZ DB cluster', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html' },
      { title: 'AWS: RDS read replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' },
      { title: 'AWS: Failover của Multi-AZ DB instance', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html' },
      { title: 'AWS: Kiến trúc Aurora', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html' },
      { title: 'AWS: Aurora reader endpoint', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Endpoints.Reader.html' }
    ]
  },
  'eventbridge-sns-sqs': {
    reviewedAt: '2026-10-20',
    overview: [
      { title: 'Ba dịch vụ này khác nhau thế nào?', paragraphs: [
        'Bạn có thể bắt đầu thế này: EventBridge chọn nơi nhận dựa trên nội dung sự kiện; SNS phát một thông điệp cho nhiều bên đăng ký; SQS giữ công việc để bên xử lý lấy dần. Chúng có thể đứng cạnh nhau trong cùng hệ thống, không nhất thiết phải chọn một rồi bỏ hai cái còn lại.',
        'Ví dụ, khi khách đặt hàng, kho cần giữ hàng, hệ thống email cần gửi thư và nhóm phân tích cần cập nhật số liệu. SNS có thể gửi một bản tới mỗi bên. Mỗi bên đặt một SQS queue riêng để xử lý theo tốc độ của mình. Nếu bạn còn muốn phân loại sự kiện theo nguồn hoặc nội dung rồi chọn nơi nhận, EventBridge có thể lo phần đó.'
      ] },
      { title: 'EventBridge chọn nơi nhận bằng cách nào?', paragraphs: [
        'Ứng dụng hoặc dịch vụ AWS gửi sự kiện vào event bus. Bạn viết rule để khớp những trường như source, detail-type hoặc thông tin trong detail. Khi sự kiện khớp, EventBridge gửi nó tới target đã cấu hình. Chẳng hạn, đơn hàng có loại “xuất khẩu” đi tới một quy trình khác với đơn hàng nội địa; bên gửi chỉ cần mô tả đơn hàng, không phải gọi thẳng từng hệ thống nhận.',
        'Ở đây, mình đang nói về EventBridge Classic event bus với rules và targets. Những phần về thứ tự, retry và archive bên dưới áp dụng cho phạm vi này. EventBridge có các loại bus và API khác với hành vi khác; Pipes dùng để nối nguồn với đích, còn Scheduler dùng để gọi theo lịch. Bạn không nên lấy tính năng của một loại để suy ra loại còn lại.'
      ] },
      { title: 'SNS cũng gửi nhiều nơi, vậy khác gì?', paragraphs: [
        'Với SNS, bạn gửi thông điệp vào một topic, các bên muốn nhận thì tạo subscription. Mỗi subscription có thể lọc theo thuộc tính hoặc nội dung thông điệp. Đây là cách thuận tiện khi bạn muốn nói “có một đơn hàng mới” và để nhiều bên đã đăng ký nhận một bản riêng.',
        'SNS Standard không bảo đảm thứ tự và có thể giao lặp. SNS FIFO hỗ trợ thứ tự theo MessageGroupId và loại trùng khi dùng đúng các điều kiện của chuỗi SNS–SQS FIFO. Vì vậy, nếu cần giữ thứ tự, bạn phải chọn đúng loại topic và queue, kiểm tra endpoint được hỗ trợ và cách chia nhóm thông điệp. Chỉ có chữ FIFO trong tên chưa đủ chứng minh mọi bước nghiệp vụ sẽ chạy đúng một lần.'
      ] },
      { title: 'SQS giữ công việc như thế nào?', paragraphs: [
        'SQS là nơi công việc chờ tới lượt xử lý. Chương trình xử lý, thường gọi là consumer hoặc worker, lấy thông điệp bằng ReceiveMessage. SQS tạm ẩn thông điệp trong một khoảng gọi là visibility timeout để các lượt nhận tiếp theo không thấy nó ngay. Khi làm xong, worker gọi DeleteMessage với receipt handle của lượt nhận phù hợp để xóa thông điệp.',
        'Nếu worker dừng giữa chừng hoặc chưa xóa trước khi hết thời gian ẩn, thông điệp có thể được nhận lại. Đây là lý do bạn phải thiết kế việc xử lý lặp mà không tạo thêm tác động, còn gọi là idempotency. Ví dụ, nhận lại cùng mã thanh toán không được trừ tiền thêm lần nữa. Queue giữ được công việc không có nghĩa nó biết bước nghiệp vụ bên ngoài đã thành công hay chưa.'
      ] },
      { title: 'Standard và FIFO khác nhau ở điểm nào?', paragraphs: [
        'SQS Standard giao ít nhất một lần và cố gắng giữ thứ tự, nhưng không bảo đảm thông điệp tới theo đúng thứ tự gửi. Nếu các công việc độc lập, bạn thường không cần ép chúng chạy tuần tự. Consumer vẫn phải chịu được thông điệp lặp và, khi cần, kiểm tra phiên bản dữ liệu để tránh cập nhật cũ ghi đè cập nhật mới.',
        'SQS FIFO giữ thứ tự trong từng MessageGroupId; các nhóm khác nhau có thể chạy song song. Ví dụ, các thay đổi của một đơn hàng dùng chung một group, còn hai đơn độc lập dùng hai group khác nhau. Cơ chế loại trùng khi gửi có cửa sổ năm phút. Nó không tạo giao dịch chung với database hay API thanh toán, nên vẫn cần xử lý an toàn khi nhận lại thông điệp.'
      ] }
    ],
    table: {
      columns: ['EventBridge Classic event bus', 'SNS', 'SQS'],
      rows: [
        { label: 'Bạn thường dùng để làm gì?', cells: ['Chọn nơi nhận theo nội dung sự kiện.', 'Gửi một bản cho mỗi bên đăng ký phù hợp.', 'Giữ công việc để xử lý dần.'] },
        { label: 'Ai đưa dữ liệu tới bên xử lý?', cells: ['EventBridge gửi tới target.', 'SNS gửi tới endpoint đăng ký.', 'Consumer lấy từ queue; dịch vụ tích hợp có thể lấy hộ.'] },
        { label: 'Nhiều bên có cùng nhận một bản không?', cells: ['Có thể, qua các rule và target khớp.', 'Có, qua các subscription phù hợp.', 'Cùng một queue thì các consumer chia nhau công việc.'] },
        { label: 'Lọc ở đâu?', cells: ['Event pattern của rule.', 'Bộ lọc của subscription.', 'Queue không thay cho bộ định tuyến theo nội dung.'] },
        { label: 'Có bảo đảm thứ tự không?', cells: ['Không bảo đảm thứ tự giao.', 'Standard không; FIFO theo message group.', 'Standard không; FIFO theo message group.'] },
        { label: 'Muốn giữ để xử lý sau?', cells: ['Cấu hình archive nếu cần replay lịch sử.', 'Thường ghép với queue cho từng bên nhận.', 'Giữ tối đa 14 ngày nếu chưa xóa hoặc hết hạn.'] },
        { label: 'Nếu chưa giao hoặc chưa xử lý được?', cells: ['Thử giao lại theo cấu hình target.', 'Thử giao lại theo giao thức bên nhận.', 'Thông điệp có thể được nhận lại khi hết thời gian ẩn.'] },
        { label: 'DLQ giữ lỗi nào?', cells: ['Lỗi giao tới target.', 'Lỗi giao tới subscription.', 'Thông điệp vượt số lượt nhận theo chính sách.'] }
      ]
    },
    conditions: [
      { title: 'Khi nào nên đặt SQS sau SNS hoặc EventBridge?', paragraphs: [
        'Khi bên gửi có thể tạo công việc nhanh hơn bên xử lý, một queue giúp công việc chờ lại thay vì bắt hai bên chạy cùng tốc độ. Ví dụ, đợt khuyến mãi tạo rất nhiều đơn nhưng hệ thống xuất hóa đơn chỉ xử lý được một lượng giới hạn mỗi giây. SQS giữ phần còn lại để worker làm tiếp.',
        'Bạn cần chọn visibility timeout đủ cho một lần xử lý và gia hạn nếu công việc kéo dài. Đặt quá ngắn dễ khiến cùng công việc bị nhận lại khi lượt trước chưa xong; đặt quá dài khiến hệ thống chờ lâu mới nhận lại công việc của worker đã dừng. Thời gian lưu thông điệp là chuyện khác: SQS giữ tối đa 14 ngày, nên phải theo dõi tuổi thông điệp và lượng việc tồn đọng.'
      ] },
      { title: 'Nếu EventBridge chưa giao được thì nó làm gì?', paragraphs: [
        'Với lỗi có thể thử lại, EventBridge Classic mặc định thử giao đến target trong tối đa 24 giờ và tối đa 185 lần; chạm giới hạn nào trước thì dừng. Các lần thử có khoảng chờ tăng dần kèm độ ngẫu nhiên để tránh nhiều bên cùng gọi lại một lúc. Bạn có thể cấu hình chính sách này cho target.',
        'Hết lượt thử mà không có DLQ thì sự kiện có thể bị bỏ. Khi cấu hình target DLQ, EventBridge lưu sự kiện giao thất bại vào một SQS Standard queue để bạn sửa lỗi rồi xử lý lại. Một số lỗi như thiếu quyền hoặc target không còn tồn tại có thể được đưa thẳng vào DLQ thay vì thử nhiều lần. Bạn còn phải cấp quyền để EventBridge ghi được vào queue đó.'
      ] },
      { title: 'Muốn gửi lại lịch sử thì dùng DLQ hay archive?', paragraphs: [
        'Hai thứ phục vụ hai nhu cầu. DLQ giữ những lần giao thất bại. Archive của EventBridge lưu các sự kiện khớp phạm vi bạn chọn, với thời hạn lưu được cấu hình, để sau này replay về event bus nguồn. Nếu bạn cần chạy lại sự kiện cũ để cập nhật một chức năng mới, phải chuẩn bị archive từ trước; event bus Classic không mặc định là kho lịch sử để đọc lại tùy ý.',
        'Với SNS, chính sách thử giao lại phụ thuộc giao thức của endpoint. Bạn không thể lấy mốc 24 giờ của EventBridge áp cho mọi subscription SNS. Nếu bên nhận cần tự quyết định lúc nào làm việc và giữ phần chưa làm, ghép SNS với SQS thường dễ kiểm soát hơn việc chỉ dựa vào thử giao lại.'
      ] }
    ],
    scenarios: [
      { title: 'Ba nhóm đều cần xử lý mỗi đơn hàng thì bố trí sao?', paragraphs: [
        'Bạn có thể dùng một SNS topic với ba subscription tới ba SQS queue: kho hàng, email và phân tích. Mỗi nhóm nhận bản riêng, có worker và DLQ riêng. Nhóm email xử lý chậm thì công việc chờ ở queue email, không lấy mất công việc của kho.',
        'Nếu đặt ba nhóm lên cùng một queue, các nhóm sẽ chia nhau thông điệp; bạn không bảo đảm cả ba cùng xử lý mỗi đơn. Nếu còn cần tách loại sự kiện từ nhiều hệ thống, EventBridge có thể chọn đúng queue hoặc topic theo nội dung. Chọn dịch vụ dựa trên việc cần phát cho mọi bên hay chỉ chia công việc giữa nhiều worker.'
      ] },
      { title: 'EventBridge giao thành công mà worker lỗi thì sao?', paragraphs: [
        'Giả sử EventBridge đã gửi thành công vào SQS. Sau đó worker lấy đơn hàng nhưng xử lý lỗi. EventBridge không đưa sự kiện này vào target DLQ, vì công việc của nó là giao tới SQS đã hoàn thành. Thông điệp chưa xóa sẽ có thể được nhận lại; khi vượt maxReceiveCount theo chính sách, SQS chuyển nó vào DLQ.',
        'Tương tự, nếu Lambda đã chấp nhận một lời gọi bất đồng bộ rồi mới lỗi khi chạy, cần xem cơ chế xử lý lỗi bất đồng bộ của Lambda. Bởi vậy, bạn phải hỏi “thành công ở bước nào?” Một DLQ cho lỗi giao không tự giữ mọi lỗi xảy ra sâu bên trong ứng dụng.'
      ] },
      { title: 'Vì sao nhận lại một tin nhắn dù đã dùng FIFO?', paragraphs: [
        'Ví dụ, worker gọi cổng thanh toán thành công rồi dừng trước khi DeleteMessage. Queue chưa biết công việc đã hoàn tất, nên sau visibility timeout thông điệp có thể được nhận lại. Loại trùng lúc gửi không giải quyết được khoảng trống giữa “đã trừ tiền” và “đã xóa thông điệp”.',
        'Bạn nên gửi mã thanh toán ổn định làm idempotency key và lưu trạng thái để nhận lại cùng việc không tạo một lần thanh toán mới. Nếu kết quả cũ chưa rõ, kiểm tra với nơi xử lý trước khi thử lại. FIFO giúp giữ thứ tự trong nhóm; ứng dụng vẫn chịu trách nhiệm bảo đảm tác động nghiệp vụ không bị lặp.'
      ] }
    ],
    pitfalls: [
      { title: 'Cứ có DLQ là không mất dữ liệu nữa?', paragraphs: ['Bạn vẫn cần cấp quyền ghi vào DLQ, theo dõi cảnh báo và xử lý trước khi thông điệp hết hạn. EventBridge target DLQ, SNS subscription DLQ và SQS DLQ giữ các loại thất bại khác nhau. Đặt tên theo bước mà queue bảo vệ sẽ giúp bạn biết nên điều tra ở đâu.'] },
      { title: 'Đặt FIFO phía sau có sửa được thứ tự đã sai không?', paragraphs: ['Không tự sửa được. Nếu EventBridge Classic đã giao các sự kiện khác thứ tự ban đầu, SQS FIFO phía sau không biết thứ tự nghiệp vụ đúng phải là gì. Khi thứ tự quan trọng, bạn cần thiết kế từ nguồn gửi, cách chia nhóm và cách nhận biết phiên bản sự kiện.'] },
      { title: 'Replay và redrive có phải cùng một việc?', paragraphs: ['Replay của EventBridge gửi lại dữ liệu từ archive về event bus nguồn. Redrive của SQS đưa thông điệp từ DLQ tới queue được chỉ định theo khả năng hỗ trợ. Trước khi chạy lại, hãy sửa nguyên nhân lỗi và chọn tốc độ phù hợp; nếu không, bạn có thể tạo lại cùng lỗi hoặc làm quá tải bên nhận.'] },
      { title: 'Cho mọi thông điệp vào một group cho dễ được không?', paragraphs: ['Được nếu bạn thật sự cần toàn bộ công việc đi theo một thứ tự, nhưng bạn sẽ hạn chế khả năng xử lý song song của FIFO. Nếu chỉ cần giữ thứ tự trong từng đơn hàng, hãy chia MessageGroupId theo đơn hàng. Những đơn độc lập không cần chờ nhau chỉ vì dùng chung một queue.'] }
    ],
    flow: { title: 'Bạn có thể kiểm tra đường đi của thông điệp thế này', steps: ['Bên gửi tạo mã sự kiện và mã nghiệp vụ ổn định.', 'Rule hoặc subscription chọn các bên cần nhận.', 'Mỗi queue giữ phần việc riêng cho bên xử lý tương ứng.', 'Worker kiểm tra việc đã làm, xử lý an toàn rồi xóa thông điệp.', 'Theo dõi lỗi giao, việc tồn đọng và DLQ; sửa lỗi trước khi gửi lại.'], caption: 'Ở mỗi bước, bạn chỉ cần biết ai đang giữ công việc và lần xác nhận thành công vừa rồi thực sự có nghĩa gì.' },
    sources: [
      { title: 'AWS: Phân biệt retry của Custom và Classic event buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-custom-bus-retry.html' },
      { title: 'AWS: EventBridge target retry policy', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html' },
      { title: 'AWS: EventBridge target DLQ', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html' },
      { title: 'AWS: EventBridge archive và replay', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html' },
      { title: 'AWS: SNS delivery retry theo giao thức', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html' },
      { title: 'AWS: SNS FIFO deduplication', url: 'https://docs.aws.amazon.com/sns/latest/dg/fifo-message-dedup.html' },
      { title: 'AWS: SQS visibility timeout', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html' },
      { title: 'AWS: SQS DLQ', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
      { title: 'AWS: SQS retention và giới hạn thông điệp', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html' },
      { title: 'AWS: EventBridge rules và event patterns', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html' },
      { title: 'AWS: SNS subscription filtering', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html' },
      { title: 'AWS: SQS FIFO deduplication', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html' }
    ]
  }
};
