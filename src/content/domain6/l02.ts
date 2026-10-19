import { lesson } from '../domain4/author';

export const d6l02 = lesson({
  id: 'd6-l02', number: 63, domainId: 6, chapterId: '6.1',
  title: 'Federation, IAM Identity Center và ABAC',
  summary: 'Quản lý quyền workforce nhiều account bằng federation và permission sets; dùng session attributes có kiểm soát thay cho policy riêng cho từng người.',
  duration: 70,
  objectives: ['Chọn federation cho người dùng và OIDC cho CI phù hợp.', 'Theo dõi luồng identity source, assignment, permission set và phiên account.', 'Áp dụng ABAC, kiểm soát tag mutation và role chaining.'],
  prerequisites: ['Nắm trust/permissions và request context trong bài 62.', 'Biết tag resource và khái niệm SAML/OIDC ở mức nhận diện.'],
  sections: [
    { id: 'd6-l02-federation', title: '1. Federation: danh tính tập trung, credentials tạm thời', paragraphs: [
      'Federation (liên kết danh tính) cho phép một identity provider, viết tắt IdP (nhà cung cấp danh tính), xác thực người hoặc workload để nhận quyền vào AWS mà không tạo access key dài hạn riêng cho từng người ở mọi account. Workforce identity (danh tính nhân sự) thường liên quan directory công ty, nhóm công việc, MFA và quy trình joiner/mover/leaver (vào công ty, chuyển nhóm, rời công ty). IAM Identity Center quản lý truy cập người dùng vào AWS accounts và ứng dụng được hỗ trợ. Nó khác Amazon Cognito phục vụ danh tính khách hàng của ứng dụng; hai vấn đề có thể cùng tồn tại nhưng có mục tiêu khác nhau.',
      'Federation không tự cho phép mọi API. Sau xác thực, user nhận role session với permissions tương ứng; guardrails và resource policies vẫn áp dụng. SAML assertion hoặc OIDC token là bằng chứng từ IdP, không phải mật khẩu root của AWS. Khi dùng CLI, cấu hình đăng nhập phù hợp để lấy credentials ngắn hạn thay vì chép access key dùng chung từ người khác. Để giảm quyền quản trị thường trực, tạo vai trò hỗ trợ hẹp cho công việc hàng ngày và chỉ dùng quyền cao khi nhiệm vụ yêu cầu. Cần giữ đường emergency access (truy cập khẩn cấp) được kiểm soát và thử định kỳ nếu IdP gặp sự cố.'
    ] },
    { id: 'd6-l02-permission-set', title: '2. Permission set và account assignment', paragraphs: [
      'Permission set (bộ quyền mẫu) tập hợp policies mô tả vai trò công việc, chẳng hạn ReadOnlyOps hoặc DatabaseOperator. Account assignment (gán truy cập account) liên kết user/group với permission set trong các AWS accounts đích. IAM Identity Center tạo và quản lý role tương ứng cho assignment theo mô hình permission sets. Vì vậy tạo một permission set đơn thuần chưa khiến mọi user vào được mọi account. Group-based assignment (gán theo nhóm) giúp onboarding và chuyển nhóm ít thao tác hơn. Identity source (nguồn danh tính), provisioning (đồng bộ danh tính) và authorization assignment là ba khâu cần kiểm tra riêng khi người dùng không thấy account.',
      'Khi sửa permission set, phải kiểm tra trạng thái provisioning và policy thực tế ở account đích. Với customer managed policy reference (tham chiếu policy do khách hàng quản lý), policy theo tên/path phù hợp phải tồn tại ở account cần dùng; tham chiếu không tự sao chép document từ account quản lý sang mọi member. Đừng sửa thủ công role do Identity Center quản lý rồi kỳ vọng thay đổi bền qua lần provision sau. Portal session duration (thời gian phiên portal) khác AWS account role session duration; còn có phiên IdP bên ngoài. Giảm một giá trị không đồng nghĩa mọi credentials đã phát lập tức hết hạn ở cùng thời điểm.'
    ] },
    { id: 'd6-l02-abac', title: '3. ABAC nối thuộc tính principal với thuộc tính tài nguyên', paragraphs: [
      'RBAC (role-based access control, kiểm soát theo vai trò) gán quyền theo chức năng. ABAC (attribute-based access control, kiểm soát theo thuộc tính) dùng attributes như Project hoặc CostCenter để quyết định phạm vi tài nguyên. Một permission set chung có thể cho ec2:StartInstances nếu ec2:ResourceTag/Project bằng aws:PrincipalTag/Project. Nhân sự Project=payments và Project=analytics dùng cùng policy nhưng truy cập tập instance khác nhau. Identity Center có thể chuyển thuộc tính được cấu hình cho access control vào session. Policy không tự biết department trong email hoặc job title: phải có mapping từ identity source và context thực sự đi vào AWS.',
      'ABAC giảm số policy khi nhiều dự án có cùng hình dạng quyền, nhưng không là cơ chế áp dụng mù cho mọi action. Kiểm tra service/action có hỗ trợ resource tags, request tags và resource-level permission hay không. Các list/describe actions đôi khi cần cách cấp quyền khác; một số create actions chưa có resource tag tồn tại, nên cần aws:RequestTag và aws:TagKeys nơi được hỗ trợ. Untagged resource (tài nguyên thiếu tag) phải có kết quả rõ ràng: thường không được truy cập theo policy match tag, kèm quy trình sửa có kiểm soát. Tag dùng cho billing và tag dùng authorization cần governance khác nhau vì thay tag authorization có thể thay quyền truy cập.'
    ] },
    { id: 'd6-l02-tag-security', title: '4. Session tags, transitive tags và đường nâng quyền', paragraphs: [
      'Session tag (tag phiên) mang attribute cho phiên STS. Khi gọi AssumeRole kèm tags, trust phải cho phép sts:TagSession trong tình huống phù hợp, đồng thời kiểm soát keys/values được phép truyền. Cho người dùng tự chọn Project=admin làm principal tag rồi tin nó để ủy quyền sẽ phá mô hình dù policy resource tag viết đúng. Thuộc tính phải đến từ nguồn được quản trị, hoặc có điều kiện giới hạn theo attribute nguồn đã tin cậy. Session tag có thể ghi đè role tag cùng key; vì vậy không được xem role tag cố định là bảo đảm nếu session caller có thể tự gửi giá trị khác.',
      'Role chaining (nối chuỗi assume role) có thể cần mang Project qua nhiều bước; chỉ các tag được đánh dấu transitive (truyền tiếp) phù hợp mới tiếp tục qua chuỗi theo cơ chế STS. Kiểm tra trust của từng role, giới hạn tag keys và hành vi xung đột. Hãy coi quyền tag/untag tài nguyên là một phần của security boundary: nếu user có thể đổi Project của instance người khác thành dự án mình, họ có thể vượt phân vùng ABAC. Tách quyền quản trị tags nhạy cảm khỏi quyền vận hành thông thường, kiểm tra tạo tài nguyên đúng tag và ghi audit thay đổi. Không dùng tag policy tổ chức như một cơ chế authorization duy nhất để thay IAM deny/condition khi cần chặn hành động.'
    ] },
    { id: 'd6-l02-oidc', title: '5. OIDC cho CI và kiểm chứng vòng đời truy cập', paragraphs: [
      'Với CI chạy ngoài AWS, OIDC federation (liên kết OIDC) cho phép workflow nhận token từ issuer rồi đổi qua STS AssumeRoleWithWebIdentity để lấy credentials tạm thời. Trust cần đúng provider, audience (đối tượng nhận token) và subject (chủ thể token) phù hợp repo, branch hoặc environment được duyệt. Chỉ kiểm tra audience chung như sts.amazonaws.com mà cho subject quá rộng có thể tin nhầm workload khác dùng cùng provider. Khi GitHub workflow dùng environment, subject shape khác nhánh trực tiếp; phải đối chiếu claim thực tế thay vì nối một pattern tự đoán. Role permissions vẫn giới hạn artifact, deploy target và action sau khi federation thành công.',
      'Kiểm chứng identity lifecycle bằng tình huống chuyển nhóm, bỏ assignment, token hết hạn và người rời công ty. SCIM provisioning đồng bộ user/group từ IdP trong mô hình được cấu hình, không tự biến một group thành quyền ở mọi account; assignment vẫn là khâu riêng. Thu hồi người dùng cũng cần xem các phiên đã phát và đường credentials khác còn tồn tại. Audit nên liên kết session về người hoặc workflow nguồn, không dùng cùng session name mơ hồ cho cả tổ chức. Đối với ABAC, thử hai user cùng permission set nhưng khác attribute, một user thiếu attribute và một request cố sửa tag. Cả positive lẫn negative tests mới chứng minh policy giảm công sức mà vẫn giữ phân vùng quyền.'
    ] }
  ],
  diagram: { title: 'Từ directory đến quyền tài nguyên theo tag', steps: [
    { label: 'Identity source', detail: 'Directory xác thực và quản lý user/group/Project với người quản trị rõ ràng.' },
    { label: 'Assignment', detail: 'Gán group và permission set cho các account cần thiết.' },
    { label: 'Provision và session', detail: 'Role account được quản lý; access-control attributes vào session.' },
    { label: 'Policy match', detail: 'Action hỗ trợ tags so ResourceTag với PrincipalTag, xét guardrails.' },
    { label: 'Lifecycle test', detail: 'Kiểm chuyển nhóm, thiếu tag, đổi tag trái phép và thời hạn phiên.' }
  ], caption: 'ABAC chỉ đáng tin khi cả attribute nguồn, tag tài nguyên và quyền sửa chúng đều được kiểm soát.' },
  scenarios: [
    { title: 'Một permission set cho nhiều dự án', context: 'Hai trăm nhóm dự án có quyền start/stop instance giống nhau, nhưng phải tách tài nguyên từng Project.', solution: 'Dùng Project từ directory làm access-control attribute, condition match tag instance và chặn user tự sửa Project nhạy cảm. Kiểm tra service actions trước khi mở rộng sang loại tài nguyên khác.', tradeoff: 'Giảm số policy nhưng tăng yêu cầu kỷ luật tag, mapping attribute và kiểm thử khi service không hỗ trợ điều kiện đồng nhất.' },
    { title: 'Pipeline ngoài AWS không cần khóa dài hạn', context: 'Workflow GitHub Actions đang dùng access key chia sẻ và bất kỳ branch nào cũng có secret đó.', solution: 'Dùng OIDC provider và role trust giới hạn audience cùng subject cho repo/ref hoặc environment được duyệt; cấp permission deploy hẹp và bỏ key cũ sau quy trình chuyển.', tradeoff: 'Cần quản trị trust và lifecycle workflow/environment; credentials ngắn hạn không thay việc bảo vệ code pipeline và nhánh được tin cậy.' }
  ],
  keyTakeaways: ['Workforce federation và customer identity giải quyết các nhóm người dùng khác nhau.', 'Permission set phải có account assignment và provisioning phù hợp.', 'ABAC cần attribute đáng tin, action hỗ trợ tags và kiểm soát quyền đổi tags.', 'Role chaining cần xét transitive session tags.', 'OIDC trust phải giới hạn đúng issuer/audience/subject, không chỉ dùng credentials tạm thời.'],
  examTraps: ['Tạo permission set rồi cho rằng mọi account tự xuất hiện cho mọi user.', 'Tin rằng customer managed policy reference tự sao chép JSON sang member accounts.', 'Cho user tùy ý chọn session tag quyết định quyền.', 'Đặt portal timeout và cho rằng mọi phiên account đã phát bị thu hồi ngay.', 'Match GitHub branch subject trong workflow dùng environment mà không kiểm claim.'],
  code: { title: 'ABAC chỉ cho start/stop EC2 cùng Project (snippet)', deployable: false,
    cloudformation: `Resources:
  ProjectOperatorPolicy:
    Type: AWS::IAM::ManagedPolicy
    Properties:
      Description: Start and stop instances with matching trusted Project tags
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action: [ec2:StartInstances, ec2:StopInstances]
            Resource: 'arn:aws:ec2:*:*:instance/*'
            Condition:
              StringEquals:
                ec2:ResourceTag/Project: '\${aws:PrincipalTag/Project}'`,
    terraform: `resource "aws_iam_policy" "project_operator" {
  description = "Start and stop instances with matching trusted Project tags"
  policy = jsonencode({ Version = "2012-10-17", Statement = [{
    Effect = "Allow", Action = ["ec2:StartInstances", "ec2:StopInstances"],
    Resource = "arn:aws:ec2:*:*:instance/*",
    Condition = { StringEquals = {
      "ec2:ResourceTag/Project" = "$\${aws:PrincipalTag/Project}"
    } }
  }] })
}`,
    explanation: 'Snippet chưa attach policy, cấu hình Identity Center, cung cấp session Project hay kiểm soát tag mutation. CloudFormation không dùng !Sub cho policy variable; Terraform dùng $${ để giữ nguyên IAM policy variable trong JSON đầu ra. Không cấp DescribeInstances/CreateTags và không bảo đảm mọi EC2 action hỗ trợ cùng condition.'
  },
  lab: { title: 'Mô phỏng phân vùng ABAC trước khi thay hệ thống danh tính', duration: 45,
    prerequisites: ['Sandbox với quyền IAM tạo policy/role thử và IAM Policy Simulator.', 'Không cần đăng ký IdP mới hoặc sửa Identity Center production; lab dùng context giả trong simulator.', 'Hiểu principal tag là context được tin cậy trong thực tế, không phải người học tùy chọn để cấp quyền production.'],
    cost: 'Phân tích IAM không cần tài nguyên compute. Nếu mở rộng sang thử EC2 hoặc directory thật có thể phát sinh phí; lab này không tạo hoặc start/stop instance.',
    steps: [
      { title: 'Xác định policy và tài nguyên giả', detail: 'Ghi account sandbox, chọn instance ARN giả đúng định dạng. Lập ma trận Project của principal và instance: cùng project, khác project, thiếu tag.', command: 'aws sts get-caller-identity', expected: 'Có ma trận kỳ vọng: match cho phép, mismatch/missing bị cấm theo policy hẹp.' },
      { title: 'Tạo policy thử', detail: 'Dùng document của snippet trong policy lab riêng, không attach vào role production. Validate policy với Access Analyzer trước khi mô phỏng.', expected: 'Policy JSON hợp lệ; actions chỉ StartInstances/StopInstances; variable PrincipalTag được giữ nguyên.' },
      { title: 'Mô phỏng match', detail: 'Trong IAM Policy Simulator chọn policy/role thử và action StartInstances; điền resource ARN, context aws:PrincipalTag/Project=payments và ec2:ResourceTag/Project=payments.', expected: 'Allowed trong phạm vi policy được mô phỏng khi không có tầng deny khác; không có EC2 API thực chạy.' },
      { title: 'Mô phỏng mismatch và missing', detail: 'Đổi resource Project thành analytics rồi bỏ principal Project. Lặp với action CreateTags để chứng minh snippet không tự cấp quyền sửa tag.', expected: 'Các trường hợp ngoài phạm vi không được policy này cho phép; ghi rõ implicit deny không bảo đảm policy khác cũng không grant.' },
      { title: 'Thiết kế source và chaining', detail: 'Vẽ directory Project → access-control attribute → session. Viết rõ ai được sửa Project, ai được TagSession, tag nào transitive và role nào trong chain được tin cậy. Không cấu hình IdP thật trong bước này.', expected: 'Có danh sách quyền quản trị tags và negative tests cho tự đổi Project/chèn session tag.' },
      { title: 'Cleanup', detail: 'Xóa role/policy thử theo đúng tên đã ghi; không xóa permission set hay assignment hiện có của tổ chức. Lưu ma trận kết quả nhưng không lưu token.', expected: 'Không còn IAM resources riêng của lab; không có EC2 được tạo hoặc thay trạng thái.' }
    ], cleanup: ['Detach/xóa policy chỉ của lab và xóa role thử nếu có.', 'Không sửa Identity Center instance, IdP hoặc groups dùng chung.', 'Không lưu assertion, JWT hay STS credentials vào ghi chú hoặc repository.'],
    challenge: 'Mở rộng ma trận cho EC2 create-and-tag và thiết kế cách không cho người dùng đổi Project trên tài nguyên hiện hữu của nhóm khác; kiểm chứng action/condition support trước khi viết policy.'
  },
  sources: [
    { title: 'Identity Center permission sets', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html' },
    { title: 'Identity Center ABAC', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/abac.html' },
    { title: 'IAM OIDC federation', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html' },
    { title: 'STS session tags', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html' },
    { title: 'IAM ABAC tutorial', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_attribute-based-access-control.html' },
    { title: 'Roles for OIDC providers', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html' },
    { title: 'Identity Center SCIM provisioning', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/how-to-with-scim.html' },
    { title: 'Customer managed policies in permission sets', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetcustom.html' }
  ], reviewedAt: '2026-10-19'
}, [
  { en: 'A company wants employees to access many AWS accounts with existing corporate identities. Which service is the most direct workforce-access fit?', vi: 'Công ty muốn nhân viên vào nhiều AWS account bằng danh tính công ty hiện có. Dịch vụ nào phù hợp trực tiếp cho workforce access?', section: 'federation', answers: [0], refresh: true, explanation: 'Identity Center tập trung workforce account access; không cần IAM user riêng cho mỗi nhân viên ở mỗi account.', choices: [
    ['IAM Identity Center integrated with the appropriate identity source.', 'IAM Identity Center tích hợp identity source phù hợp.', 'Đúng: phục vụ truy cập workforce tới AWS accounts và ứng dụng.'],
    ['Independent IAM users with passwords synchronized manually in every member account.', 'IAM users độc lập với passwords đồng bộ thủ công ở mỗi member account.', 'Sai: tăng vòng đời danh tính và credential phải quản lý; không tận dụng corporate identity/federation tập trung như yêu cầu.'],
    ['One shared IAM user whose access keys are distributed to the workforce.', 'Một IAM user chung phát access keys cho workforce.', 'Sai: mất attribution cá nhân, khó thu hồi người rời nhóm và tạo bí mật dài hạn dùng chung.'],
    ['A Cognito user pool alone with no account-role assignments.', 'Chỉ Cognito user pool không account-role assignments.', 'Sai: customer application sign-in không tự cung cấp mô hình workforce account permissions cần thiết.'] ] },
  { en: 'An administrator creates a permission set, but a group cannot see the target account in the portal. Which missing step is most likely?', vi: 'Admin tạo permission set nhưng group không thấy account đích trong portal. Bước nào có thể thiếu?', section: 'permission-set', answers: [2], explanation: 'Permission set là mẫu quyền; cần assignment cho principal trong account đích.', choices: [
    ['Create a CloudWatch metric with the permission-set name.', 'Tạo CloudWatch metric cùng tên permission set.', 'Sai: metric không gán truy cập account.'],
    ['Enable S3 event notifications.', 'Bật S3 event notifications.', 'Sai: không liên quan Identity Center assignment.'],
    ['Assign the group and permission set to the target AWS account and verify provisioning.', 'Gán group/permission set tới AWS account đích và xác minh provisioning.', 'Đúng: thiết lập quan hệ truy cập và role tương ứng.'],
    ['Rename the account to match the group.', 'Đổi tên account khớp group.', 'Sai: tên hiển thị không tạo assignment.'] ] },
  { en: 'Two teams need the same EC2 start/stop actions but only on their own Project resources. What scales better than a separate policy per project?', vi: 'Hai nhóm cần cùng EC2 start/stop nhưng chỉ trên tài nguyên Project của mình. Cách nào mở rộng tốt hơn policy riêng mỗi dự án?', section: 'abac', answers: [1], explanation: 'ABAC dùng policy chung và context thuộc tính để chọn tập tài nguyên tương ứng.', choices: [
    ['Grant all teams AdministratorAccess.', 'Cấp AdministratorAccess cho mọi nhóm.', 'Sai: vượt phạm vi start/stop theo project.'],
    ['Match trusted principal Project tags to supported resource Project tags.', 'Match Project tag principal đáng tin với Project tag resource được hỗ trợ.', 'Đúng: cùng hình dạng quyền nhưng phạm vi theo attribute.'],
    ['Use one shared long-lived access key.', 'Dùng một access key dài hạn chung.', 'Sai: không phân vùng theo nhóm và khó audit.'],
    ['Remove tags from every resource.', 'Gỡ tag khỏi mọi tài nguyên.', 'Sai: loại bỏ attribute cần cho policy ABAC.'] ] },
  { en: 'Users can choose any Project value in session tags, and policy trusts that value. What is the main risk?', vi: 'User tự chọn mọi Project trong session tag và policy tin giá trị đó. Rủi ro chính?', section: 'tag-security', answers: [3], explanation: 'Attribute quyết định quyền phải có nguồn/giới hạn đáng tin, nếu không user tự nâng quyền.', choices: [
    ['ABAC automatically rejects every tag chosen by a user.', 'ABAC tự từ chối mọi tag user chọn.', 'Sai: phải cấu hình trust và conditions; không có bảo đảm tự động như vậy.'],
    ['The only risk is a larger tag bill.', 'Rủi ro duy nhất là phí tag cao hơn.', 'Sai: đây là vấn đề authorization, không chỉ chi phí.'],
    ['Session names become longer.', 'Session name dài hơn.', 'Sai: không nêu tác động bảo mật quan trọng.'],
    ['Users may claim another project and gain its resource access.', 'User có thể tự nhận project khác để được quyền trên tài nguyên đó.', 'Đúng: kiểm soát ai được TagSession và giá trị được truyền là thiết yếu.'] ] },
  { en: 'Which TWO controls are essential for an ABAC project boundary? (Choose TWO.)', vi: 'Hai kiểm soát nào thiết yếu cho ranh giới Project bằng ABAC? (Chọn HAI.)', section: 'tag-security', answers: [0, 4], explanation: 'Phải bảo vệ cả attribute principal lẫn attribute tài nguyên khỏi sửa trái phép.', choices: [
    ['Restrict who can change the authoritative Project attribute or session tags.', 'Giới hạn ai sửa Project gốc hoặc session tags.', 'Đúng: tránh giả mạo thuộc tính chủ thể để lấy quyền nhóm khác.'],
    ['Allow every user to retag every instance arbitrarily.', 'Cho mọi user đổi mọi instance tag tùy ý.', 'Sai: có thể đổi tài nguyên người khác thành Project của mình.'],
    ['Assume all AWS actions support the same ResourceTag condition.', 'Cho rằng mọi AWS action hỗ trợ cùng ResourceTag condition.', 'Sai: support theo service/action phải được xác minh.'],
    ['Treat billing tags as trusted authorization without governance.', 'Tin billing tags để authorization mà không governance.', 'Sai: tag dùng quyền cần kiểm soát thay đổi chặt.'],
    ['Control mutation of authorization-relevant resource tags.', 'Kiểm soát sửa resource tags liên quan authorization.', 'Đúng: chặn retag làm vượt phân vùng truy cập.'] ] },
  { en: 'A GitHub Actions workflow should avoid permanent AWS keys. Which federation path is appropriate?', vi: 'Workflow GitHub Actions nên tránh AWS key dài hạn. Luồng federation nào phù hợp?', section: 'oidc', answers: [2], explanation: 'OIDC token có thể đổi lấy credentials STS ngắn hạn gắn role với trust chặt.', choices: [
    ['Store a rotating IAM user access key in repository secrets as the permanent identity model.', 'Lưu access key IAM user có xoay trong repository secrets như mô hình danh tính lâu dài.', 'Sai: có thể quản trị key nhưng vẫn giữ bí mật dài hạn; không đáp ứng mục tiêu tránh permanent AWS keys bằng federation.'],
    ['Copy an employee Identity Center cached session into the CI runner image.', 'Chép cached session Identity Center của nhân viên vào image CI runner.', 'Sai: gắn workload với phiên cá nhân dễ hết hạn/lộ và không là trust workload riêng có claims được giới hạn.'],
    ['Use an OIDC provider and AssumeRoleWithWebIdentity with scoped role trust.', 'Dùng OIDC provider và AssumeRoleWithWebIdentity với role trust có giới hạn.', 'Đúng: credentials được cấp theo token workload thay vì khóa dài hạn.'],
    ['Grant the runner repository access but omit any AWS role trust relationship.', 'Cấp runner quyền repository nhưng bỏ mọi AWS role trust.', 'Sai: quyền repository không tự tạo AWS principal credentials hoặc grant deploy; vẫn cần cơ chế federation trust vào role.'] ] },
  { en: 'A CI OIDC trust checks only a shared audience value. What additional restriction is important?', vi: 'OIDC trust CI chỉ kiểm shared audience. Giới hạn bổ sung nào quan trọng?', section: 'oidc', answers: [1], explanation: 'Audience chung không xác định repo/workflow được tin; cần subject constraints phù hợp.', choices: [
    ['Allow every subject from the issuer.', 'Allow mọi subject từ issuer.', 'Sai: có thể tin workload không liên quan cùng provider.'],
    ['Restrict the subject to the approved repository and ref or environment claim shape.', 'Giới hạn subject theo repo và ref hoặc hình dạng claim environment đã duyệt.', 'Đúng: thu hẹp workload được phép đổi token lấy role.'],
    ['Restrict only the role session name while accepting any repository subject.', 'Chỉ giới hạn role session name nhưng nhận mọi repository subject.', 'Sai: session name không thay claim chứng minh repo/ref được tin; workload ngoài phạm vi có thể chọn tên giống.'],
    ['Rely only on the role permissions policy to identify which repository may assume it.', 'Chỉ dựa permissions policy để xác định repository nào được assume.', 'Sai: permissions giới hạn hành động sau assume; trust conditions phải giới hạn ai được vào role.'] ] },
  { en: 'A permission set references a customer managed policy by name. Provisioning fails in one target account. What should be checked?', vi: 'Permission set tham chiếu customer managed policy theo tên. Provisioning lỗi ở một account. Cần kiểm gì?', section: 'permission-set', answers: [0], explanation: 'Policy reference cần policy tương ứng tại target; không tự sao chép document từ account khác.', choices: [
    ['The required customer managed policy name/path exists in that target account.', 'Tên/path customer managed policy cần thiết tồn tại ở account đích.', 'Đúng: kiểm tra dependency policy theo account trước khi provision.'],
    ['Only whether the referenced policy exists in the management account.', 'Chỉ policy tham chiếu có ở management account không.', 'Sai: target account cần policy name/path tương ứng; policy ở management không tự được copy document qua mọi account.'],
    ['Only whether the user can sign in to the external IdP.', 'Chỉ user có đăng nhập được external IdP không.', 'Sai: xác thực thành công không sửa dependency policy/provisioning ở account đích.'],
    ['Only whether the assignment uses a direct user instead of a group.', 'Chỉ assignment dùng direct user thay vì group không.', 'Sai: đổi principal assignment không tự tạo customer managed policy bị thiếu trong target.'] ] },
  { en: 'Which TWO session concepts should be distinguished when troubleshooting sign-in duration? (Choose TWO.)', vi: 'Hai khái niệm phiên nào cần phân biệt khi chẩn đoán thời gian đăng nhập? (Chọn HAI.)', section: 'permission-set', answers: [1, 3], explanation: 'Phiên portal và phiên role account là các lớp khác nhau, thêm cả IdP session nếu có.', choices: [
    ['S3 lifecycle expiration is the AWS portal session timer.', 'S3 lifecycle expiration là bộ đếm phiên portal AWS.', 'Sai: lifecycle object không điều khiển phiên đăng nhập.'],
    ['The IAM Identity Center access portal session.', 'Phiên access portal IAM Identity Center.', 'Đúng: xác định thời gian người dùng ở lớp portal.'],
    ['An EC2 status-check interval is an authentication lifetime.', 'EC2 status-check interval là thời hạn xác thực.', 'Sai: health metric không là thời hạn phiên.'],
    ['The AWS account role session controlled by the permission-set session setting.', 'Phiên role AWS account do thiết lập session permission set kiểm soát.', 'Đúng: có lifecycle riêng với portal session.'],
    ['Every session in every layer always expires simultaneously.', 'Mọi phiên ở mọi lớp luôn hết hạn cùng lúc.', 'Sai: không thể suy ra sự đồng bộ thời hạn giữa các lớp.'] ] },
  { en: 'A user assumes a second role and loses the Project attribute required for ABAC. What STS feature deserves investigation?', vi: 'User assume role thứ hai và mất Project cần cho ABAC. Cần xem tính năng STS nào?', section: 'tag-security', answers: [2], explanation: 'Role chaining cần xét transitive session tags và quyền/trust ở từng chặng.', choices: [
    ['S3 transfer acceleration.', 'S3 transfer acceleration.', 'Sai: không chuyển session attributes qua AssumeRole.'],
    ['EC2 placement groups.', 'EC2 placement groups.', 'Sai: placement compute không quản lý phiên STS.'],
    ['Transitive session tags and the trust/tagging permissions along the chain.', 'Transitive session tags và trust/quyền tagging qua chuỗi.', 'Đúng: attribute không tự đi qua mọi role nếu không được thiết kế phù hợp.'],
    ['CloudFront cache TTL.', 'CloudFront cache TTL.', 'Sai: không là cơ chế giữ principal tags.'] ] },
  { en: 'An untagged instance is denied by a policy requiring its Project tag to equal the principal Project. What is a sound response?', vi: 'Instance thiếu tag bị policy yêu cầu Project match từ chối. Phản ứng nào hợp lý?', section: 'abac', answers: [3], explanation: 'Missing tag cần quy trình xử lý riêng có kiểm soát, không mở mọi resource để vượt lỗi.', choices: [
    ['Remove every condition permanently.', 'Gỡ mọi condition vĩnh viễn.', 'Sai: phá ranh giới project cho tất cả tài nguyên.'],
    ['Allow every developer to set Project on any instance without an ownership check.', 'Cho mọi developer đặt Project trên mọi instance không kiểm ownership.', 'Sai: user có thể retag tài nguyên nhóm khác rồi lấy quyền theo ABAC; remediation tags cần authority hẹp riêng.'],
    ['Assume tags are automatically inferred from instance names.', 'Cho rằng tag tự suy ra từ instance name.', 'Sai: policy context phụ thuộc tags thực sự được đặt.'],
    ['Use an authorized remediation path to assign the correct tag and prevent future untagged creation.', 'Dùng đường sửa được ủy quyền để đặt tag đúng và ngăn tạo thiếu tag sau này.', 'Đúng: giữ ABAC boundary và cải thiện governance nguồn tài nguyên.'] ] },
  { en: 'A team tries to authorize a create request using only a ResourceTag that does not yet exist. What should be assessed?', vi: 'Đội ủy quyền create request chỉ bằng ResourceTag chưa tồn tại. Cần đánh giá gì?', section: 'abac', answers: [0], explanation: 'Create-time control có thể cần request tags và support cụ thể theo action.', choices: [
    ['Whether the action supports request tags/tag keys and tag-on-create controls.', 'Action có hỗ trợ request tags/tag keys và tag-on-create controls không.', 'Đúng: dùng context thực có trong create request thay vì tag chưa tồn tại.'],
    ['Whether the permission-set name is short enough.', 'Tên permission set có đủ ngắn không.', 'Sai: không giải quyết context create-time.'],
    ['Whether all account users share one password.', 'Mọi account user có dùng chung password không.', 'Sai: không liên quan và là thực hành rủi ro.'],
    ['Whether logs are stored in a warmer storage class.', 'Log có lưu class nóng hơn không.', 'Sai: không thêm điều kiện authorization cho create action.'] ] },
  { en: 'Which TWO statements about identity provisioning and access are correct? (Choose TWO.)', vi: 'Hai phát biểu nào về provisioning danh tính và truy cập là đúng? (Chọn HAI.)', section: 'oidc', answers: [0, 4], explanation: 'Đồng bộ identity/group và assignment quyền AWS là các bước khác nhau trong lifecycle.', choices: [
    ['SCIM can synchronize users and groups when configured with a supported external IdP.', 'SCIM có thể đồng bộ user/group khi cấu hình IdP ngoài được hỗ trợ.', 'Đúng: hỗ trợ quản lý nguồn danh tính và nhóm.'],
    ['SCIM automatically grants every synchronized user administrator access in every account.', 'SCIM tự cấp mọi user đồng bộ quyền admin ở mọi account.', 'Sai: quyền account còn phụ thuộc assignments và policies.'],
    ['Removing a portal assignment always proves all previously issued credentials are instantly invalid.', 'Bỏ portal assignment luôn chứng minh mọi credentials đã phát lập tức vô hiệu.', 'Sai: phải xét các phiên và quy trình thu hồi liên quan.'],
    ['Permission-set provisioning creates missing external-directory users automatically.', 'Provision permission set tự tạo external-directory users bị thiếu.', 'Sai: provisioning account role/policies và đồng bộ user/group từ identity source là hai quy trình khác nhau.'],
    ['Account assignments must still map users or groups to the required access.', 'Account assignments vẫn phải map user/group tới quyền cần thiết.', 'Đúng: đồng bộ danh tính không thay authorization assignment.'] ] },
  { en: 'A developer manually edits an Identity Center-managed account role to fix permissions. What is the maintainability issue?', vi: 'Developer sửa tay role account do Identity Center quản lý để sửa quyền. Vấn đề bảo trì là gì?', section: 'permission-set', answers: [2], explanation: 'Nguồn quản lý là permission set/provisioning; sửa tay có thể bị ghi đè và gây drift.', choices: [
    ['Manual role edits always update every permission set automatically.', 'Sửa role tay luôn tự cập nhật mọi permission set.', 'Sai: không có đồng bộ ngược theo giả định này.'],
    ['IAM roles cannot have policies.', 'IAM role không thể có policy.', 'Sai: role permissions là nền tảng account access.'],
    ['Reprovisioning may overwrite the edit; change the managed source configuration instead.', 'Reprovision có thể ghi đè; nên sửa cấu hình nguồn được quản lý.', 'Đúng: giữ nguồn quyền nhất quán và có thể kiểm toán.'],
    ['The account can no longer use federation of any kind.', 'Account không còn dùng được bất kỳ federation nào.', 'Sai: quá rộng và không phải hệ quả tự động.'] ] },
  { en: 'A role has a Project=payments role tag, but its caller may pass Project=admin session tags. Why is the fixed role tag not sufficient?', vi: 'Role có tag Project=payments nhưng caller có thể truyền session tag Project=admin. Vì sao role tag cố định chưa đủ?', section: 'tag-security', answers: [1], explanation: 'Session tag cùng key có thể ghi đè role tag trong context phiên, nên phải quản lý nguồn tag.', choices: [
    ['Role tags are never used by IAM.', 'Role tag không bao giờ được IAM dùng.', 'Sai: principal tags có thể lấy từ tag role trong trường hợp phù hợp.'],
    ['A same-key session tag can override the role tag; restrict tag-session permissions and values.', 'Session tag cùng key có thể ghi đè role tag; cần hạn chế quyền/giá trị TagSession.', 'Đúng: không chỉ nhìn tag trên role để kết luận context phiên.'],
    ['The role name determines Project instead.', 'Tên role quyết định Project thay tag.', 'Sai: policy đang dùng attribute, không tự suy ra từ tên.'],
    ['CloudWatch automatically rejects the admin tag.', 'CloudWatch tự từ chối tag admin.', 'Sai: đây là quyết định IAM trust/policy, không do CloudWatch.'] ] },
  { en: 'An application needs customer sign-up, sign-in and user profiles. Why is a workforce permission-set design not the direct substitute?', vi: 'Ứng dụng cần khách hàng đăng ký, đăng nhập và hồ sơ. Vì sao thiết kế workforce permission set không là thay thế trực tiếp?', section: 'federation', answers: [3], explanation: 'Customer identity và workforce AWS account access có đối tượng và lifecycle khác nhau.', choices: [
    ['Customer applications never need authentication.', 'Ứng dụng khách hàng không bao giờ cần xác thực.', 'Sai: yêu cầu đang nêu rõ sign-up/sign-in.'],
    ['Every customer should receive an AWS account administrator role.', 'Mỗi khách hàng nên có role AWS account admin.', 'Sai: vượt mục tiêu và nguy hiểm.'],
    ['S3 versioning is a complete identity service.', 'S3 versioning là dịch vụ identity đầy đủ.', 'Sai: quản lý phiên bản object, không đăng nhập người dùng.'],
    ['Use a customer-identity solution such as Cognito where appropriate; Identity Center primarily addresses workforce access.', 'Dùng giải pháp customer identity như Cognito khi phù hợp; Identity Center chủ yếu giải quyết workforce access.', 'Đúng: chọn dịch vụ theo nhóm người dùng và chức năng cần thiết.'] ] },
  { en: 'Which TWO tests provide useful ABAC negative coverage? (Choose TWO.)', vi: 'Hai phép thử nào tạo negative coverage hữu ích cho ABAC? (Chọn HAI.)', section: 'abac', answers: [1, 3], explanation: 'Phải chứng minh không match và không được tự sửa attribute để vượt ranh giới.', choices: [
    ['Only test the administrator account.', 'Chỉ thử account quản trị.', 'Sai: không kiểm ranh giới quyền của principal mục tiêu.'],
    ['Attempt access to a resource tagged for a different project.', 'Thử truy cập resource có tag project khác.', 'Đúng: kiểm tra phân vùng giữa các dự án.'],
    ['Inspect only whether the policy has a valid JSON comma.', 'Chỉ xem dấu phẩy JSON hợp lệ.', 'Sai: cú pháp không đủ chứng minh authorization.'],
    ['Attempt unauthorized mutation of the Project resource or session attribute.', 'Thử sửa Project resource/session attribute khi không được ủy quyền.', 'Đúng: kiểm tra đường nâng quyền qua tag mutation.'],
    ['Assume every service supports the same condition keys.', 'Cho rằng mọi service hỗ trợ cùng condition keys.', 'Sai: cần kiểm support theo action, không là một test.'] ] },
  { en: 'A GitHub workflow starts using a deployment environment, and a branch-shaped subject condition no longer matches. What should the engineer do?', vi: 'Workflow GitHub chuyển sang deployment environment và condition subject dạng branch không còn match. Nên làm gì?', section: 'oidc', answers: [0], explanation: 'Subject có hình dạng phụ thuộc context workflow; sửa trust theo claim được duyệt, không mở wildcard mọi repo.', choices: [
    ['Verify the actual approved environment subject claim and update the narrowly scoped trust.', 'Xác minh subject claim environment được duyệt rồi cập nhật trust hẹp tương ứng.', 'Đúng: giữ ràng buộc repo/environment chính xác theo token thực tế.'],
    ['Replace the subject condition with an unrestricted wildcard.', 'Thay subject condition bằng wildcard không hạn chế.', 'Sai: có thể cấp quyền workload không liên quan.'],
    ['Keep the old subject condition and only increase the STS session duration.', 'Giữ subject condition cũ và chỉ tăng STS session duration.', 'Sai: token không match trust sẽ không vào được role; thời hạn phiên chỉ có ý nghĩa sau authorization phù hợp.'],
    ['Change only the role permissions policy to add more deployment actions.', 'Chỉ thêm deployment actions vào permissions policy role.', 'Sai: thiếu quyền API sau assume khác với subject mismatch lúc federation; mở quyền không sửa trust.'] ] },
  { en: 'An employee changes teams in the corporate directory. What should the ABAC validation plan include?', vi: 'Nhân viên đổi nhóm trong directory công ty. Kế hoạch kiểm chứng ABAC nên có gì?', section: 'oidc', answers: [2], explanation: 'Cần kiểm context phiên mới và lifecycle các phiên đã phát; không giả định sửa directory lập tức đổi mọi request đang tồn tại.', choices: [
    ['Assume all existing sessions immediately acquire the new Project.', 'Cho rằng mọi phiên hiện có lập tức nhận Project mới.', 'Sai: session attributes và credentials đã phát cần được xét riêng.'],
    ['Keep old and new project access forever.', 'Giữ cả quyền project cũ và mới mãi mãi.', 'Sai: không đáp ứng quyền theo nhóm hiện tại.'],
    ['Verify updated attributes in new sessions and address previously issued sessions according to revocation requirements.', 'Xác minh attributes mới trong phiên mới và xử lý phiên đã phát theo yêu cầu thu hồi.', 'Đúng: kiểm đầy đủ chuyển nhóm và access lifecycle.'],
    ['Delete every resource from the former project.', 'Xóa mọi tài nguyên của project cũ.', 'Sai: thay membership không yêu cầu phá tài nguyên.'] ] },
  { en: 'The ABAC snippet permits StartInstances and StopInstances. Does it also permit DescribeInstances and CreateTags?', vi: 'Snippet ABAC Allow StartInstances và StopInstances. Nó có tự cho DescribeInstances và CreateTags không?', section: 'abac', answers: [1], explanation: 'Policy cấp đúng các actions nêu; list/describe/tag cần được đánh giá và cấp riêng theo support.', choices: [
    ['Yes, all EC2 actions are implied by any EC2 permission.', 'Có, mọi EC2 action được suy ra từ một EC2 permission.', 'Sai: IAM action không tự mở rộng theo service như vậy.'],
    ['No; additional actions require explicit analysis and appropriate grants.', 'Không; action khác cần phân tích và grant phù hợp riêng.', 'Đúng: giữ least privilege và kiểm tra condition/resource support cho từng action.'],
    ['Yes, because Terraform ignores the Action list.', 'Có vì Terraform bỏ qua Action list.', 'Sai: jsonencode tạo policy theo document đã khai báo.'],
    ['No, because tags cannot be used for any EC2 authorization.', 'Không vì tags không thể dùng cho bất kỳ EC2 authorization nào.', 'Sai: một số actions hỗ trợ conditions theo tag như trong snippet.'] ] }
]);
