import type { ComparisonArticle } from './types';

export const databaseEventArticles: Record<string, ComparisonArticle> = {
  "multi-az-read-replica": {
    "reading": [
      {
        "title": "1. Multi-AZ là gì?",
        "paragraphs": [
          "Multi-AZ là cách đặt database ở nhiều Availability Zone để có nơi tiếp quản khi máy đang chạy gặp sự cố. Các AZ là những khu vực hạ tầng tách biệt trong cùng một Region của AWS. Mục tiêu chính ở đây là giúp ứng dụng chạy tiếp khi máy hoặc AZ gặp vấn đề."
        ],
        "quote": "Máy chính hỏng → chuyển sang máy dự phòng → ứng dụng kết nối lại để làm việc tiếp.",
        "after": [
          "Ví dụ, bạn có website bán hàng. Nếu database chỉ có một máy và máy đó hỏng giữa giờ bán, khách có thể phải chờ bạn khôi phục. Multi-AZ giúp chuẩn bị sẵn khả năng tiếp quản, thay vì đợi sự cố rồi mới tạo database khác."
        ]
      },
      {
        "title": "2. Read replica là gì?",
        "paragraphs": [
          "Read replica là bản sao thường dùng để nhận bớt truy vấn đọc từ máy chính. Vẫn website đó, việc đặt đơn cần ghi dữ liệu, còn báo cáo doanh thu cần đọc và tổng hợp nhiều dữ liệu. Bạn có thể cho báo cáo đọc replica để bớt tranh tài nguyên với khách đang mua hàng."
        ],
        "diagram": "Khách đặt đơn → Database chính\n                     │\n                     └── sao chép bất đồng bộ → Read replica ← Báo cáo doanh thu",
        "after": [
          "Ứng dụng phải kết nối tới replica để đọc; tạo replica không khiến truy vấn tự chuyển sang đó. Với replica thông thường của RDS DB instance, nguồn ghi trước rồi replica nhận và áp dụng theo sau. Khoảng chậm này gọi là replication lag.",
          "Báo cáo chậm vài giây có thể chấp nhận được, nhưng màn hình vừa thanh toán xong mà đọc số dư cũ thì dễ gây nhầm lẫn. Bạn cần chọn truy vấn nào được đọc dữ liệu trễ, truy vấn nào cần đọc tại máy chính."
        ]
      },
      {
        "title": "3. Hai loại Multi-AZ dễ bị nhầm",
        "paragraphs": [
          "Multi-AZ DB instance có một primary và một standby ở hai AZ. Dữ liệu được sao chép đồng bộ, nhưng standby không nhận truy vấn đọc từ ứng dụng. Nó chờ để tiếp quản khi cần, không chạy báo cáo giúp primary."
        ],
        "diagram": "Ứng dụng → Primary ở AZ A\n                 │\n                 └── sao chép đồng bộ → Standby ở AZ B\n                                        Không phục vụ đọc",
        "after": [
          "Multi-AZ DB cluster là cấu hình khác: một writer và hai reader ở ba AZ. Reader vừa nhận truy vấn đọc, vừa có thể tiếp quản writer. Vì vậy, nói “Multi-AZ không đọc được” mà không chỉ rõ loại triển khai sẽ dễ gây hiểu nhầm.",
          "DB cluster sao chép bán đồng bộ: ít nhất một reader phải xác nhận thay đổi theo cơ chế của cụm trước khi writer xác nhận giao dịch. Không có nghĩa mọi reader đã áp dụng xong dữ liệu mới. Nếu cần đọc ngay sau khi ghi, bạn vẫn phải chọn nơi đọc phù hợp. Loại cụm này chỉ hỗ trợ những engine, phiên bản, Region và cấu hình nhất định."
        ]
      },
      {
        "title": "4. So sánh các loại bản sao",
        "paragraphs": [
          "Tên “bản sao” chưa đủ để biết máy đó có phục vụ đọc hay tự tiếp quản không. Bạn có thể phân biệt nhanh như sau."
        ],
        "table": {
          "columns": [
            "Loại triển khai",
            "Đọc từ bản sao",
            "Khi máy ghi hỏng",
            "Cơ chế dữ liệu"
          ],
          "rows": [
            [
              "Multi-AZ DB instance",
              "Standby không nhận đọc.",
              "RDS tự chuyển sang standby.",
              "Sao chép đồng bộ."
            ],
            [
              "Multi-AZ DB cluster",
              "Hai reader nhận đọc.",
              "RDS chọn reader phù hợp để tiếp quản.",
              "Sao chép bán đồng bộ; reader vẫn có thể chậm áp dụng."
            ],
            [
              "RDS read replica thông thường",
              "Thường nhận đọc; có ngoại lệ theo engine/chế độ.",
              "Cần promote và chuyển ứng dụng theo kế hoạch.",
              "Sao chép bất đồng bộ từ nguồn."
            ],
            [
              "Aurora có replicas",
              "Aurora Replicas nhận đọc.",
              "Cụm có thể cho replica tiếp quản writer.",
              "Các instance dùng lớp lưu trữ phân tán dùng chung."
            ]
          ]
        },
        "after": [
          "Một số chế độ replica của Db2 và Oracle phục vụ dự phòng mà không nhận kết nối người dùng. Khi chọn cấu hình, bạn vẫn cần xem engine và chế độ cụ thể. Aurora cũng có kiến trúc riêng, không phải read replica thông thường của RDS DB instance đổi tên."
        ]
      },
      {
        "title": "5. RDS đã chuyển máy, vì sao website vẫn lỗi?",
        "paragraphs": [
          "Quá trình chuyển máy gọi là failover. Với Multi-AZ DB instance, RDS cập nhật DNS của endpoint để ứng dụng tìm tới máy tiếp quản. Nhưng kết nối đang mở tới máy cũ có thể đã đứt, còn ứng dụng có thể vẫn giữ địa chỉ cũ trong bộ nhớ đệm DNS."
        ],
        "steps": [
          "Ứng dụng nhận lỗi kết nối và bỏ kết nối không còn dùng được.",
          "Ứng dụng phân giải lại endpoint, mở kết nối mới và thử lại có giới hạn.",
          "Với giao dịch chưa rõ kết quả, ứng dụng kiểm tra trước khi gửi lại thao tác ghi."
        ],
        "after": [
          "Ví dụ, lệnh tạo đơn đã commit nhưng phản hồi chưa tới thì kết nối đứt. Nếu gửi lại mà không có mã đơn ổn định để kiểm tra, bạn có thể tạo hai đơn. Vì vậy, lúc diễn tập failover hãy đo tới khi khách đặt hàng được trở lại, không chỉ nhìn trạng thái database."
        ]
      },
      {
        "title": "6. Aurora có nhiều reader mà một máy vẫn quá tải",
        "paragraphs": [
          "Reader endpoint của Aurora phân phối các kết nối mới tới các replica. Nó không chia từng câu SQL trong cùng một kết nối sang nhiều máy. Nếu ứng dụng giữ một kết nối lâu rồi gửi hàng nghìn truy vấn qua đó, một reader vẫn có thể bận hơn các máy còn lại."
        ],
        "bullets": [
          "Kiểm tra cách ứng dụng tạo, dùng lại và đóng kết nối.",
          "Xem truy vấn nặng có dồn vào một phiên hay một nhóm người dùng không.",
          "Giữ đường đọc phù hợp cho thao tác cần thấy ngay dữ liệu vừa ghi."
        ],
        "after": [
          "Thêm reader chỉ giúp khi ứng dụng thực sự sử dụng được chúng. Khi writer failover, ứng dụng vẫn cần xử lý kết nối đứt và kết nối lại; reader endpoint không thay bạn giải quyết giao dịch dang dở."
        ]
      },
      {
        "title": "7. Bản sao không thay cho backup",
        "paragraphs": [
          "Nếu bạn xóa nhầm một bảng bằng lệnh hợp lệ, thay đổi đó có thể được sao chép sang các máy khác. Máy dự phòng giúp tiếp tục chạy khi hạ tầng hỏng; bản sao lưu và khôi phục về thời điểm trước lỗi giúp lấy lại dữ liệu đã mất. Bạn có thể cần cả hai.",
          "Multi-AZ nằm trong một Region, nên không tự tạo nơi tiếp quản ở Region khác. Cross-Region read replica có thể hỗ trợ kế hoạch phục hồi xa hơn nếu engine hỗ trợ, nhưng sao chép bất đồng bộ có thể để lại thay đổi chưa tới đích. Promote replica còn cần chuyển ứng dụng, kiểm tra dữ liệu và xử lý máy nguồn cũ."
        ],
        "quote": "RTO: chấp nhận ngừng bao lâu? RPO: chấp nhận mất phần dữ liệu của khoảng thời gian nào?",
        "after": [
          "Đừng mặc định mọi sự cố đều có RPO bằng không chỉ vì thấy chữ “đồng bộ”. Kết quả còn phụ thuộc loại lỗi, trạng thái giao dịch và cơ chế khôi phục thực tế."
        ]
      },
      {
        "title": "8. Với website bán hàng, bạn chọn gì?",
        "paragraphs": [
          "Bạn có thể xuất phát từ vấn đề đang cần giải quyết, rồi mới chọn loại triển khai."
        ],
        "table": {
          "columns": [
            "Bạn đang cần gì?",
            "Hướng nên xem trước"
          ],
          "rows": [
            [
              "Tự tiếp quản khi primary hoặc AZ lỗi.",
              "Multi-AZ, kèm cách ứng dụng kết nối lại."
            ],
            [
              "Báo cáo làm chậm việc đặt đơn.",
              "Read replica và chuyển kết nối báo cáo sang đó."
            ],
            [
              "Vừa chịu lỗi vừa chia tải đọc.",
              "Multi-AZ DB instance cộng read replica, hoặc Multi-AZ DB cluster nếu phù hợp."
            ],
            [
              "Phục hồi khi cả Region gặp sự cố.",
              "Giải pháp liên Region và quy trình chuyển ứng dụng."
            ],
            [
              "Lấy lại dữ liệu trước lúc xóa nhầm.",
              "Backup và khôi phục về thời điểm phù hợp."
            ]
          ]
        },
        "after": [
          "Sau khi chọn, bạn vẫn cần kiểm tra chi phí, engine hỗ trợ, độ trễ dữ liệu và hành vi ứng dụng khi chuyển máy. Có thêm bản sao chỉ có ý nghĩa khi nó thực sự giải quyết yêu cầu của bạn."
        ]
      }
    ]
  },
  "eventbridge-sns-sqs": {
    "reading": [
      {
        "title": "1. EventBridge là gì?",
        "paragraphs": [
          "EventBridge là dịch vụ nhận sự kiện rồi chuyển tới nơi cần xử lý. Sự kiện đơn giản là thông tin về một việc đã xảy ra, như “đơn hàng vừa tạo” hoặc “ECS task vừa dừng”. Bạn đặt quy tắc để khi việc đó xảy ra thì hệ thống làm bước tiếp theo."
        ],
        "quote": "Có sự kiện A xảy ra → nếu đúng điều kiện → thực hiện việc B.",
        "bullets": [
          "ECS task dừng → gửi thông báo cho người vận hành.",
          "Đơn hàng quốc tế được tạo → chạy quy trình xử lý xuất khẩu.",
          "Một sự kiện thay đổi cấu hình được nhận → gọi quy trình kiểm tra hoặc khắc phục."
        ],
        "after": [
          "Trong các ví dụ dùng event bus ở bài này, mình nói về EventBridge Classic với rules và targets. Các loại bus khác có thể có hành vi khác về thứ tự, lưu giữ và thử lại."
        ]
      },
      {
        "title": "2. Một luồng EventBridge có bốn phần",
        "paragraphs": [
          "Bạn chỉ cần phân biệt ai gửi, gửi vào đâu, điều kiện nào được chọn và ai nhận."
        ],
        "bullets": [
          "Event source: nơi phát sự kiện, chẳng hạn ECS hoặc ứng dụng bán hàng.",
          "Event bus: nơi nhận sự kiện để các rule kiểm tra.",
          "Rule: điều kiện chọn sự kiện, chẳng hạn task có trạng thái STOPPED.",
          "Target: nơi nhận sự kiện đã khớp, như SNS, SQS hoặc Lambda."
        ],
        "diagram": "ECS → Event bus → Rule: task đã STOPPED → SNS → Email\nỨng dụng → Event bus → Rule: đơn quốc tế → Lambda",
        "after": [
          "Một sự kiện có thể khớp nhiều rule và được chuyển tới nhiều nơi. Rule không tự chạy nghiệp vụ bên trong target; nó chọn sự kiện và yêu cầu target tiếp nhận."
        ]
      },
      {
        "title": "3. Ví dụ: nhận thông báo khi ECS task dừng",
        "paragraphs": [
          "Bạn có thể tạo rule dùng mẫu sau để chọn sự kiện task chuyển sang STOPPED, rồi cấu hình SNS làm target. Đây là mẫu điều kiện chọn sự kiện, chưa phải toàn bộ cấu hình rule hay quyền gửi thông báo."
        ],
        "code": "{\n  \"source\": [\"aws.ecs\"],\n  \"detail-type\": [\"ECS Task State Change\"],\n  \"detail\": {\n    \"lastStatus\": [\"STOPPED\"]\n  }\n}",
        "codeExplanation": [
          "source chọn sự kiện do ECS phát, thay vì mọi dịch vụ AWS.",
          "detail-type chọn loại thay đổi trạng thái task.",
          "detail.lastStatus chỉ nhận sự kiện mà trạng thái task đã là STOPPED."
        ],
        "after": [
          "STOPPED không tự có nghĩa là ứng dụng bị lỗi. Task cũng có thể dừng bình thường khi giảm số lượng máy chạy, triển khai phiên bản mới hoặc hoàn thành công việc. Nếu muốn cảnh báo sự cố, bạn cần xem thêm stoppedReason, stopCode, exitCode của container và bối cảnh triển khai. Có thể thêm điều kiện clusterArn để chỉ theo dõi đúng cụm cần quan tâm.",
          "SNS topic cần cho phép EventBridge gửi thông báo vào. Nếu gửi email, bạn còn phải tạo và xác nhận subscription. Một pattern khớp đúng nhưng thiếu quyền hoặc chưa xác nhận email vẫn chưa tạo thành đường cảnh báo hoạt động đầy đủ."
        ]
      },
      {
        "title": "4. EventBridge liên quan gì tới CloudWatch, CloudTrail và Config?",
        "paragraphs": [
          "Ba dịch vụ kia giúp bạn quan sát hoặc ghi nhận thông tin. EventBridge giúp nối một sự kiện phù hợp tới hành động tiếp theo. Bạn có thể dùng chúng cùng nhau, mỗi phần làm một việc."
        ],
        "table": {
          "columns": [
            "Dịch vụ",
            "Vai trò trong ví dụ"
          ],
          "rows": [
            [
              "CloudWatch",
              "Xem lỗi vận hành, số đo và log; cảnh báo khi đạt điều kiện."
            ],
            [
              "CloudTrail",
              "Tìm danh tính và API đã thay đổi security group."
            ],
            [
              "AWS Config",
              "Đánh giá security group có đáp ứng rule đã đặt không."
            ],
            [
              "EventBridge",
              "Chọn sự kiện đánh giá vi phạm rồi gửi tới nơi thông báo hoặc xử lý."
            ]
          ]
        },
        "after": [
          "Ví dụ, bạn bật ghi nhận security group và có Config rule kiểm tra SSH không được mở ra Internet. Khi kết quả chuyển sang NON_COMPLIANT, Config có thể phát sự kiện Config Rules Compliance Change. EventBridge rule chọn thay đổi đó để thông báo qua SNS hoặc gọi Lambda kiểm tra rồi xử lý. Đây là phản ứng sau đánh giá, không chặn thao tác mở cổng ngay từ đầu.",
          "Bạn cần khớp đúng kết quả đánh giá mới, chẳng hạn detail.newEvaluationResult.complianceType bằng NON_COMPLIANT, và giới hạn đúng rule hoặc tài nguyên. Sự kiện được phát theo cơ chế best effort; Lambda cần quyền riêng và phải kiểm tra trạng thái hiện tại trước khi sửa. Không nên coi đường sự kiện là bảo đảm mọi vi phạm đều được khắc phục."
        ],
        "diagram": "Security group mở SSH ra Internet\n          ↓\nConfig rule: chuyển sang NON_COMPLIANT\n          ↓\nEventBridge rule ┬→ SNS: gửi thông báo\n                 └→ Lambda: kiểm tra lại rồi xử lý"
      },
      {
        "title": "5. SNS là gì?",
        "paragraphs": [
          "SNS giúp gửi một thông điệp tới nhiều bên đăng ký nhận. Bạn tạo topic, rồi các bên tạo subscription tới topic đó. Khi gửi thông điệp vào topic, SNS chuyển cho các subscription phù hợp; mỗi subscription có thể lọc theo thuộc tính hoặc nội dung."
        ],
        "diagram": "Đơn hàng mới → SNS topic ┬→ Queue của kho\n                        ├→ Queue của email\n                        └→ Queue của phân tích",
        "after": [
          "Trong ví dụ đặt hàng, kho cần giữ hàng, email cần gửi thư, phân tích cần cập nhật số liệu. SNS giúp bên tạo đơn gửi một lần mà cả ba bên đều có bản phù hợp để xử lý.",
          "EventBridge cũng có thể gửi nhiều nơi và SNS cũng có bộ lọc. Khác biệt không nằm ở việc dịch vụ nào “biết lọc”, mà ở cách bạn tổ chức hệ thống: EventBridge thường chọn nơi nhận giữa nhiều loại sự kiện, SNS thường phát thông điệp cho những bên đã đăng ký một topic."
        ]
      },
      {
        "title": "6. SQS là gì?",
        "paragraphs": [
          "SQS là hàng đợi giữ công việc để chương trình xử lý lấy dần. Khi đơn hàng tăng đột biến nhưng hệ thống xuất hóa đơn chỉ xử lý được một lượng nhất định mỗi giây, các yêu cầu còn lại chờ trong queue. Chương trình lấy việc, thường gọi là worker, làm xong rồi xóa thông điệp."
        ],
        "diagram": "SQS queue → Worker 1\n          → Worker 2\n          → Worker 3\nCác worker chia nhau công việc trong cùng queue.",
        "after": [
          "Nếu kho, email và phân tích đều phải xử lý mỗi đơn, bạn cần queue riêng cho từng nhóm. Cho ba nhóm tranh lấy từ một queue sẽ chia công việc giữa họ, không bảo đảm mỗi nhóm đều có mọi đơn. SNS gửi tới ba queue riêng là một cách tổ chức phù hợp.",
          "SQS giữ thông điệp tối đa 14 ngày nếu chưa bị xóa hoặc hết hạn. Bạn vẫn phải theo dõi lượng việc còn chờ và tuổi thông điệp, không thể coi queue là nơi lưu lịch sử vô hạn."
        ]
      },
      {
        "title": "7. Scheduler và Pipes dùng khi nào?",
        "paragraphs": [
          "Nếu yêu cầu là “6 giờ sáng mỗi ngày chạy báo cáo”, bạn không cần chờ một sự kiện đơn hàng. Bạn có thể dùng EventBridge Scheduler để gọi target theo lịch."
        ],
        "table": {
          "columns": [
            "Bạn muốn chạy thế nào?",
            "Cách đặt lịch"
          ],
          "rows": [
            [
              "Mỗi ngày lúc 06:00 giờ Việt Nam.",
              "cron(0 6 * * ? *) và múi giờ Asia/Ho_Chi_Minh."
            ],
            [
              "Cứ mỗi 15 phút chạy một lần.",
              "rate(15 minutes)."
            ],
            [
              "Chạy một lần vào một ngày giờ cụ thể.",
              "Lịch one-time với biểu thức at(...)."
            ]
          ]
        },
        "after": [
          "Lịch 06:00 cần chọn múi giờ; đừng mặc định giờ bạn nhập là giờ Việt Nam. Scheduler có độ chính xác theo phút, không hứa chạy đúng giây 00. Nếu không muốn một khoảng linh hoạt rộng hơn, bạn tắt flexible time window. Bạn cũng cần execution role có quyền gọi target.",
          "EventBridge từng có scheduled rules, hiện là cách đặt lịch cũ. Với lịch mới, Scheduler là lựa chọn nên xem trước vì hỗ trợ múi giờ và lịch chạy một lần thuận tiện hơn.",
          "Pipes lại phục vụ việc nối một nguồn được hỗ trợ với một target. Ví dụ, lấy thông điệp từ SQS, lọc, bổ sung dữ liệu nếu cần rồi gửi sang nơi xử lý. Nó phù hợp với một đường nối nguồn–đích; không phải một tên khác của rule trên event bus."
        ]
      },
      {
        "title": "8. Giao được thông điệp chưa có nghĩa công việc đã xong",
        "paragraphs": [
          "Giả sử EventBridge gửi thành công vào SQS nhưng worker lấy ra rồi xử lý lỗi. Bước giao của EventBridge đã xong; lỗi mới nằm ở bước xử lý từ queue. Vì vậy, bạn phải nhìn đúng nơi thất bại."
        ],
        "table": {
          "columns": [
            "Bước lỗi",
            "Điều cần xử lý"
          ],
          "rows": [
            [
              "EventBridge chưa giao được tới target.",
              "Retry policy và target DLQ của EventBridge."
            ],
            [
              "SNS chưa giao được tới subscription.",
              "Chính sách giao theo giao thức và subscription DLQ."
            ],
            [
              "Worker nhận từ SQS nhưng làm chưa xong.",
              "Nhận lại sau thời gian ẩn; SQS DLQ theo maxReceiveCount."
            ]
          ]
        },
        "after": [
          "Với lỗi có thể thử lại, EventBridge Classic mặc định thử trong tối đa 24 giờ và tối đa 185 lần, dừng khi chạm một trong hai giới hạn. Khoảng chờ tăng dần kèm độ ngẫu nhiên. Target DLQ phải là SQS Standard queue; một số lỗi như thiếu quyền có thể đi thẳng vào DLQ mà không thử nhiều lần.",
          "Nếu không có DLQ và giao vẫn thất bại sau giới hạn, sự kiện có thể bị bỏ. SNS không dùng cùng một lịch retry cho mọi endpoint; cách thử lại phụ thuộc giao thức bên nhận. Nếu Lambda đã nhận lời gọi bất đồng bộ rồi mới lỗi lúc chạy, bạn cần xem cơ chế lỗi bất đồng bộ của Lambda.",
          "Muốn chạy lại lịch sử trên EventBridge Classic, bạn cần chuẩn bị archive rồi replay về event bus nguồn. Archive lưu sự kiện theo cấu hình; DLQ giữ lỗi của một bước. Hai thứ không thay thế nhau."
        ]
      },
      {
        "title": "9. Nhận lại có làm trừ tiền hai lần không?",
        "paragraphs": [
          "Khi worker gọi ReceiveMessage, SQS chỉ tạm ẩn thông điệp trong visibility timeout, chưa xóa. Làm xong thì worker gọi DeleteMessage với receipt handle của lượt nhận đó. Nếu worker dừng hoặc chưa xóa kịp, thông điệp có thể được nhận lại."
        ],
        "steps": [
          "Worker nhận yêu cầu thanh toán.",
          "Cổng thanh toán đã trừ tiền thành công.",
          "Worker dừng trước khi xóa thông điệp.",
          "Hết thời gian ẩn, worker khác nhận lại cùng yêu cầu."
        ],
        "after": [
          "SQS không biết tiền đã được trừ ở hệ thống bên ngoài. Ứng dụng cần dùng mã thanh toán ổn định, lưu trạng thái và kiểm tra kết quả trước khi gửi lại. Xử lý lại cùng một yêu cầu mà không tạo thêm tác động gọi là idempotency.",
          "Visibility timeout quá ngắn dễ khiến công việc được nhận lại khi lượt trước chưa xong; quá dài làm chậm việc nhận lại từ worker đã chết. Bạn có thể gia hạn khi cần, nhưng vẫn phải giữ xử lý an toàn với thông điệp lặp."
        ]
      },
      {
        "title": "10. Có FIFO thì hết trùng và đúng mọi thứ tự chưa?",
        "paragraphs": [
          "SQS Standard giao ít nhất một lần và không bảo đảm thứ tự. SQS FIFO giữ thứ tự trong từng MessageGroupId: các thay đổi của một đơn hàng có thể chung một group, còn hai đơn độc lập dùng hai group để xử lý song song. Dồn mọi thứ vào một group sẽ hạn chế mức song song.",
          "FIFO loại trùng lúc gửi trong cửa sổ năm phút. Nó không tạo giao dịch chung với cổng thanh toán, nên tình huống đã trừ tiền nhưng chưa xóa thông điệp vẫn cần được ứng dụng xử lý. SNS FIFO cũng yêu cầu dùng đúng điều kiện của chuỗi SNS–SQS FIFO để giữ những bảo đảm tương ứng."
        ],
        "quote": "FIFO giúp giữ thứ tự theo nhóm. Ứng dụng vẫn phải bảo đảm làm lại không tạo thêm tác động.",
        "after": [
          "EventBridge Classic không bảo đảm thứ tự giao. Nếu sự kiện đã tới khác thứ tự ban đầu, đặt một queue FIFO phía sau cũng không tự suy ra thứ tự nghiệp vụ đúng. Khi cần, bạn phải thiết kế mã thứ tự hoặc phiên bản ngay từ nguồn gửi."
        ]
      },
      {
        "title": "11. Chọn theo tình huống cụ thể",
        "paragraphs": [
          "Bạn không cần ghép cả ba dịch vụ cho mọi ứng dụng. Hãy chọn theo việc cần làm."
        ],
        "table": {
          "columns": [
            "Tình huống",
            "Dịch vụ nên xem"
          ],
          "rows": [
            [
              "Chọn nơi nhận theo nguồn và nội dung sự kiện.",
              "EventBridge event bus và rules."
            ],
            [
              "Gửi thông báo cho nhiều bên đăng ký.",
              "SNS."
            ],
            [
              "Giữ công việc để một nhóm worker xử lý dần.",
              "SQS."
            ],
            [
              "Mỗi nhóm đều cần một bản và tốc độ xử lý riêng.",
              "SNS → một SQS queue cho từng nhóm."
            ],
            [
              "Chạy báo cáo lúc 06:00 mỗi ngày.",
              "EventBridge Scheduler."
            ],
            [
              "Nối một nguồn được hỗ trợ với một target, có lọc hoặc bổ sung dữ liệu.",
              "EventBridge Pipes."
            ]
          ]
        },
        "after": [
          "Một hệ thống lớn có thể dùng EventBridge chọn loại sự kiện, SNS phát cho nhiều nhóm và SQS giữ phần việc của từng nhóm. Nếu chỉ có một loại công việc và vài worker, một SQS queue có thể đã đủ."
        ]
      }
    ]
  }
};
