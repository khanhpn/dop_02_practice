import { lesson } from "../domain4/author";

export const d6l01 = lesson(
  {
    id: "d6-l01",
    number: 62,
    domainId: 6,
    chapterId: "6.1",
    title: "IAM: hiểu cách xét quyền và sử dụng role giữa các tài khoản",
    summary:
      "Ôn lại cách IAM quyết định một yêu cầu được phép hay bị từ chối. Từ đó, bạn sẽ biết phân biệt quyền sử dụng role với quyền của chính role đó, khoanh vùng lỗi AccessDenied và thiết kế truy cập giữa các tài khoản AWS.",
    duration: 70,
    objectives: [
      "Phân biệt trust policy (chính sách tin cậy) với permissions policy (chính sách cấp quyền), và biết cần kiểm tra loại nào khi có lỗi.",
      "Giải thích vì sao một yêu cầu vẫn bị từ chối dù đã có Allow, dựa vào các chính sách thực sự áp dụng.",
      "Thiết kế cách sử dụng role giữa hai tài khoản theo nguyên tắc quyền tối thiểu, rồi thử cả thao tác được phép và thao tác cần bị chặn.",
    ],
    prerequisites: [
      "Đã biết IAM user (người dùng), IAM role (vai trò truy cập) và cấu trúc một chính sách IAM viết bằng JSON.",
      "Nhận biết được ARN của role, S3 bucket và object; hiểu sự khác nhau giữa quyền trên bucket và quyền trên một đối tượng bên trong.",
    ],
    sections: [
      {
        id: "d6-l01-request",
        title: "1. Xác định ai đang yêu cầu làm gì, với tài nguyên nào",
        paragraphs: [
          "Khi gặp AccessDenied, đừng vội tìm một chính sách tên AdministratorAccess để gắn thêm. Trước hết, hãy làm rõ yêu cầu đang bị từ chối. Principal (chủ thể gửi yêu cầu) có thể là người dùng IAM, một phiên sử dụng role hoặc dịch vụ AWS. Action là thao tác muốn thực hiện, resource là tài nguyên đích, còn context là những thông tin đi kèm như tài khoản, nguồn kết nối và thẻ của phiên truy cập. Authentication (xác thực) giúp xác định danh tính; authorization (kiểm tra quyền) quyết định danh tính đó được làm gì trong điều kiện cụ thể. Vì vậy, một CLI profile được đặt tên prod-admin chưa chứng minh bạn đang có quyền quản trị. Hãy dùng STS GetCallerIdentity để xem ARN thực tế, rồi ghi lại API bị lỗi, ARN tài nguyên và khu vực đang thao tác.",
          "Sau khi xác định đúng yêu cầu, mới xem quyền đến từ đâu. Identity-based policy (chính sách gắn với danh tính) mô tả quyền của người dùng, nhóm hoặc role. Resource-based policy (chính sách gắn với tài nguyên), chẳng hạn S3 bucket policy, chỉ rõ những chủ thể nào được truy cập tài nguyên đó. IAM không đọc các statement theo cách dòng sau ghi đè dòng trước. Nếu thiếu quyền cho phép cần thiết, yêu cầu thường nhận implicit deny, tức bị từ chối vì chưa được cho phép. Nếu có một statement Deny áp dụng đúng yêu cầu, đó là explicit deny, tức bị cấm rõ ràng; thêm Allow rộng hơn cũng không bỏ qua được lệnh cấm ấy. Phân biệt hai nguyên nhân này giúp bạn biết cần bổ sung quyền còn thiếu hay cần xem lại một điều kiện đang chủ động chặn truy cập.",
        ],
      },
      {
        id: "d6-l01-evaluation",
        title: "2. Vì sao đã có Allow mà yêu cầu vẫn bị từ chối?",
        paragraphs: [
          "Một yêu cầu có thể chịu nhiều lớp chính sách cùng lúc. Trong trường hợp cấp quyền thông thường qua danh tính, chính sách của role cho biết các thao tác được phép, còn permissions boundary (ranh giới quyền) đặt giới hạn tối đa cho các quyền đó. Session policy (chính sách của phiên truy cập) có thể giới hạn thêm quyền của một phiên STS. Với tài khoản thành viên trong AWS Organizations, SCP (chính sách kiểm soát dịch vụ) tiếp tục giới hạn những quyền mà các danh tính thuộc phạm vi áp dụng có thể sử dụng. Những lớp giới hạn này không tự cấp quyền mới. Chẳng hạn, role có AdministratorAccess vẫn không tắt được CloudTrail nếu một SCP áp dụng đang cấm thao tác đó. Khi điều tra, hãy liệt kê đúng những lớp đang có hiệu lực, tìm lệnh Deny rõ ràng và kiểm tra xem quyền được cấp có nằm trong các giới hạn còn lại hay không.",
          "Tuy nhiên, đừng rút gọn mọi tình huống thành một phép lấy giao của tất cả chính sách. Chính sách gắn với tài nguyên có quy tắc khác nhau tùy đối tượng được cấp quyền và cách cấp. Trong cùng tài khoản, cấp trực tiếp cho ARN của một phiên role không hoàn toàn giống cấp cho ARN của IAM role; cách implicit deny ảnh hưởng đến hai trường hợp có thể khác nhau. Explicit deny áp dụng vẫn cần được xét. Với KMS key policy, chính sách tin cậy hoặc truy cập khác tài khoản, bạn còn phải kiểm tra yêu cầu riêng của loại tài nguyên và danh tính liên quan. Khi thiết kế hệ thống thật, cách cấp quyền rõ đối tượng, rõ điều kiện và đã được kiểm chứng sẽ dễ giải thích, kiểm toán hơn việc mở quyền cho những phiên truy cập ngắn hạn mà nhóm chưa hiểu hết.",
        ],
      },
      {
        id: "d6-l01-trust",
        title:
          "3. AssumeRole: được sử dụng role chưa có nghĩa được làm mọi việc",
        paragraphs: [
          "AssumeRole là thao tác yêu cầu STS cấp một phiên truy cập tạm thời với quyền của role được chọn. Trust policy (chính sách tin cậy) của role trả lời ai được phép thực hiện thao tác này; permissions policy (chính sách cấp quyền) của role trả lời phiên vừa tạo được làm gì sau đó. Ví dụ, pipeline ở tài khoản A cần triển khai sang tài khoản B: phía A phải được phép gọi sts:AssumeRole trên role đích, đồng thời chính sách tin cậy của role ở B phải chấp nhận đúng chủ thể nguồn và các điều kiện liên quan. Khi STS trả về thông tin xác thực tạm thời, ứng dụng phải thực sự dùng thông tin đó cho những lệnh tiếp theo. Nếu vẫn dùng thông tin xác thực ban đầu, các yêu cầu vẫn được gửi dưới danh tính cũ. Việc đặt tên phiên giúp điều tra, nhưng không tự chuyển danh tính hay cấp thêm quyền.",
          "Một chi tiết hay gây nhầm là ARN dạng arn:aws:iam::111122223333:root trong phần Principal. Cách khai báo này thể hiện sự tin cậy đối với tài khoản đó, chứ không chỉ riêng người dùng root. Quản trị viên của tài khoản được tin cậy có thể tiếp tục phân quyền sử dụng role trong phạm vi các chính sách cho phép. Nếu chỉ cần một role cụ thể, hãy cân nhắc giới hạn rõ role đó. Khi một nhà cung cấp bên thứ ba phục vụ nhiều khách hàng, điều kiện ExternalId giúp gắn yêu cầu với đúng quan hệ khách hàng, giảm rủi ro confused deputy: nhà cung cấp bị lợi dụng để truy cập nhầm tài nguyên của khách hàng khác. ExternalId không thay thế việc xác thực. Ngoài ra, xóa role nguồn rồi tạo lại cùng tên có thể làm liên kết với principal ID cũ không còn hợp lệ; bạn cần kiểm tra lại chính sách tin cậy, không chỉ so tên ARN.",
        ],
      },
      {
        id: "d6-l01-scope",
        title: "4. Cấp đủ quyền cho công việc, đúng phạm vi cần dùng",
        paragraphs: [
          "Least privilege (nguyên tắc quyền tối thiểu) có nghĩa là cấp đủ quyền để hoàn thành công việc, trong phạm vi thực sự cần thiết. Giả sử pipeline chỉ cần đọc các gói phát hành trên S3. Thao tác s3:GetObject phải được cấp trên ARN của các đối tượng, chẳng hạn arn:aws:s3:::study-artifacts/releases/*. Nếu pipeline còn cần liệt kê đối tượng, s3:ListBucket lại được xét trên ARN của bucket. Cấp quyền đúng thao tác nhưng sai loại ARN vẫn khiến yêu cầu thất bại. Không phải API nào cũng hỗ trợ giới hạn theo từng tài nguyên; với API bắt buộc dùng Resource=*, hãy tìm điều kiện được hỗ trợ để thu hẹp quyền và giải thích rõ lý do cấu hình. Dấu * không tự động làm một chính sách sai, nhưng cũng không nên được thêm vào chỉ để lỗi tạm biến mất.",
          "Condition (điều kiện áp dụng quyền) chỉ có tác dụng khi khóa ngữ cảnh và toán tử so sánh phù hợp với yêu cầu. Ví dụ, StringEquals kiểm tra chuỗi bằng nhau, còn StringLike hỗ trợ mẫu có ký tự đại diện. Thông tin MFA, thẻ hoặc nguồn mạng cũng không xuất hiện giống nhau ở mọi loại phiên truy cập. Nếu bắt buộc aws:MultiFactorAuthPresent=true đối với một chương trình không có quy trình xác thực MFA tương tác, bạn có thể vô tình chặn chính chương trình cần chạy. Một điểm khác cần phân biệt là iam:PassRole: quyền này kiểm soát role nào bạn được giao cho dịch vụ AWS, khác với việc tự nhận một phiên role qua sts:AssumeRole. Nếu người dùng được tạo Lambda và giao cho hàm một role quản trị bất kỳ, hàm có thể chạy với quyền cao hơn người tạo. Vì vậy, hãy giới hạn cả ARN role được giao và dịch vụ nhận role bằng các điều kiện phù hợp, đồng thời xem xét cả chuỗi thao tác có thể dẫn đến nâng quyền.",
        ],
      },
      {
        id: "d6-l01-validation",
        title: "5. Kiểm tra cả việc cần làm được và việc phải bị chặn",
        paragraphs: [
          "Dùng IAM Access Analyzer để kiểm tra cú pháp và những vấn đề bảo mật của chính sách trước khi gắn vào danh tính hoặc tài nguyên. Sau đó, IAM Policy Simulator có thể giúp thử một thao tác trên tài nguyên với những điều kiện cụ thể. Tuy nhiên, mô phỏng không thay thế hoàn toàn việc kiểm tra luồng truy cập thật, nhất là khi có nhiều tài khoản và chính sách gắn với tài nguyên. Một chính sách không có lỗi cú pháp vẫn có thể thiếu API phụ trợ mà ứng dụng cần gọi. Với ví dụ đọc gói phát hành, hãy ghi trước các kết quả mong muốn: đọc đối tượng trong releases/ phải thành công; đọc ngoài thư mục này và ghi đối tượng mới phải bị từ chối. Khi thử cả hai phía, bạn mới xác minh được quyền vừa đủ dùng thay vì chỉ chứng minh rằng quyền rộng đã làm cho một lệnh chạy được.",
          "Khi cần đối chiếu ai đã gọi API, CloudTrail cung cấp nhật ký nếu loại sự kiện đó đã được cấu hình ghi nhận. Các trường như userIdentity và sessionIssuer giúp xác định danh tính, role và phiên truy cập liên quan. Riêng thao tác đọc đối tượng S3 cần cấu hình data events (sự kiện truy cập dữ liệu) phù hợp; mục Event history ghi sự kiện quản lý không tự chứa mọi lần GetObject. Sau khi đổi quyền IAM, cũng cần tính đến eventual consistency (độ trễ để thay đổi được cập nhật đồng bộ), nhưng không nên quy mọi lỗi AccessDenied cho độ trễ này. Hãy lưu chính sách bằng mã, xem xét thay đổi quyền, kiểm tra cả trường hợp cho phép lẫn từ chối trong tài khoản thực hành, rồi theo dõi kết quả. Thông tin xác thực do AssumeRole trả về vẫn là bí mật trong thời gian còn hiệu lực, nên không được ghi vào nhật ký chạy CI.",
        ],
      },
    ],
    diagram: {
      title: "Các bước sử dụng role ở tài khoản khác",
      steps: [
        {
          label: "Xác định nguồn",
          detail:
            "Dùng GetCallerIdentity để xác nhận pipeline đang sử dụng role thuộc tài khoản A.",
        },
        {
          label: "Kiểm tra quyền sử dụng role đích",
          detail:
            "Phía nguồn được phép gọi sts:AssumeRole; role ở B tin cậy đúng chủ thể và điều kiện truy cập.",
        },
        {
          label: "Nhận thông tin truy cập tạm thời",
          detail:
            "Cấu hình SDK dùng thông tin xác thực vừa nhận; đặt tên phiên để có thể đối chiếu khi điều tra.",
        },
        {
          label: "Kiểm tra quyền đối với thao tác cần làm",
          detail:
            "AWS xét quyền của role, chính sách của tài nguyên và các giới hạn thực sự áp dụng cho yêu cầu.",
        },
        {
          label: "Thử lại và đối chiếu nhật ký",
          detail:
            "Thử cả thao tác được phép và cần bị chặn; đối chiếu CloudTrail nếu loại sự kiện đã được ghi nhận.",
        },
      ],
      caption:
        "STS chấp nhận AssumeRole chỉ cho biết bạn đã nhận được phiên truy cập. Từng yêu cầu API sau đó vẫn phải được kiểm tra quyền riêng.",
    },
    scenarios: [
      {
        title: "Sử dụng được role đích nhưng vẫn không đọc được gói phát hành",
        context:
          "Pipeline ở tài khoản A đã nhận phiên truy cập của role tại B. Nó liệt kê được bucket, nhưng khi đọc releases/build.zip bằng GetObject lại nhận AccessDenied.",
        solution:
          "Trước hết, dùng GetCallerIdentity để xác nhận lệnh đọc đang sử dụng đúng phiên role B. Sau đó kiểm tra s3:GetObject có áp dụng trên ARN đối tượng cần đọc hay không, cùng các lệnh Deny trong chính sách của bucket hoặc những lớp giới hạn liên quan. Liệt kê được tên đối tượng chưa đồng nghĩa với việc được đọc nội dung của chúng.",
        tradeoff:
          "Bạn có thể cần nhiều statement hơn khi tách quyền liệt kê và quyền đọc, nhưng đổi lại sẽ xác định rõ từng thao tác được phép trên tài nguyên nào.",
      },
      {
        title:
          "Tạo lại role cùng tên nhưng không còn được tài khoản đích tin cậy",
        context:
          "Quy trình quản lý hạ tầng xóa rồi tạo lại role chạy pipeline với tên cũ. Sau thay đổi này, role triển khai ở tài khoản đích từ chối AssumeRole dù ARN nhìn vẫn giống trước.",
        solution:
          "Kiểm tra xem chính sách tin cậy có còn trỏ đến principal ID của role đã xóa hay không. Cập nhật về đúng danh tính mới và đưa bước kiểm tra này vào quy trình thay thế role bằng mã.",
        tradeoff:
          "Tin cậy tài khoản kèm điều kiện phù hợp có thể giảm phụ thuộc vào ID của một role cụ thể, nhưng phạm vi tin cậy cần được giới hạn chặt. Không mở rộng quyền cho cả tài khoản chỉ để tránh cập nhật chính sách.",
      },
    ],
    keyTakeaways: [
      "Chính sách tin cậy xác định ai được sử dụng role; chính sách cấp quyền xác định phiên role được làm những thao tác nào.",
      "Khi một Deny áp dụng đúng yêu cầu, thêm Allow rộng hơn cũng không làm yêu cầu đó được phép.",
      "Permissions boundary, SCP và chính sách phiên là các lớp giới hạn; bạn vẫn cần nguồn cấp quyền phù hợp cho thao tác muốn thực hiện.",
      "Đọc nội dung đối tượng S3 và liệt kê bucket cần những thao tác và loại ARN khác nhau.",
      "Luôn xác nhận danh tính thực tế và kiểm tra cả những thao tác mà thiết kế yêu cầu phải chặn.",
    ],
    examTraps: [
      "Đọc ARN của tài khoản trong Principal rồi kết luận chỉ người dùng root mới sử dụng được role.",
      "Nhầm quyền giao role cho dịch vụ (iam:PassRole) với quyền nhận một phiên truy cập của role (sts:AssumeRole).",
      "Áp dụng một công thức lấy giao cho mọi chính sách mà không xét cách cấp quyền và loại chủ thể được cấp.",
      "Cho rằng công cụ kiểm tra hoặc mô phỏng chính sách đã chứng minh toàn bộ luồng truy cập thật sẽ hoạt động.",
    ],
    code: {
      title: "Ví dụ rút gọn: chỉ cho một role chạy pipeline đọc gói phát hành",
      deployable: false,
      cloudformation: `Parameters:
  RunnerRoleArn:
    Type: String
  ArtifactBucket:
    Type: String
Resources:
  ArtifactReader:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal: { AWS: !Ref RunnerRoleArn }
            Action: sts:AssumeRole
      Policies:
        - PolicyName: ReadReleases
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: s3:GetObject
                Resource: !Sub 'arn:aws:s3:::\${ArtifactBucket}/releases/*'`,
      terraform: `variable "runner_role_arn" { type = string }
variable "artifact_bucket" { type = string }
resource "aws_iam_role" "reader" {
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{
    Effect = "Allow", Principal = { AWS = var.runner_role_arn }, Action = "sts:AssumeRole"
  }] })
}
resource "aws_iam_role_policy" "read" {
  role = aws_iam_role.reader.id
  policy = jsonencode({ Version = "2012-10-17", Statement = [{
    Effect = "Allow", Action = "s3:GetObject",
    Resource = "arn:aws:s3:::\${var.artifact_bucket}/releases/*"
  }] })
}`,
      explanation:
        "Hai đoạn mã minh họa cách role đích tin cậy một role nguồn cụ thể và chỉ cho đọc các đối tượng trong releases/. Chúng chưa tạo bucket, chưa cấp sts:AssumeRole ở phía nguồn và chưa bổ sung quyền KMS nếu gói dữ liệu dùng SSE-KMS. Trước khi triển khai, cần thay ARN và tài khoản theo môi trường thực tế; CloudFormation cũng yêu cầu xác nhận việc tạo tài nguyên IAM. Cả hai cách viết đều ghép giá trị tên bucket vào ARN đối tượng, để giới hạn quyền đọc ở đúng nơi cần thiết.",
    },
    lab: {
      title: "Thực hành kiểm tra quyền trong tài khoản riêng",
      duration: 45,
      prerequisites: [
        "AWS CLI đã đăng nhập vào tài khoản thực hành, có quyền tạo role, chính sách thử và dùng công cụ mô phỏng IAM. Chỉ sử dụng tài nguyên riêng của bài.",
        "Một bucket thực hành có hai đối tượng chứa dữ liệu giả: releases/allowed.txt và private/denied.txt.",
        "Ghi lại ARN role nguồn và tên bucket. Nếu muốn thử truy cập khác tài khoản, chuẩn bị hai tài khoản thực hành mà bạn có quyền quản lý.",
      ],
      cost: "IAM không thu phí riêng cho việc tạo role và chính sách. Tuy nhiên, các yêu cầu S3, lưu trữ dữ liệu, KMS hoặc dịch vụ ghi nhật ký dùng kèm có thể tính phí. Bài này không yêu cầu tạo máy EC2.",
      steps: [
        {
          title: "Xác nhận danh tính và ghi trước kết quả mong muốn",
          detail:
            "Chạy STS GetCallerIdentity rồi ghi mã tài khoản và ARN đang sử dụng. Lập trước bảng kiểm tra gồm ba trường hợp: đọc trong releases/ được phép; đọc trong private/ bị từ chối; ghi đối tượng mới bằng PutObject bị từ chối.",
          command: "aws sts get-caller-identity",
          expected:
            "ARN đúng với danh tính thực hành đã được cấp quyền. Bạn có bảng kết quả mong đợi cho cả ba trường hợp trước khi sửa chính sách.",
        },
        {
          title: "Tạo role chỉ có quyền đọc trong phạm vi cần thiết",
          detail:
            "Tạo một role thử trong IAM với chính sách tin cậy chỉ chấp nhận danh tính nguồn đã chọn. Gắn quyền s3:GetObject cho các đối tượng dưới releases/* theo ví dụ. Nếu gặp lỗi, giữ nguyên phạm vi thử để tìm nguyên nhân thay vì gắn AdministratorAccess.",
          expected:
            "Role có chính sách tin cậy và chính sách cấp quyền riêng của bài. Các quyền vừa cấp không cho ghi đối tượng hoặc đọc dưới private/.",
        },
        {
          title: "Kiểm tra chính sách trước khi sử dụng",
          detail:
            "Mở chính sách trong IAM và dùng Access Analyzer để kiểm tra. Sửa lỗi cú pháp, đọc các cảnh báo bảo mật và ghi lại cách xử lý. Đồng thời, tự giải thích vì sao Resource của GetObject phải là ARN đối tượng, không chỉ là ARN bucket.",
          expected:
            "Công cụ không còn báo lỗi cú pháp. Mỗi cảnh báo đã được xem xét và có lý do xử lý hoặc chấp nhận rõ ràng.",
        },
        {
          title: "Thử ba thao tác trên đúng tài nguyên",
          detail:
            "Chọn role thử trong IAM Policy Simulator. Lần lượt mô phỏng GetObject với releases/allowed.txt, GetObject với private/denied.txt và PutObject với releases/new.txt. Đây là bước kiểm tra quyền của danh tính; kết quả mô phỏng chưa thay thế việc kiểm tra mọi chính sách của tài nguyên trong luồng truy cập thật.",
          expected:
            "Trường hợp đầu được phép. Hai trường hợp còn lại trả implicitDeny nếu không có chính sách nào khác cấp thêm quyền.",
        },
        {
          title: "Quan sát một lệnh cấm rõ ràng được ưu tiên ra sao",
          detail:
            "Tạm thêm một statement Deny cho GetObject trên releases/blocked.txt rồi mô phỏng thao tác đọc đối tượng này. So sánh kết quả với trường hợp đọc private/denied.txt: một bên bị cấm rõ ràng, bên kia chưa được cấp quyền. Sau khi ghi kết quả, bỏ statement thử khỏi chính sách của bài.",
          expected:
            "Đọc blocked.txt trả explicitDeny dù đã có Allow cho releases/*. Đọc private/denied.txt vẫn bị từ chối vì chưa được cho phép.",
        },
        {
          title: "Kiểm chứng luồng thật rồi dọn tài nguyên thử",
          detail:
            "Nếu đã chuẩn bị hai tài khoản, dùng danh tính nguồn để gọi AssumeRole, sau đó cấu hình SDK hoặc profile sử dụng thông tin xác thực tạm thời vừa nhận. Kiểm tra lại GetCallerIdentity trước khi đọc đối tượng giả. Ghi kết quả so sánh với mô phỏng, nhưng không ghi khóa truy cập vào nhật ký. Khi xong, xóa role và chính sách được tạo riêng cho bài.",
          expected:
            "ARN sau khi chuyển phiên là assumed-role của tài khoản đích. Nếu kết quả khác mô phỏng, bạn xác định được lớp quyền còn cần kiểm tra. Role thử đã được dọn sau khi kết thúc.",
        },
      ],
      cleanup: [
        "Gỡ các chính sách được tạo riêng cho bài trước khi xóa role thử.",
        "Chỉ xóa những đối tượng giả do bạn tạo khi không còn cần dùng; giữ nguyên bucket nếu đang được dùng chung.",
        "Gỡ thông tin xác thực tạm khỏi profile hoặc biến môi trường sau khi dùng; không lưu vào ghi chú hay kho mã nguồn.",
      ],
      challenge:
        "Bổ sung quyền ListBucket chỉ cho phép liệt kê tiền tố releases/ bằng điều kiện phù hợp. Sau đó giải thích vì sao vẫn cần statement GetObject riêng để đọc nội dung đối tượng.",
    },
    sources: [
      {
        title: "DOP-C02 Domain 6",
        url: "https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02-domain6.html",
      },
      {
        title: "IAM policy evaluation",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
      },
      {
        title: "Create cross-account roles",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html",
      },
      {
        title: "IAM condition element",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html",
      },
      {
        title: "Permissions boundaries",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html",
      },
      {
        title: "Cross-account access evaluation",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies-cross-account-resource-access.html",
      },
      {
        title: "IAM Access Analyzer policy validation",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-validation.html",
      },
    ],
    reviewedAt: "2026-10-19",
  },
  [
    {
      en: "A CLI profile is named prod-admin, but a deployment is denied. What should the engineer verify first?",
      vi: "Bạn đang dùng cấu hình AWS CLI mang tên prod-admin nhưng lệnh triển khai vẫn bị từ chối. Trước tiên, bạn nên xác minh điều gì?",
      section: "request",
      answers: [1],
      refresh: true,
      explanation:
        "Tên profile chỉ là nhãn cấu hình trên máy, không phải bằng chứng về quyền. Cần biết yêu cầu thực sự được gửi dưới danh tính nào, gọi thao tác gì và tác động đến tài nguyên nào rồi mới kiểm tra chính sách.",
      choices: [
        [
          "Attach a broader policy to the role whose name appears in the profile without checking the caller.",
          "Gắn thêm quyền cho role có tên trong profile mà chưa kiểm tra danh tính thực tế.",
          "Profile có thể sử dụng thông tin đăng nhập ban đầu hoặc chuyển sang một role khác. Sửa nhầm role vừa không giải quyết lỗi, vừa cấp thêm quyền không cần thiết.",
        ],
        [
          "Run STS GetCallerIdentity and identify the failing action and resource.",
          "Chạy STS GetCallerIdentity, sau đó xác định thao tác và tài nguyên đang bị từ chối.",
          "GetCallerIdentity cho biết danh tính đang ký yêu cầu. Kết hợp với API và ARN tài nguyên bị lỗi, bạn mới có cơ sở tìm đúng chính sách cần kiểm tra.",
        ],
        [
          "Create a second administrator user immediately.",
          "Tạo ngay một người dùng IAM mới có quyền quản trị.",
          "Tạo thêm tài khoản quản trị không giúp xác định nguyên nhân ban đầu. Việc này còn mở rộng quyền trước khi biết ứng dụng thực sự cần gì.",
        ],
        [
          "Wait for IAM propagation without identifying which action was denied.",
          "Chỉ chờ thay đổi IAM được cập nhật mà không xác định thao tác đang bị chặn.",
          "Độ trễ cập nhật có thể xuất hiện sau khi sửa quyền, nhưng không thay thế việc kiểm tra danh tính và yêu cầu cụ thể. Lỗi cũng có thể do thiếu quyền hoặc đang có Deny áp dụng.",
        ],
      ],
    },
    {
      en: "A role trust policy allows a CI role to assume it, but the target role has no permissions policies. What can the assumed session do?",
      vi: "Chính sách tin cậy cho phép role CI sử dụng role đích, nhưng role đích không có chính sách cấp quyền. Phiên truy cập vừa nhận được có thể làm gì?",
      section: "trust",
      answers: [0],
      explanation:
        "Chính sách tin cậy cho phép tạo phiên truy cập, không tự cấp quyền triển khai. Mỗi thao tác sau đó vẫn cần được các chính sách áp dụng cho phép; quyền của role nguồn không tự chuyển sang role đích.",
      choices: [
        [
          "Only actions independently authorized by applicable policies; trust alone grants no deployment permissions.",
          "Chỉ thực hiện những thao tác được các chính sách áp dụng cho phép riêng; chính sách tin cậy không tự cấp quyền triển khai.",
          "Bạn cần phân biệt việc được sử dụng role với việc role được phép làm gì. Nếu không có nguồn cấp quyền phù hợp cho thao tác đích, việc AssumeRole thành công cũng chưa đủ.",
        ],
        [
          "Every action allowed to the source CI role automatically.",
          "Tự động có tất cả quyền của role CI nguồn.",
          "STS tạo phiên với quyền của role đích theo các chính sách liên quan. Nó không sao chép toàn bộ quyền của role nguồn vào phiên mới.",
        ],
        [
          "Full administrator access because STS authenticated it.",
          "Có toàn quyền quản trị vì STS đã xác thực thành công.",
          "Xác thực thành công cho biết danh tính đã được chấp nhận, không có nghĩa được làm mọi việc. Quyền thao tác trên tài nguyên vẫn được kiểm tra riêng.",
        ],
        [
          "All S3 actions in all accounts.",
          "Thực hiện mọi thao tác S3 trong tất cả tài khoản.",
          "Chính sách tin cậy không cấp một tập quyền S3 như vậy. Từng yêu cầu S3 cần được cho phép đối với đúng thao tác và tài nguyên.",
        ],
      ],
    },
    {
      en: "An applicable bucket policy explicitly denies DeleteObject. A role policy allows s3:*. Which result is expected?",
      vi: "Chính sách của bucket đang cấm rõ thao tác DeleteObject. Trong khi đó, chính sách của role cho phép s3:*. Yêu cầu xóa đối tượng sẽ có kết quả nào?",
      section: "evaluation",
      answers: [2],
      refresh: true,
      explanation:
        "Deny áp dụng đúng yêu cầu được ưu tiên hơn Allow. Quyền s3:* rộng hơn không làm mất hiệu lực lệnh cấm DeleteObject trong chính sách của bucket.",
      choices: [
        [
          "Allowed because s3:* is more general.",
          "Được phép vì s3:* bao quát nhiều thao tác hơn.",
          "Độ rộng của Allow không quyết định mức ưu tiên. Một Deny áp dụng vẫn chặn thao tác, kể cả khi chính sách khác cho phép toàn bộ S3.",
        ],
        [
          "Allowed if the Allow statement appears last.",
          "Được phép nếu statement Allow được đặt cuối cùng.",
          "IAM không đánh giá theo cách dòng sau ghi đè dòng trước. Đổi thứ tự các statement không vô hiệu hóa Deny.",
        ],
        [
          "Denied because the explicit deny applies.",
          "Bị từ chối vì lệnh Deny áp dụng cho yêu cầu này.",
          "Đây là trường hợp bị cấm rõ ràng. Muốn thay đổi kết quả, phải xem lại lệnh cấm hoặc điều kiện áp dụng, không chỉ thêm quyền Allow.",
        ],
        [
          "Allowed if the object is small.",
          "Được phép nếu đối tượng có dung lượng nhỏ.",
          "Tình huống không có điều kiện nào dựa trên dung lượng. Kích thước đối tượng không làm thay đổi lệnh cấm đang áp dụng.",
        ],
      ],
    },
    {
      en: "A role policy allows s3:GetObject, but its permissions boundary allows only CloudWatch read actions. What happens to GetObject under this identity-policy path?",
      vi: "Chính sách của role cho phép s3:GetObject, nhưng permissions boundary chỉ cho phép các thao tác đọc CloudWatch. Nếu xét quyền được cấp qua chính sách danh tính này, GetObject có được phép không?",
      section: "evaluation",
      answers: [1],
      explanation:
        "Permissions boundary đặt giới hạn cho quyền được cấp qua chính sách danh tính. GetObject nằm ngoài giới hạn được mô tả, nên Allow trong chính sách của role chưa đủ để thực hiện thao tác.",
      choices: [
        [
          "Allowed because boundaries grant additional permissions.",
          "Được phép vì boundary bổ sung thêm quyền cho role.",
          "Boundary là lớp giới hạn, không phải nguồn cấp quyền bổ sung. Bạn vẫn phải đối chiếu quyền đã được cấp với phạm vi boundary cho phép.",
        ],
        [
          "Denied because GetObject is outside the boundary.",
          "Bị từ chối vì GetObject nằm ngoài phạm vi boundary.",
          "Chính sách của role có Allow nhưng boundary không cho phép thao tác S3 này. Vì vậy, quyền được cấp theo cách đang xét không có hiệu lực cho GetObject.",
        ],
        [
          "Allowed after renaming the role.",
          "Được phép sau khi đổi tên role.",
          "Tên role không thay đổi nội dung boundary đang áp dụng. Cần kiểm tra chính sách, không phải đổi nhãn tài nguyên.",
        ],
        [
          "Allowed only on weekends.",
          "Chỉ được phép vào cuối tuần.",
          "Đề bài không nêu điều kiện thời gian. Không thể suy ra quyền truy cập thay đổi theo ngày từ những chính sách được mô tả.",
        ],
      ],
    },
    {
      en: "Which TWO elements are required for the normal cross-account AssumeRole path from account A to role B? (Choose TWO.)",
      vi: "Trong luồng AssumeRole thông thường từ tài khoản A sang role B ở tài khoản khác, hai điều kiện nào cần có? Chọn HAI đáp án.",
      section: "trust",
      answers: [0, 3],
      explanation:
        "Cần sự cho phép ở cả hai phía: danh tính nguồn được quyền gọi AssumeRole và role đích chấp nhận danh tính đó trong chính sách tin cậy. Chỉ cấu hình một phía sẽ chưa hoàn tất quan hệ truy cập.",
      choices: [
        [
          "The caller is allowed sts:AssumeRole on role B.",
          "Danh tính gửi yêu cầu được phép gọi sts:AssumeRole trên role B.",
          "Phía nguồn cần được cho phép thực hiện thao tác AssumeRole đối với đúng ARN role đích. Đây là một phần của quá trình kiểm tra truy cập khác tài khoản.",
        ],
        [
          "Both accounts have an IAM group with the same name.",
          "Cả hai tài khoản đều có một IAM group cùng tên.",
          "Tên nhóm giống nhau không thiết lập quan hệ tin cậy giữa hai tài khoản. Nó cũng không tự cấp sts:AssumeRole cho danh tính nguồn.",
        ],
        [
          "The source role must be named Administrator.",
          "Role nguồn bắt buộc phải có tên Administrator.",
          "STS không yêu cầu tên role như vậy. Quyết định truy cập dựa trên chính sách và điều kiện áp dụng, không dựa vào tên mang ý nghĩa quản trị.",
        ],
        [
          "Role B has an applicable trust policy accepting the caller.",
          "Chính sách tin cậy của role B chấp nhận danh tính nguồn trong các điều kiện áp dụng.",
          "Role đích cần tin cậy đúng chủ thể nguồn. Đây là phần kiểm tra ở phía nhận, độc lập với việc phía nguồn đã có quyền gọi AssumeRole.",
        ],
        [
          "Every resource in B must be public.",
          "Mọi tài nguyên trong tài khoản B đều phải được mở công khai.",
          "Truy cập bằng role là truy cập có xác thực và kiểm tra quyền. Không cần mở công khai tài nguyên để sử dụng cơ chế này.",
        ],
      ],
    },
    {
      en: "A policy grants s3:GetObject on arn:aws:s3:::study-artifacts. Reads still fail. What is the likely resource error?",
      vi: "Chính sách cấp s3:GetObject trên arn:aws:s3:::study-artifacts, nhưng ứng dụng vẫn không đọc được đối tượng. ARN tài nguyên có thể đang sai ở đâu?",
      section: "scope",
      answers: [3],
      explanation:
        "ARN trong đề là ARN của bucket. GetObject tác động đến đối tượng bên trong nên cần ARN đối tượng; ListBucket mới là ví dụ thao tác được xét trên ARN bucket.",
      choices: [
        [
          "The bucket must use an EC2 ARN.",
          "Bucket cần được khai báo bằng một ARN của EC2.",
          "Tài nguyên cần đọc thuộc S3 nên ARN phải mô tả đúng tài nguyên S3. Thay bằng ARN EC2 không làm quyền khớp đối tượng.",
        ],
        [
          "GetObject supports only Resource=*.",
          "GetObject chỉ hỗ trợ Resource=*.",
          "GetObject hỗ trợ giới hạn quyền theo ARN đối tượng. Bạn có thể cấp đúng tiền tố cần đọc thay vì mở quyền cho mọi tài nguyên.",
        ],
        [
          "The ARN must include the IAM group name.",
          "ARN cần chứa thêm tên IAM group.",
          "Tên nhóm IAM không phải thành phần của ARN đối tượng S3. Việc gắn chính sách với nhóm và việc xác định tài nguyên đích là hai phần khác nhau.",
        ],
        [
          "Use an object ARN such as arn:aws:s3:::study-artifacts/releases/*.",
          "Dùng ARN đối tượng, chẳng hạn arn:aws:s3:::study-artifacts/releases/*.",
          "Phần releases/* chỉ ra các đối tượng thuộc phạm vi được đọc. Nhờ vậy Resource mới khớp với loại tài nguyên mà GetObject tác động.",
        ],
      ],
    },
    {
      en: "The role trust names arn:aws:iam::111122223333:root. What does this principal generally delegate trust to?",
      vi: "Phần Principal trong chính sách tin cậy của role ghi arn:aws:iam::111122223333:root. Cách khai báo này thường thể hiện sự tin cậy đối với ai?",
      section: "trust",
      answers: [0],
      explanation:
        "ARN có hậu tố :root trong trường hợp này thể hiện chủ thể là tài khoản AWS, không chỉ riêng người dùng root. Quản trị viên ở tài khoản đó có thể tiếp tục phân quyền cho các danh tính đủ điều kiện theo chính sách.",
      choices: [
        [
          "The account, whose administrators can delegate eligible callers subject to the policies.",
          "Tài khoản được chỉ định; quản trị viên có thể phân quyền cho các danh tính đủ điều kiện sử dụng role.",
          "Đây là ý nghĩa của account principal. Cần tiếp tục xét các quyền và điều kiện liên quan, thay vì giới hạn cách hiểu vào một lần đăng nhập bằng root.",
        ],
        [
          "Only the root user and no IAM identity.",
          "Chỉ người dùng root, không có danh tính IAM nào khác.",
          "Cách hiểu này nhầm chủ thể tài khoản với riêng người dùng root. Phạm vi tin cậy được khai báo có thể cho phép tài khoản tiếp tục ủy quyền.",
        ],
        [
          "Every anonymous internet user.",
          "Mọi người dùng ẩn danh trên internet.",
          "Principal đang chỉ rõ một tài khoản, không phải quyền truy cập ẩn danh cho tất cả mọi người. Không nên nhầm nó với một khai báo mở rộng bằng dấu *.",
        ],
        [
          "Only EC2 instances in the target account.",
          "Chỉ các máy EC2 thuộc tài khoản đích.",
          "Khai báo không chỉ định dịch vụ EC2 hay điều kiện giới hạn các máy EC2. Không thể suy ra ràng buộc đó từ ARN tài khoản.",
        ],
      ],
    },
    {
      en: "A third-party monitoring vendor can act for many customers. Which trust-policy condition helps mitigate the confused-deputy problem?",
      vi: "Một nhà cung cấp dịch vụ giám sát thay mặt nhiều khách hàng truy cập AWS. Điều kiện nào trong chính sách tin cậy giúp giảm rủi ro confused deputy, tức bên được ủy quyền bị lợi dụng để truy cập nhầm tài nguyên khách hàng khác?",
      section: "trust",
      answers: [2],
      explanation:
        "ExternalId giúp nhà cung cấp gắn yêu cầu AssumeRole với đúng quan hệ khách hàng. Nó bổ sung điều kiện cho sự tin cậy, chứ không phải mật khẩu thay thế việc xác thực.",
      choices: [
        [
          "Use the same shared password in every account.",
          "Sử dụng cùng một mật khẩu dùng chung trong mọi tài khoản.",
          "Mật khẩu dùng chung không tạo ra cơ chế kiểm tra quan hệ khách hàng trong yêu cầu STS. Nó còn tạo thêm rủi ro khi một bí mật được chia sẻ rộng.",
        ],
        [
          "Allow Principal=* with no condition.",
          "Cho phép Principal=* và không đặt điều kiện.",
          "Cách này mở rộng những chủ thể có thể được tin cậy, thay vì ràng buộc yêu cầu với khách hàng cụ thể. Nó không giải quyết vấn đề được hỏi.",
        ],
        [
          "Require the agreed sts:ExternalId in the role trust.",
          "Yêu cầu giá trị sts:ExternalId đã thống nhất trong chính sách tin cậy của role.",
          "ExternalId cho phép kiểm tra yêu cầu có gắn với đúng quan hệ ủy quyền hay không. Đây là biện pháp phù hợp với nhà cung cấp phục vụ nhiều khách hàng.",
        ],
        [
          "Set the role description to confidential.",
          "Đặt phần mô tả role thành confidential.",
          "Phần mô tả chỉ cung cấp thông tin cho người quản lý. IAM không dùng nội dung mô tả đó làm điều kiện cấp quyền AssumeRole.",
        ],
      ],
    },
    {
      en: "Which TWO tests best establish that a read-only artifact policy is scoped correctly? (Choose TWO.)",
      vi: "Bạn cần kiểm chứng chính sách chỉ cho phép đọc gói phát hành trong releases/. Hai phép thử nào phù hợp nhất? Chọn HAI đáp án.",
      section: "validation",
      answers: [1, 4],
      explanation:
        "Một thiết kế quyền tối thiểu phải vừa cho phép công việc cần làm, vừa chặn thao tác ngoài phạm vi. Vì vậy, cần thử đọc đúng đối tượng được duyệt và thử các yêu cầu phải bị từ chối.",
      choices: [
        [
          "Check only whether the JSON can be parsed.",
          "Chỉ kiểm tra xem JSON có đọc được hay không.",
          "JSON hợp lệ mới chứng minh đúng cú pháp. Nó chưa cho biết phạm vi tài nguyên và tập thao tác đã được giới hạn đúng yêu cầu hay chưa.",
        ],
        [
          "Verify GetObject succeeds for an approved releases object.",
          "Xác minh GetObject thành công với đối tượng được phép dưới releases/.",
          "Đây là phép thử cho công việc mà chính sách phải cho làm. Nếu thao tác này thất bại, thiết kế quyền chưa đáp ứng nhu cầu đọc gói phát hành.",
        ],
        [
          "Attach AdministratorAccess before every test.",
          "Gắn AdministratorAccess trước mỗi lần thử.",
          "Quyền quản trị có thể làm thao tác thành công dù chính sách cần kiểm tra đang sai. Kết quả khi đó không còn chứng minh được phạm vi quyền tối thiểu.",
        ],
        [
          "Assume an unrelated production administrator role.",
          "Sử dụng một role quản trị ở môi trường chính thức không liên quan đến bài thử.",
          "Phép thử phải dùng đúng danh tính và phạm vi đang được thiết kế. Chuyển sang role quản trị khác sẽ không xác minh được chính sách của bài.",
        ],
        [
          "Verify GetObject outside the prefix and PutObject are denied.",
          "Xác minh GetObject ngoài releases/ và PutObject đều bị từ chối.",
          "Hai yêu cầu này kiểm tra ranh giới tài nguyên và quyền ghi. Chúng giúp phát hiện trường hợp chính sách cho phép rộng hơn nhu cầu ban đầu.",
        ],
      ],
    },
    {
      en: "A CI deployment can create a Lambda function and pass any role to it. What escalation path should the reviewer consider?",
      vi: "Danh tính CI được tạo hàm Lambda và được giao bất kỳ role nào cho hàm. Khi rà soát bảo mật, cần xem xét khả năng nâng quyền nào?",
      section: "scope",
      answers: [0],
      explanation:
        "Quyền tạo chương trình kết hợp với PassRole quá rộng có thể cho phép chương trình chạy với quyền cao hơn người tạo. Vì vậy, cần đánh giá cả chuỗi hành động chứ không chỉ từng API riêng lẻ.",
      choices: [
        [
          "The function could run with a more privileged execution role.",
          "Hàm có thể chạy với một execution role có quyền cao hơn danh tính CI.",
          "Nếu được giao role quản trị, hàm có thể gọi những API mà CI không được gọi trực tiếp. Cần giới hạn role nào được giao và dịch vụ nào nhận role.",
        ],
        [
          "PassRole automatically forces the role to be read-only.",
          "PassRole tự động buộc role được giao chỉ có quyền đọc.",
          "PassRole kiểm soát việc được giao role nào, không tự sửa nội dung quyền của role đó. Role có quyền rộng vẫn giữ những quyền được cấp theo chính sách.",
        ],
        [
          "Lambda never uses execution roles.",
          "Lambda không bao giờ sử dụng execution role.",
          "Lambda sử dụng execution role để truy cập các dịch vụ AWS. Vì vậy, quyền chọn role cho hàm là một phần quan trọng của đánh giá nâng quyền.",
        ],
        [
          "A role description prevents privilege escalation.",
          "Phần mô tả role tự ngăn được việc nâng quyền.",
          "Mô tả là thông tin quản trị, không phải cơ chế kiểm soát iam:PassRole. Việc hạn chế phải được thể hiện bằng chính sách và điều kiện áp dụng.",
        ],
      ],
    },
    {
      en: "The engineer adds a second Allow statement after an explicit Deny and expects access to recover. Why does this fail?",
      vi: "Kỹ sư thêm một statement Allow phía sau Deny rõ ràng và cho rằng quyền truy cập sẽ được khôi phục. Vì sao cách này không hiệu quả?",
      section: "request",
      answers: [2],
      explanation:
        "IAM không dùng quy tắc dòng cuối ghi đè. Nếu Deny vẫn áp dụng cho yêu cầu, thêm Allow ở vị trí nào cũng chưa làm yêu cầu được phép.",
      choices: [
        [
          "JSON policies require Deny to appear last.",
          "Chính sách JSON bắt buộc phải đặt Deny ở cuối.",
          "Thứ tự statement không quyết định quyền ưu tiên của Deny. Đưa Deny lên đầu hoặc xuống cuối không đổi nguyên tắc đánh giá này.",
        ],
        [
          "Only inline policies support Allow.",
          "Chỉ chính sách inline mới hỗ trợ Allow.",
          "Cả chính sách inline và managed policy đều có thể khai báo Allow. Loại chính sách không giải thích được việc Deny vẫn chặn yêu cầu.",
        ],
        [
          "An applicable explicit Deny overrides the Allow regardless of ordering.",
          "Deny áp dụng được ưu tiên hơn Allow, bất kể vị trí các statement.",
          "Cần kiểm tra lệnh cấm và điều kiện của nó. Thêm một Allow trùng hoặc rộng hơn không loại bỏ Deny đang có hiệu lực.",
        ],
        [
          "The policy must be converted into YAML.",
          "Cần chuyển chính sách sang định dạng YAML.",
          "Đổi cách trình bày không làm thay đổi ý nghĩa của chính sách. Vấn đề nằm ở quy tắc xét quyền, không phải thứ tự hoặc định dạng văn bản.",
        ],
      ],
    },
    {
      en: "A member-account role has AdministratorAccess but an SCP denies disabling CloudTrail. Can the role disable it?",
      vi: "Một role trong tài khoản thành viên có AdministratorAccess, nhưng SCP đang cấm tắt CloudTrail. Role đó có thể tắt CloudTrail không?",
      section: "evaluation",
      answers: [1],
      explanation:
        "SCP áp dụng đặt giới hạn ở cấp tổ chức đối với role này. AdministratorAccess không bỏ qua được một Deny của SCP đang có hiệu lực.",
      choices: [
        [
          "Yes, managed administrator policies override SCPs.",
          "Có, vì chính sách quản trị do AWS quản lý được ưu tiên hơn SCP.",
          "Tên hoặc nguồn quản lý của AdministratorAccess không khiến nó vượt qua SCP. Các giới hạn cấp tổ chức vẫn phải được xét.",
        ],
        [
          "No, the applicable SCP deny restricts the role.",
          "Không, vì Deny của SCP đang áp dụng cho role.",
          "Role bị giới hạn bởi SCP dù đã có quyền rộng trong tài khoản. Muốn phân tích kết quả, phải xét cả lớp chính sách tổ chức này.",
        ],
        [
          "Yes, if the role is used from the CLI.",
          "Có, nếu gọi lệnh qua AWS CLI.",
          "CLI và giao diện quản trị đều gửi yêu cầu đến API AWS. Dùng công cụ khác không giúp bỏ qua quá trình kiểm tra quyền.",
        ],
        [
          "Only if the trail logs to the same Region.",
          "Chỉ được nếu trail ghi nhật ký trong cùng Region.",
          "Tình huống không nêu điều kiện khu vực nào loại bỏ lệnh cấm. Việc lưu nhật ký cùng khu vực không tự vô hiệu hóa Deny của SCP.",
        ],
      ],
    },
    {
      en: "Which TWO statements about policy analysis are accurate? (Choose TWO.)",
      vi: "Hai nhận định nào đúng khi kiểm tra chính sách IAM? Chọn HAI đáp án.",
      section: "validation",
      answers: [0, 3],
      explanation:
        "Công cụ kiểm tra và mô phỏng giúp phát hiện lỗi, nhưng kết quả phải được hiểu trong phạm vi của công cụ. Cần đối chiếu cả điều kiện của yêu cầu thực tế và các lớp chính sách đang áp dụng.",
      choices: [
        [
          "Access Analyzer policy validation can identify syntax and security issues.",
          "Access Analyzer có thể phát hiện lỗi cú pháp và vấn đề bảo mật trong chính sách.",
          "Kiểm tra chính sách trước khi sử dụng giúp tìm những khai báo sai hoặc tiềm ẩn rủi ro. Đây là chức năng phù hợp của Access Analyzer policy validation.",
        ],
        [
          "A clean validation result proves every application API call will succeed.",
          "Không có cảnh báo khi kiểm tra nghĩa là mọi API của ứng dụng chắc chắn sẽ thành công.",
          "Chính sách đúng cú pháp vẫn có thể thiếu thao tác mà ứng dụng cần gọi, hoặc yêu cầu còn bị giới hạn bởi chính sách khác. Kết quả kiểm tra chưa chứng minh toàn bộ luồng chạy thật.",
        ],
        [
          "Simulator results eliminate all need to inspect resource policies.",
          "Kết quả mô phỏng khiến việc xem chính sách của tài nguyên không còn cần thiết.",
          "Mô phỏng có phạm vi và giới hạn riêng. Với luồng truy cập thật, bạn vẫn cần xem các chính sách tài nguyên và ngữ cảnh liên quan.",
        ],
        [
          "Test the effective request context, including conditions and applicable guardrails.",
          "Cần thử trong ngữ cảnh yêu cầu thực tế, gồm điều kiện và những lớp giới hạn đang áp dụng.",
          "Cùng một thao tác có thể được phép trong ngữ cảnh này nhưng bị từ chối trong ngữ cảnh khác. Kiểm tra đúng điều kiện mới giúp kết luận về yêu cầu cần thực hiện.",
        ],
        [
          "Temporary credentials are safe to print in public build logs.",
          "Thông tin xác thực tạm thời có thể được in an toàn trong nhật ký build công khai.",
          "Thông tin tạm thời vẫn cho phép truy cập trong thời gian còn hiệu lực. Việc ghi công khai có thể làm lộ quyền truy cập, dù nó sẽ hết hạn sau đó.",
        ],
      ],
    },
    {
      en: "AssumeRole succeeds, but the next GetCallerIdentity still shows the source role. What should the engineer fix?",
      vi: "AssumeRole thành công, nhưng gọi GetCallerIdentity ngay sau đó vẫn thấy role nguồn. Bạn cần sửa phần nào?",
      section: "trust",
      answers: [3],
      explanation:
        "Gọi AssumeRole không tự đổi thông tin xác thực của mọi SDK client hoặc CLI profile đang dùng. Những yêu cầu tiếp theo phải được ký bằng thông tin mà STS trả về cho phiên role đích.",
      choices: [
        [
          "Make the bucket public.",
          "Mở bucket thành công khai.",
          "Mở tài nguyên công khai không sửa việc ứng dụng đang gửi yêu cầu bằng sai danh tính. Đây còn là thay đổi quyền không cần thiết cho bài toán.",
        ],
        [
          "Add more permissions to the target trust statement.",
          "Bổ sung thêm quyền vào statement tin cậy của role đích.",
          "AssumeRole đã được chấp nhận nên sự cố được mô tả xảy ra sau bước tin cậy. Cần kiểm tra client đang dùng bộ thông tin xác thực nào.",
        ],
        [
          "Rename the role session.",
          "Đổi tên phiên truy cập của role.",
          "Tên phiên giúp theo dõi hoạt động, không tự chuyển SDK client sang thông tin xác thực mới. Đổi tên không thay danh tính ký yêu cầu tiếp theo.",
        ],
        [
          "Use the assumed-role credentials in the SDK client or selected profile.",
          "Cấu hình SDK client hoặc profile sử dụng thông tin xác thực của phiên role đích.",
          "Sau khi dùng access key, secret key và session token do STS trả về, yêu cầu mới được thực hiện dưới phiên role đích. GetCallerIdentity giúp xác nhận sự chuyển đổi này.",
        ],
      ],
    },
    {
      en: "A machine role is denied after a policy requires aws:MultiFactorAuthPresent=true. What is the design issue?",
      vi: "Một role dùng cho chương trình bị từ chối sau khi chính sách yêu cầu aws:MultiFactorAuthPresent=true. Vấn đề trong thiết kế là gì?",
      section: "scope",
      answers: [0],
      explanation:
        "Điều kiện quyền phải phù hợp với cách danh tính được xác thực. Một chương trình chạy tự động thường không cung cấp ngữ cảnh MFA tương tác như người dùng, nên điều kiện này có thể chặn chính luồng cần cho phép.",
      choices: [
        [
          "The condition assumes an MFA context the workload request does not provide.",
          "Điều kiện yêu cầu thông tin MFA mà yêu cầu của chương trình không cung cấp.",
          "Cần chọn cơ chế tin cậy và điều kiện phù hợp với danh tính máy. Không nên áp nguyên một điều kiện xác thực dành cho người dùng rồi mặc định chương trình sẽ đáp ứng.",
        ],
        [
          "Every EC2 role has MFA=true by default.",
          "Mọi role của EC2 đều mặc định có MFA=true.",
          "Sử dụng role gắn với EC2 không đồng nghĩa đã có bước MFA tương tác. Không thể suy ra khóa ngữ cảnh MFA chỉ từ việc ứng dụng chạy trên EC2.",
        ],
        [
          "MFA context is determined by the EC2 instance size.",
          "Thông tin MFA được xác định bởi kích thước máy EC2.",
          "Kích thước máy mô tả tài nguyên tính toán, không phải cách xác thực yêu cầu. Thay loại máy không cung cấp được thông tin MFA đang thiếu.",
        ],
        [
          "Changing the S3 object name enables MFA.",
          "Đổi tên đối tượng S3 sẽ bật MFA.",
          "Tên đối tượng là thông tin tài nguyên, không phải cơ chế xác thực danh tính. Đổi tên không tạo ra ngữ cảnh MFA cho yêu cầu.",
        ],
      ],
    },
    {
      en: "A source role was deleted and recreated under the same name. Target trust now shows an unknown principal ID. What explains the failure?",
      vi: "Role nguồn đã bị xóa rồi tạo lại cùng tên. Chính sách tin cậy ở tài khoản đích giờ hiển thị một principal ID không còn nhận diện được. Điều gì giải thích lỗi này?",
      section: "trust",
      answers: [2],
      explanation:
        "IAM có thể lưu liên kết tới một principal bằng ID duy nhất của nó. Role được tạo lại có ID mới dù dùng lại tên cũ, nên liên kết tin cậy tới danh tính đã xóa cần được cập nhật.",
      choices: [
        [
          "Trust policies cannot contain IAM roles.",
          "Chính sách tin cậy không thể khai báo IAM role làm chủ thể.",
          "IAM hỗ trợ role làm principal trong chính sách tin cậy. Việc từng khai báo role không phải nguyên nhân lỗi của tình huống này.",
        ],
        [
          "Role names are reused with the same immutable principal identity.",
          "Dùng lại tên role nghĩa là dùng lại chính danh tính bất biến trước đó.",
          "Tên có thể được dùng lại, nhưng tài nguyên mới không phải danh tính đã bị xóa. Không nên đồng nhất chuỗi tên ARN với principal ID bên dưới.",
        ],
        [
          "The trust references the deleted role identity and must be updated.",
          "Chính sách tin cậy đang tham chiếu danh tính của role đã xóa và cần được cập nhật.",
          "Đây là lý do ARN nhìn quen thuộc nhưng quan hệ tin cậy không còn hoạt động như trước. Hãy kiểm tra và cập nhật về đúng role mới.",
        ],
        [
          "All STS sessions are globally disabled after any role deletion.",
          "Xóa bất kỳ role nào cũng làm mọi phiên STS trên toàn cầu bị vô hiệu hóa.",
          "Sự cố đang liên quan đến liên kết của một role cụ thể. Không có căn cứ suy ra một hành vi vô hiệu hóa toàn bộ phiên STS như phương án mô tả.",
        ],
      ],
    },
    {
      en: "Which TWO observations distinguish iam:PassRole from sts:AssumeRole? (Choose TWO.)",
      vi: "Hai nhận định nào phân biệt đúng iam:PassRole với sts:AssumeRole? Chọn HAI đáp án.",
      section: "scope",
      answers: [1, 4],
      explanation:
        "AssumeRole giúp bên gọi nhận thông tin xác thực tạm thời cho một phiên role. PassRole kiểm soát việc giao role cho dịch vụ AWS sử dụng; đây là hai quyền khác nhau và cần được giới hạn theo đúng mục đích.",
      choices: [
        [
          "PassRole returns a new access key and session token.",
          "PassRole trả về access key và session token mới.",
          "iam:PassRole không có chức năng cấp bộ thông tin xác thực cho bên gọi. Cơ chế nhận phiên role tạm thời thuộc về STS AssumeRole.",
        ],
        [
          "AssumeRole obtains temporary credentials for a role session.",
          "AssumeRole cấp thông tin xác thực tạm thời cho một phiên role.",
          "Bên gọi sử dụng thông tin STS trả về để gửi các yêu cầu tiếp theo dưới danh tính phiên role, trong phạm vi quyền có hiệu lực.",
        ],
        [
          "PassRole can be ignored whenever CreateFunction is allowed.",
          "Có quyền CreateFunction thì không cần xem xét PassRole.",
          "Khi tạo hàm với execution role, cần kiểm tra quyền giao role đó cho Lambda. Chỉ được tạo hàm chưa có nghĩa được chọn bất kỳ role nào.",
        ],
        [
          "Both actions always use identical policy resources and conditions.",
          "Hai thao tác luôn sử dụng cùng loại tài nguyên và điều kiện chính sách.",
          "Đây là hai thao tác khác mục đích nên phải kiểm tra các tài nguyên và điều kiện được từng thao tác hỗ trợ. Không thể thay thế chính sách của thao tác này bằng thao tác kia.",
        ],
        [
          "PassRole controls which role a caller may assign to an AWS service.",
          "PassRole kiểm soát role nào người gọi được giao cho một dịch vụ AWS.",
          "Giới hạn này giúp ngăn việc giao một role quá mạnh cho chương trình hoặc dịch vụ mà người gọi có thể cấu hình. Nên giới hạn cả role đích và dịch vụ nhận role.",
        ],
      ],
    },
    {
      en: "An auditor sees CloudTrail Event history but no S3 GetObject records. Which explanation should be considered?",
      vi: "Kiểm toán viên xem CloudTrail Event history nhưng không tìm thấy các lần S3 GetObject. Cần xem xét nguyên nhân nào?",
      section: "validation",
      answers: [0],
      explanation:
        "Đọc đối tượng S3 thuộc nhóm data events, tức sự kiện truy cập dữ liệu. Event history dành cho sự kiện quản lý không tự chứa toàn bộ thao tác đọc đối tượng; cần cấu hình ghi đúng loại sự kiện và phạm vi tài nguyên.",
      choices: [
        [
          "S3 object data events must be configured in an appropriate trail or event data store.",
          "Cần cấu hình S3 object data events trên trail hoặc event data store phù hợp.",
          "CloudTrail có thể ghi thao tác trên đối tượng khi bạn chọn đúng loại sự kiện và tài nguyên cần theo dõi. Đây là cấu hình nên kiểm tra khi thiếu các lần GetObject.",
        ],
        [
          "GetObject can never be audited.",
          "GetObject không bao giờ có thể được ghi nhận để kiểm toán.",
          "CloudTrail có hỗ trợ sự kiện dữ liệu trên đối tượng S3. Vấn đề cần kiểm tra là cấu hình ghi nhận, không phải kết luận dịch vụ không hỗ trợ.",
        ],
        [
          "GetObject is always a global management event.",
          "GetObject luôn là sự kiện quản lý toàn cục.",
          "GetObject truy cập nội dung đối tượng, thuộc hoạt động dữ liệu trên S3. Nhầm nó với sự kiện quản lý sẽ khiến bạn tìm sai nơi và cấu hình sai loại nhật ký.",
        ],
        [
          "CloudTrail records only successful root logins.",
          "CloudTrail chỉ ghi những lần đăng nhập root thành công.",
          "CloudTrail ghi nhiều loại hoạt động API và sự kiện khác nhau. Phạm vi của dịch vụ không chỉ giới hạn ở đăng nhập root.",
        ],
      ],
    },
    {
      en: "A reviewer says permissions are always the intersection of every policy, including all same-account resource grants. What should the engineer clarify?",
      vi: "Một người rà soát cho rằng quyền luôn là phần giao của tất cả chính sách, kể cả mọi cách cấp quyền qua tài nguyên trong cùng tài khoản. Bạn cần làm rõ điều gì?",
      section: "evaluation",
      answers: [3],
      explanation:
        "Quy tắc đánh giá phụ thuộc vào cách cấp quyền và loại chủ thể nhận quyền. Không nên dùng một công thức đơn giản để kết luận cho mọi trường hợp của chính sách gắn với tài nguyên.",
      choices: [
        [
          "Resource policies never grant permissions.",
          "Chính sách của tài nguyên không bao giờ cấp quyền.",
          "Chính sách gắn với tài nguyên là một nguồn cấp quyền quan trọng. Bỏ qua nó sẽ khiến phân tích quyền thiếu một phần của luồng truy cập.",
        ],
        [
          "Explicit Deny never affects role sessions.",
          "Explicit Deny không bao giờ ảnh hưởng đến phiên role.",
          "Một Deny áp dụng vẫn có thể chặn yêu cầu của phiên role. Không thể mặc định rằng nhận được phiên STS là đã bỏ qua các lệnh cấm.",
        ],
        [
          "SCPs always grant access directly.",
          "SCP luôn trực tiếp cấp quyền truy cập.",
          "SCP đặt giới hạn cho các quyền có thể sử dụng trong phạm vi áp dụng. Nó không thay thế nguồn cấp quyền cho thao tác muốn thực hiện.",
        ],
        [
          "Evaluation depends on the grant and principal type; role-session grants have important differences.",
          "Cách đánh giá phụ thuộc kiểu cấp quyền và loại principal; cấp trực tiếp cho phiên role có những khác biệt cần xét.",
          "Cần phân biệt ARN của IAM role với ARN của phiên role và đọc các lớp giới hạn theo đúng trường hợp. Chính những khác biệt này khiến công thức tổng quát trong đề chưa đủ chính xác.",
        ],
      ],
    },
    {
      en: "A deployment gets AccessDenied immediately after an IAM change. Which investigation is most defensible?",
      vi: "Lệnh triển khai nhận AccessDenied ngay sau khi sửa quyền IAM. Cách điều tra nào có cơ sở nhất?",
      section: "validation",
      answers: [1],
      explanation:
        "Thay đổi IAM có thể cần thời gian cập nhật, nhưng không phải mọi lỗi đều do độ trễ. Hãy xác nhận yêu cầu thực tế và các chính sách liên quan, rồi thử lại một cách có giới hạn thay vì mở rộng quyền để bỏ qua lỗi.",
      choices: [
        [
          "Assume every denial is eventual consistency and stop investigating.",
          "Cho rằng mọi lần bị từ chối đều do độ trễ cập nhật và ngừng điều tra.",
          "Ứng dụng vẫn có thể thiếu quyền, dùng sai danh tính hoặc gặp Deny thực sự. Chỉ chờ đợi sẽ không giải quyết những nguyên nhân đó.",
        ],
        [
          "Confirm the caller and request, inspect applicable policies, and allow for propagation while retesting bounded cases.",
          "Xác nhận danh tính, thao tác và tài nguyên; xem các chính sách áp dụng, đồng thời tính đến độ trễ khi thử lại các trường hợp đã xác định.",
          "Cách này kết hợp đặc tính cập nhật của IAM với bằng chứng cụ thể của yêu cầu. Nhờ đó, bạn có thể phân biệt độ trễ tạm thời với lỗi thiết kế quyền.",
        ],
        [
          "Remove all SCPs from the organization.",
          "Gỡ toàn bộ SCP khỏi tổ chức.",
          "Đây là thay đổi phạm vi lớn khi chưa xác định SCP nào có liên quan. Nó có thể làm mất các giới hạn bảo mật mà không sửa đúng nguyên nhân.",
        ],
        [
          "Publish the temporary credentials so others can test them.",
          "Công khai thông tin xác thực tạm thời để người khác thử giúp.",
          "Thông tin xác thực vẫn có thể được sử dụng khi còn hiệu lực. Làm lộ chúng tạo thêm rủi ro truy cập và không phải cách chia sẻ dữ liệu điều tra phù hợp.",
        ],
      ],
    },
  ],
);
