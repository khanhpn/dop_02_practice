import { lesson } from '../domain4/author';

export const d6l05 = lesson({
  id: 'd6-l05', number: 66, domainId: 6, chapterId: '6.2',
  title: 'Tự động hóa bảo vệ dữ liệu: KMS, SSE-KMS và ACM',
  summary: 'Thiết kế encryption từ yêu cầu dữ liệu, quyền dùng key và vòng đời certificate; phân biệt cấu hình mặc định với enforcement thực sự.',
  duration: 70,
  objectives: ['Phân biệt các loại key và envelope encryption.', 'Chẩn đoán SSE-KMS cross-account qua S3 và KMS policies.', 'Quản lý rotation, deletion và ACM renewal theo vòng đời dữ liệu/dịch vụ.'],
  prerequisites: ['Nắm IAM policy evaluation và resource policy.', 'Biết S3 object, HTTPS/TLS và ALB ở mức Associate.'],
  sections: [
    { id: 'd6-l05-classification', title: '1. Bắt đầu từ dữ liệu và đường đi', paragraphs: [
      'Data classification (phân loại dữ liệu) xác định thông tin nào nhạy cảm, ai được đọc, bao lâu phải giữ và cần audit ra sao. Encryption at rest (mã hóa khi lưu) bảo vệ dữ liệu trong tầng lưu; encryption in transit (mã hóa khi truyền) bảo vệ kết nối qua TLS. Cấu hình SSE-KMS cho S3 không tự chuyển mọi client HTTP thành HTTPS, và listener HTTPS trên ALB không tự mã hóa EBS hoặc bucket. Vẽ từng chặng client → load balancer → application → storage để chọn control cho mỗi chặng. Đừng dùng một nhãn encrypted chung để bỏ qua một hop còn plaintext.',
      'Default encryption (mã hóa mặc định) giúp các writes mới được bảo vệ khi client không chỉ định khác, nhưng enforcement (bắt buộc tuân thủ) còn cần policy và audit. Với S3, mặc định bucket không tự mã hóa lại toàn bộ object cũ bằng key vừa chọn. Nếu quy định yêu cầu một customer key cụ thể, phải xét requests có header/key khác và các ngoại lệ tích hợp. Một policy deny thiếu header có thể vô tình chặn client vốn dựa vào bucket default, nên viết rule đúng yêu cầu thực tế và test các paths. Dọn dữ liệu thử cũng cần xét versioning, replication và retention trước khi kết luận không còn bản sao nhạy cảm.'
    ] },
    { id: 'd6-l05-envelope', title: '2. Envelope encryption và quyền quản trị khóa', paragraphs: [
      'Envelope encryption (mã hóa phong bì) dùng data key (khóa dữ liệu) để mã hóa payload và dùng KMS key để bảo vệ data key. Dịch vụ như S3 thực hiện tích hợp này, không gửi mọi gigabyte object qua KMS Encrypt trực tiếp. Khi đọc, quyền S3 GetObject chưa đủ nếu object cần KMS Decrypt mà caller không được cho phép. AWS owned keys thuộc dịch vụ, AWS managed keys có phạm vi/lifecycle do AWS quản lý, còn customer managed keys cho khách hàng kiểm soát policy, grants, rotation và deletion. Chọn theo yêu cầu quản trị, chia sẻ và audit, không chỉ theo việc có chữ KMS trong tên.',
      'Key administrator (người quản trị khóa) và key user (người sử dụng khóa) nên được phân tách theo nhiệm vụ. Người sửa policy có thể tạo đường cấp quyền mới nên cần kiểm soát thay đổi, dù không trực tiếp có Decrypt ban đầu. Encryption context (ngữ cảnh mã hóa) là additional authenticated data (dữ liệu xác thực bổ sung), có thể ràng buộc key usage và phải khớp khi giải mã trong các API liên quan. Nó không phải secret; có thể xuất hiện trong log audit, vì vậy không đặt password hoặc dữ liệu nhạy cảm trong context. Kiểm service context thực tế trước khi viết điều kiện quá hẹp, đặc biệt khi đổi chế độ tích hợp như S3 Bucket Keys.'
    ] },
    { id: 'd6-l05-cross-account', title: '3. SSE-KMS và cross-account cần hai lớp quyền', paragraphs: [
      'Với caller ở account A đọc object SSE-KMS của account B, kiểm cả quyền S3 và quyền dùng key. Bucket policy/identity policy phải cho path đọc theo cơ chế cross-account, còn customer KMS key policy ở B và IAM phía A phải cho KMS operations cần thiết. Không thể sửa AWS managed key policy theo ý mình để chia sẻ tùy ý tài nguyên đã mã hóa bằng key đó sang account khác; thiết kế customer managed key khi cần mô hình chia sẻ tương ứng. Dùng full key ARN theo tích hợp để tránh alias được resolve ở account ngoài dự kiến. AccessDenied có thể đến từ S3 hoặc KMS; xem request/action và CloudTrail phù hợp.',
      'Permissions phụ thuộc operation: SSE-KMS upload thường cần GenerateDataKey; download cần Decrypt; multipart workflow có thể cần các quyền bổ sung theo tài liệu S3. Một grant chỉ cho Encrypt không phải tập quyền mặc định đúng cho mọi API storage. S3 Bucket Keys có thể giảm số request tới KMS cho SSE-KMS, nhưng không thay việc kiểm soát quyền và không bảo đảm mọi audit event KMS giống cấu hình trước đó. Nếu key policy condition dựa encryption context của object ARN, cần đối chiếu context thực tế khi Bucket Keys dùng bucket-level context. Tối ưu chi phí không được làm chính sách âm thầm loại bỏ hoặc cấp rộng ngoài ý định.'
    ] },
    { id: 'd6-l05-lifecycle', title: '4. Rotation khác replacement và deletion', paragraphs: [
      'Automatic rotation (xoay key material tự động) trong logical KMS key giữ key identity và khả năng dùng vật liệu cũ để giải mã ciphertext cũ theo cơ chế được hỗ trợ. Nó không tự rewrite toàn bộ object storage thành ciphertext mới. Manual replacement (thay key resource) bằng ARN khác cần kế hoạch chuyển writes mới, giữ quyền đọc dữ liệu cũ và có thể copy/re-encrypt nếu yêu cầu thật sự cần. Alias là con trỏ; chuyển alias sang key mới không đổi key đã bảo vệ ciphertext trước đó. Học theo vòng đời ciphertext thay vì chỉ vòng đời tên alias sẽ tránh nhiều quyết định mất dữ liệu.',
      'Disable key là thao tác vận hành có thể khiến dữ liệu phụ thuộc không đọc được dù bucket và IAM vẫn còn. Schedule deletion (lên lịch xóa) có waiting period (thời gian chờ) theo dịch vụ nhưng không phải bản backup key độc lập sau khi đã xóa. Inventory snapshots, backups, log archives, replicas và object versions trước khi nghỉ dùng một key. KMS multi-Region keys (khóa đa Region) có related key material nhưng policy, alias, grants và trạng thái là thành phần Regional phải quản lý; không giả định replica key tự sao mọi quyền hoặc mọi dịch vụ tự dùng được ARN bất kỳ Region. Kiểm DR bằng đọc lại dữ liệu, không chỉ kiểm replica resource tồn tại.'
    ] },
    { id: 'd6-l05-certificates', title: '5. ACM, TLS và tự động hóa vòng đời certificate', paragraphs: [
      'AWS Certificate Manager, viết tắt ACM, quản lý certificates (chứng thư) để tích hợp TLS với các dịch vụ được hỗ trợ. Với ACM-issued public certificate đủ điều kiện managed renewal, giữ domain validation (xác minh domain) hợp lệ và liên kết sử dụng cần thiết; DNS validation CNAME không nên bị xóa ngay sau phát hành. Imported certificate (chứng thư nhập) có trách nhiệm renewal khác: không được giả định ACM tự gia hạn như chứng thư do ACM phát hành. Theo dõi expiry (hết hạn), renewal status và thông báo cần hành động trước khi người dùng gặp lỗi TLS.',
      'Certificate Region phải phù hợp tích hợp: ALB cần certificate trong Region tương ứng, còn CloudFront có yêu cầu ACM certificate Region riêng cho viewer TLS. Không copy logic của một dịch vụ cho mọi dịch vụ. HTTPS từ client tới ALB chỉ bảo vệ chặng đó; backend HTTPS hoặc mạng/identity controls cần được thiết kế theo threat model. Automation nên quản lý certificate validation records, listener associations, renewability checks và alarm expiry bằng IaC/quy trình có chủ sở hữu. KMS và ACM cùng hỗ trợ bảo vệ dữ liệu nhưng giải quyết các lớp khác nhau: KMS key không thay server certificate có tên miền đúng, và certificate TLS không kiểm soát ai được đọc object đã lưu.'
    ] }
  ],
  diagram: { title: 'Bảo vệ dữ liệu theo từng lớp', steps: [
    { label: 'Phân loại và vẽ luồng', detail: 'Ghi người được đọc, thời gian giữ và từng hop truyền/lưu.' },
    { label: 'Chọn key/certificate', detail: 'Customer key khi cần kiểm soát/chia sẻ; ACM cho TLS tích hợp.' },
    { label: 'Áp defaults và policies', detail: 'Bucket defaults, IAM/key policy và TLS enforcement có mục tiêu riêng.' },
    { label: 'Kiểm chứng đường đọc/ghi', detail: 'Test caller hợp lệ, caller sai, object cũ và cross-account.' },
    { label: 'Vòng đời', detail: 'Rotation/renewal, inventory phụ thuộc và DR retrieval trước deletion.' }
  ], caption: 'Encryption chỉ có giá trị vận hành khi dữ liệu vẫn đọc được bởi đúng principal trong suốt nghĩa vụ lưu giữ.' },
  scenarios: [
    { title: 'S3 Allow nhưng đọc SSE-KMS vẫn bị cấm', context: 'Role phân tích A đã có bucket permission ở B; GetObject SSE-KMS vẫn AccessDenied.', solution: 'Kiểm KMS key ARN, key policy B và IAM Decrypt A, cùng context/deny áp dụng. Không mở bucket public để né key authorization.', tradeoff: 'Chia sẻ customer key cần quản trị policy và audit rõ hơn nhưng đáp ứng phạm vi cross-account có kiểm soát.' },
    { title: 'Gia hạn TLS bị hỏng sau dọn DNS', context: 'Certificate ACM-issued từng được DNS validate nhưng CNAME bị xóa sau khi cấp; team dựa vào auto-renew.', solution: 'Khôi phục validation record phù hợp, kiểm renewal eligibility/status và listener association; thiết lập quản lý record bằng IaC và alert cần can thiệp.', tradeoff: 'Giữ record và giám sát vòng đời thêm tài nguyên/quy trình nhưng giảm rủi ro hết hạn do nhầm validation chỉ cần một lần.' }
  ],
  keyTakeaways: ['At rest và in transit bảo vệ các chặng khác nhau.', 'Default encryption không tự re-encrypt object cũ hoặc thay mọi enforcement policy.', 'SSE-KMS cần cả quyền storage lẫn quyền key phù hợp.', 'Alias switch/rotation/deletion là ba hành vi khác nhau.', 'ACM renewal phụ thuộc loại certificate, validation và tích hợp.'],
  examTraps: ['Cho rằng GetObject Allow tự bao gồm kms:Decrypt.', 'Dùng AWS managed key khi cần tùy chỉnh cross-account key policy.', 'Đưa secret vào encryption context.', 'Xóa key cũ ngay sau khi đổi alias.', 'Cho rằng imported certificate tự renew và mọi service dùng certificate cùng Region.'],
  code: { title: 'S3 default SSE-KMS với customer key có sẵn (snippet)', deployable: false,
    cloudformation: `Parameters:
  DataKeyArn:
    Type: String
Resources:
  DataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms
              KMSMasterKeyID: !Ref DataKeyArn
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true`,
    terraform: `variable "data_key_arn" { type = string }
resource "aws_s3_bucket" "data" {}
resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = var.data_key_arn
    }
  }
}
resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}`,
    explanation: 'Chưa tạo key/key policy, IAM đọc/ghi, TLS deny policy, lifecycle hoặc migration dữ liệu cũ. Hai đoạn mô tả default và public-access block, không tuyên bố đã cưỡng chế mọi request dùng một key cụ thể.'
  },
  lab: { title: 'Kiểm tra SSE-KMS bằng object giả và key sandbox có sẵn', duration: 45,
    prerequisites: ['Sandbox, một customer symmetric key cùng Region được quản trị viên cho phép dùng riêng để học; không sửa policy key dùng chung.', 'Quyền tạo bucket lab, PutObject/GetObject/HeadObject và KMS operations cần cho SSE-KMS.', 'Chỉ object giả vài byte; không tạo certificate thật hoặc đổi DNS trong lab này.'],
    cost: 'S3 requests/storage, KMS usage và key hiện có có thể tính phí; không cần EC2. Nếu dùng versioning phải dọn cả versions riêng của lab.',
    steps: [
      { title: 'Xác minh phạm vi key', detail: 'Kiểm STS và DescribeKey để ghi ARN, Region, KeyManager=CUSTOMER, trạng thái Enabled và symmetric usage. Không in key material hoặc thay key policy.', command: 'aws sts get-caller-identity', expected: 'Account/Region sandbox đúng và key phù hợp tác vụ mã hóa được cho phép.' },
      { title: 'Tạo bucket default', detail: 'Tạo bucket riêng với public-access block và default SSE-KMS theo snippet dùng full key ARN. Không bật Object Lock hoặc replication cho lab cơ bản.', expected: 'Default encryption là aws:kms với key dự định; bucket không public.' },
      { title: 'Ghi object giả', detail: 'Upload message giả bằng console hoặc CLI vào proof/sample.txt. Kiểm HeadObject và encryption metadata, không chỉ xem default configuration.', expected: 'Object mới có ServerSideEncryption aws:kms và SSEKMSKeyId trỏ đúng customer key.' },
      { title: 'Đọc và phân tích quyền', detail: 'Đọc object bằng role được duyệt. Sau đó dùng simulator hoặc review policy trên giấy để xác định role có S3 GetObject nhưng thiếu KMS Decrypt sẽ khác thế nào; không sửa key dùng chung để cố gây outage.', expected: 'Đọc thật thành công; ghi được hai lớp quyền và nơi xem AccessDenied tương ứng.' },
      { title: 'Thiết kế lifecycle', detail: 'Không disable/delete key. Liệt kê object versions, backups hoặc archive còn phụ thuộc; giải thích vì sao alias switch không re-encrypt chúng. Rà một ACM imported-vs-issued renewal checklist trên giấy.', expected: 'Có dependency inventory và cách kiểm certificate type/validation/expiry, không khẳng định auto-renew cho mọi loại.' },
      { title: 'Cleanup', detail: 'Xóa exact object và versions nếu bạn bật versioning, xóa bucket chỉ của lab, giữ nguyên key có sẵn và quyền của ứng dụng khác.', expected: 'Không còn bucket/object thử; không có thao tác disable hoặc schedule deletion key dùng chung.' }
    ], cleanup: ['Xóa objects và versions riêng của lab rồi bucket thử.', 'Giữ nguyên KMS key có sẵn; không schedule deletion để dọn một lab dùng chung key.', 'Xóa IAM resources chỉ nếu chính lab đã tạo riêng, không gỡ permissions của workload khác.'],
    challenge: 'Thiết kế bucket policy bắt HTTPS và chỉ cho key được duyệt mà không vô tình chặn client dựa vào bucket default; đưa cả trường hợp header thiếu/sai/đúng vào test matrix.'
  },
  sources: [
    { title: 'KMS key types and concepts', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html' },
    { title: 'KMS key policies', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html' },
    { title: 'KMS key rotation', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html' },
    { title: 'S3 SSE-KMS permissions and behavior', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html' },
    { title: 'ACM managed renewal', url: 'https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html' }
  ], reviewedAt: '2026-10-19'
}, [
  { en: 'An S3 bucket switches its default encryption key. Why do older objects still show their previous key ARN?', vi: 'Bucket S3 đổi default encryption key. Vì sao object cũ vẫn hiện key ARN trước?', section: 'classification', answers: [0], explanation: 'Default ảnh hưởng writes mới, không tự rewrite objects đã có. Migration phải được thiết kế riêng nếu yêu cầu.', choices: [
    ['Changing the default does not automatically re-encrypt existing objects.', 'Đổi default không tự mã hóa lại object hiện có.', 'Đúng: metadata và ciphertext cũ vẫn phụ thuộc key đã dùng khi ghi.'],
    ['The old ARN is only a display cache; the old key can be deleted safely.', 'ARN cũ chỉ là display cache; có thể xóa key cũ an toàn.', 'Sai: không được suy từ việc đổi default rằng phụ thuộc giải mã đã biến mất.'],
    ['Default encryption applies only to Glacier objects.', 'Default encryption chỉ áp cho Glacier objects.', 'Sai: cấu hình áp cho writes mới của bucket theo cơ chế hỗ trợ, không giới hạn như vậy.'],
    ['Enabling versioning immediately re-encrypts all versions.', 'Bật versioning lập tức mã hóa lại mọi version.', 'Sai: versioning quản lý phiên bản, không là tác vụ migration key.'] ] },
  { en: 'A role can GetObject from a cross-account bucket but cannot decrypt its SSE-KMS object. What should be investigated?', vi: 'Role GetObject được cấp ở bucket khác account nhưng không giải mã được SSE-KMS object. Cần điều tra gì?', section: 'cross-account', answers: [2], explanation: 'Storage grant và key grant là hai lớp; cross-account KMS cần key policy và IAM phía caller phù hợp.', choices: [
    ['Only the object content type.', 'Chỉ content type của object.', 'Sai: content type không cấp kms:Decrypt hay thay key policy.'],
    ['Only the bucket default retention period.', 'Chỉ retention mặc định của bucket.', 'Sai: tuổi lưu dữ liệu không giải quyết key authorization.'],
    ['The key ARN, its policy, caller KMS permissions and applicable conditions.', 'Key ARN, key policy, quyền KMS caller và conditions áp dụng.', 'Đúng: xác minh đúng key và các lớp cấp phép dùng key.'],
    ['Enable S3 Transfer Acceleration to bypass KMS authorization.', 'Bật S3 Transfer Acceleration để bỏ qua KMS authorization.', 'Sai: acceleration thay đường truyền, không loại quyền giải mã.'] ] },
  { en: 'A team must customize key policy for controlled sharing with another account. Which KMS key category fits?', vi: 'Đội cần tùy chỉnh key policy để chia sẻ có kiểm soát sang account khác. Loại key nào phù hợp?', section: 'envelope', answers: [1], explanation: 'Customer managed key cho khách hàng quản trị policy/lifecycle; AWS managed key không cho sửa policy tùy ý.', choices: [
    ['An AWS managed service key whose policy the customer will edit.', 'AWS managed service key mà khách hàng sẽ sửa policy.', 'Sai: khách hàng không tùy chỉnh key policy loại này để đáp ứng mô hình chia sẻ.'],
    ['A customer managed KMS key with explicitly scoped permissions.', 'Customer managed KMS key có quyền được giới hạn rõ.', 'Đúng: cho kiểm soát key policy, IAM/grants và audit theo nhu cầu.'],
    ['An AWS owned key whose material will be exported to the partner.', 'AWS owned key sẽ export material cho đối tác.', 'Sai: AWS owned key không do khách hàng quản trị/export theo cách đó.'],
    ['An ACM server certificate used as the S3 data key.', 'ACM server certificate dùng làm S3 data key.', 'Sai: TLS certificate không thay KMS data encryption integration.'] ] },
  { en: 'A design sends a multi-gigabyte S3 object directly to KMS Encrypt. What mechanism should it use instead?', vi: 'Thiết kế gửi S3 object nhiều GB trực tiếp tới KMS Encrypt. Nên dùng cơ chế nào thay thế?', section: 'envelope', answers: [3], explanation: 'Envelope encryption mã hóa payload bằng data key, còn KMS bảo vệ key; dịch vụ tích hợp thực hiện cơ chế đó.', choices: [
    ['Split it into certificates and import them into ACM.', 'Chia dữ liệu thành certificates rồi import ACM.', 'Sai: ACM không là kho mã hóa dữ liệu ứng dụng theo mô hình này.'],
    ['Put the complete plaintext into the KMS encryption context.', 'Đưa toàn bộ plaintext vào encryption context KMS.', 'Sai: context không bí mật và không phải payload mã hóa thay thế.'],
    ['Use the key alias string as a local encryption password.', 'Dùng chuỗi key alias như password mã hóa local.', 'Sai: alias là định danh/con trỏ, không là secret key material.'],
    ['Use envelope encryption, such as the S3 SSE-KMS integration.', 'Dùng envelope encryption như tích hợp S3 SSE-KMS.', 'Đúng: dữ liệu lớn dùng data key, KMS bảo vệ data key.'] ] },
  { en: 'Which TWO controls address different parts of a client-to-storage data path? (Choose TWO.)', vi: 'Hai control nào bảo vệ các phần khác nhau trên đường client tới storage? (Chọn HAI.)', section: 'classification', answers: [0, 4], explanation: 'At-rest và transit encryption độc lập; cấu hình một lớp không tự bảo vệ mọi chặng.', choices: [
    ['TLS on the relevant network connections.', 'TLS trên các kết nối mạng liên quan.', 'Đúng: bảo vệ dữ liệu đang truyền qua hop được thiết lập TLS.'],
    ['Assume SSE-KMS automatically forces all clients to use HTTPS.', 'Cho rằng SSE-KMS tự buộc mọi client dùng HTTPS.', 'Sai: cần transport controls riêng, không suy từ encryption at rest.'],
    ['Use an ACM certificate as a substitute for S3 authorization.', 'Dùng ACM certificate thay S3 authorization.', 'Sai: TLS identity không tự cấp GetObject hay quyền KMS.'],
    ['Assume an HTTPS listener encrypts all storage objects.', 'Cho rằng HTTPS listener mã hóa mọi storage object.', 'Sai: listener chỉ bảo vệ chặng mạng tương ứng.'],
    ['Appropriate server-side or application encryption for persisted data.', 'Mã hóa server-side hoặc ứng dụng phù hợp cho dữ liệu lưu.', 'Đúng: bảo vệ tầng lưu, bổ sung cho TLS thay vì trùng chức năng.'] ] },
  { en: 'A key administrator is separated from data readers. Why must changes to the key policy still be tightly governed?', vi: 'Quản trị key tách khỏi người đọc dữ liệu. Vì sao vẫn phải kiểm soát chặt sửa key policy?', section: 'envelope', answers: [2], explanation: 'Quyền quản trị policy có thể tạo đường cấp quyền sử dụng mới, dù ban đầu không có Decrypt.', choices: [
    ['Key administrators are technically incapable of changing permissions.', 'Quản trị key không thể thay đổi quyền về kỹ thuật.', 'Sai: đó thường là năng lực quan trọng của role quản trị phải được bảo vệ.'],
    ['Separation of duties removes all need to audit policy changes.', 'Tách nhiệm vụ loại mọi nhu cầu audit sửa policy.', 'Sai: separation có giá trị khi thay đổi quyền cũng được kiểm soát.'],
    ['A policy administrator may alter who can use the key.', 'Người quản trị policy có thể đổi ai dùng được key.', 'Đúng: review, audit và phạm vi quản trị giảm đường leo thang quyền.'],
    ['Changing a key alias always destroys historical ciphertext.', 'Đổi key alias luôn phá hủy ciphertext lịch sử.', 'Sai: alias change không tự xóa key hay mã hóa lại ciphertext.'] ] },
  { en: 'A developer places an API secret inside a KMS encryption context for later audit lookup. What is wrong?', vi: 'Developer đặt API secret vào KMS encryption context để tra audit sau. Sai ở đâu?', section: 'envelope', answers: [1], explanation: 'Context là authenticated metadata, không là dữ liệu bí mật được che trong audit.', choices: [
    ['Encryption context is always discarded and cannot affect decryption.', 'Encryption context luôn bị bỏ và không ảnh hưởng giải mã.', 'Sai: context phải khớp trong các thao tác dùng nó và có thể dùng trong policy.'],
    ['Encryption context is not secret and can appear in audit logs.', 'Encryption context không bí mật và có thể xuất hiện trong audit logs.', 'Đúng: dùng định danh không nhạy cảm, không đưa password/token vào context.'],
    ['Context automatically becomes an encrypted S3 object.', 'Context tự thành S3 object được mã hóa.', 'Sai: không có bước lưu dữ liệu bảo mật như vậy.'],
    ['Only asymmetric keys can have metadata.', 'Chỉ asymmetric key có metadata.', 'Sai: không phải lý do sai của việc đặt secret vào context.'] ] },
  { en: 'A bucket policy denies every upload without an encryption header, while clients rely on the bucket SSE-KMS default. What must be tested?', vi: 'Bucket policy Deny mọi upload thiếu encryption header nhưng client dựa vào SSE-KMS default. Cần test gì?', section: 'classification', answers: [0], explanation: 'Thiếu header có thể là đường hợp lệ dùng default; policy phải match yêu cầu thật và không vô tình cấm đường này.', choices: [
    ['Header-absent, correct-header and wrong-key paths against the intended policy.', 'Các path thiếu header, header đúng và key sai theo policy dự định.', 'Đúng: phân biệt defaults với explicit-header enforcement và các tích hợp.'],
    ['Only whether an existing old object can be downloaded.', 'Chỉ xem object cũ có download được không.', 'Sai: download cũ không kiểm authorization cho upload thiếu header.'],
    ['Assume bucket defaults bypass all explicit Deny statements.', 'Cho rằng bucket default bypass mọi explicit Deny.', 'Sai: explicit Deny áp dụng vẫn có thể chặn request dù encryption default hợp lệ.'],
    ['Remove all encryption and test only public ACLs.', 'Bỏ mọi encryption và chỉ thử public ACL.', 'Sai: không còn kiểm yêu cầu bảo vệ dữ liệu đang thiết kế.'] ] },
  { en: 'Which TWO observations about automatic KMS rotation are accurate? (Choose TWO.)', vi: 'Hai nhận xét nào về automatic rotation KMS là chính xác? (Chọn HAI.)', section: 'lifecycle', answers: [1, 3], explanation: 'Rotation thay vật liệu trong key identity được hỗ trợ, không là migration rewrite dữ liệu.', choices: [
    ['It changes every encrypted object into new ciphertext immediately.', 'Nó lập tức biến mọi object mã hóa thành ciphertext mới.', 'Sai: dịch vụ không tự rewrite toàn bộ dữ liệu chỉ vì xoay key material.'],
    ['The logical key identity remains stable under supported automatic rotation.', 'Logical key identity giữ ổn định khi automatic rotation được hỗ trợ.', 'Đúng: khác tạo key resource mới với ARN khác.'],
    ['It makes all old key material unavailable immediately.', 'Nó làm mọi key material cũ không dùng được ngay.', 'Sai: cơ chế giữ khả năng giải mã ciphertext cũ là phần thiết kế rotation.'],
    ['Older ciphertext remains decryptable with retained historical material.', 'Ciphertext cũ vẫn giải mã được nhờ vật liệu lịch sử được giữ.', 'Đúng: với key còn khả dụng và quyền hợp lệ theo cơ chế hỗ trợ.'],
    ['It grants every account decrypt access automatically.', 'Nó tự cấp mọi account quyền decrypt.', 'Sai: rotation không thay authorization theo cách đó.'] ] },
  { en: 'A key alias is moved to a new KMS key ARN. Why must the old key remain until dependent archives are handled?', vi: 'Alias chuyển sang KMS key ARN mới. Vì sao phải giữ key cũ tới khi xử lý archive phụ thuộc?', section: 'lifecycle', answers: [2], explanation: 'Ciphertext lịch sử được bảo vệ bằng key thực cũ, không chỉ tên alias hiện tại.', choices: [
    ['Aliases contain backup copies of every object.', 'Aliases chứa bản backup mọi object.', 'Sai: alias là định danh trỏ key, không chứa dữ liệu payload.'],
    ['S3 always resolves old ciphertext against the newest alias target.', 'S3 luôn giải old ciphertext bằng alias target mới nhất.', 'Sai: đổi alias không thay phụ thuộc key của dữ liệu đã mã hóa.'],
    ['The alias switch does not re-encrypt historical data.', 'Chuyển alias không mã hóa lại dữ liệu lịch sử.', 'Đúng: cần inventory và migration có kiểm chứng nếu thay key resource.'],
    ['Only new writes need the old key forever.', 'Chỉ writes mới cần key cũ mãi mãi.', 'Sai: writes mới có thể dùng key mới; dữ liệu cũ mới là phụ thuộc cần bảo toàn.'] ] },
  { en: 'A disaster-recovery plan creates a multi-Region KMS replica and assumes all key policies are copied forever. What is missing?', vi: 'DR tạo multi-Region KMS replica rồi cho rằng mọi key policy được copy mãi. Thiếu gì?', section: 'lifecycle', answers: [3], explanation: 'Related key material không đồng nghĩa mọi Regional settings đồng bộ; phải quản lý policy/grants/alias theo Region.', choices: [
    ['No missing work; all IAM policies are globally identical.', 'Không thiếu; mọi IAM policy toàn cầu giống hệt.', 'Sai: key settings và quyền theo Region cần được kiểm chứng.'],
    ['A public S3 ACL is required for every replica key.', 'Mọi replica key cần S3 ACL public.', 'Sai: không liên quan, còn mở rủi ro dữ liệu.'],
    ['All ciphertext must be decrypted into plaintext before every failover.', 'Mọi ciphertext phải giải ra plaintext trước mỗi failover.', 'Sai: không là yêu cầu chung của multi-Region keys.'],
    ['Manage Regional key policies/grants/aliases and test actual DR access.', 'Quản lý key policy/grants/aliases theo Region và test truy cập DR thực.', 'Đúng: replica tồn tại chưa chứng minh caller đúng có thể giải mã.'] ] },
  { en: 'An ACM-issued public certificate uses DNS validation. The team removes its CNAME after issuance. What risk follows?', vi: 'ACM public certificate dùng DNS validation, đội xóa CNAME sau cấp. Rủi ro gì?', section: 'certificates', answers: [0], explanation: 'Managed renewal đủ điều kiện vẫn cần validation và usage đúng; xóa validation record có thể làm renew cần can thiệp.', choices: [
    ['Future managed renewal may fail validation or require action.', 'Managed renewal sau này có thể lỗi validation hoặc cần hành động.', 'Đúng: quản lý DNS validation record trong vòng đời certificate.'],
    ['The certificate becomes a KMS customer key automatically.', 'Certificate tự thành KMS customer key.', 'Sai: hai loại tài nguyên có chức năng khác nhau.'],
    ['ACM imports replacement certificates from every public CA automatically.', 'ACM tự import replacement certificate từ mọi public CA.', 'Sai: không phải cơ chế tự sửa khi mất validation.'],
    ['DNS validation records are needed only for billing, never renewal.', 'DNS validation records chỉ cần billing, không bao giờ renewal.', 'Sai: mất record có thể ảnh hưởng khả năng xác minh lại domain.'] ] },
  { en: 'Which TWO facts should an operations team verify before relying on ACM managed renewal? (Choose TWO.)', vi: 'Hai yếu tố nào đội vận hành cần kiểm trước khi dựa vào ACM managed renewal? (Chọn HAI.)', section: 'certificates', answers: [0, 4], explanation: 'Renewability phụ thuộc certificate type, điều kiện sử dụng/validation; không áp một giả định cho imported và issued.', choices: [
    ['Whether the certificate type and usage are eligible for managed renewal.', 'Loại certificate và cách sử dụng có đủ điều kiện managed renewal không.', 'Đúng: kiểm tài liệu và trạng thái thay vì suy từ việc certificate hiện trong ACM.'],
    ['Assume every imported certificate renews without external work.', 'Cho rằng mọi imported certificate tự renew không cần bên ngoài.', 'Sai: imported certificate có trách nhiệm gia hạn khác.'],
    ['Assume an HTTPS listener renews any certificate regardless of issuer.', 'Cho rằng HTTPS listener gia hạn mọi certificate bất kể issuer.', 'Sai: liên kết listener không biến imported cert thành ACM-issued renewal.'],
    ['Delete validation records to prove the certificate is already issued.', 'Xóa validation records để chứng minh đã cấp.', 'Sai: có thể làm hỏng vòng đời renewal về sau.'],
    ['Validation status, expiration and renewal notifications requiring action.', 'Validation status, expiry và renewal notifications cần xử lý.', 'Đúng: kết hợp cấu hình và giám sát để tránh hết hạn bất ngờ.'] ] },
  { en: 'A certificate in an application Region works on an ALB but is not selectable for CloudFront viewer TLS. What should be checked?', vi: 'Certificate ở Region ứng dụng dùng được ALB nhưng không chọn cho CloudFront viewer TLS. Cần kiểm gì?', section: 'certificates', answers: [2], explanation: 'ACM Region requirement phụ thuộc tích hợp; CloudFront viewer certificate có yêu cầu riêng.', choices: [
    ['Use the ALB certificate ARN in a KMS Decrypt policy.', 'Dùng ARN ALB certificate trong KMS Decrypt policy.', 'Sai: không chuyển certificate sang Region tích hợp CloudFront yêu cầu.'],
    ['Make the ALB target group public.', 'Làm target group ALB public.', 'Sai: network access của target không sửa certificate selection.'],
    ['Request or import the certificate in the ACM Region required by CloudFront.', 'Request/import certificate tại ACM Region CloudFront yêu cầu.', 'Đúng: không suy ALB Region rule áp chung mọi dịch vụ.'],
    ['Disable all DNS validation for the domain.', 'Tắt toàn bộ DNS validation cho domain.', 'Sai: không làm certificate sai Region trở thành lựa chọn hợp lệ.'] ] },
  { en: 'A service uses HTTPS from users to ALB but HTTP from ALB to application. What does its certificate alone prove?', vi: 'Dịch vụ dùng HTTPS user→ALB nhưng HTTP ALB→app. Riêng certificate chứng minh điều gì?', section: 'classification', answers: [1], explanation: 'TLS có phạm vi chặng; không được dùng một listener để tuyên bố toàn bộ đường dữ liệu mã hóa.', choices: [
    ['Every hop and every storage object is encrypted.', 'Mọi hop và mọi object lưu đều mã hóa.', 'Sai: backend HTTP và storage encryption cần control riêng.'],
    ['The configured user-to-ALB TLS hop can be protected, not automatically the backend hop.', 'Chặng TLS user→ALB được cấu hình có thể được bảo vệ, không tự bảo vệ backend.', 'Đúng: threat model quyết định backend HTTPS và controls bổ sung.'],
    ['The application has no need for IAM authorization.', 'Ứng dụng không cần IAM authorization.', 'Sai: TLS không thay quyền API/data access.'],
    ['The S3 KMS key can be deleted once TLS is enabled.', 'Có thể xóa S3 KMS key khi bật TLS.', 'Sai: dữ liệu lưu vẫn phụ thuộc key đã dùng.'] ] },
  { en: 'A company imports a third-party TLS certificate into ACM. Which operational responsibility should remain explicit?', vi: 'Công ty import TLS certificate bên thứ ba vào ACM. Trách nhiệm vận hành nào cần ghi rõ?', section: 'certificates', answers: [3], explanation: 'Imported certificates không được mặc định hưởng renewal như ACM-issued; cần issuer renewal/reimport và triển khai phù hợp.', choices: [
    ['ACM will always renew it directly with any issuer.', 'ACM luôn trực tiếp gia hạn với mọi issuer.', 'Sai: không bảo đảm managed renewal cho imported certificates theo giả định này.'],
    ['KMS automatic rotation renews the imported certificate.', 'KMS automatic rotation gia hạn imported certificate.', 'Sai: key-material rotation không cấp chứng thư TLS mới.'],
    ['DNS validation is irrelevant to all certificate types.', 'DNS validation không liên quan mọi loại certificate.', 'Sai: validation phụ thuộc quy trình cấp/renew, không thể phủ nhận chung.'],
    ['Track expiry and own the appropriate issuer renewal and replacement process.', 'Theo dõi expiry và chịu trách nhiệm quy trình renewal/replacement với issuer phù hợp.', 'Đúng: tránh nhầm imported hiện trong ACM đồng nghĩa sẽ tự gia hạn.'] ] },
  { en: 'Which TWO checks should precede scheduling deletion of a retired data-encryption key? (Choose TWO.)', vi: 'Hai kiểm tra nào nên làm trước schedule deletion key dữ liệu đã nghỉ dùng? (Chọn HAI.)', section: 'lifecycle', answers: [1, 3], explanation: 'Cần biết còn ciphertext phụ thuộc và chứng minh migration/recovery, không chỉ xem writes hiện tại.', choices: [
    ['Only confirm that the key alias points elsewhere.', 'Chỉ xác nhận alias đã trỏ nơi khác.', 'Sai: alias chuyển không loại phụ thuộc key của lịch sử.'],
    ['Inventory retained objects, versions, snapshots, backups and archives that still depend on it.', 'Inventory objects, versions, snapshots, backups và archive còn phụ thuộc.', 'Đúng: dữ liệu không truy cập thường xuyên vẫn cần key trong nghĩa vụ giữ.'],
    ['Assume the waiting period recreates a deleted key if needed later.', 'Cho rằng waiting period tái tạo key đã xóa nếu cần sau.', 'Sai: thời gian chờ không là backup khôi phục sau deletion hoàn tất.'],
    ['Validate that required data has a readable approved path after the retirement plan.', 'Kiểm dữ liệu cần thiết có đường đọc được đã duyệt sau kế hoạch nghỉ key.', 'Đúng: kiểm chứng migration/recovery trước khi mất khả năng giải mã.'],
    ['Delete the key first and use user reports as the dependency inventory.', 'Xóa key trước rồi dùng báo lỗi user làm inventory.', 'Sai: phát hiện phụ thuộc sau phá hủy có thể quá muộn để khôi phục.'] ] },
  { en: 'After enabling S3 Bucket Keys, a key policy conditioned on object ARN encryption context fails. What deserves review?', vi: 'Sau bật S3 Bucket Keys, key policy condition object ARN encryption context lỗi. Cần rà gì?', section: 'cross-account', answers: [0], explanation: 'Context có thể thay đổi sang bucket-level theo tích hợp Bucket Keys; policy cần match context thật nhưng vẫn giữ scope.', choices: [
    ['The actual encryption context used by the integration and the condition scope.', 'Encryption context thực do tích hợp dùng và phạm vi condition.', 'Đúng: đối chiếu bucket/object context thay vì mở kms:* để vượt lỗi.'],
    ['Assume Bucket Keys disable every KMS policy.', 'Cho rằng Bucket Keys tắt mọi KMS policy.', 'Sai: tối ưu KMS requests không loại authorization.'],
    ['Only change the S3 object Content-Type.', 'Chỉ đổi Content-Type object.', 'Sai: content type không sửa key policy context condition.'],
    ['Convert the TLS certificate into a symmetric key.', 'Chuyển TLS certificate thành symmetric key.', 'Sai: không liên quan SSE-KMS/Bucket Key integration.'] ] },
  { en: 'An upload role has only kms:Encrypt on the customer key. Why might an S3 SSE-KMS upload still fail?', vi: 'Upload role chỉ có kms:Encrypt trên customer key. Vì sao upload SSE-KMS S3 vẫn có thể lỗi?', section: 'cross-account', answers: [2], explanation: 'S3 envelope integration dùng KMS APIs phù hợp như GenerateDataKey; phải cấp theo operation, đặc biệt multipart.', choices: [
    ['kms:Encrypt always implies every other KMS action.', 'kms:Encrypt luôn bao gồm mọi KMS action khác.', 'Sai: IAM actions độc lập, không được suy ra GenerateDataKey/Decrypt tự có.'],
    ['S3 never supports customer managed keys for uploads.', 'S3 không hỗ trợ customer managed keys cho upload.', 'Sai: SSE-KMS tích hợp hỗ trợ với quyền và key phù hợp.'],
    ['The operation may require GenerateDataKey and additional permissions for its workflow.', 'Operation có thể cần GenerateDataKey và quyền bổ sung theo workflow.', 'Đúng: kiểm tài liệu PutObject/multipart thay vì chỉ cấp tên action nghe tương tự.'],
    ['The role must disable server-side encryption before uploading.', 'Role phải tắt server-side encryption trước upload.', 'Sai: né yêu cầu bảo vệ dữ liệu thay vì sửa quyền cần thiết.'] ] },
  { en: 'A template sets bucket default SSE-KMS and blocks public access. What remains unproved by that snippet alone?', vi: 'Template đặt default SSE-KMS và chặn public access. Riêng snippet chưa chứng minh điều gì?', section: 'classification', answers: [1], explanation: 'Default, access block, transport enforcement, migration và effective authorization là các controls riêng.', choices: [
    ['The bucket has a declared default encryption configuration.', 'Bucket có cấu hình default encryption được khai báo.', 'Sai: đó chính là điều snippet thể hiện, dù vẫn cần kiểm trạng thái triển khai thực tế.'],
    ['All old objects are migrated, every client uses TLS, and effective key permissions meet policy.', 'Mọi object cũ đã migrate, mọi client dùng TLS và quyền key thực đáp ứng policy.', 'Đúng: snippet không có migration, TLS deny, key policy hay test effective permissions.'],
    ['Public-access block settings are declared.', 'Public-access block settings được khai báo.', 'Sai: cấu hình này có trong snippet; câu hỏi hỏi phần chưa được chứng minh.'],
    ['New writes without an overriding option have a bucket encryption default.', 'Writes mới không override có bucket encryption default.', 'Sai: đây là tác dụng cấu hình mặc định nêu ra, khác bảo đảm toàn bộ luồng dữ liệu.'] ] }
]);
