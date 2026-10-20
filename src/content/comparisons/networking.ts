import type { ComparisonArticle } from './types';

export const networkingArticles: Record<string, ComparisonArticle> = {
  'aws-networking': {
    reading: [
      {
        title: '1. VPC là gì?',
        paragraphs: ['VPC là mạng riêng bạn tạo trên AWS để đặt những tài nguyên như EC2, ứng dụng và database. Bạn chọn dải địa chỉ, chia mạng thành các subnet, quyết định đường đi và kiểm soát kết nối.'],
        quote: 'Nói đơn giản: VPC là mạng bạn thiết kế; subnet là phần mạng để đặt tài nguyên; route và các lớp bảo vệ quyết định chúng kết nối ra sao.',
        bullets: [
          'CIDR mô tả một dải IP. Ví dụ, 10.0.0.0/16 là dải IPv4 của VPC minh họa; bạn có thể chia thành các subnet nhỏ hơn như 10.0.1.0/24.',
          'Private IPv4 dùng trong mạng riêng hoặc các mạng đã kết nối với nhau. Máy có địa chỉ 10.0.11.20 không vì thế mà được Internet truy cập trực tiếp.',
          'Public IPv4 là địa chỉ có thể dùng để giao tiếp qua Internet khi đường mạng và các quyền cho phép. Gán public IP chưa đủ nếu route hoặc firewall đang chặn.'
        ],
        after: ['Trong bài, bạn xây một website bán hàng: khách vào qua load balancer, ứng dụng chạy bên trong, database chỉ nhận kết nối từ ứng dụng. Phần lớn ví dụ dùng IPv4; IPv6 được giải thích riêng để không nhầm cách định tuyến.']
      },
      {
        title: '2. VPC, subnet và Availability Zone khác nhau thế nào?',
        paragraphs: ['VPC nằm trong một Region và có thể chứa subnet ở nhiều Availability Zone. Mỗi subnet chỉ nằm trong một AZ. Muốn ứng dụng chạy ở hai AZ, bạn phải có subnet phù hợp ở cả hai.'],
        table: {
          columns: ['Loại subnet trong ví dụ', 'AZ A', 'AZ B', 'Đặt gì ở đây?'],
          rows: [
            ['Public', '10.0.1.0/24', '10.0.2.0/24', 'Internet-facing ALB và public NAT gateway theo thiết kế.'],
            ['Private ứng dụng', '10.0.11.0/24', '10.0.12.0/24', 'Ứng dụng không có public IP.'],
            ['Isolated database', '10.0.21.0/24', '10.0.22.0/24', 'Database không có public IP và không có route ra ngoài VPC.']
          ]
        },
        after: [
          'Các dải trong bảng không chồng lấn và đều nằm trong 10.0.0.0/16. Bạn cần tính đủ địa chỉ cho máy, network interface và việc tăng thêm tài nguyên khi deploy; đừng chỉ tính số máy hiện tại.',
          'Tên subnet không quyết định nó public hay private. Một subnet đặt tên private nhưng có đường trực tiếp tới Internet Gateway vẫn phải được đánh giá theo route thực tế. Các dải IP ở trên chỉ là ví dụ, không phải cấu hình bắt buộc của AWS.'
        ]
      },
      {
        title: '3. Route table quyết định đường đi thế nào?',
        paragraphs: ['Route table chứa các route: muốn tới dải đích này thì gửi qua thành phần nào. Mỗi subnet dùng một route table; nếu không gắn riêng thì dùng main route table của VPC.'],
        table: {
          columns: ['Destination', 'Target minh họa', 'Ý nghĩa trong subnet ứng dụng AZ A'],
          rows: [
            ['10.0.0.0/16', 'local', 'Đi tới tài nguyên bên trong VPC.'],
            ['172.16.0.0/16', 'Peering tới VPC khác', 'Đi tới đúng mạng đã kết nối.'],
            ['0.0.0.0/0', 'NAT gateway AZ A', 'Các đích IPv4 còn lại đi theo đường mặc định này.']
          ]
        },
        after: [
          'AWS ưu tiên route khớp cụ thể hơn, gọi là longest prefix match. Đích 172.16.5.10 khớp cả /16 và /0 nhưng sẽ đi theo /16. Route mặc định không có nghĩa mọi gói đều đi NAT; lưu lượng trong VPC vẫn dùng local trong ví dụ này.',
          'Route chỉ trả lời gửi qua đâu. Nó không tự cấp quyền qua security group, không cấp IAM và không khiến ứng dụng mở cổng. Đường quay về cũng phải hợp lệ; có đường đi mà thiếu đường trả lời vẫn có thể bị timeout.'
        ]
      },
      {
        title: '4. Internet Gateway và public subnet',
        paragraphs: ['Internet Gateway, thường viết là IGW, là thành phần gắn vào VPC để hỗ trợ giao tiếp với Internet. Với ví dụ IPv4 thông thường, public subnet có route 0.0.0.0/0 trỏ trực tiếp tới IGW.'],
        diagram: 'EC2 có public IPv4\n        |\nPublic subnet: 0.0.0.0/0 -> IGW\n        |\n     Internet',
        after: [
          'Một EC2 muốn trực tiếp giao tiếp Internet theo đường này còn cần public IPv4 hoặc Elastic IP, cùng security group, NACL và hệ điều hành cho phép. Chỉ đưa EC2 vào public subnet không bảo đảm máy tự có public IP; còn phụ thuộc cấu hình cấp địa chỉ khi khởi tạo.',
          'Ngược lại, có public IP mà subnet không có route phù hợp tới IGW cũng chưa đủ. Bạn phải kiểm tra địa chỉ lẫn đường đi, không dùng một trong hai làm bằng chứng duy nhất.',
          'Public subnet không có nghĩa cần mở mọi cổng. Với website, bạn có thể chỉ cho khách vào ALB qua HTTPS 443, còn máy ứng dụng và database nằm ở subnet bên trong.'
        ]
      },
      {
        title: '5. NAT Gateway giúp máy private ra Internet ra sao?',
        paragraphs: ['Ứng dụng không có public IP vẫn có thể cần tải gói, gọi API thanh toán hoặc lấy dữ liệu từ một dịch vụ công khai. Ví dụ dưới dùng public NAT gateway loại zonal thông thường: NAT nằm trong public subnet, có Elastic IP và đi ra Internet qua IGW.'],
        diagram: 'Ứng dụng có private IPv4\n        |\nPrivate subnet: 0.0.0.0/0 -> NAT\n        |\nPublic NAT gateway + Elastic IP\n        |\nPublic subnet: 0.0.0.0/0 -> IGW\n        |\n     Internet',
        bullets: [
          'Máy private khởi tạo kết nối ra ngoài, NAT chuyển địa chỉ và chuyển phản hồi của kết nối đó về máy.',
          'Internet không thể tự khởi tạo kết nối tùy ý tới máy private chỉ nhờ NAT này. NAT không thay load balancer để công bố website.',
          'NAT Gateway không gắn security group. Bạn kiểm soát lưu lượng ở tài nguyên và các lớp mạng liên quan.',
          'Với loại NAT zonal này, dùng một NAT chung khiến các AZ phụ thuộc AZ chứa NAT. Nếu cần chịu lỗi tốt hơn, đặt NAT từng AZ và cho subnet dùng NAT cùng AZ, có tính tới chi phí.'
        ],
        after: ['IGW và NAT làm hai việc khác nhau: IGW nối VPC với Internet, còn public NAT trong ví dụ giúp các máy private dùng chung đường ra IPv4 mà không cần public IP riêng. AWS có những loại và mô hình NAT khác; không áp máy móc sơ đồ zonal này cho mọi lựa chọn NAT.']
      },
      {
        title: '6. Security group khác NACL thế nào?',
        paragraphs: ['Security group thường gắn với network interface của tài nguyên, như EC2 hoặc các thành phần dịch vụ có hỗ trợ. NACL áp dụng ở mức subnet. Đây là hai lớp khác nhau, không phải hai tên của cùng một firewall.'],
        table: {
          columns: ['Điểm so sánh', 'Security group', 'NACL'],
          rows: [
            ['Áp dụng ở đâu?', 'Network interface hoặc tài nguyên có hỗ trợ.', 'Lưu lượng vào, ra subnet theo phạm vi NACL.'],
            ['Cho phép hay từ chối?', 'Chỉ có rule Allow.', 'Có rule Allow và Deny.'],
            ['Thứ tự rule', 'Xét các rule cho phép cùng nhau.', 'Xét số rule từ nhỏ tới lớn, dừng ở rule khớp đầu tiên.'],
            ['Lưu lượng trả lời', 'Stateful: lưu lượng phản hồi của kết nối được cho phép tự được cho qua.', 'Stateless: cần rule phù hợp cho cả hai chiều.']
          ]
        },
        after: [
          'Ví dụ, máy ứng dụng gọi HTTPS tới cổng 443 bên ngoài từ cổng tạm thời 49152. Phản hồi quay về cổng 49152 của máy ứng dụng. Security group theo dõi kết nối được phép; với NACL, bạn phải cho phép cả chiều đi lẫn chiều trả về trên các cổng phù hợp.',
          'Dải cổng tạm thời phụ thuộc bên khởi tạo và các thành phần trên đường đi. Nếu NACL chỉ mở 443 ở cả hai chiều, bạn có thể vẫn chặn phản hồi. Vì vậy, đừng sửa một lỗi timeout bằng cách chỉ thêm cổng dịch vụ vào inbound.',
          'Security group cho phép không vượt qua NACL đang chặn. Có nhiều security group trên cùng interface thì các Allow được kết hợp; thêm một group chặt hơn không tạo Deny để thu hồi Allow đã có từ group khác.'
        ]
      },
      {
        title: '7. Ghép thành website hai AZ: ALB → ứng dụng → database',
        paragraphs: ['Khách chỉ cần vào website qua ALB. Ứng dụng xử lý yêu cầu rồi kết nối database; khách không cần kết nối thẳng tới máy ứng dụng hoặc database.'],
        diagram: 'Khách trên Internet\n        | HTTPS 443\n        v\nInternet-facing ALB\n  Public AZ A + Public AZ B\n        | TCP 8080\n        v\nỨng dụng ở private subnet\n  App AZ A + App AZ B\n        | TCP 5432\n        v\nRDS trong DB subnet group\n  DB subnet AZ A + AZ B',
        table: {
          columns: ['Security group', 'Inbound chính trong ví dụ', 'Giới hạn đạt được'],
          rows: [
            ['SG-ALB', 'TCP 443 từ những khách được phục vụ.', 'Chỉ công bố điểm vào HTTPS.'],
            ['SG-App', 'TCP 8080 từ SG-ALB.', 'Ứng dụng chỉ nhận từ lớp ALB theo rule này.'],
            ['SG-DB', 'TCP 5432 từ SG-App.', 'Database chỉ nhận từ lớp ứng dụng theo rule này.']
          ]
        },
        after: [
          'Bạn còn cần outbound cho ALB tới app và app tới database, NACL phù hợp, listener, target group và health check đúng cổng. Rule tham chiếu security group không tự tạo route; ứng dụng cũng phải thực sự lắng nghe ở 8080.',
          'Ứng dụng và database không có public IP. App có thể ra ngoài qua NAT khi cần; subnet database trong ví dụ không có route ra ngoài VPC. Việc đặt DB subnet ở hai AZ giúp đáp ứng bố trí mạng; muốn RDS tự chuyển máy khi lỗi còn phải chọn triển khai Multi-AZ phù hợp.',
          'Nếu cần xem inbound rule của SG-App ở dạng JSON, ví dụ dưới là đầu vào minh họa cho lệnh authorize-security-group-ingress. Các ID phải thay bằng security group thực tế trong thiết kế tương ứng.'
        ]
      },
      {
        title: '8. Một rule cho ALB gọi ứng dụng trông thế nào?',
        paragraphs: ['Rule này cho các interface mang security group của ALB kết nối tới cổng 8080 của ứng dụng. Đây không phải rule mở 8080 ra toàn Internet.'],
        code: `{
  "GroupId": "sg-0123456789abcdef0",
  "IpPermissions": [
    {
      "IpProtocol": "tcp",
      "FromPort": 8080,
      "ToPort": 8080,
      "UserIdGroupPairs": [
        { "GroupId": "sg-0fedcba9876543210" }
      ]
    }
  ]
}`,
        codeExplanation: [
          'GroupId bên ngoài là SG-App, nơi thêm inbound rule.',
          'IpProtocol, FromPort và ToPort chỉ cho TCP 8080.',
          'GroupId trong UserIdGroupPairs là SG-ALB làm nguồn được phép, không phải một bản sao toàn bộ rule của ALB.'
        ],
        after: [
          'Tham chiếu group cho phép nhận diện nguồn theo các interface gắn group đó trong phạm vi cấu hình được hỗ trợ. Nó không cấp quyền IAM hay tự mở outbound của ALB. Bạn vẫn kiểm tra các security group khác gắn trên tài nguyên để biết tổng quyền mạng thực tế.',
          'Bạn cũng nên giới hạn ai được gắn SG-ALB vào tài nguyên khác; nếu gắn cùng group cho nguồn ngoài ý muốn, nguồn đó có thể thỏa rule tham chiếu này. Tên “ALB” là tên bạn đặt, không phải cơ chế AWS bảo đảm group chỉ được dùng cho ALB.'
        ]
      },
      {
        title: '9. VPC endpoints: gọi dịch vụ AWS mà không cần NAT',
        paragraphs: ['Nếu ứng dụng private chỉ cần gọi một số dịch vụ AWS, endpoint có thể cung cấp đường kết nối phù hợp mà không cần đi theo đường Internet. Bạn phải chọn đúng loại endpoint và dịch vụ được hỗ trợ.'],
        table: {
          columns: ['Loại', 'Cách hoạt động', 'Bạn cần kiểm tra'],
          rows: [
            ['Gateway endpoint', 'S3 hoặc DynamoDB; thêm route theo prefix list của dịch vụ vào route table được chọn.', 'Đúng route table và phạm vi dịch vụ/Region.'],
            ['Interface endpoint', 'Dùng PrivateLink, tạo endpoint network interface với địa chỉ private trong các subnet được chọn.', 'DNS, endpoint security group và quyền truy cập dịch vụ.']
          ]
        },
        after: [
          'Ví dụ, gateway endpoint S3 có thể giúp app lấy object trong S3 mà không dùng NAT. Với interface endpoint, private DNS có thể khiến tên dịch vụ quen thuộc phân giải tới địa chỉ của endpoint; endpoint security group cần cho nguồn ứng dụng vào cổng phù hợp, thường là HTTPS 443.',
          'Gateway endpoint không phải interface endpoint đổi tên: nó dùng route, không có endpoint ENI để bạn gắn SG giống interface endpoint. Cả hai cũng không phải đường ra mọi trang web hay mọi API AWS.',
          'Có endpoint không đồng nghĩa đã được phép đọc dữ liệu. Bạn vẫn phải thỏa IAM, bucket policy hoặc resource policy, endpoint policy nếu áp dụng, và đường mạng. Endpoint policy không thay IAM; nó giới hạn việc truy cập qua endpoint. Một bucket policy giới hạn aws:SourceVpce còn có thể chặn yêu cầu đi nhầm endpoint dù kết nối mạng hoạt động.'
        ]
      },
      {
        title: '10. Nối VPC khác hoặc mạng công ty thì chọn gì?',
        paragraphs: ['Route local không tự nối các VPC và cùng Organizations cũng không tự tạo mạng chung. Bạn cần kết nối phù hợp rồi cấu hình route và các lớp bảo vệ.'],
        table: {
          columns: ['Cách nối', 'Dùng khi nào?', 'Điều dễ nhầm'],
          rows: [
            ['VPC peering', 'Nối trực tiếp hai VPC.', 'Không có định tuyến bắc cầu; CIDR IPv4 chồng lấn không thiết lập được peering.'],
            ['Transit Gateway', 'Kết nối nhiều VPC và mạng khác qua một điểm trung tâm.', 'Còn phải cấu hình attachment, route table và phân tách lưu lượng.'],
            ['Site-to-Site VPN', 'Nối mạng công ty với AWS qua các đường hầm IPsec.', 'Có kết nối chưa có nghĩa mọi dải mạng đã có route và quyền.'],
            ['Direct Connect', 'Kết nối riêng từ địa điểm của bạn tới AWS.', 'Đường riêng không có nghĩa dữ liệu mặc định được mã hóa.']
          ]
        },
        after: [
          'Ví dụ, A peering B và B peering C không khiến A tự đi tới C qua B. Bạn cần kết nối trực tiếp phù hợp hoặc một thiết kế trung tâm như Transit Gateway; không chỉ thêm route rồi coi peering trở thành router bắc cầu.',
          'Với Direct Connect, nếu cần mã hóa, bạn thiết kế thêm TLS, VPN phù hợp hoặc MACsec trên loại kết nối hỗ trợ. Không thay yêu cầu mã hóa bằng câu “đây là đường riêng”. Với mọi cách nối, cần tính cả các dải IP không chồng lấn và đường trả lời.'
        ]
      },
      {
        title: '11. DNS, IPv6 và CodeBuild: ba chỗ rất hay nhầm',
        paragraphs: ['DNS chỉ giúp đổi tên thành địa chỉ; nó không cấp quyền hay sửa route. VPC có Route 53 Resolver, còn private hosted zone cần được liên kết với VPC và cấu hình DNS phù hợp để các máy dùng được tên riêng.'],
        bullets: [
          'enableDnsSupport liên quan việc dùng bộ phân giải DNS được AWS cung cấp. enableDnsHostnames liên quan hỗ trợ hostname; muốn dùng private DNS cho interface endpoint cần bật cả DNS resolution và DNS hostnames.',
          'Tên đã trả về private IP chưa chứng minh kết nối được. Bạn vẫn phải kiểm tra route, security group, NACL và dịch vụ đang lắng nghe.',
          'Với IPv6, route mặc định là ::/0. Nếu muốn tài nguyên chỉ khởi tạo kết nối IPv6 ra Internet, bạn có thể dùng egress-only Internet Gateway. Đây không phải phép đổi địa chỉ IPv4 của NAT; NAT64 cho IPv6 gọi đích IPv4 là một trường hợp khác.'
        ],
        after: [
          'CodeBuild là ví dụ quan trọng cho DOP-C02. Khi gắn build vào VPC để truy cập RDS private, CodeBuild tạo các network interface nhưng không gán public IP cho chúng. Đặt build trong public subnet có IGW không tự giúp build tải dependency trên Internet.',
          'Nếu build cần npm công khai, GitHub hoặc API ngoài, bạn thường cần đường ra qua NAT hay giải pháp kết nối được cấu hình phù hợp. Nếu muốn không dùng Internet, phải chuẩn bị từng dịch vụ và kho dependency thực sự dùng được qua đường private.',
          'Interface endpoint của CodeBuild phục vụ truy cập API CodeBuild qua mạng riêng. Nó không tự giúp môi trường build gọi npm hay GitHub, cũng không thay endpoint của S3, ECR, Logs và các dịch vụ khác mà build cần. Bạn phải kiểm tra đầy đủ các phụ thuộc, DNS, IAM và endpoint policy.'
        ]
      },
      {
        title: '12. Bị timeout thì kiểm tra theo thứ tự nào?',
        paragraphs: ['Giả sử app không kết nối được database. Bạn nên theo đúng một lần kết nối cụ thể, thay vì mở mọi cổng rồi thử lại.'],
        steps: [
          'Xác định nguồn, tên đích, IP sau khi phân giải, giao thức và cổng. Kiểm tra ứng dụng có đang dùng nhầm endpoint hoặc DNS trả về địa chỉ không mong muốn không.',
          'Xem route table đúng subnet nguồn và đường trả lời. Trong ví dụ cùng VPC, app tới database dùng địa chỉ private và local route, không cần NAT hay IGW.',
          'Kiểm tra outbound của SG nguồn và inbound của SG đích, kể cả các group khác đang gắn. Xem có tham chiếu đúng group của nguồn thực tế không.',
          'Kiểm tra NACL cả hai chiều, số rule và cổng tạm thời cho phản hồi. Một Allow đúng cổng vẫn có thể đứng sau Deny khớp trước.',
          'Kiểm tra dịch vụ có lắng nghe đúng cổng không, cấu hình bind, TLS và thông tin xác thực. Kết nối TCP được nhưng bị AccessDenied ở API thường cần điều tra quyền, không chỉ sửa firewall.'
        ],
        after: [
          'VPC Flow Logs giúp xem thông tin luồng IP ở network interface, như nguồn, đích, cổng và trạng thái ACCEPT hoặc REJECT trong các bản ghi được thu thập. Đây không phải toàn bộ nội dung gói tin; bạn không dùng nó để đọc câu SQL, nội dung HTTP hay mọi chi tiết ứng dụng. ACCEPT cũng chưa chứng minh nghiệp vụ thành công.',
          'Reachability Analyzer phân tích cấu hình mạng để chỉ ra đường có thể đi hoặc thành phần chặn trong phạm vi được hỗ trợ. Nó không gửi một lượt truy cập thử trực tiếp và không xác nhận ứng dụng đang chạy đúng. Kết hợp phân tích cấu hình, Flow Logs và log ứng dụng mới giúp bạn thấy đủ vấn đề.',
          'Cách nhớ để làm bài: public subnet cần đường trực tiếp IGW; máy private muốn chủ động ra Internet IPv4 thường dùng NAT theo thiết kế; dịch vụ AWS hỗ trợ có thể dùng endpoint; kết nối nội bộ cần route và các lớp bảo vệ cho phép. Không thành phần nào tự thay thế tất cả những phần còn lại.'
        ]
      }
    ]
  }
};
