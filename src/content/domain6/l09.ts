import { lesson } from "../domain4/author";

export const d6l09 = lesson(
  {
    id: "d6-l09",
    number: 70,
    domainId: 6,
    chapterId: "6.3",
    title:
      "Kiểm toán tập trung: kết hợp CloudTrail, Config, Flow Logs và kiểm tra sai lệch hạ tầng",
    summary:
      "Chọn đúng nguồn dữ liệu để xác định ai đã thay đổi hệ thống, cấu hình thay đổi thế nào và những kết nối mạng nào có liên quan. Hiểu giới hạn của từng nguồn trước khi đưa ra kết luận.",
    duration: 70,
    objectives: [
      "Thiết kế cơ chế thu nhật ký cho nhiều tài khoản, nhiều Region và kiểm tra dữ liệu đã được lưu đầy đủ, nguyên vẹn.",
      "Phân biệt sự kiện quản lý với sự kiện dữ liệu để chọn đúng phạm vi thu thập.",
      "Kết hợp Config, kết quả kiểm tra sai lệch hạ tầng và Flow Logs để trả lời từng câu hỏi điều tra.",
    ],
    prerequisites: [
      "Hiểu phiên sử dụng IAM role, chính sách S3/KMS và quan hệ giữa các tài khoản trong AWS Organizations.",
      "Biết vai trò của security group, network ACL và mẫu CloudFormation.",
    ],
    sections: [
      {
        id: "d6-l09-evidence",
        title: "1. Cần trả lời câu hỏi nào thì chọn nguồn dữ liệu đó",
        paragraphs: [
          "Security auditing (kiểm toán bảo mật) bắt đầu từ một câu hỏi cụ thể: bạn cần chứng minh điều gì? Nếu cần biết ai đã sửa quy tắc truy cập, hãy tìm hoạt động API tương ứng trong CloudTrail. Nếu cần xem cấu hình tài nguyên trước và sau thay đổi, hãy dùng dữ liệu mà AWS Config đã ghi nhận. VPC Flow Logs cung cấp thông tin mô tả các luồng mạng, còn CloudFormation drift detection (phát hiện sai lệch hạ tầng) so sánh trạng thái thực tế với những thuộc tính được khai báo trong mẫu và được hỗ trợ kiểm tra. Bốn nguồn này bổ sung cho nhau, không thay thế nhau. Chẳng hạn, một bản ghi kết nối mạng không cho biết IAM user nào đã mở security group; ngược lại, sự kiện sửa security group không chứa nội dung các yêu cầu HTTP đi qua nó.",
          "Trước khi có sự cố, hãy lập bảng ghi rõ mỗi câu hỏi sẽ được trả lời bằng nguồn nào, trong tài khoản và Region nào, dữ liệu được giữ bao lâu và ai được đọc. Khi ghép các sự kiện theo thời gian, cần thống nhất múi giờ và đối chiếu thông tin của cùng một yêu cầu hoặc phiên truy cập. Trường userIdentity trong CloudTrail có thể chỉ đến assumed-role session (phiên sử dụng role), nên tên role chung chưa đủ xác định người đã thao tác. Hãy xem thêm session issuer (role đã cấp phiên) và những thuộc tính nhận diện nguồn có sẵn. Địa chỉ IP cũng không mặc nhiên đại diện cho một người, còn access key ID chỉ là mã nhận diện khoá, không phải secret access key. Cuối cùng, hãy xác nhận dữ liệu thực sự được thu trong khoảng cần điều tra: bật ghi nhật ký sau sự cố không tái tạo được mọi thông tin đã bỏ lỡ.",
        ],
      },
      {
        id: "d6-l09-cloudtrail",
        title: "2. Thu sự kiện trên toàn tổ chức và chọn đúng loại sự kiện",
        paragraphs: [
          "Organization trail (đường thu thập sự kiện cấp tổ chức) giúp thu sự kiện từ tài khoản quản lý và các tài khoản thành viên theo cấu hình chung. Tài khoản quản lý hoặc delegated administrator (quản trị viên được uỷ quyền) quản lý trail này. Người dùng trong tài khoản thành viên không thể tự sửa hoặc xoá nó chỉ vì được cấp quyền quản lý CloudTrail trong tài khoản của mình. Với multi-Region trail (trail nhiều Region), cần xem cả những Region phải chủ động kích hoạt, home Region (Region gốc của trail) và AWS partition (phân vùng AWS). Đừng hiểu “nhiều Region” là tự động bao phủ mọi phân vùng hoặc mọi Region chưa được kích hoạt. Khi tài khoản mới gia nhập tổ chức, nó tham gia cơ chế thu thập chung, nhưng bạn vẫn phải kiểm tra việc chuyển nhật ký đến nơi lưu trữ có thành công hay không.",
          "Management events (sự kiện quản lý) mô tả những thao tác như thay đổi cấu hình, trong khi data events (sự kiện dữ liệu) có thể ghi các thao tác như S3 GetObject, PutObject hoặc Lambda Invoke. Trail không mặc định thu toàn bộ sự kiện dữ liệu. Bạn phải cấu hình bộ chọn sự kiện để thu đúng loại tài nguyên và thao tác cần kiểm toán, đồng thời kiểm soát chi phí. Event history chỉ cung cấp lịch sử sự kiện quản lý gần đây trong phạm vi tài khoản và Region đang xem; đây không phải kho lưu trữ dài hạn hay màn hình tự tập hợp dữ liệu của mọi tài khoản thành viên. Để điều tra trên toàn tổ chức hoặc lưu lâu dài, hãy dùng dữ liệu trail trong S3 hoặc event data store phù hợp. Ví dụ, nếu chỉ thu thao tác ghi, bạn sẽ thiếu căn cứ để trả lời ai đã đọc một đối tượng nhạy cảm.",
        ],
      },
      {
        id: "d6-l09-integrity",
        title: "3. Kiểm tra việc chuyển nhật ký và bảo vệ dữ liệu đã lưu",
        paragraphs: [
          "Thấy trail trong danh sách chưa chứng minh nhật ký đã đến S3. Hãy kiểm tra GetTrailStatus, giá trị IsLogging, lỗi chuyển dữ liệu gần nhất và các đối tượng mới dưới đường dẫn của tài khoản, Region cần theo dõi. Organization trail có thể xuất hiện trong tài khoản thành viên dù có lỗi khi kiểm tra nơi nhận dữ liệu. Vì vậy, một bảng giám sát chỉ đếm số trail sẽ bỏ sót tình trạng ngừng thu thập. Chính sách bucket phải cho phép CloudTrail ghi vào đúng đường dẫn; nếu dùng khoá KMS do khách hàng quản lý, chính sách khoá cũng phải cho phép những thao tác cần thiết. Nên tách tài khoản lưu trữ nhật ký và quyền đọc phục vụ kiểm toán khỏi quyền quản trị ứng dụng, để một người chiếm được quyền sửa ứng dụng không đồng thời dễ dàng xoá dấu vết.",
          "Log file validation (xác minh tính toàn vẹn của tập tin nhật ký) tạo digest files (tập tin chứa thông tin kiểm chứng), sử dụng giá trị băm và chữ ký để hỗ trợ phát hiện việc sửa hoặc xoá nhật ký trong chuỗi được kiểm tra. Bật tính năng này không có nghĩa mọi lần kiểm chứng đã tự được thực hiện, cũng không tự ngăn yêu cầu xoá. S3 Object Lock và quyền truy cập giúp hạn chế sửa, xoá; cơ chế xác minh giúp kiểm tra dữ liệu có còn nguyên vẹn; mã hoá giúp bảo vệ nội dung khỏi người không có quyền đọc. Mỗi biện pháp giải quyết một yêu cầu khác nhau. Bạn phải giữ cả nhật ký, tập tin kiểm chứng và khoá giải mã trong thời gian cần thiết. Kho lưu trữ không cho sửa nhưng thiếu dữ liệu, hoặc có dữ liệu mà không giải mã được, vẫn chưa đáp ứng yêu cầu kiểm toán.",
        ],
      },
      {
        id: "d6-l09-config-drift",
        title:
          "4. Tổng hợp dữ liệu Config và kiểm tra sai lệch với CloudFormation",
        paragraphs: [
          "AWS Config recorder (bộ ghi cấu hình) phải được bật cho đúng loại tài nguyên và Region cần theo dõi. Aggregator (bộ tổng hợp dữ liệu) chỉ gom thông tin cấu hình và kết quả đánh giá từ nhiều tài khoản, Region để bạn xem tập trung; nó không tự bật bộ ghi, tạo quy tắc đánh giá ở nguồn hay trực tiếp sửa tài nguyên. Nếu một tài khoản không có lịch sử cấu hình, hãy kiểm tra nguồn có thực sự ghi dữ liệu không rồi mới kiểm tra việc tổng hợp. Dữ liệu cũng có thể đến chậm, nên chưa thấy bản ghi không đủ để kết luận tài nguyên đã bị xoá. Một quy tắc chỉ đánh giá yêu cầu mà nó được thiết kế để kiểm tra: đạt yêu cầu mã hoá không có nghĩa quyền truy cập cũng an toàn. Conformance pack (gói quy tắc tuân thủ) giúp triển khai một tập quy tắc và cấu hình khắc phục theo phạm vi đã chọn.",
          "CloudFormation drift detection giúp nhận ra những giá trị thực tế khác với mẫu hạ tầng, nhưng chỉ trong phạm vi loại tài nguyên và thuộc tính được hỗ trợ, được khai báo để so sánh. Trạng thái IN_SYNC không chứng minh mọi thiết lập bảo mật đều chưa thay đổi. Một thuộc tính không ghi trong mẫu hoặc không được hỗ trợ kiểm tra có thể nằm ngoài phép so sánh. Với nested stacks (các stack lồng nhau), cũng cần kiểm tra đúng phạm vi thay vì cho rằng một lần quét stack cha đã kiểm tra tất cả. Phát hiện sai lệch không tự sửa sai lệch: bạn phải xác định thay đổi có hợp lệ không, rồi cập nhật mẫu để chấp nhận hoặc đưa tài nguyên về cấu hình mong muốn. CloudTrail giúp tìm người và thao tác gây thay đổi; Config giúp xem lịch sử; kết quả drift cho biết khác biệt so với hạ tầng dạng mã.",
        ],
      },
      {
        id: "d6-l09-network",
        title: "5. Đọc Flow Logs và ghép các nguồn để điều tra",
        paragraphs: [
          "Bạn có thể bật VPC Flow Logs cho VPC, subnet hoặc network interface (giao diện mạng) để ghi thông tin mô tả luồng IP: địa chỉ nguồn, đích, cổng, giao thức, số byte và kết quả ACCEPT hoặc REJECT tuỳ định dạng. Đây không phải packet capture (bắt toàn bộ gói tin), nên không cung cấp toàn bộ nội dung HTTP hay dữ liệu TLS đã giải mã. Quá trình tổng hợp và chuyển nhật ký có độ trễ, đồng thời có những loại lưu lượng hoặc bản ghi không được thu như thông thường. Vì vậy, đừng coi nó là bằng chứng tuyệt đối rằng mọi gói tin đều đã được ghi. Khi thấy REJECT, bạn biết luồng bị từ chối ở lớp được quan sát, nhưng chưa biết chính xác quy tắc security group hay network ACL nào gây ra. Cần đối chiếu cấu hình và bối cảnh định tuyến để khoanh vùng nguyên nhân.",
          "Một cuộc điều tra thường cần ghép nhiều nguồn theo cùng khoảng thời gian. CloudTrail cho biết ai sửa quy tắc, Config cho thấy cấu hình trước và sau, Flow Logs cho biết luồng mạng liên quan, còn nhật ký ứng dụng giúp xác định ảnh hưởng đến người dùng. GuardDuty cung cấp dấu hiệu đe doạ, Inspector phát hiện lỗ hổng trong phạm vi hỗ trợ và Access Analyzer phân tích quyền truy cập. Những findings (kết quả phát hiện) này là đầu mối để điều tra, không thay thế toàn bộ nhật ký gốc phải lưu. Với cảnh báo như StopLogging hoặc thay đổi bất thường ở chính sách kho lưu trữ, cần có hướng dẫn xác minh danh tính, phạm vi và lý do thay đổi. Chỉ tự động khắc phục khi đã có quyền và điều kiện an toàn; lưu mã sự kiện để tránh xử lý trùng, đồng thời ghi lại kết quả kiểm tra sau hành động.",
        ],
      },
    ],
    diagram: {
      title: "Ghép bằng chứng của một thay đổi đáng ngờ",
      steps: [
        {
          label: "CloudTrail",
          detail:
            "Xác định danh tính, API, thời điểm và tài nguyên bị thay đổi.",
        },
        {
          label: "Config",
          detail:
            "Xem cấu hình đã được ghi trước và sau thay đổi, cùng kết quả đánh giá quy tắc.",
        },
        {
          label: "Kiểm tra sai lệch",
          detail:
            "So sánh thuộc tính thực tế với giá trị trong mẫu hạ tầng, trong phạm vi được hỗ trợ.",
        },
        {
          label: "Nhật ký mạng và ứng dụng",
          detail:
            "Tìm các luồng kết nối liên quan và ảnh hưởng đến người dùng trong cùng khoảng thời gian.",
        },
        {
          label: "Xác minh và xử lý",
          detail:
            "Kiểm tra dữ liệu đã được thu và còn nguyên vẹn, lưu bằng chứng rồi khắc phục trong phạm vi được phép.",
        },
      ],
      caption:
        "Mỗi nguồn trả lời một phần của cuộc điều tra. Hãy ghép thông tin thay vì yêu cầu một nguồn chứng minh tất cả.",
    },
    scenarios: [
      {
        title: "Có trail nhưng thiếu nhật ký của một tài khoản",
        context:
          "Trail cấp tổ chức xuất hiện trong bảng điều khiển của mọi tài khoản, nhưng kho lưu trữ không nhận được tập tin mới từ một tài khoản thành viên.",
        solution:
          "Kiểm tra trạng thái trail, lỗi chuyển nhật ký, Region đã kích hoạt, đường dẫn và chính sách bucket, rồi quyền sử dụng khoá KMS. Thực hiện một thao tác quản lý vô hại được phép và tìm bản ghi tương ứng ở nơi lưu trữ.",
        tradeoff:
          "Kiểm tra từ thao tác nguồn đến tập tin đích tốn thêm công sức, nhưng phát hiện được lỗi mà việc chỉ đếm số trail không thể nhận ra.",
      },
      {
        title: "Security group bị sửa ngoài quy trình quản lý hạ tầng",
        context:
          "Nhóm vận hành thấy một luồng kết nối mới được chấp nhận. CloudFormation phát hiện quy tắc cho phép kết nối vào khác với mẫu đã khai báo.",
        solution:
          "Đối chiếu API và danh tính trong CloudTrail, lịch sử Config và Flow Logs trong cùng khoảng thời gian. Kiểm tra hồ sơ phê duyệt trước khi quyết định giữ thay đổi hay khôi phục cấu hình theo mã hạ tầng.",
        tradeoff:
          "Việc lưu và đối chiếu nhiều nguồn phát sinh chi phí, nhưng giúp phân biệt thay đổi khẩn cấp đã được phép với hành vi đáng ngờ, tránh khôi phục nhầm cấu hình đang cần cho hệ thống.",
      },
    ],
    keyTakeaways: [
      "CloudTrail cho biết hoạt động API; Config lưu cấu hình đã ghi nhận; Flow Logs mô tả luồng mạng.",
      "Với trail nhiều tài khoản, nhiều Region, phải kiểm tra cả phạm vi thu thập và việc chuyển dữ liệu thực tế.",
      "Muốn thu sự kiện dữ liệu, cần chọn rõ phạm vi; Event history không tự chứa mọi lần đọc đối tượng.",
      "Xác minh toàn vẹn, chống sửa xoá và mã hoá là ba yêu cầu khác nhau.",
      "Bộ tổng hợp Config không tự bật nguồn ghi dữ liệu; phát hiện sai lệch không tự sửa tài nguyên.",
    ],
    examTraps: [
      "Thấy trail trong danh sách rồi kết luận nhật ký đã được lưu thành công.",
      "Tìm mọi lần đọc đối tượng trong Event history dù chỉ thu sự kiện quản lý.",
      "Cho rằng Flow Logs chứa toàn bộ nội dung yêu cầu HTTP.",
      "Hiểu IN_SYNC là mọi thuộc tính của tài nguyên đều chưa thay đổi.",
      "Tạo bộ tổng hợp Config rồi cho rằng bộ ghi cấu hình và quy tắc đã được bật ở mọi tài khoản thành viên.",
    ],
    code: {
      title: "Đoạn mẫu thu sự kiện quản lý của tổ chức vào bucket có sẵn",
      deployable: false,
      cloudformation: `Parameters:
  ArchiveBucketName:
    Type: String
Resources:
  OrganizationAudit:
    Type: AWS::CloudTrail::Trail
    Properties:
      S3BucketName: !Ref ArchiveBucketName
      IsLogging: true
      IsOrganizationTrail: true
      IsMultiRegionTrail: true
      IncludeGlobalServiceEvents: true
      EnableLogFileValidation: true
      EventSelectors:
        - IncludeManagementEvents: true
          ReadWriteType: All`,
      terraform: `variable "archive_bucket_name" { type = string }
resource "aws_cloudtrail" "organization" {
  name = "study-organization-audit"
  s3_bucket_name = var.archive_bucket_name
  is_organization_trail = true
  is_multi_region_trail = true
  include_global_service_events = true
  enable_logging = true
  enable_log_file_validation = true
  event_selector {
    include_management_events = true
    read_write_type = "All"
  }
}`,
      explanation:
        "Đây chỉ là đoạn minh hoạ, chưa đủ để triển khai độc lập. Người chạy cần quyền quản lý trail cấp tổ chức, tích hợp với Organizations và chính sách S3 phù hợp. Mẫu chưa tạo bucket lưu trữ, cấu hình KMS, thời hạn giữ dữ liệu hoặc bộ chọn sự kiện dữ liệu. Không dùng tổ chức thật chỉ để thử bài này vì thay đổi có thể ảnh hưởng nhiều tài khoản và phát sinh chi phí.",
    },
    lab: {
      title: "Chọn và kiểm chứng nguồn dữ liệu trong tài khoản thử nghiệm",
      duration: 50,
      prerequisites: [
        "Có tài khoản thử nghiệm với quyền xem CloudTrail, bucket và đối tượng chỉ dùng cho bài học; chỉ tạo trail riêng nếu được phép.",
        "Không thay đổi trail cấp tổ chức, SCP, bộ ghi Config hoặc bucket nhật ký dùng chung.",
        "Nếu thử thu sự kiện dữ liệu, chỉ chọn một đường dẫn nhỏ trong bucket của bài thực hành và kiểm tra chi phí trước khi bật.",
      ],
      cost: "Trail bổ sung, sự kiện dữ liệu, lưu trữ S3, bản ghi và quy tắc Config, Flow Logs cùng truy vấn có thể phát sinh phí. Bài cơ bản không yêu cầu bật thu thập trên toàn tài khoản hoặc tổ chức.",
      steps: [
        {
          title: "Ghi câu hỏi và nguồn cần dùng",
          detail:
            "Chạy lệnh STS để xác nhận tài khoản và danh tính đang sử dụng. Lập bảng cho ba câu hỏi: ai đổi nhãn bucket, ai đọc đối tượng thử nghiệm, kết nối mạng có bị từ chối không. Với mỗi câu, chọn nguồn sẽ cung cấp bằng chứng.",
          command: "aws sts get-caller-identity",
          expected:
            "Bảng phân biệt được sự kiện quản lý, sự kiện dữ liệu của đối tượng và thông tin mô tả luồng mạng.",
        },
        {
          title: "Tạo một thay đổi quản lý vô hại",
          detail:
            "Trong bảng điều khiển AWS, đổi nhãn Purpose trên bucket riêng của bài học. Ghi thời gian UTC và ARN của danh tính thao tác. Chờ dữ liệu xuất hiện, rồi tìm API tương ứng trong Event history của đúng tài khoản và Region.",
          expected:
            "Tìm thấy sự kiện có thời gian, danh tính và yêu cầu phù hợp. Không nhầm lịch sử của tài khoản quản lý với dữ liệu tập trung của mọi tài khoản thành viên.",
        },
        {
          title: "Kiểm tra loại sự kiện đang được thu",
          detail:
            "Xem bộ chọn sự kiện trên trail riêng. Nếu được phép thử, bật thu sự kiện dữ liệu cho đúng đường dẫn đối tượng trước khi gọi GetObject. Nếu không có quyền thay đổi, chỉ ghi nhận phần dữ liệu còn thiếu; không sửa trail chung.",
          expected:
            "Giải thích được vì sao chưa chọn sự kiện dữ liệu thì có thể không thấy GetObject, và vì sao bật sau đó không bổ sung những bản ghi đã bỏ lỡ.",
        },
        {
          title: "Kiểm tra nhật ký đã được lưu và có thể xác minh",
          detail:
            "Với trail riêng, xem GetTrailStatus và tìm các đối tượng S3 mới. Nếu đã bật xác minh toàn vẹn, tìm tập tin digest và đọc quy trình kiểm chứng bằng CLI. Không sửa hay xoá nhật ký chỉ để tạo lỗi thử nghiệm.",
          expected:
            "Có cả thông tin trạng thái và tập tin thực tế để chứng minh việc chuyển nhật ký. Phân biệt được bật tính năng xác minh với đã chạy kiểm chứng.",
        },
        {
          title: "Ghi rõ giới hạn của các nguồn còn lại",
          detail:
            "Chỉ xem nguồn đã có trong tài khoản thử nghiệm: loại tài nguyên Config đang ghi, trạng thái nguồn tổng hợp, thuộc tính được hỗ trợ kiểm tra sai lệch và các trường trong Flow Logs. Nếu chưa có nguồn, mô tả điều kiện cần để triển khai thay vì bật hàng loạt.",
          expected:
            "Biết mỗi nguồn thu được gì, bỏ sót gì và cần cấu hình ở đâu; không nhầm bộ tổng hợp với bộ ghi cấu hình hoặc Flow Logs với dữ liệu bắt gói tin.",
        },
        {
          title: "Dọn tài nguyên trong đúng phạm vi",
          detail:
            "Khôi phục nhãn thử nghiệm nếu cần. Nếu đã tạo trail hoặc bộ chọn sự kiện riêng, dừng hoặc xoá đúng phần đó và xử lý dữ liệu theo quy định của tài khoản thử nghiệm. Giữ nguyên trail tổ chức và nhật ký dùng chung.",
          expected:
            "Không để nguồn thu riêng tiếp tục phát sinh phí ngoài ý muốn. Dữ liệu kiểm toán được giữ hoặc xoá theo thoả thuận, không theo suy đoán của người làm bài.",
        },
      ],
      cleanup: [
        "Chỉ xoá trail, bộ chọn và nơi nhận nhật ký riêng do bạn tạo cho bài học; không thay đổi cơ chế kiểm toán chung.",
        "Dọn bucket, đối tượng và các phiên bản thử nghiệm trong phạm vi được phép; không xoá nhật ký đang phải lưu theo quy định.",
        "Nếu đã tạo riêng Flow Logs hoặc tài nguyên Config ngoài phần cơ bản, tắt đúng phần đó. Giữ khoá giải mã chừng nào dữ liệu phụ thuộc vào nó còn cần đọc.",
      ],
      challenge:
        "Thiết kế cảnh báo khi có StopLogging hoặc thay đổi bất thường ở chính sách kho nhật ký. Nêu rõ sự kiện cần thu, điều kiện khớp cảnh báo, cách kiểm tra trạng thái hiện tại, cách giữ bằng chứng và ai có quyền khôi phục.",
    },
    sources: [
      {
        title: "CloudTrail organization trails",
        url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html",
      },
      {
        title: "CloudTrail data events",
        url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
      },
      {
        title: "CloudTrail log-file integrity validation",
        url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html",
      },
      {
        title: "AWS Config aggregation",
        url: "https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html",
      },
      {
        title: "VPC Flow Logs",
        url: "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html",
      },
      {
        title: "CloudFormation drift detection",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html",
      },
    ],
    reviewedAt: "2026-10-19",
  },
  [
    {
      en: "An investigator needs to identify the role session that changed a security group ingress rule. Which source is most direct?",
      vi: "Người điều tra cần xác định phiên sử dụng role đã sửa quy tắc cho phép kết nối vào của một security group. Nguồn nào cung cấp thông tin trực tiếp nhất?",
      section: "evidence",
      answers: [0],
      explanation:
        "Thay đổi quy tắc security group là thao tác quản lý qua API. CloudTrail ghi danh tính gọi API, thông tin phiên và nội dung yêu cầu, nên phù hợp để tìm ai đã thực hiện thay đổi; nhật ký luồng mạng chỉ mô tả kết nối.",
      choices: [
        [
          "CloudTrail management events for the relevant API call.",
          "Sự kiện quản lý CloudTrail của lời gọi API liên quan.",
          "Đúng. Hãy đối chiếu userIdentity, session issuer, thời điểm và tài nguyên trong yêu cầu để xác định phiên đã sửa quy tắc.",
        ],
        [
          "VPC Flow Logs alone.",
          "Chỉ dùng VPC Flow Logs.",
          "Sai. Flow Logs mô tả lưu lượng mạng, không ghi danh tính IAM đã gọi API thay đổi security group.",
        ],
        [
          "Only the current CloudFormation template.",
          "Chỉ xem mẫu CloudFormation hiện tại.",
          "Sai. Mẫu mô tả cấu hình mong muốn; bản thân mẫu không phải nhật ký ghi ai đã sửa tài nguyên và sửa lúc nào.",
        ],
        [
          "Only an aggregate CPU dashboard.",
          "Chỉ xem bảng giám sát CPU tổng hợp.",
          "Sai. CPU có thể cho thấy ảnh hưởng đến hệ thống, nhưng không xác định được danh tính đã thực hiện thao tác quản lý.",
        ],
      ],
    },
    {
      en: "An organization trail appears in every member account, but one member produces no S3 files. What is the next sound check?",
      vi: "Trail cấp tổ chức xuất hiện trong mọi tài khoản thành viên, nhưng một tài khoản không có tập tin nhật ký mới trong S3. Nên kiểm tra gì tiếp theo?",
      section: "integrity",
      answers: [2],
      explanation:
        "Việc trail xuất hiện chỉ chứng minh cấu hình hoặc bản sao trail đã có mặt, chưa chứng minh dữ liệu được chuyển thành công. Cần kiểm tra trạng thái, phạm vi Region và quyền ở nơi nhận để tìm đúng điểm gián đoạn.",
      choices: [
        [
          "Assume the trail list proves complete logging.",
          "Cho rằng danh sách trail đã chứng minh việc ghi nhật ký đầy đủ.",
          "Sai. Trail vẫn có thể tồn tại khi bucket từ chối ghi, khoá KMS thiếu quyền hoặc việc chuyển nhật ký gặp lỗi.",
        ],
        [
          "Create a second identical trail before checking any status.",
          "Tạo ngay một trail giống hệt trước khi xem trạng thái.",
          "Sai. Trail mới có thể gặp cùng lỗi ở nơi nhận và còn làm tăng chi phí, trong khi nguyên nhân chưa được xác định.",
        ],
        [
          "Inspect GetTrailStatus, delivery errors, Region coverage and destination permissions.",
          "Kiểm tra GetTrailStatus, lỗi chuyển nhật ký, phạm vi Region và quyền tại nơi nhận.",
          "Đúng. Các kiểm tra này giúp phân biệt trail đã được tạo với đường thu thập và lưu trữ đang thực sự hoạt động.",
        ],
        [
          "Disable encryption for every archive bucket.",
          "Tắt mã hoá cho mọi bucket lưu nhật ký.",
          "Sai. Chưa có bằng chứng mã hoá là nguyên nhân; thay đổi đồng loạt còn làm giảm bảo vệ dữ liệu và vượt phạm vi cần xử lý.",
        ],
      ],
    },
    {
      en: "A member administrator wants to delete the organization trail using local CloudTrail permissions. What behavior should be expected?",
      vi: "Quản trị viên của một tài khoản thành viên muốn dùng quyền CloudTrail trong tài khoản mình để xoá trail cấp tổ chức. Điều gì sẽ xảy ra?",
      section: "cloudtrail",
      answers: [1],
      explanation:
        "Trail cấp tổ chức do tài khoản quản lý hoặc quản trị viên được uỷ quyền quản lý. Quyền quản trị trail thông thường trong một tài khoản thành viên không tự cho phép thay đổi cấu hình chung này.",
      choices: [
        [
          "Any member administrator can delete the organization trail.",
          "Bất kỳ quản trị viên tài khoản thành viên nào cũng xoá được trail cấp tổ chức.",
          "Sai. Quyền CloudTrail trong tài khoản thành viên không đồng nghĩa với quyền quản lý trail do tổ chức kiểm soát.",
        ],
        [
          "The member cannot modify or delete that organization trail through ordinary local trail permissions.",
          "Quản trị viên thành viên không thể sửa hoặc xoá trail đó chỉ bằng quyền quản lý trail thông thường trong tài khoản mình.",
          "Đúng. Thao tác phải được thực hiện qua danh tính có thẩm quyền quản lý trail cấp tổ chức phù hợp.",
        ],
        [
          "Deleting the local console entry removes all historic S3 logs automatically.",
          "Xoá mục hiển thị trong bảng điều khiển của tài khoản sẽ tự xoá mọi nhật ký S3 trước đây.",
          "Sai. Cấu hình thu thập và dữ liệu đã lưu là hai phần riêng; xoá trail không mặc nhiên xoá toàn bộ đối tượng S3.",
        ],
        [
          "The member must first rotate every KMS key to gain deletion authority.",
          "Quản trị viên thành viên phải xoay vòng mọi khoá KMS trước để được quyền xoá trail.",
          "Sai. Xoay vòng khoá thay đổi vật liệu mã hoá theo cơ chế của khoá, không cấp quyền quản lý trail tổ chức.",
        ],
      ],
    },
    {
      en: "An auditor asks who read a sensitive S3 object. Only management events are logged. What coverage gap exists?",
      vi: "Kiểm toán viên cần biết ai đã đọc một đối tượng S3 nhạy cảm, nhưng hệ thống chỉ thu sự kiện quản lý. Phần dữ liệu nào đang bị thiếu?",
      section: "cloudtrail",
      answers: [3],
      explanation:
        "GetObject là sự kiện dữ liệu ở cấp đối tượng, không phải sự kiện quản lý. Muốn dựa vào CloudTrail để điều tra thao tác này, bộ chọn sự kiện phải thu đúng đối tượng và thao tác từ trước thời điểm cần kiểm toán.",
      choices: [
        [
          "S3 object reads are always stored in management Event history.",
          "Mọi lần đọc đối tượng S3 luôn được lưu trong Event history của sự kiện quản lý.",
          "Sai. Thu sự kiện quản lý không tự thu các lời gọi GetObject ở cấp đối tượng.",
        ],
        [
          "Enabling AWS Config now reconstructs every past GetObject caller.",
          "Bật AWS Config bây giờ sẽ dựng lại danh tính của mọi lần GetObject trong quá khứ.",
          "Sai. Config ghi trạng thái cấu hình trong phạm vi được bật, không tái tạo nhật ký truy cập dữ liệu đã bị bỏ lỡ.",
        ],
        [
          "A bucket policy contains a complete log of every read.",
          "Chính sách bucket chứa nhật ký đầy đủ của từng lần đọc.",
          "Sai. Chính sách xác định điều kiện cho phép hoặc từ chối truy cập, không ghi lại mọi yêu cầu đã xảy ra.",
        ],
        [
          "The required S3 object data events were not selected.",
          "Các sự kiện dữ liệu của đối tượng S3 cần điều tra chưa được chọn để thu thập.",
          "Đúng. Trail chỉ thu sự kiện quản lý sẽ thiếu loại bản ghi cần để xác định người đọc đối tượng.",
        ],
      ],
    },
    {
      en: "Which TWO choices improve audit coverage without blindly collecting every high-volume data event? (Choose TWO.)",
      vi: "Hai cách nào giúp thu đủ dữ liệu kiểm toán cần thiết mà không bật thu mọi sự kiện dữ liệu có lưu lượng lớn? (Chọn HAI.)",
      section: "cloudtrail",
      answers: [0, 4],
      explanation:
        "Phạm vi thu thập nên xuất phát từ yêu cầu kiểm toán: tài nguyên nào, thao tác nào, cần đọc hay ghi. Sau khi cấu hình, hãy thử những thao tác đại diện được phép để kiểm chứng dữ liệu thực sự đến nơi lưu trữ.",
      choices: [
        [
          "Use advanced selectors for the required resource types, ARNs and event operations.",
          "Dùng bộ chọn nâng cao cho đúng loại tài nguyên, ARN và thao tác cần theo dõi.",
          "Đúng. Bộ chọn giúp tập trung vào dữ liệu cần chứng minh thay vì thu mọi sự kiện không phân biệt mức độ liên quan.",
        ],
        [
          "Assume management events imply all data reads.",
          "Cho rằng sự kiện quản lý đã bao gồm mọi lần đọc dữ liệu.",
          "Sai. Sự kiện quản lý và sự kiện dữ liệu là hai nhóm khác nhau, nên không thể suy ra đã thu nhóm này từ cấu hình của nhóm kia.",
        ],
        [
          "Keep only write events when the requirement explicitly audits reads.",
          "Chỉ giữ sự kiện ghi dù yêu cầu kiểm toán nêu rõ phải theo dõi thao tác đọc.",
          "Sai. Cấu hình này bỏ qua đúng thao tác cần điều tra, dù có thể giảm lượng dữ liệu phải lưu.",
        ],
        [
          "Enable selectors after an incident and claim historical completeness.",
          "Bật bộ chọn sau sự cố rồi kết luận lịch sử đã đầy đủ.",
          "Sai. Cấu hình mới chỉ có tác dụng thu thập theo thời điểm áp dụng, không tái tạo mọi sự kiện trước đó.",
        ],
        [
          "Test representative permitted reads and writes to confirm expected records arrive.",
          "Thử các thao tác đọc và ghi đại diện được phép, rồi xác nhận bản ghi dự kiến đã được lưu.",
          "Đúng. Kiểm tra thực tế giúp phát hiện thiếu phạm vi hoặc lỗi chuyển dữ liệu mà việc chỉ xem cấu hình có thể bỏ sót.",
        ],
      ],
    },
    {
      en: "A security team signs into the management account and expects Event history to list all member events. What should be clarified?",
      vi: "Nhóm bảo mật đăng nhập tài khoản quản lý và cho rằng Event history sẽ liệt kê sự kiện của mọi tài khoản thành viên. Cần làm rõ điều gì?",
      section: "cloudtrail",
      answers: [2],
      explanation:
        "Lưu nhật ký tập trung bằng trail tổ chức khác với xem Event history của tài khoản đang đăng nhập. Muốn phân tích toàn tổ chức, cần truy vấn kho dữ liệu tập trung có thu các sự kiện liên quan.",
      choices: [
        [
          "Event history is a permanent organization-wide data-event warehouse.",
          "Event history là kho sự kiện dữ liệu vĩnh viễn của toàn tổ chức.",
          "Sai. Event history không có phạm vi và thời gian lưu như một kho kiểm toán dài hạn tập trung cho mọi tài khoản.",
        ],
        [
          "Organization trails never record management-account events.",
          "Trail tổ chức không bao giờ ghi sự kiện của tài khoản quản lý.",
          "Sai. Trail tổ chức có thể thu sự kiện của cả tài khoản quản lý và thành viên trong phạm vi cấu hình.",
        ],
        [
          "Event history reflects the signed-in account scope; query the central audit store for organization-wide records.",
          "Event history có phạm vi tài khoản đang đăng nhập; muốn xem toàn tổ chức cần truy vấn kho nhật ký tập trung.",
          "Đúng. Chọn đúng nguồn và phạm vi truy vấn trước khi kết luận trail không nhận dữ liệu của tài khoản thành viên.",
        ],
        [
          "Switching the console language reveals member data automatically.",
          "Đổi ngôn ngữ bảng điều khiển sẽ tự làm xuất hiện dữ liệu thành viên.",
          "Sai. Ngôn ngữ hiển thị không thay đổi phạm vi tài khoản, nguồn dữ liệu hay quyền truy cập.",
        ],
      ],
    },
    {
      en: "Log-file validation is enabled on a CloudTrail trail. What does this feature primarily add?",
      vi: "Một trail CloudTrail đã bật tính năng xác minh toàn vẹn tập tin nhật ký. Tính năng này chủ yếu bổ sung khả năng gì?",
      section: "integrity",
      answers: [1],
      explanation:
        "CloudTrail tạo tập tin digest chứa thông tin băm và chữ ký để hỗ trợ kiểm chứng chuỗi nhật ký. Đây là cơ chế phát hiện dấu hiệu sửa hoặc xoá, không phải cơ chế tự ngăn mọi thao tác xoá hay tự kiểm chứng mọi lần đọc.",
      choices: [
        [
          "Automatic prevention of every S3 DeleteObject request.",
          "Tự động ngăn mọi yêu cầu S3 DeleteObject.",
          "Sai. Hạn chế xoá cần chính sách truy cập hoặc cơ chế như Object Lock; xác minh toàn vẹn phục vụ kiểm tra dữ liệu.",
        ],
        [
          "Digest-based evidence that can be used to validate log-file integrity.",
          "Cung cấp thông tin kiểm chứng dựa trên digest để xác minh nhật ký còn nguyên vẹn.",
          "Đúng. Cần giữ các tập tin liên quan và thực hiện quy trình kiểm chứng khi cần; bật tính năng chưa đồng nghĩa đã kiểm tra xong.",
        ],
        [
          "Decryption permission for every organization member.",
          "Cấp quyền giải mã cho mọi thành viên trong tổ chức.",
          "Sai. Quyền giải mã do chính sách và quyền KMS quyết định, không được cấp bởi tính năng xác minh nhật ký.",
        ],
        [
          "Automatic recording of all S3 data events.",
          "Tự động thu mọi sự kiện dữ liệu S3.",
          "Sai. Loại sự kiện được thu vẫn do bộ chọn sự kiện quyết định, độc lập với việc tạo digest.",
        ],
      ],
    },
    {
      en: "A compliance archive uses Object Lock and KMS encryption. Why might log-file validation still be useful?",
      vi: "Kho nhật ký tuân thủ đã dùng Object Lock và mã hoá KMS. Vì sao tính năng xác minh toàn vẹn vẫn có ích?",
      section: "integrity",
      answers: [0],
      explanation:
        "Chống sửa xoá, bảo vệ bí mật và kiểm chứng dữ liệu là các yêu cầu khác nhau. Object Lock và mã hoá không thay thế quy trình dùng digest để kiểm tra tính toàn vẹn của nhật ký.",
      choices: [
        [
          "It adds a verification mechanism for integrity, distinct from retention and encryption.",
          "Nó bổ sung cơ chế kiểm chứng tính toàn vẹn, khác với giữ dữ liệu và mã hoá.",
          "Đúng. Mỗi biện pháp bảo vệ một thuộc tính riêng, nên có thể cần kết hợp để đáp ứng yêu cầu kiểm toán.",
        ],
        [
          "It replaces the need to retain the KMS key.",
          "Nó loại bỏ nhu cầu giữ khoá KMS.",
          "Sai. Digest không giải mã được dữ liệu; mất khoá cần thiết vẫn có thể khiến nhật ký không còn đọc được.",
        ],
        [
          "It makes unlogged events appear retrospectively.",
          "Nó làm xuất hiện lại các sự kiện trước đây chưa được ghi.",
          "Sai. Kiểm chứng dữ liệu đã thu không thể bổ sung lịch sử của những sự kiện chưa từng được thu.",
        ],
        [
          "It allows a member to bypass organization-trail ownership.",
          "Nó cho phép tài khoản thành viên bỏ qua quyền quản lý trail tổ chức.",
          "Sai. Xác minh toàn vẹn không thay đổi danh tính nào được phép quản lý hoặc xoá trail.",
        ],
      ],
    },
    {
      en: "Which TWO operational checks establish more than mere trail-resource existence? (Choose TWO.)",
      vi: "Hai kiểm tra nào cho biết nhiều hơn việc trail chỉ tồn tại trong danh sách? (Chọn HAI.)",
      section: "integrity",
      answers: [1, 3],
      explanation:
        "Trạng thái ghi và lỗi gần nhất cho biết dịch vụ đang gặp vấn đề gì; tập tin mới sau thao tác thử cho thấy đường chuyển dữ liệu thực sự hoạt động trong phạm vi đã kiểm tra. Cần cả thông tin cấu hình và kết quả thực tế.",
      choices: [
        [
          "Only count trails returned by DescribeTrails.",
          "Chỉ đếm số trail do DescribeTrails trả về.",
          "Sai. Kết quả vẫn có thể chứa trail đang ngừng ghi hoặc không chuyển được nhật ký do lỗi S3, KMS.",
        ],
        [
          "Inspect logging status and recent delivery errors.",
          "Kiểm tra trạng thái ghi nhật ký và lỗi chuyển dữ liệu gần nhất.",
          "Đúng. Cách này giúp phát hiện IsLogging bị tắt hoặc lỗi ở nơi nhận thay vì chỉ xác nhận trail đã được tạo.",
        ],
        [
          "Only confirm an S3 bucket name exists in the template.",
          "Chỉ xác nhận tên bucket S3 có trong mẫu hạ tầng.",
          "Sai. Tên bucket trong mẫu không chứng minh chính sách, đường dẫn và việc ghi dữ liệu thực tế đều đúng.",
        ],
        [
          "Confirm expected new log files after a known benign test event.",
          "Xác nhận có tập tin nhật ký mới sau một thao tác thử vô hại đã biết trước.",
          "Đúng. Đây là bằng chứng thực tế cho đường thu thập của tài khoản, Region và thao tác vừa kiểm tra.",
        ],
        [
          "Assume a successful KMS DescribeKey proves CloudTrail can encrypt.",
          "Cho rằng gọi KMS DescribeKey thành công chứng minh CloudTrail mã hoá được dữ liệu.",
          "Sai. Quyền đọc thông tin khoá của người kiểm tra không chứng minh CloudTrail có quyền dùng khoá để mã hoá.",
        ],
      ],
    },
    {
      en: "A Config aggregator is created, but several accounts have no resource history. What dependency should be checked?",
      vi: "Đã tạo bộ tổng hợp AWS Config, nhưng một số tài khoản vẫn không có lịch sử tài nguyên. Cần kiểm tra điều kiện nào?",
      section: "config-drift",
      answers: [2],
      explanation:
        "Bộ tổng hợp chỉ thu nhận dữ liệu cấu hình đã được ghi tại nguồn. Cần xác nhận tài khoản và Region nguồn có bộ ghi đang hoạt động với đúng phạm vi, rồi kiểm tra trạng thái tổng hợp.",
      choices: [
        [
          "Only whether the aggregator Region matches a central CloudTrail bucket Region.",
          "Chỉ xem Region của bộ tổng hợp có trùng Region của bucket CloudTrail trung tâm không.",
          "Sai. Lịch sử Config phụ thuộc vào bộ ghi và cấu hình tổng hợp riêng; trùng Region với bucket CloudTrail không tạo dữ liệu còn thiếu.",
        ],
        [
          "Whether the aggregator name equals the organization name.",
          "Xem tên bộ tổng hợp có giống tên tổ chức không.",
          "Sai. Tên là thông tin nhận diện, không bật bộ ghi cấu hình hay quy tắc đánh giá ở nguồn.",
        ],
        [
          "Source account/Region recorders, recording scope and aggregation status.",
          "Kiểm tra bộ ghi, phạm vi ghi và trạng thái tổng hợp tại tài khoản, Region nguồn.",
          "Đúng. Trước hết phải có dữ liệu được ghi ở nguồn và được chuyển vào bộ tổng hợp thành công.",
        ],
        [
          "Whether CloudTrail is configured to log EC2 CPU values.",
          "Xem CloudTrail có được cấu hình để ghi giá trị CPU EC2 không.",
          "Sai. CloudTrail ghi hoạt động API, không tạo lịch sử cấu hình Config từ số liệu CPU.",
        ],
      ],
    },
    {
      en: "An administrator expects a Config aggregator to remediate a noncompliant security group directly. What is the misconception?",
      vi: "Quản trị viên cho rằng bộ tổng hợp Config sẽ trực tiếp sửa một security group không tuân thủ. Nhận định này sai ở đâu?",
      section: "config-drift",
      answers: [3],
      explanation:
        "Tổng hợp dữ liệu phục vụ việc xem và phân tích tập trung. Muốn khắc phục tài nguyên, phải cấu hình riêng hành động, điều kiện và quyền thực thi; bộ tổng hợp không mặc nhiên thực hiện phần việc đó.",
      choices: [
        [
          "Config can never evaluate compliance.",
          "Config hoàn toàn không thể đánh giá tuân thủ.",
          "Sai. Config rules có thể đánh giá tài nguyên theo yêu cầu cụ thể trong phạm vi được cấu hình.",
        ],
        [
          "All aggregators automatically receive administrator roles everywhere.",
          "Mọi bộ tổng hợp tự động nhận quyền quản trị ở mọi tài khoản.",
          "Sai. Tạo bộ tổng hợp không tự cấp quyền sửa tài nguyên trên toàn bộ các tài khoản nguồn.",
        ],
        [
          "A compliant result always proves every security standard passes.",
          "Kết quả tuân thủ luôn chứng minh tài nguyên đạt mọi tiêu chuẩn bảo mật.",
          "Sai. Kết quả gắn với từng quy tắc; đạt một yêu cầu không chứng minh mọi yêu cầu khác đều đạt.",
        ],
        [
          "An aggregator collects data; remediation requires separately configured controls and permissions.",
          "Bộ tổng hợp chỉ thu dữ liệu; việc khắc phục cần cơ chế và quyền được cấu hình riêng.",
          "Đúng. Cần tách vai trò quan sát tập trung khỏi quy trình thực hiện thay đổi lên tài nguyên.",
        ],
      ],
    },
    {
      en: "A stack reports IN_SYNC, but a security property not declared in its template changed. What limitation explains this?",
      vi: "Stack báo IN_SYNC, nhưng một thuộc tính bảo mật không khai báo trong mẫu đã thay đổi. Giới hạn nào giải thích điều này?",
      section: "config-drift",
      answers: [0],
      explanation:
        "Phát hiện sai lệch không so sánh mọi thiết lập có thể có của tài nguyên. Kết quả chỉ phản ánh những thuộc tính được hỗ trợ và được khai báo để so sánh, nên phải đọc IN_SYNC trong đúng phạm vi.",
      choices: [
        [
          "Drift evaluates supported properties explicitly represented for comparison, not every possible setting.",
          "Việc kiểm tra chỉ xét những thuộc tính được hỗ trợ và được khai báo để so sánh, không phải mọi thiết lập.",
          "Đúng. Muốn kiểm soát đầy đủ hơn, cần khai báo cấu hình mong muốn phù hợp và kết hợp Config cùng dữ liệu kiểm toán.",
        ],
        [
          "IN_SYNC proves no resource configuration anywhere changed.",
          "IN_SYNC chứng minh không có cấu hình tài nguyên nào ở bất kỳ đâu thay đổi.",
          "Sai. Kết luận này vượt quá phạm vi stack, tài nguyên và thuộc tính mà lần kiểm tra đã đánh giá.",
        ],
        [
          "CloudFormation automatically accepts every console change into the template.",
          "CloudFormation tự nhập mọi thay đổi trên bảng điều khiển vào mẫu.",
          "Sai. Phát hiện sai lệch không tự cập nhật mẫu để chấp nhận trạng thái thực tế.",
        ],
        [
          "CloudTrail events are deleted whenever drift is IN_SYNC.",
          "Mỗi khi stack IN_SYNC, các sự kiện CloudTrail đều bị xoá.",
          "Sai. Kết quả kiểm tra sai lệch không điều khiển vòng đời lưu trữ sự kiện CloudTrail.",
        ],
      ],
    },
    {
      en: "Which TWO actions help assess an unexpected CloudFormation drift finding? (Choose TWO.)",
      vi: "Hai hành động nào giúp đánh giá một sai lệch CloudFormation bất thường? (Chọn HAI.)",
      section: "config-drift",
      answers: [0, 4],
      explanation:
        "Trước khi sửa, cần biết giá trị nào thay đổi, ai thay đổi và có được phê duyệt không. Từ đó mới quyết định cập nhật mẫu để chấp nhận hay khôi phục tài nguyên, tránh làm gián đoạn một thay đổi hợp lệ.",
      choices: [
        [
          "Compare the actual property with the declared expected value and approved change record.",
          "So sánh thuộc tính thực tế với giá trị khai báo và hồ sơ thay đổi đã được phê duyệt.",
          "Đúng. Cách này giúp phân biệt cấu hình sai ngoài ý muốn với thay đổi hợp lệ nhưng chưa được cập nhật vào mẫu.",
        ],
        [
          "Assume detecting drift automatically corrected it.",
          "Cho rằng phát hiện sai lệch đồng nghĩa đã tự sửa xong.",
          "Sai. Phát hiện và khắc phục là hai bước riêng; trạng thái thực tế không tự trở về giá trị mong muốn.",
        ],
        [
          "Delete the entire stack immediately regardless of workload impact.",
          "Lập tức xoá toàn bộ stack bất kể ảnh hưởng đến ứng dụng.",
          "Sai. Đây là hành động phá huỷ vượt quá nhu cầu xác minh và có thể gây gián đoạn không cần thiết.",
        ],
        [
          "Treat every unsupported property as proven unchanged.",
          "Coi mọi thuộc tính không được hỗ trợ kiểm tra là chắc chắn chưa đổi.",
          "Sai. Không được kiểm tra nghĩa là chưa có kết luận từ phép kiểm này, không phải đã được chứng minh nguyên vẹn.",
        ],
        [
          "Correlate CloudTrail activity and Config history where available.",
          "Đối chiếu hoạt động CloudTrail và lịch sử Config khi có dữ liệu.",
          "Đúng. Hai nguồn bổ sung danh tính thao tác và diễn biến cấu hình để giải thích sai lệch so với mã hạ tầng.",
        ],
      ],
    },
    {
      en: "A security analyst needs the HTTP request body of rejected traffic. Can VPC Flow Logs alone provide it?",
      vi: "Nhân viên phân tích bảo mật cần nội dung HTTP của lưu lượng bị từ chối. Chỉ VPC Flow Logs có cung cấp được không?",
      section: "network",
      answers: [2],
      explanation:
        "Flow Logs ghi thông tin mô tả luồng mạng, không phải toàn bộ gói tin hay nội dung TLS đã giải mã. Cần chọn nguồn phù hợp với loại nội dung cần điều tra và chỉ thu trong phạm vi được phép.",
      choices: [
        [
          "Yes; every flow record stores full decrypted HTTP bodies.",
          "Có; mọi bản ghi luồng đều lưu đầy đủ nội dung HTTP đã giải mã.",
          "Sai. Flow Logs không chứa toàn bộ nội dung yêu cầu HTTP và không tự giải mã TLS.",
        ],
        [
          "Yes; selecting REJECT automatically enables packet capture.",
          "Có; chọn REJECT sẽ tự bật bắt gói tin.",
          "Sai. Bộ lọc REJECT chọn những luồng bị từ chối để ghi, không thay đổi Flow Logs thành công cụ thu toàn bộ gói tin.",
        ],
        [
          "No; use appropriate application/WAF logging or packet-capture capabilities where authorized.",
          "Không; cần nguồn nhật ký ứng dụng, WAF hoặc khả năng bắt gói phù hợp khi được phép.",
          "Đúng. Phải chọn công cụ theo nơi có thể quan sát nội dung cần tìm; lựa chọn cụ thể còn phụ thuộc lưu lượng bị chặn ở lớp nào.",
        ],
        [
          "No; because Flow Logs record only IAM API calls.",
          "Không, vì Flow Logs chỉ ghi lời gọi API IAM.",
          "Sai. Kết luận không cung cấp nội dung HTTP là đúng, nhưng lý do sai: Flow Logs mô tả lưu lượng mạng, không phải nhật ký API.",
        ],
      ],
    },
    {
      en: "A flow record says REJECT. Why should the analyst still inspect security groups, NACLs and routing context?",
      vi: "Một bản ghi luồng có kết quả REJECT. Vì sao vẫn cần kiểm tra security group, network ACL và bối cảnh định tuyến?",
      section: "network",
      answers: [1],
      explanation:
        "REJECT cho biết lưu lượng bị từ chối, nhưng riêng trường này chưa xác định chính xác quy tắc nào chặn hay giải thích toàn bộ đường kết nối. Hãy dùng địa chỉ, cổng và thời gian để khoanh vùng rồi đối chiếu cấu hình.",
      choices: [
        [
          "REJECT always names the exact NACL rule number in every format.",
          "REJECT luôn ghi chính xác số quy tắc network ACL trong mọi định dạng.",
          "Sai. Không thể suy ra số quy tắc gây chặn chỉ từ giá trị REJECT của trường hành động.",
        ],
        [
          "The record does not by itself identify the exact blocking policy rule.",
          "Bản ghi không tự chỉ ra chính xác quy tắc chính sách đã chặn kết nối.",
          "Đúng. Cần kết hợp thông tin luồng với cấu hình các lớp mạng liên quan để xác định nguyên nhân.",
        ],
        [
          "REJECT proves the application returned HTTP 403.",
          "REJECT chứng minh ứng dụng đã trả HTTP 403.",
          "Sai. Từ chối ở lớp mạng khác với phản hồi HTTP do ứng dụng hoặc thành phần xử lý HTTP tạo ra.",
        ],
        [
          "A rejected flow automatically changes the security group to allow it.",
          "Một luồng bị từ chối sẽ tự sửa security group để cho phép nó.",
          "Sai. Ghi nhật ký chỉ quan sát kết nối; nó không tự thay đổi quyền truy cập mạng.",
        ],
      ],
    },
    {
      en: "An audit pipeline sees an assumed-role ARN shared by a team. What additional CloudTrail context helps attribution?",
      vi: "Trong nhật ký kiểm toán, nhóm thấy ARN của một phiên sử dụng role chung cho cả đội. Thông tin CloudTrail nào giúp truy về nguồn thực hiện thao tác?",
      section: "evidence",
      answers: [3],
      explanation:
        "Tên role chung không đủ phân biệt những người hoặc ứng dụng cùng sử dụng role. Thông tin cấp phiên và thuộc tính nhận diện nguồn có sẵn giúp liên kết sự kiện với phiên cụ thể, cần đối chiếu cùng thời gian và thao tác.",
      choices: [
        [
          "Only the bucket storage class.",
          "Chỉ xem lớp lưu trữ của bucket.",
          "Sai. Lớp lưu trữ quyết định cách lưu đối tượng, không nhận diện người hoặc ứng dụng đã sử dụng phiên role.",
        ],
        [
          "Only the shared role name, ignoring the individual session context.",
          "Chỉ xem tên role chung và bỏ qua thông tin từng phiên.",
          "Sai. Nhiều danh tính có thể sử dụng cùng role; bỏ qua thông tin phiên làm mất căn cứ phân biệt nguồn thao tác.",
        ],
        [
          "Only the destination log-group retention.",
          "Chỉ xem thời hạn lưu của log group đích.",
          "Sai. Thời hạn lưu quyết định dữ liệu còn tồn tại bao lâu, không cho biết danh tính khởi tạo phiên.",
        ],
        [
          "Session issuer and the available session/source identity attributes.",
          "Xem session issuer và các thuộc tính của phiên, danh tính nguồn hiện có.",
          "Đúng. Những thông tin này bổ sung ngữ cảnh để truy nguồn thao tác thay vì quy mọi hoạt động về một tên role chung.",
        ],
      ],
    },
    {
      en: "Which TWO statements preserve the distinction between findings and audit evidence? (Choose TWO.)",
      vi: "Hai phát biểu nào phân biệt đúng kết quả phát hiện bảo mật với dữ liệu gốc phục vụ kiểm toán? (Chọn HAI.)",
      section: "network",
      answers: [1, 3],
      explanation:
        "Kết quả phát hiện giúp chỉ ra dấu hiệu đáng chú ý và ưu tiên điều tra. Nhật ký gốc cùng bản ghi cấu hình vẫn cần được giữ theo yêu cầu vì chúng chứa thông tin để xác minh diễn biến và phạm vi sự việc.",
      choices: [
        [
          "A GuardDuty finding replaces every CloudTrail log required by policy.",
          "Một kết quả GuardDuty thay thế mọi nhật ký CloudTrail mà chính sách yêu cầu lưu.",
          "Sai. Kết quả phát hiện không phải bản sao đầy đủ của mọi sự kiện API cần giữ để kiểm toán.",
        ],
        [
          "Use findings as leads and correlate them with relevant raw audit records.",
          "Dùng kết quả phát hiện làm đầu mối rồi đối chiếu với bản ghi kiểm toán gốc liên quan.",
          "Đúng. Đối chiếu giúp xác minh nguyên nhân, danh tính và phạm vi thay vì chỉ dựa vào một kết luận cảnh báo.",
        ],
        [
          "Inspector findings prove every network flow was captured.",
          "Kết quả Inspector chứng minh mọi luồng mạng đã được thu.",
          "Sai. Đánh giá lỗ hổng không chứng minh việc thu nhật ký mạng đầy đủ hay không bỏ sót lưu lượng.",
        ],
        [
          "Retain logs and configuration evidence according to the audit requirement even when findings are centralized.",
          "Vẫn lưu nhật ký và bằng chứng cấu hình theo yêu cầu, dù đã tập trung kết quả phát hiện.",
          "Đúng. Tập trung cảnh báo không thay thế trách nhiệm thu, giữ và bảo vệ các dữ liệu gốc cần cho điều tra.",
        ],
        [
          "An Access Analyzer finding automatically contains all application HTTP payloads.",
          "Kết quả Access Analyzer tự chứa mọi nội dung HTTP của ứng dụng.",
          "Sai. Phân tích quyền truy cập không phải chức năng bắt gói tin hoặc ghi đầy đủ nội dung ứng dụng.",
        ],
      ],
    },
    {
      en: "A multi-Region organization trail is created in an opt-in home Region. Why must Region activation be reviewed?",
      vi: "Một trail tổ chức nhiều Region được tạo ở Region gốc phải chủ động kích hoạt. Vì sao cần rà lại việc kích hoạt Region?",
      section: "cloudtrail",
      answers: [0],
      explanation:
        "Phạm vi thu của trail còn chịu quy tắc về Region gốc, Region phải kích hoạt và trạng thái của tài khoản thành viên. Không thể chỉ thấy multi-Region rồi kết luận mọi tài khoản đều chuyển đủ sự kiện.",
      choices: [
        [
          "Account activation and home-Region rules can affect which accounts deliver events to the trail.",
          "Trạng thái kích hoạt Region của tài khoản và quy tắc Region gốc có thể ảnh hưởng tài khoản nào chuyển sự kiện vào trail.",
          "Đúng. Cần kiểm tra phạm vi thực tế theo Region đã bật và phân vùng AWS đang sử dụng, thay vì giả định bao phủ tuyệt đối.",
        ],
        [
          "Multi-Region means every AWS partition is covered automatically.",
          "Multi-Region nghĩa là tự động bao phủ mọi phân vùng AWS.",
          "Sai. Phân vùng AWS và cơ chế kích hoạt Region đặt ra ranh giới riêng; nhiều Region không đồng nghĩa mọi phân vùng.",
        ],
        [
          "Opt-in Regions do not support any CloudTrail management events.",
          "Region phải chủ động kích hoạt hoàn toàn không hỗ trợ sự kiện quản lý CloudTrail.",
          "Sai. Vấn đề là trạng thái kích hoạt và cấu hình đúng, không phải loại Region này hoàn toàn không hỗ trợ sự kiện quản lý.",
        ],
        [
          "A KMS alias name automatically activates Regions for all members.",
          "Tên bí danh khoá KMS tự kích hoạt Region cho mọi tài khoản thành viên.",
          "Sai. Bí danh giúp tham chiếu khoá KMS, không quản lý việc bật Region của tài khoản.",
        ],
      ],
    },
    {
      en: "An archive key is scheduled for deletion while log retention is still active. Which audit property is at risk?",
      vi: "Khoá mã hoá kho nhật ký được lên lịch xoá trong khi nhật ký vẫn phải được lưu theo quy định. Khả năng nào đang gặp rủi ro?",
      section: "integrity",
      answers: [2],
      explanation:
        "Giữ tập tin không đủ nếu sau này không thể giải mã để đọc bằng chứng. Vòng đời khoá và quyền sử dụng khoá phải phù hợp với thời gian cần sử dụng dữ liệu phụ thuộc vào nó.",
      choices: [
        [
          "Only the visual order of log-group names.",
          "Chỉ thứ tự hiển thị tên các log group.",
          "Sai. Rủi ro là mất khả năng đọc dữ liệu mã hoá, không phải thay đổi cách sắp xếp giao diện.",
        ],
        [
          "Only the number of Config rule names.",
          "Chỉ số lượng tên quy tắc Config.",
          "Sai. Xoá khoá lưu trữ không làm thay đổi số lượng quy tắc theo cách này; vấn đề trực tiếp nằm ở dữ liệu mã hoá.",
        ],
        [
          "Recoverability and readability of encrypted audit evidence.",
          "Khả năng khôi phục và đọc bằng chứng kiểm toán đã mã hoá.",
          "Đúng. Nếu khoá cần thiết bị xoá, các tập tin còn tồn tại cũng có thể không sử dụng được cho kiểm toán.",
        ],
        [
          "The archive automatically becomes plaintext and easier to query.",
          "Kho lưu trữ tự chuyển sang văn bản rõ và dễ truy vấn hơn.",
          "Sai. Xoá khoá không tự giải mã dữ liệu rồi lưu lại bản rõ; trái lại có thể làm mất khả năng giải mã.",
        ],
      ],
    },
    {
      en: "A team enables logging after a suspected intrusion and claims full historical visibility. What is the evidence problem?",
      vi: "Nhóm chỉ bật ghi nhật ký sau khi nghi ngờ bị xâm nhập nhưng tuyên bố đã có đầy đủ lịch sử. Kết luận này có vấn đề gì?",
      section: "evidence",
      answers: [1],
      explanation:
        "Không thể dùng cấu hình thu thập hiện tại để khẳng định mọi hoạt động trước đó đã được ghi. Cần nêu rõ khoảng thời gian và nguồn dữ liệu còn thiếu, đồng thời tìm bằng chứng bổ sung còn tồn tại.",
      choices: [
        [
          "New logging reconstructs all previously unrecorded API and network details.",
          "Bật ghi nhật ký mới sẽ dựng lại mọi chi tiết API và mạng trước đây chưa được thu.",
          "Sai. Việc bắt đầu thu thập không tái tạo đầy đủ lịch sử đã bỏ lỡ ở những nguồn chưa bật.",
        ],
        [
          "The required sources may not contain events from before collection was enabled.",
          "Những nguồn cần dùng có thể không chứa sự kiện xảy ra trước khi bắt đầu thu thập.",
          "Đúng. Phải giới hạn kết luận theo dữ liệu thực có và tiếp tục tìm nguồn khác, không tuyên bố lịch sử đầy đủ.",
        ],
        [
          "No security investigation is possible unless every service has every log.",
          "Không thể điều tra bất cứ điều gì trừ khi mọi dịch vụ đều có mọi loại nhật ký.",
          "Sai. Vẫn có thể điều tra bằng dữ liệu còn sẵn, nhưng phải công khai giới hạn thay vì suy diễn vượt bằng chứng.",
        ],
        [
          "Turning on Config replaces the need to identify API callers.",
          "Bật Config sẽ loại bỏ nhu cầu xác định danh tính gọi API.",
          "Sai. Cấu hình tài nguyên và danh tính đã thực hiện thao tác là hai câu hỏi khác nhau, cần nguồn phù hợp cho từng câu.",
        ],
      ],
    },
  ],
);
