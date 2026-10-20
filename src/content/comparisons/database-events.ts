import type { ComparisonArticle } from './types';

export const databaseEventArticles: Record<string, ComparisonArticle> = {
  'multi-az-read-replica': {
    reading: [
      { title: 'Multi-AZ là gì?', paragraphs: [
        'Multi-AZ là cách đặt database ở nhiều Availability Zone để có nơi tiếp quản khi máy đang chạy gặp sự cố. Một Availability Zone, thường viết là AZ, là một khu vực hạ tầng tách biệt trong cùng Region của AWS. Nếu bạn chỉ đặt database ở một AZ, ứng dụng có thể phải chờ khôi phục khi AZ đó gặp vấn đề. Multi-AZ giúp bạn chuẩn bị sẵn khả năng chạy tiếp ở AZ khác.',
        'Lấy ví dụ một website bán hàng. Khách đang đặt đơn thì máy database chính hỏng. Với cấu hình Multi-AZ phù hợp, RDS có thể tự chuyển sang máy dự phòng để website tiếp tục đọc, ghi dữ liệu. Bạn không phải đợi tạo lại một database từ đầu rồi khôi phục bản sao lưu mới có thể bán hàng tiếp.',
        'Tuy vậy, việc chuyển máy vẫn có thể làm đứt kết nối đang mở. Ứng dụng cần biết mở kết nối mới và xử lý giao dịch chưa rõ kết quả. Multi-AZ giúp giảm gián đoạn khi hạ tầng lỗi, chứ không có nghĩa mọi yêu cầu của khách đều hoàn thành mà không cần ứng dụng xử lý gì.'
      ] },
      { title: 'Read replica là gì?', paragraphs: [
        'Read replica là bản sao mà bạn thường dùng để nhận bớt truy vấn đọc từ database chính. Vẫn website bán hàng đó, ban ngày khách đặt đơn bình thường nhưng cuối ngày có báo cáo tổng hợp hàng triệu dòng. Nếu báo cáo và việc đặt đơn cùng chạy trên máy chính, chúng tranh CPU, bộ nhớ và tài nguyên đọc dữ liệu. Bạn có thể đưa báo cáo sang read replica để máy chính tập trung phục vụ khách.',
        'Với read replica thông thường của RDS DB instance, thay đổi được sao chép bất đồng bộ: máy chính ghi trước, replica nhận và áp dụng theo sau. Vì vậy, replica có thể chậm hơn nguồn. Báo cáo chấp nhận số liệu chậm vài giây có thể phù hợp, còn bước kiểm tra số dư ngay sau thanh toán có thể cần đọc ở máy chính để thấy dữ liệu vừa ghi.',
        'Bạn phải chuyển kết nối của ứng dụng báo cáo sang replica; tạo thêm máy không làm truy vấn tự chạy sang đó. Và không phải cứ tên replica là luôn nhận truy vấn đọc: một số chế độ replica của Db2 và Oracle phục vụ dự phòng mà không nhận kết nối người dùng. Khi triển khai, bạn vẫn cần xem engine và chế độ mình chọn.'
      ] },
      { title: 'Vậy khác biệt quan trọng nhất là gì?', paragraphs: [
        'Multi-AZ thường trả lời câu hỏi “máy chính hỏng thì ai tiếp quản?”. Read replica thường trả lời câu hỏi “máy chính bận quá thì ai đọc giúp?”. Một bên tập trung vào khả năng tiếp tục hoạt động, bên kia tập trung vào chia tải đọc. Đây cũng là lý do bạn có thể cần cả hai trong cùng hệ thống.',
        'Nếu chỉ thêm read replica rồi để nguyên kết nối ứng dụng, báo cáo vẫn chạy trên máy chính. Nếu chỉ bật một loại Multi-AZ có standby không nhận đọc, báo cáo cũng không được chia tải. Bạn cần biết bản sao được tạo để làm gì, thay vì chỉ thấy có thêm một máy là nghĩ cả hai vấn đề đã được giải quyết.'
      ] },
      { title: 'Multi-AZ DB instance và Multi-AZ DB cluster', paragraphs: [
        'Chỗ này dễ nhầm vì cả hai đều có chữ Multi-AZ. Với Multi-AZ DB instance, bạn có một máy chính và một standby ở hai AZ khác nhau. RDS sao chép đồng bộ sang standby, nhưng standby không nhận truy vấn đọc từ ứng dụng. Khi cần chuyển máy, RDS cho standby tiếp quản và cập nhật DNS của endpoint kết nối.',
        'Multi-AZ DB cluster là cấu hình khác: một writer nhận ghi và hai reader nhận đọc, đặt ở ba AZ. Các reader vừa giúp chia tải đọc, vừa có thể tiếp quản writer. Vì vậy, câu “Multi-AZ không phục vụ đọc” chỉ đúng với standby của mô hình DB instance, không đúng cho mọi cấu hình Multi-AZ.',
        'DB cluster dùng sao chép bán đồng bộ: ít nhất một reader phải xác nhận thay đổi theo cơ chế của cụm trước khi writer xác nhận giao dịch. Nhưng điều đó không có nghĩa mọi reader đã áp dụng xong dữ liệu mới. Nếu bạn cần đọc ngay sau khi ghi, vẫn phải chọn nơi đọc phù hợp. Loại cụm này cũng chỉ hỗ trợ những engine, phiên bản, Region và cấu hình nhất định.',
        'Nếu cần vừa dự phòng vừa chia tải, bạn có thể dùng primary Multi-AZ DB instance rồi thêm read replica, hoặc cân nhắc Multi-AZ DB cluster khi đáp ứng điều kiện. Chi phí, cách ứng dụng tách kết nối đọc và ghi, cùng mức dữ liệu cũ chấp nhận được sẽ ảnh hưởng lựa chọn.'
      ] },
      { title: 'Máy chính hỏng thì read replica có tự lên thay không?', paragraphs: [
        'Với read replica thông thường đang nói ở đây, bạn không nên mặc định nó tự tiếp quản như Multi-AZ. Bạn có thể promote replica thành database độc lập theo khả năng của engine, nhưng còn phải chuyển ứng dụng sang đó và kiểm tra dữ liệu. Vì sao chép bất đồng bộ, một phần thay đổi mới nhất có thể chưa tới replica.',
        'Ví dụ, bạn đặt replica ở Region khác để chuẩn bị cho sự cố lớn. Khi cần chuyển sang nơi đó, phải xem replica đang chậm bao nhiêu, quyết định thời điểm chuyển, cho nó nhận ghi và xử lý database nguồn cũ. Chỉ bấm promote chưa phải toàn bộ kế hoạch phục hồi.',
        'Multi-AZ nằm trong một Region nên không tự giải quyết sự cố cả Region. Ngược lại, có replica khác Region cũng không tự đáp ứng yêu cầu chuyển máy tự động khi một AZ lỗi. Hai kiểu sự cố cần được chuẩn bị đúng phạm vi.'
      ] },
      { title: 'Aurora nằm ở đâu trong câu chuyện này?', paragraphs: [
        'Aurora có kiến trúc riêng. Writer và Aurora Replicas dùng chung lớp lưu trữ phân tán của cụm. Các replica có thể nhận đọc và tham gia cơ chế tiếp quản writer, nên bạn không nên hiểu chúng giống hoàn toàn read replica của RDS DB instance.',
        'Aurora có reader endpoint để phân phối các kết nối mới tới các replica. Điểm cần nhớ là nó phân phối kết nối, không chia từng câu SQL trong một kết nối sang máy khác. Nếu ứng dụng giữ một kết nối rất lâu rồi chạy hàng nghìn truy vấn qua đó, một reader vẫn có thể bận hơn các máy còn lại.',
        'Nếu writer được thay bằng máy khác, các kết nối cũ vẫn có thể lỗi. Ứng dụng phải kết nối lại, dùng DNS phù hợp và thử lại có giới hạn. Với giao dịch chưa rõ đã ghi thành công chưa, hãy kiểm tra bằng mã nghiệp vụ trước khi gửi lại để tránh tạo hai đơn hàng hoặc trừ tiền hai lần.'
      ] },
      { title: 'Có bản sao rồi vẫn phải sao lưu', paragraphs: [
        'Nếu bạn xóa nhầm một bảng bằng lệnh hợp lệ, thay đổi đó có thể được sao chép sang các máy khác. Máy dự phòng giúp bạn chạy tiếp khi hạ tầng hỏng; bản sao lưu và khả năng khôi phục về một thời điểm trước đó giúp bạn lấy lại dữ liệu trước lỗi. Hai việc này không thay thế nhau.',
        'Khi chọn giải pháp, bạn nên nói rõ mình chấp nhận ngừng bao lâu và chấp nhận mất phần dữ liệu của khoảng thời gian nào. Hai yêu cầu này thường được gọi là RTO và RPO. Đừng mặc định mọi sự cố đều không mất dữ liệu chỉ vì thấy chữ “đồng bộ”; cần xem loại lỗi, trạng thái giao dịch và cơ chế khôi phục thực tế.',
        'Cuối cùng, hãy kiểm tra từ phía website: sau khi chuyển máy, khách đã đặt đơn lại được chưa, có đơn bị lặp không, báo cáo có bị chậm dữ liệu quá mức không. Trạng thái database đã ổn chưa chắc toàn bộ ứng dụng đã phục hồi.'
      ] }
    ]
  },
  'eventbridge-sns-sqs': {
    reading: [
      { title: 'EventBridge là gì?', paragraphs: [
        'EventBridge là dịch vụ nhận thông tin về những việc đã xảy ra rồi chuyển thông tin đó tới nơi cần xử lý. Ví dụ, khi một đơn hàng được tạo, hệ thống phát ra sự kiện “đã tạo đơn hàng”. EventBridge có thể dựa vào nội dung đơn để chuyển đơn quốc tế tới quy trình xuất khẩu, còn đơn trong nước tới quy trình giao hàng nội địa.',
        'Sự kiện được gửi vào event bus. Bạn đặt rule để chọn loại sự kiện muốn nhận và target là nơi sẽ nhận nó. Rule có thể kiểm tra nguồn gửi, loại sự kiện hoặc dữ liệu bên trong. Bên tạo đơn không cần biết từng hệ thống phía sau; nó chỉ cần gửi thông tin đủ rõ về việc vừa xảy ra.',
        'Phần giải thích ở đây dùng EventBridge Classic với rules và targets. EventBridge có những loại bus và tính năng khác với hành vi riêng. Chẳng hạn, Scheduler dùng để gọi theo lịch, còn Pipes nối nguồn với đích; bạn không cần dùng hết các tính năng đó để xây một luồng sự kiện đơn giản.'
      ] },
      { title: 'SNS là gì?', paragraphs: [
        'SNS là dịch vụ giúp bạn gửi một thông điệp cho nhiều bên đã đăng ký nhận. Bạn tạo một topic, rồi mỗi bên tạo subscription tới topic đó. Khi có thông điệp mới, SNS gửi cho các subscription phù hợp. Mỗi subscription cũng có thể lọc theo thuộc tính hoặc nội dung thông điệp.',
        'Ví dụ, một khách vừa đặt hàng thì kho cần giữ hàng, hệ thống email cần gửi thư và hệ thống phân tích cần cập nhật số liệu. Bạn có thể gửi một thông điệp vào topic “đơn hàng mới”, rồi để SNS chuyển tới cả ba. Bên tạo đơn không phải lần lượt gọi từng hệ thống.',
        'So với EventBridge, cách dùng quen thuộc của SNS là phát cùng một thông báo cho các bên đăng ký. EventBridge thường thuận tiện khi bạn có nhiều nguồn sự kiện và muốn đặt quy tắc chọn nơi nhận theo cấu trúc dữ liệu. Cả hai đều có thể lọc và gửi nhiều nơi, nên cần nhìn luồng xử lý cụ thể thay vì phân biệt chỉ bằng một tính năng.'
      ] },
      { title: 'SQS là gì?', paragraphs: [
        'SQS là hàng đợi giữ công việc để chương trình xử lý lấy dần. Ví dụ, một đợt khuyến mãi tạo nhiều đơn cùng lúc nhưng hệ thống xuất hóa đơn chỉ làm được một lượng nhất định mỗi giây. Bạn đưa yêu cầu xuất hóa đơn vào SQS; phần chưa xử lý sẽ chờ trong queue thay vì bắt khách chờ hệ thống làm hết ngay.',
        'Chương trình xử lý thường gọi là worker. Worker lấy thông điệp từ queue, làm việc rồi xóa thông điệp sau khi thành công. Nếu cần nhiều máy xử lý, bạn có thể cho nhiều worker cùng lấy việc từ một queue. Chúng chia nhau công việc, không phải mỗi worker đều nhận một bản của mọi thông điệp.',
        'Đây là khác biệt quan trọng với SNS. Nếu kho, email và phân tích đều phải xử lý mỗi đơn hàng, bạn không nên cho ba nhóm đó tranh lấy việc từ cùng một queue. Bạn có thể dùng SNS gửi tới ba SQS queue riêng, rồi mỗi nhóm xử lý queue của mình. Nhóm email chậm thì việc email chờ lại, không lấy mất công việc của kho.'
      ] },
      { title: 'Ghép cả ba trong một luồng đặt hàng', paragraphs: [
        'Bạn có thể bắt đầu từ EventBridge để nhận sự kiện đơn hàng từ nhiều ứng dụng và chọn nơi nhận theo loại đơn. Khi một nhóm sự kiện cần gửi cho nhiều bên, EventBridge có thể chuyển tới SNS. SNS lại gửi tới các SQS queue riêng của những bên đó. Worker của mỗi bên lấy công việc từ queue và xử lý theo năng lực.',
        'Không phải hệ thống nào cũng cần cả ba. Nếu chỉ có một loại công việc và một nhóm worker, SQS có thể đủ. Nếu cần phát thông báo tới nhiều bên, SNS có thể đáp ứng. Nếu cần định tuyến nhiều loại sự kiện theo nội dung, bạn cân nhắc EventBridge. Thêm dịch vụ nên có lý do cụ thể, không phải cứ đi qua nhiều bước thì hệ thống tốt hơn.'
      ] },
      { title: 'Vì sao một thông điệp có thể được nhận lại?', paragraphs: [
        'Khi worker lấy thông điệp từ SQS bằng ReceiveMessage, thông điệp chưa bị xóa mà chỉ tạm ẩn. Khoảng ẩn này gọi là visibility timeout. Nếu worker hoàn thành, nó gọi DeleteMessage với thông tin của lượt nhận đó để xóa. Nếu worker dừng hoặc chưa xóa trước khi hết thời gian ẩn, thông điệp có thể xuất hiện lại.',
        'Giả sử worker đã gọi cổng thanh toán thành công nhưng dừng ngay trước bước xóa thông điệp. Lượt xử lý sau sẽ lại thấy yêu cầu thanh toán. SQS không thể tự biết tiền đã được trừ ở hệ thống bên ngoài, nên ứng dụng phải dùng một mã thanh toán ổn định, lưu trạng thái và kiểm tra trước khi gửi yêu cầu mới. Cách xử lý lại cùng việc mà không tạo thêm tác động thường gọi là idempotency.',
        'Bạn cũng cần đặt thời gian ẩn phù hợp. Quá ngắn thì công việc có thể bị nhận lại khi lượt trước chưa xong; quá dài thì việc của một worker đã dừng phải chờ lâu mới được thử lại. Nếu xử lý lâu hơn dự kiến, worker có thể gia hạn. Thời hạn lưu của queue là chuyện riêng: SQS giữ thông điệp tối đa 14 ngày, nên cần theo dõi lượng việc còn chờ và tuổi thông điệp.'
      ] },
      { title: 'Standard và FIFO nên hiểu thế nào?', paragraphs: [
        'SQS Standard giao ít nhất một lần và không bảo đảm thứ tự. Nếu các công việc độc lập, đây thường là cách sử dụng đơn giản. Bạn vẫn cần xử lý được thông điệp lặp; nếu thứ tự cập nhật quan trọng, ứng dụng phải biết một cập nhật có cũ hơn trạng thái hiện tại không.',
        'SQS FIFO giữ thứ tự trong từng MessageGroupId. Ví dụ, các thay đổi của cùng một đơn hàng dùng một group để xử lý tuần tự, còn các đơn khác nhau dùng group khác nhau để có thể chạy song song. Nếu dồn tất cả vào một group, bạn hạn chế khả năng xử lý đồng thời dù các đơn không liên quan nhau.',
        'FIFO còn loại trùng khi gửi trong cửa sổ năm phút. Nhưng nó không giải quyết thay bạn chuyện đã trừ tiền mà chưa xóa thông điệp, vì đây là hai thao tác ở hai hệ thống khác nhau. Việc dùng FIFO không loại bỏ nhu cầu chống tác động nghiệp vụ bị lặp.',
        'SNS cũng có Standard và FIFO. Standard không bảo đảm thứ tự và có thể giao lặp; FIFO hỗ trợ thứ tự theo nhóm và loại trùng khi bạn đáp ứng điều kiện của chuỗi SNS–SQS FIFO. Nếu sự kiện đã đi qua EventBridge Classic và tới không đúng thứ tự ban đầu, đặt FIFO phía sau cũng không tự đoán lại được thứ tự đúng.'
      ] },
      { title: 'Giao thành công chưa chắc xử lý đã thành công', paragraphs: [
        'Nếu EventBridge gửi được thông điệp vào SQS, bước giao của nó đã thành công. Worker lấy từ SQS rồi xử lý lỗi là một thất bại khác. EventBridge không tự nhận thông báo rằng nghiệp vụ bên trong worker vừa hỏng, cũng không đưa sự kiện đó vào hàng đợi lỗi của bước giao.',
        'Với lỗi giao có thể thử lại, EventBridge Classic mặc định thử trong tối đa 24 giờ và tối đa 185 lần; chạm giới hạn nào trước thì dừng. Các lần thử có khoảng chờ tăng dần và thêm độ ngẫu nhiên. Bạn có thể gắn một SQS Standard queue làm DLQ để giữ những sự kiện không giao được. Một số lỗi như thiếu quyền có thể đi thẳng vào DLQ mà không thử nhiều lần.',
        'Còn với SQS, nếu một thông điệp bị nhận nhiều lần mà vẫn chưa hoàn tất, bạn có thể cấu hình chuyển nó sang DLQ theo maxReceiveCount. Nếu muốn gửi lại từ DLQ, hãy sửa nguyên nhân trước rồi đưa công việc về queue phù hợp. SNS cũng có DLQ cho subscription giao thất bại, nhưng cách và thời gian thử giao lại còn phụ thuộc giao thức của nơi nhận.',
        'Nếu nơi nhận là Lambda đã chấp nhận lời gọi bất đồng bộ rồi mới lỗi khi chạy, bạn cần xem cơ chế xử lý lỗi bất đồng bộ của Lambda. Điểm chung là phải phân biệt “dịch vụ đã nhận yêu cầu” với “nghiệp vụ đã làm xong”; một hàng đợi lỗi không tự bảo vệ tất cả các bước.'
      ] },
      { title: 'Còn muốn chạy lại sự kiện cũ thì sao?', paragraphs: [
        'Với EventBridge Classic, bạn có thể cấu hình archive để giữ các sự kiện được chọn, rồi replay về event bus nguồn khi cần. Chẳng hạn, bạn sửa một chức năng thống kê và muốn nó xử lý lại các đơn cũ đã lưu. Nếu chưa chuẩn bị archive, event bus không mặc định giữ toàn bộ lịch sử để bạn tùy ý đọc lại.',
        'Archive khác DLQ: một bên lưu lịch sử theo cấu hình, bên kia giữ lỗi ở một bước cụ thể. Dù gửi lại từ archive hay từ DLQ, bạn đều cần nghĩ tới tác động của việc chạy lại. Tính lại thống kê có thể phù hợp, nhưng gửi lại thư hoặc yêu cầu thanh toán thì phải kiểm tra việc nào đã làm để không lặp ngoài ý muốn.'
      ] }
    ]
  }
};
