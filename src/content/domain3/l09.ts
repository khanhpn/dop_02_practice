import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'd3-l09', number: 38, domainId: 3, chapterId: '3.3',
  title: 'DR strategy: RTO, RPO, pilot light và warm standby',
  summary: 'Chọn chiến lược khôi phục theo dữ liệu và thời gian chấp nhận, tự động hóa các bước nhưng giữ tiêu chí chuyển vùng, kiểm chứng và failback rõ ràng.',
  duration: 100,
  objectives: ['Chọn backup/restore, pilot light, warm/hot standby hoặc active-active theo yêu cầu.', 'Tính recovery timeline và data gap thay vì gán cam kết cố định cho tên chiến lược.', 'Thiết kế failover, write fencing, dependency recovery và failback có kiểm chứng.'],
  prerequisites: ['Biết multi-AZ khác multi-Region, replication khác backup.', 'Hiểu Route 53, IAM role, KMS và IaC ở mức khái niệm.'],
  sections: [
    { id: 'd3-l09-s1', title: 'Chọn disaster scenario trước khi chọn dịch vụ', paragraphs: [
      'Disaster recovery, viết tắt DR, là khôi phục sau sự cố vượt phạm vi vận hành bình thường đã được định nghĩa. Có thể là Region không phục vụ, dữ liệu bị xóa sai, credentials bị lạm dụng hoặc hệ thống phụ thuộc ngoài bị gián đoạn dài. Mỗi loại sự cố cần đường khôi phục khác nhau. Replica ở Region khác giúp trước một số lỗi hạ tầng nhưng có thể nhận cùng thay đổi dữ liệu sai. Backup ở cùng failure domain có thể không đáp ứng yêu cầu mất toàn Region. Vì vậy tài liệu DR phải ghi rõ sự cố nào thuộc phạm vi, mốc bắt đầu đo và chức năng nào được coi là phục hồi thành công.',
      'RTO là thời gian gián đoạn cho phép; RPO là khoảng dữ liệu có thể mất tính tới điểm phục hồi. Đặt hai mục tiêu cùng owner kinh doanh rồi xem dependency nào có mục tiêu tương thích. Một luồng được yêu cầu phục hồi trong 15 phút không thể chắc chắn đạt nếu dịch vụ identity bắt buộc chỉ được phục hồi sau hai giờ. Tương tự, database đã khôi phục nhưng credentials, DNS, certificates hoặc artifact repository chưa dùng được thì workload vẫn chưa sẵn sàng. Phân tích downtime và mất dữ liệu theo tác động thực giúp tránh chọn active-active phức tạp cho một batch có thể chờ, hoặc chọn backup quá thưa cho dữ liệu giao dịch không thể tạo lại.'
    ] },
    { id: 'd3-l09-s2', title: 'Backup/restore và pilot light', paragraphs: [
      'Backup and restore duy trì dữ liệu và artifact cần thiết để dựng lại workload khi cần. Nó thường giảm chi phí tài nguyên chạy dự phòng nhưng cần thời gian restore, provisioning, bootstrap và kiểm chứng. IaC làm việc tái tạo nhất quán hơn; nó không chứa thay dữ liệu, secret access hoặc service quotas. Backup thành công chỉ xác nhận công việc sao lưu theo phạm vi đó, chưa chứng minh restore sử dụng được. Cần kiểm tra recovery point, encryption key, quyền restore và tính nhất quán giữa các thành phần; một database snapshot và object backup ở thời điểm khác nhau có thể cần reconciliation để ứng dụng dùng đúng.',
      'Pilot light giữ các thành phần lõi cần cho replication và nền tảng phục hồi ở Region dự phòng, còn các phần phục vụ chưa đủ để nhận request khi chưa hành động thêm. Ví dụ dữ liệu đã replicate nhưng cần tạo hoặc khởi động application tier trước khi route traffic. Điều làm pilot light khác warm standby là khả năng xử lý request hiện tại, không phải chỉ số lượng server. Muốn đạt RTO, phải tính cả thời gian cấp phát và phụ thuộc control plane. Kiểm tra trước quota, image, network, cấu hình và quyền cross-Region; chuẩn bị template nhưng chưa từng thử trong recovery Region là một giả định rủi ro chứ không phải bằng chứng sẵn sàng.'
    ] },
    { id: 'd3-l09-s3', title: 'Warm standby, hot standby và active-active', paragraphs: [
      'Warm standby có một bản workload hoạt động đầy đủ ở quy mô nhỏ hơn trong Region dự phòng. Nó có thể xử lý traffic trong giới hạn capacity sẵn có, rồi scale để đáp ứng nhu cầu production. Việc luôn có đường giao dịch hoạt động giúp kiểm thử dễ hơn pilot light nhưng vẫn cần đo thời gian scale và kiểm tra downstream. Nếu mục tiêu đòi phục vụ full load ngay mà không chờ cấp phát, warm capacity nhỏ có thể chưa đủ; hot standby chạy capacity đầy đủ ở phía passive là một đánh đổi chi phí. Không gán một RTO cố định cho tên chiến lược vì data volume, boot time, routing và runbook thay đổi kết quả thực tế.',
      'Multi-site active-active phục vụ traffic từ nhiều Regions. Mất một Region vẫn cần route traffic khỏi vùng lỗi và chứng minh các Regions còn lại chịu được tải. Dữ liệu đa điểm ghi đòi semantics rõ về consistency, conflict và quyền ghi; active-active ở compute không tự biến relational database một writer thành multi-writer. Triển khai lỗi đồng loạt và dữ liệu bị phá có thể ảnh hưởng mọi Region, nên backup và safe deployments vẫn cần. Độ phức tạp vận hành, chi phí và yêu cầu kiểm thử tăng đáng kể; chọn mô hình này khi mục tiêu kinh doanh thực sự cần, không vì có thể thêm một Region bằng IaC.'
    ] },
    { id: 'd3-l09-s4', title: 'Failover tự động cần guard conditions', paragraphs: [
      'Một runbook tốt điều phối phát hiện, xác nhận scope lỗi, kiểm tra recovery point, bảo đảm quyền ghi, chuẩn bị capacity, xác minh health rồi mới chuyển traffic theo thiết kế. Fencing nghĩa là ngăn phía cũ tiếp tục ghi khi chuyển vai trò, tránh hai phía cùng nhận writes ngoài mô hình cho phép. Chỉ đổi DNS không xử lý data promotion hoặc split brain. DNS caches và connection cũ cũng có thể khiến traffic không đổi tức thì ở mọi client. Với yêu cầu nghiêm ngặt, giảm phụ thuộc control plane trong đường phục hồi thiết yếu và dùng cơ chế routing/data-plane đã được chuẩn bị khi có thể.',
      'Automated recovery không bắt buộc mọi quyết định đều tự kích hoạt bởi một health check. False positive có thể dẫn đến promotion không cần thiết, mất phần dữ liệu chưa replicate hoặc gây gián đoạn thêm. Có thể giữ manual approval ở điểm khởi đầu nhưng tự động hóa các bước bên dưới bằng runbook có quyền tối thiểu, idempotency, retries có giới hạn và audit. Trigger cần dựa vào tín hiệu có ý nghĩa, tránh chỉ dùng một probe từ một vị trí. Điều kiện hủy, điểm không thể đảo đơn giản và người có quyền quyết định phải rõ. Nếu recovery Region chưa ready, việc liên tục flip routing giữa hai nơi thường không thay thế việc điều tra nguyên nhân.'
    ] },
    { id: 'd3-l09-s5', title: 'Đo recovery capability và lập kế hoạch quay về', paragraphs: [
      'Test DR phải phục hồi dữ liệu và chạy giao dịch đại diện, không chỉ nhìn resource available hoặc job completed. Ghi actual interruption-to-service time và point của dữ liệu phục hồi. Mục tiêu là RTO/RPO, còn con số đo được là capability của thiết kế trong điều kiện test. Test một lần với database rất nhỏ không chứng minh production data volume sẽ phục hồi cùng tốc độ. Kiểm tra configuration drift ở recovery Region, artifact versions, service quotas, permissions và khả năng lấy secret trước mỗi lần diễn tập phù hợp. Backup copy cần được xác minh completed và có thể decrypt; thấy tên recovery point ở console chưa đủ.',
      'Failback là đưa workload về vị trí hoặc topology mong muốn sau khi ổn định. Nó cần kế hoạch đồng bộ dữ liệu mới ở recovery side, quyết định write authority, traffic transition và kiểm chứng. Không chỉ chuyển DNS về primary đã chạy lại vì primary có thể thiếu các writes mới. Tách failover incident khỏi quyết định failback giúp không gây một outage thứ hai do vội vàng. Sau test hoặc incident, dọn tài nguyên restore trong đúng phạm vi, giữ bằng chứng và sửa runbook theo thời gian thực đã quan sát. Trong đề, ưu tiên phương án có đường kiểm chứng toàn bộ mục tiêu và dependency, thay vì một lời hứa khôi phục tức thì từ tên dịch vụ.'
    ] }
  ],
  diagram: { title: 'Một đường failover phải giữ dữ liệu và quyền ghi', steps: [
    { label: 'Detect and decide', detail: 'Xác nhận disaster scope, mục tiêu và quyền kích hoạt recovery.' },
    { label: 'Validate recovery point', detail: 'Kiểm tra freshness, consistency, encryption access và phần dữ liệu có thể mất.' },
    { label: 'Fence and prepare', detail: 'Kiểm soát writer cũ; promote/restore và chuẩn bị capacity theo runbook.' },
    { label: 'Verify destination', detail: 'Kiểm tra health và giao dịch tại recovery side trước traffic cutover.' },
    { label: 'Route and measure', detail: 'Chuyển traffic theo kế hoạch, đo RTO/RPO và theo dõi client behavior.' },
    { label: 'Plan failback', detail: 'Đồng bộ dữ liệu và kiểm soát write authority trước khi quay lại.' }
  ], caption: 'Traffic routing là một bước trong recovery, không phải toàn bộ recovery.' },
  scenarios: [
    { title: 'Bản dự phòng có database nhưng chưa có app', context: 'Recovery Region replicate dữ liệu liên tục, có network và artifact, nhưng phải dựng app tier trước khi xử lý request.', solution: 'Phân loại pilot light; đo provisioning/bootstrap và xác minh quota để biết có đạt RTO không.', tradeoff: 'Chi phí thấp hơn bản chạy đầy đủ nhưng phụ thuộc nhiều hơn vào control plane và capacity khi sự cố.' },
    { title: 'Warm standby quá nhỏ cho full load', context: 'Recovery side xử lý được smoke test nhưng chỉ chịu một phần traffic production. Mục tiêu yêu cầu full load ngay khi đổi vùng.', solution: 'Tăng running capacity hoặc điều chỉnh mục tiêu được kinh doanh duyệt; nếu phải chờ scaling thì ghi rõ khoảng thời gian đó trong recovery timeline.', tradeoff: 'Capacity dự phòng lớn hơn tăng chi phí, nhưng giảm delay và rủi ro cấp phát lúc disaster.' },
    { title: 'Primary hồi phục nhưng dữ liệu đã cũ', context: 'Sau failover, khách hàng tiếp tục ghi ở Region dự phòng. Primary trở lại và nhóm muốn chuyển DNS ngay.', solution: 'Lập failback với đồng bộ các writes mới, kiểm soát writer và kiểm chứng dữ liệu trước cutover.', tradeoff: 'Quay về chậm hơn nhưng tránh mất dữ liệu hoặc split brain do hai phía không đồng nhất.' }
  ],
  keyTakeaways: ['RTO và RPO là mục tiêu riêng cần đo theo disaster scenario.', 'Pilot light chưa xử lý request được nếu chưa hành động thêm; warm standby hoạt động ở capacity nhỏ hơn.', 'Hot standby và active-active cần xem full-load capacity và data semantics.', 'Replication không thay backup trước lỗi logic.', 'Failover cần guard conditions, quyền ghi và kiểm chứng trước/sau routing.', 'Failback phải xử lý dữ liệu mới phát sinh tại recovery side.'],
  examTraps: ['Gán RTO/RPO bảo đảm chỉ từ tên strategy.', 'Coi template IaC là backup đầy đủ của workload.', 'Chỉ đổi DNS mà bỏ data promotion và write fencing.', 'Coi manual initiation nghĩa là các bước recovery không được automation.', 'Coi active-active bảo vệ khỏi mọi dữ liệu bị xóa sai.', 'Chuyển traffic về primary ngay khi primary running mà không đồng bộ writes mới.'],
  code: { title: 'Trích đoạn Automation gate kiểm tra resource trước bước tiếp', deployable: false,
    cloudformation: `# Partial recovery runbook: verifies instance state only.
# It does not restore data, promote writers or change traffic.
Resources:
  RecoveryGate:
    Type: AWS::SSM::Document
    Properties:
      DocumentType: Automation
      Content:
        schemaVersion: '0.3'
        description: Check a recovery instance before later recovery steps
        parameters:
          InstanceId:
            type: String
        mainSteps:
          - name: AssertRunning
            action: aws:assertAwsResourceProperty
            inputs:
              Service: ec2
              Api: DescribeInstances
              InstanceIds: ['{{ InstanceId }}']
              PropertySelector: '$.Reservations[0].Instances[0].State.Name'
              DesiredValues: [running]`,
    terraform: `# Partial recovery runbook; execution role and later gates are omitted.
resource "aws_ssm_document" "recovery_gate" {
  name = "DopRecoveryGate"
  document_type = "Automation"
  content = jsonencode({
    schemaVersion = "0.3"
    description = "Check a recovery instance state"
    parameters = { InstanceId = { type = "String" } }
    mainSteps = [{
      name = "AssertRunning"
      action = "aws:assertAwsResourceProperty"
      inputs = {
        Service = "ec2"
        Api = "DescribeInstances"
        InstanceIds = ["{{ InstanceId }}"]
        PropertySelector = "$.Reservations[0].Instances[0].State.Name"
        DesiredValues = ["running"]
      }
    }]
  })
}`,
    explanation: 'Đoạn code chỉ minh họa một gate, chưa phải runbook DR hoàn chỉnh và không nên triển khai như giải pháp recovery. Một instance running chưa chứng minh ứng dụng/backup/dữ liệu dùng được. Bổ sung execution role có phạm vi, recovery-point checks, fencing, application health, approval/cutover và audit theo thiết kế trước khi dùng. Terraform provider và role không nằm trong excerpt.'
  },
  lab: { title: 'Tabletop RTO/RPO và lựa chọn DR strategy', duration: 50,
    prerequisites: ['Giấy hoặc worksheet; không cần AWS credentials.', 'Bộ giả định: mất Region lúc 12:00, RTO 60 phút, RPO năm phút; các thời lượng ở bước tiếp là số bài tập, không phải cam kết AWS.', 'Hiểu các steps phát hiện, chuẩn bị dữ liệu/app, routing và verification.'],
    cost: 'Lab offline không tạo tài nguyên. Bài restore thực tế có thể tính phí backup storage, copy cross-Region, EC2/database phục hồi, logs và traffic; cần xác định cleanup trước khi dựng test.',
    steps: [
      { title: 'Đặt mốc đo', detail: 'Viết disaster scope mất Region, thời điểm interruption 12:00, phục hồi là checkout thành công ở tải yêu cầu. Ghi RTO/RPO riêng.', expected: 'Deadline phục hồi là 13:00; recovery point cần nằm không sớm hơn 11:55 theo giả định.' },
      { title: 'Đánh giá backup candidate', detail: 'Candidate A có recovery point mới nhất 11:50, restore/app/routing/test tổng 40 phút. Chấm từng mục tiêu.', expected: 'RTO mô hình đạt 40 phút nhưng RPO mất mười phút vượt năm phút; không đạt toàn bộ yêu cầu.' },
      { title: 'Đánh giá pilot light candidate', detail: 'Candidate B có điểm dữ liệu 11:58:30. Detect/approve năm phút, app prepare 12 phút, routing hai phút, validation ba phút; giả định tất cả tuần tự và dependencies sẵn.', expected: 'Data gap 90 giây; timeline 22 phút. Mô hình đạt cả hai, nhưng các giả định còn phải kiểm thử thực.' },
      { title: 'Phân loại warm standby', detail: 'Candidate C có toàn workload đang chạy ở recovery Region, nhận được giao dịch nhỏ nhưng cần scale để chịu full load. Phân loại và ghi thời gian còn thiếu.', expected: 'Warm standby; chưa được tuyên bố full-load RTO nếu chưa đo scaling/downstream readiness.' },
      { title: 'Thêm dependency failure', detail: 'Giả định recovery app cần một secret chỉ lấy được từ primary Region đang mất. Sửa đánh giá B/C và đề xuất loại bỏ dependency đó theo thiết kế được phép.', expected: 'Kết luận đạt ban đầu không còn hợp lệ; phải có recovery-side credentials/config access và test quyền/decrypt.' },
      { title: 'Viết cutover gate', detail: 'Liệt kê data-point check, writer fencing, app health, intended traffic load, approval nếu cần và rollback/abort criteria. Không đổi DNS thật.', expected: 'Runbook nêu rõ traffic switch không thay data promotion hoặc quyền ghi.' },
      { title: 'Lập failback và cleanup', detail: 'Giả định recovery side phát sinh thêm đơn hàng sau 12:22. Ghi thứ tự sync writes, kiểm soát writer, xác minh primary và chuyển traffic có giám sát.', expected: 'Không mất đơn mới do quay về primary cũ; worksheet có cleanup chỉ cho test resources đã tạo nếu chạy diễn tập thực.' }
    ],
    cleanup: ['Không có AWS resource được lab này tạo.', 'Giữ worksheet, assumptions và kết quả chấm từng mục tiêu như bằng chứng thiết kế; đánh dấu chưa thực nghiệm.', 'Nếu thực hiện restore drill riêng, xóa đúng recovered resources/logs test sau validation; không xóa backup retention hoặc recovery points production để dọn lab.'],
    challenge: 'Nếu thời gian app prepare ở B tăng lên 55 phút và các bước khác giữ nguyên, tính lại RTO. Nêu cách giảm thời gian bằng running capacity/automation và trade-off chi phí, không chỉ đổi tên strategy.'
  },
  sources: [
    { title: 'DR objectives', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html' },
    { title: 'Disaster recovery options', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' },
    { title: 'Business continuity planning', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html' },
    { title: 'Defined recovery strategies', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_disaster_recovery.html' },
    { title: 'Integrate resiliency testing', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_tracking_change_management_resiliency_testing.html' }
  ], reviewedAt: '2026-10-19',
  questions: [
    { id: 'd3-l09-q01', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['rto', 'rpo'], reviewSection: 'd3-l09-s1', prompt: { en: 'Recovery finishes within a 60-minute RTO, but the restored data is 20 minutes older than a 5-minute RPO permits. Which assessment is correct?', vi: 'Recovery hoàn tất trong RTO 60 phút nhưng dữ liệu phục hồi cũ hơn 20 phút, vượt RPO năm phút. Đánh giá nào đúng?' }, options: [
      { id: 'a', en: 'The recovery time objective is met, but the data-loss objective is not.', vi: 'Đạt mục tiêu thời gian nhưng không đạt mục tiêu mất dữ liệu.', explanation: 'Đúng: hai mục tiêu được đánh giá riêng; đạt một không bù cho vi phạm mục tiêu kia.' },
      { id: 'b', en: 'Both objectives are met because the workload is running.', vi: 'Đạt cả hai vì workload đang chạy.', explanation: 'Sai: running không làm recovery point mới hơn.' },
      { id: 'c', en: 'RPO measures restore duration, so it is irrelevant to data freshness.', vi: 'RPO đo thời lượng restore nên không liên quan freshness.', explanation: 'Sai: RPO đo mức mất dữ liệu được chấp nhận theo thời gian.' },
      { id: 'd', en: 'A faster DNS change would necessarily fix the old recovery point.', vi: 'Đổi DNS nhanh hơn chắc chắn sửa recovery point cũ.', explanation: 'Sai: routing speed không phục hồi dữ liệu đã thiếu.' }
    ], correct: ['a'], explanation: 'DR strategy phải đáp ứng cả thời gian phục vụ và điểm dữ liệu theo mục tiêu.' },
    { id: 'd3-l09-q02', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['pilot-light'], reviewSection: 'd3-l09-s2', prompt: { en: 'The recovery Region continuously receives replicated data, but application servers must be provisioned before any request can be served. Which strategy best describes this?', vi: 'Recovery Region liên tục nhận replicated data nhưng phải provision app servers trước khi phục vụ được request. Strategy nào mô tả phù hợp nhất?' }, options: [
      { id: 'a', en: 'Pilot light.', vi: 'Pilot light.', explanation: 'Đúng: lõi phục hồi có sẵn nhưng chưa xử lý request nếu không hành động thêm.' },
      { id: 'b', en: 'Warm standby with a fully functional running application.', vi: 'Warm standby có ứng dụng chạy đầy đủ chức năng.', explanation: 'Sai: đề nói chưa thể phục vụ request trước provisioning.' },
      { id: 'c', en: 'Multi-site active-active.', vi: 'Multi-site active-active.', explanation: 'Sai: recovery Region chưa đang phục vụ traffic.' },
      { id: 'd', en: 'Hot standby at full production capacity.', vi: 'Hot standby đủ production capacity.', explanation: 'Sai: app tier chưa được provision nên không có full running capacity.' }
    ], correct: ['a'], explanation: 'Phân loại theo trạng thái có thể phục vụ và hành động cần thêm, không chỉ dựa vào việc có data replica.' },
    { id: 'd3-l09-q03', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'multiple', difficulty: 'professional', tags: ['warm-standby'], reviewSection: 'd3-l09-s3', prompt: { en: 'Which TWO characteristics distinguish a typical warm standby design?', vi: 'HAI đặc điểm nào nhận diện thiết kế warm standby thông thường?' }, options: [
      { id: 'a', en: 'A fully functional workload is already running in the recovery Region.', vi: 'Workload đầy đủ chức năng đã chạy ở recovery Region.', explanation: 'Đúng: có thể phục vụ trong capacity sẵn có.' },
      { id: 'b', en: 'Capacity is smaller than full production and may require scaling for full load.', vi: 'Capacity nhỏ hơn full production và có thể cần scaling để chịu đủ tải.', explanation: 'Đúng: đây là đánh đổi chi phí/thời gian phổ biến của warm standby.' },
      { id: 'c', en: 'No application request can be served until the entire app tier is created.', vi: 'Không request nào được phục vụ trước khi tạo cả app tier.', explanation: 'Sai: mô tả gần pilot light hơn một warm environment đầy đủ chức năng.' },
      { id: 'd', en: 'The name guarantees a fixed recovery time for every workload.', vi: 'Tên strategy bảo đảm recovery time cố định cho mọi workload.', explanation: 'Sai: thời gian thực phụ thuộc capacity, dữ liệu, routing và quy trình.' },
      { id: 'e', en: 'Backups are unnecessary because data replication is present.', vi: 'Không cần backup vì có data replication.', explanation: 'Sai: replication có thể truyền lỗi logic và không thay mọi recovery point.' }
    ], correct: ['a', 'b'], explanation: 'Warm standby là running functionality với scale nhỏ; muốn biết RTO phải đo đường phục hồi thực.' },
    { id: 'd3-l09-q04', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['backup-restore', 'cost'], reviewSection: 'd3-l09-s2', prompt: { en: 'A noncritical system tolerates a long tested recovery time and a data gap aligned with its backup schedule. Ongoing standby compute cost should be minimized. Which is the strongest initial candidate?', vi: 'Hệ thống ít quan trọng chấp nhận recovery lâu đã test và data gap phù hợp lịch backup. Cần giảm chi phí standby compute thường xuyên. Candidate đầu tiên tốt nhất?' }, options: [
      { id: 'a', en: 'Backup and restore with reproducible infrastructure and verified recovery tests.', vi: 'Backup and restore cùng hạ tầng tái tạo được và recovery tests xác minh.', explanation: 'Đúng: phù hợp khi mục tiêu chấp nhận thời gian dựng lại mà không cần luôn chạy standby lớn.' },
      { id: 'b', en: 'Full active-active in several Regions without evaluating requirements.', vi: 'Full active-active nhiều Regions không đánh giá yêu cầu.', explanation: 'Sai: tăng chi phí/phức tạp chưa được yêu cầu và trái mục tiêu standby cost.' },
      { id: 'c', en: 'A DNS failover record pointing to an environment that has no recoverable data.', vi: 'DNS failover record tới môi trường không có dữ liệu phục hồi.', explanation: 'Sai: routing không thay backup hoặc dựng lại workload.' },
      { id: 'd', en: 'Only retain the source template and discard data backups.', vi: 'Chỉ giữ source template và bỏ data backups.', explanation: 'Sai: IaC không thay dữ liệu của ứng dụng.' }
    ], correct: ['a'], explanation: 'Chọn strategy ít phức tạp nhất đã chứng minh đáp ứng mục tiêu, không tự đầu tư mức cao hơn.' },
    { id: 'd3-l09-q05', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['replication', 'logical-error'], reviewSection: 'd3-l09-s1', prompt: { en: 'A delete bug propagates to every regional replica. Why did cross-Region replication not meet this recovery need?', vi: 'Bug delete truyền sang mọi regional replica. Vì sao cross-Region replication chưa đáp ứng nhu cầu recovery này?' }, options: [
      { id: 'a', en: 'The incident requires a usable point before logical corruption, not merely another current replica.', vi: 'Incident cần điểm dùng được trước lỗi logic, không chỉ replica hiện tại khác.', explanation: 'Đúng: live replication có thể đồng bộ chính thay đổi sai.' },
      { id: 'b', en: 'Cross-Region replication automatically restores deleted records after a fixed delay.', vi: 'Cross-Region replication tự restore records đã xóa sau delay cố định.', explanation: 'Sai: không được giả định cơ chế hồi phục lịch sử từ live replication.' },
      { id: 'c', en: 'Adding DNS health checks alone reconstructs the missing records.', vi: 'Chỉ thêm DNS health checks sẽ dựng lại records thiếu.', explanation: 'Sai: health routing không tái tạo dữ liệu.' },
      { id: 'd', en: 'Increasing standby CPU capacity prevents all logical deletion.', vi: 'Tăng standby CPU capacity chặn mọi logical deletion.', explanation: 'Sai: compute capacity không sửa semantics dữ liệu bị xóa.' }
    ], correct: ['a'], explanation: 'Failure scenario quyết định lớp bảo vệ; lỗi hạ tầng và lỗi logic cần các đường recovery khác nhau.' },
    { id: 'd3-l09-q06', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['rto', 'dependency'], reviewSection: 'd3-l09-s1', prompt: { en: 'An app has a 15-minute RTO but requires an identity service with a tested 2-hour recovery. What is the key issue?', vi: 'App có RTO 15 phút nhưng bắt buộc identity service đã test cần hai giờ phục hồi. Vấn đề chính là gì?' }, options: [
      { id: 'a', en: 'The hard dependency recovery capability is incompatible with the app objective.', vi: 'Recovery capability của hard dependency không tương thích mục tiêu app.', explanation: 'Đúng: app không phục vụ đủ nếu dependency bắt buộc còn chưa sẵn sàng.' },
      { id: 'b', en: 'The app RTO overrides the identity service recovery automatically.', vi: 'RTO app tự ghi đè recovery của identity service.', explanation: 'Sai: mục tiêu ghi trên giấy không đổi capability dependency.' },
      { id: 'c', en: 'Only the app instance count determines end-to-end RTO.', vi: 'Chỉ số app instances quyết định end-to-end RTO.', explanation: 'Sai: phải xét toàn bộ đường phục vụ.' },
      { id: 'd', en: 'DNS TTL alone guarantees identity recovery inside 15 minutes.', vi: 'Chỉ DNS TTL bảo đảm identity phục hồi trong 15 phút.', explanation: 'Sai: TTL không tái tạo identity data/service.' }
    ], correct: ['a'], explanation: 'RTO cần tương thích dependency hoặc có degraded/cached path đã được nghiệp vụ chấp nhận và kiểm thử.' },
    { id: 'd3-l09-q07', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'multiple', difficulty: 'professional', tags: ['recovery-test'], reviewSection: 'd3-l09-s5', prompt: { en: 'Which TWO checks provide stronger recovery evidence than a completed backup job?', vi: 'HAI kiểm tra nào cung cấp recovery evidence mạnh hơn một backup job completed?' }, options: [
      { id: 'a', en: 'Restore and validate representative data and business transactions.', vi: 'Restore và validate dữ liệu/giao dịch nghiệp vụ đại diện.', explanation: 'Đúng: chứng minh backup dùng được thay vì chỉ tồn tại.' },
      { id: 'b', en: 'Measure elapsed recovery time and the actual recovered data point.', vi: 'Đo elapsed recovery time và actual recovered data point.', explanation: 'Đúng: đối chiếu capability thực với RTO/RPO.' },
      { id: 'c', en: 'Rely on the backup name containing production.', vi: 'Dựa tên backup chứa production.', explanation: 'Sai: tên không chứng minh integrity hoặc timing.' },
      { id: 'd', en: 'Treat an instance running state as full application validation.', vi: 'Coi instance running là application validation đầy đủ.', explanation: 'Sai: còn dữ liệu, dependencies và giao dịch.' },
      { id: 'e', en: 'Test only a tiny dataset and guarantee identical production restore speed.', vi: 'Chỉ test dataset rất nhỏ rồi bảo đảm production restore cùng tốc độ.', explanation: 'Sai: volume và workload có thể đổi thời gian, cần dữ liệu đại diện.' }
    ], correct: ['a', 'b'], explanation: 'Backup verification phải đi tới sử dụng được và đo đúng mục tiêu kinh doanh.' },
    { id: 'd3-l09-q08', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['manual-approval', 'automation'], reviewSection: 'd3-l09-s4', prompt: { en: 'A false failover could lose unreplicated writes. The business requires human authorization, but repeated recovery steps must be consistent. What design fits?', vi: 'Failover nhầm có thể mất writes chưa replicate. Kinh doanh cần human authorization nhưng các bước recovery phải nhất quán. Thiết kế nào phù hợp?' }, options: [
      { id: 'a', en: 'Use a controlled approval to initiate an automated, audited recovery runbook with validation gates.', vi: 'Dùng approval có kiểm soát để khởi động automated/audited recovery runbook có validation gates.', explanation: 'Đúng: manual initiation và step automation có thể cùng tồn tại.' },
      { id: 'b', en: 'Perform every recovery action manually with no runbook because approval is required.', vi: 'Làm mọi recovery action tay không runbook vì cần approval.', explanation: 'Sai: yêu cầu quyết định của người không cấm tự động hóa thao tác lặp.' },
      { id: 'c', en: 'Fail over on any single failed probe without checking destination readiness.', vi: 'Failover theo bất kỳ probe lỗi đơn lẻ mà không kiểm destination readiness.', explanation: 'Sai: làm tăng false positives và bỏ guard conditions.' },
      { id: 'd', en: 'Disable all monitoring to prevent false alarms.', vi: 'Tắt mọi monitoring để tránh false alarms.', explanation: 'Sai: mất phát hiện lỗi và không cải thiện recovery decisions.' }
    ], correct: ['a'], explanation: 'Automation cần được đặt trong quy trình ra quyết định phù hợp tác động dữ liệu.' },
    { id: 'd3-l09-q09', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['fencing', 'split-brain'], reviewSection: 'd3-l09-s4', prompt: { en: 'An active/passive design permits only one writer. The old Region may recover while the new Region is accepting writes. What control is essential?', vi: 'Thiết kế active/passive chỉ cho một writer. Region cũ có thể hồi phục trong khi Region mới đang nhận writes. Control nào thiết yếu?' }, options: [
      { id: 'a', en: 'A tested mechanism to fence the old writer and maintain unambiguous write authority.', vi: 'Cơ chế đã test để fence writer cũ và giữ write authority không mơ hồ.', explanation: 'Đúng: tránh hai phía ghi ngoài mô hình consistency đã định.' },
      { id: 'b', en: 'Only reduce the DNS TTL and allow both databases to write independently.', vi: 'Chỉ giảm DNS TTL và cho hai databases tự ghi độc lập.', explanation: 'Sai: TTL không giải quyết split brain hoặc conflict của hệ thống một writer.' },
      { id: 'c', en: 'Only increase application MaxSize in both Regions.', vi: 'Chỉ tăng application MaxSize ở hai Regions.', explanation: 'Sai: capacity không xác định writer hợp lệ.' },
      { id: 'd', en: 'Assume all clients drop old connections immediately after a DNS edit.', vi: 'Cho rằng mọi client bỏ connection cũ ngay sau DNS edit.', explanation: 'Sai: caches/connections có thể tồn tại, càng cần kiểm soát writer.' }
    ], correct: ['a'], explanation: 'Traffic control và data write authority cần phối hợp; DNS switch đơn lẻ không bảo vệ dữ liệu.' },
    { id: 'd3-l09-q10', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['warm-standby', 'capacity'], reviewSection: 'd3-l09-s3', prompt: { en: 'Warm standby handles 10 percent of production load, but the objective requires full load immediately after failover without new provisioning. What must change?', vi: 'Warm standby chịu 10% production load nhưng mục tiêu đòi full load ngay sau failover không cấp phát thêm. Cần đổi gì?' }, options: [
      { id: 'a', en: 'Provide sufficient already-running recovery capacity or revise the accepted objective explicitly.', vi: 'Cung cấp đủ recovery capacity đã chạy hoặc điều chỉnh mục tiêu được chấp nhận rõ ràng.', explanation: 'Đúng: tên warm standby không biến capacity nhỏ thành full capacity tức thì.' },
      { id: 'b', en: 'Rename the same environment hot standby without changing resources.', vi: 'Đổi tên môi trường thành hot standby mà không đổi resources.', explanation: 'Sai: nhãn không tạo throughput.' },
      { id: 'c', en: 'Raise only MaxSize and claim no provisioning dependency remains.', vi: 'Chỉ tăng MaxSize rồi nói không còn provisioning dependency.', explanation: 'Sai: maximum là bound, capacity mới vẫn phải được cấp phát.' },
      { id: 'd', en: 'Skip load testing because smoke tests already pass.', vi: 'Bỏ load testing vì smoke tests đã đạt.', explanation: 'Sai: smoke test ít tải không chứng minh full-load capability.' }
    ], correct: ['a'], explanation: 'Muốn loại thời gian scale khỏi đường phục hồi thiết yếu phải đầu tư capacity sẵn có hoặc chấp nhận mục tiêu khác.' },
    { id: 'd3-l09-q11', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'multiple', difficulty: 'professional', tags: ['active-active'], reviewSection: 'd3-l09-s3', prompt: { en: 'Which TWO concerns remain in a multi-Region active-active workload?', vi: 'HAI lo ngại nào vẫn còn trong workload multi-Region active-active?' }, options: [
      { id: 'a', en: 'Surviving Regions need enough capacity for traffic shifted from a failed Region.', vi: 'Regions sống sót cần đủ capacity cho traffic chuyển từ Region lỗi.', explanation: 'Đúng: đang active không bảo đảm capacity còn lại chịu tổng tải.' },
      { id: 'b', en: 'Data consistency, write conflicts, and recovery from logical corruption still require design.', vi: 'Data consistency, write conflicts và recovery sau lỗi logic vẫn cần thiết kế.', explanation: 'Đúng: active compute không tự giải quyết semantics hoặc lịch sử dữ liệu.' },
      { id: 'c', en: 'All backups can be removed because active-active prevents every deletion bug.', vi: 'Có thể bỏ mọi backup vì active-active ngăn mọi deletion bug.', explanation: 'Sai: lỗi dữ liệu có thể lan qua replication.' },
      { id: 'd', en: 'A relational single-writer database automatically becomes multi-writer.', vi: 'Relational database single-writer tự thành multi-writer.', explanation: 'Sai: kiến trúc data cần tính năng và mô hình riêng.' },
      { id: 'e', en: 'Simultaneous unvalidated deployments cannot affect independent Regions.', vi: 'Deploy đồng loạt chưa validate không thể ảnh hưởng Regions độc lập.', explanation: 'Sai: cùng lỗi được phát hành có thể tạo correlated application failure.' }
    ], correct: ['a', 'b'], explanation: 'Active-active giảm một số thời gian chuyển đổi nhưng không miễn capacity, consistency hoặc backup.' },
    { id: 'd3-l09-q12', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['failback'], reviewSection: 'd3-l09-s5', prompt: { en: 'The primary Region returns after customers have written new orders in the recovery Region. What is required before failback?', vi: 'Primary Region trở lại sau khi khách đã ghi đơn mới ở recovery Region. Cần gì trước failback?' }, options: [
      { id: 'a', en: 'Reconcile or synchronize new data, establish writer authority, and validate before traffic transition.', vi: 'Reconcile/synchronize dữ liệu mới, thiết lập writer authority và validate trước chuyển traffic.', explanation: 'Đúng: primary phục hồi hạ tầng có thể vẫn có dữ liệu cũ.' },
      { id: 'b', en: 'Immediately switch DNS because the primary instances are running.', vi: 'Đổi DNS ngay vì primary instances running.', explanation: 'Sai: chưa bảo đảm có các writes phát sinh sau failover.' },
      { id: 'c', en: 'Discard every new order to match the old primary snapshot.', vi: 'Bỏ mọi đơn mới để khớp snapshot primary cũ.', explanation: 'Sai: phá dữ liệu nghiệp vụ thay vì phục hồi nhất quán.' },
      { id: 'd', en: 'Run both writers independently even though the design allows only one.', vi: 'Chạy hai writers độc lập dù thiết kế chỉ cho một.', explanation: 'Sai: tạo split brain và conflict ngoài mô hình.' }
    ], correct: ['a'], explanation: 'Failback là một migration có dữ liệu mới, không chỉ đảo thao tác routing của failover.' },
    { id: 'd3-l09-q13', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['recovery-dependency', 'secrets'], reviewSection: 'd3-l09-s1', prompt: { en: 'The recovery application starts but retrieves its only usable credentials from the unavailable primary Region. What was overlooked?', vi: 'Recovery app khởi động nhưng credentials dùng được duy nhất được lấy từ primary Region đang mất. Đã bỏ sót điều gì?' }, options: [
      { id: 'a', en: 'Recovery-side availability and authorization for configuration and secrets.', vi: 'Availability và authorization của configuration/secrets phía recovery.', explanation: 'Đúng: bootstrap chạy không đủ nếu hard dependency về credentials còn ở failure domain cũ.' },
      { id: 'b', en: 'Only the visual similarity of the two network diagrams.', vi: 'Chỉ độ giống hình của hai network diagrams.', explanation: 'Sai: hình giống không chứng minh dependency độc lập.' },
      { id: 'c', en: 'Only ALB deregistration delay in the old Region.', vi: 'Chỉ ALB deregistration delay ở Region cũ.', explanation: 'Sai: không cung cấp secret cho app recovery.' },
      { id: 'd', en: 'Only the size of the backup vault name.', vi: 'Chỉ độ dài tên backup vault.', explanation: 'Sai: tên vault không tạo credentials access.' }
    ], correct: ['a'], explanation: 'DR dependency map phải bao gồm danh tính, keys, secrets và artifacts chứ không chỉ compute/database.' },
    { id: 'd3-l09-q14', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['rpo', 'calculation'], reviewSection: 'd3-l09-s5', prompt: { en: 'A disaster occurs at 12:00. The latest verified recoverable point is 11:58:30. Under a 5-minute RPO, what is the correct assessment of this data point?', vi: 'Disaster lúc 12:00. Verified recovery point mới nhất là 11:58:30. Với RPO năm phút, đánh giá điểm dữ liệu này thế nào?' }, options: [
      { id: 'a', en: 'The modeled 90-second gap is within the RPO, subject to actual data validation.', vi: 'Khoảng thiếu dữ liệu mô hình 90 giây nằm trong RPO, còn cần validate dữ liệu thật.', explanation: 'Đúng: 12:00 trừ 11:58:30 là một phút 30 giây, dưới năm phút.' },
      { id: 'b', en: 'RTO is automatically 90 seconds.', vi: 'RTO tự bằng 90 giây.', explanation: 'Sai: mốc dữ liệu không đo thời gian phục hồi dịch vụ.' },
      { id: 'c', en: 'The RPO is violated because any nonzero data gap is forbidden.', vi: 'Vi phạm RPO vì mọi data gap khác zero đều bị cấm.', explanation: 'Sai: đề cho phép năm phút, không yêu cầu zero.' },
      { id: 'd', en: 'DNS propagation time determines the timestamp of the recovered records.', vi: 'DNS propagation time quyết định timestamp records phục hồi.', explanation: 'Sai: routing không xác định recovery point của dữ liệu.' }
    ], correct: ['a'], explanation: 'Tính data gap riêng với recovery duration; cả hai đều phải được đo đúng điểm mốc.' },
    { id: 'd3-l09-q15', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'multiple', difficulty: 'professional', tags: ['pilot-light', 'control-plane'], reviewSection: 'd3-l09-s2', prompt: { en: 'Which TWO preparations reduce common pilot-light recovery risks?', vi: 'HAI chuẩn bị nào giảm rủi ro recovery pilot-light thường gặp?' }, options: [
      { id: 'a', en: 'Test recovery-region quotas, instance launch paths, artifacts, and permissions.', vi: 'Test recovery-region quotas, instance launch paths, artifacts và permissions.', explanation: 'Đúng: các bước cần cấp phát lúc sự cố phải có khả năng chạy thật.' },
      { id: 'b', en: 'Measure the complete provisioning-to-transaction timeline at representative scale.', vi: 'Đo toàn timeline từ provisioning tới transaction ở quy mô đại diện.', explanation: 'Đúng: biết capability thay vì chỉ ước lượng từ template.' },
      { id: 'c', en: 'Assume all Regions share identical quotas and instantaneous capacity.', vi: 'Cho rằng mọi Regions có quota giống nhau và capacity tức thì.', explanation: 'Sai: quota/capacity có phạm vi và giới hạn, không nên suy diễn.' },
      { id: 'd', en: 'Keep every required artifact only in the failed source Region.', vi: 'Giữ mọi artifact bắt buộc chỉ ở source Region sẽ bị lỗi.', explanation: 'Sai: tạo dependency chặn recovery.' },
      { id: 'e', en: 'Delete backups because a replica is receiving live data.', vi: 'Xóa backups vì replica đang nhận live data.', explanation: 'Sai: bỏ recovery point trước lỗi logic.' }
    ], correct: ['a', 'b'], explanation: 'Pilot light tiết kiệm capacity chạy thường xuyên nhưng cần kiểm chứng phần sẽ phải bật lên khi disaster.' },
    { id: 'd3-l09-q16', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['routing', 'dns'], reviewSection: 'd3-l09-s4', prompt: { en: 'A DNS failover record changes, but some clients continue using old endpoints and existing connections. What should the runbook account for?', vi: 'DNS failover record đổi nhưng vài clients vẫn dùng endpoints cũ và connections hiện có. Runbook cần xét gì?' }, options: [
      { id: 'a', en: 'Resolver caching, connection behavior, and data-write safety during transition.', vi: 'Resolver caching, connection behavior và an toàn ghi dữ liệu khi chuyển tiếp.', explanation: 'Đúng: cutover không nhất thiết đồng thời trên mọi client, cần guarding writer phù hợp.' },
      { id: 'b', en: 'Assume every client instantly discards all cached results.', vi: 'Giả định mọi client bỏ mọi cached result tức thì.', explanation: 'Sai: không phản ánh hành vi DNS/client thực.' },
      { id: 'c', en: 'Only change the displayed recovery strategy name.', vi: 'Chỉ đổi tên strategy hiển thị.', explanation: 'Sai: tên không thay propagation hoặc connections.' },
      { id: 'd', en: 'Treat DNS as a database replication protocol.', vi: 'Coi DNS là database replication protocol.', explanation: 'Sai: routing tên không đồng bộ dữ liệu hoặc giải quyết split brain.' }
    ], correct: ['a'], explanation: 'Runbook traffic cutover phải dựa hành vi client thực và các rào kiểm soát dữ liệu.' },
    { id: 'd3-l09-q17', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['configuration-drift'], reviewSection: 'd3-l09-s5', prompt: { en: 'The primary application has received several releases, but the recovery Region has not been tested for months. Which risk should be addressed?', vi: 'Primary app đã nhận nhiều releases nhưng recovery Region không test nhiều tháng. Cần xử lý rủi ro nào?' }, options: [
      { id: 'a', en: 'Recovery configuration, artifacts, permissions, or schemas may have drifted from the required compatible state.', vi: 'Recovery configuration, artifacts, permissions hoặc schemas có thể lệch trạng thái tương thích cần thiết.', explanation: 'Đúng: environment từng hoạt động không bảo đảm còn tương thích sau thay đổi.' },
      { id: 'b', en: 'The strategy name guarantees compatibility despite every release.', vi: 'Tên strategy bảo đảm compatibility bất kể releases.', explanation: 'Sai: không có bảo đảm compatibility từ nhãn kiến trúc.' },
      { id: 'c', en: 'A larger DNS TTL automatically migrates schemas.', vi: 'DNS TTL lớn hơn tự migrate schemas.', explanation: 'Sai: caching tên không cập nhật application/data schema.' },
      { id: 'd', en: 'A previous passing smoke test permanently proves production-scale RTO.', vi: 'Smoke test cũ đạt vĩnh viễn chứng minh production-scale RTO.', explanation: 'Sai: releases, dữ liệu và volume thay đổi đòi kiểm chứng lại phù hợp.' }
    ], correct: ['a'], explanation: 'DR là năng lực cần duy trì qua vòng đời thay đổi, không phải thiết kế xác nhận một lần.' },
    { id: 'd3-l09-q18', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['kms', 'restore'], reviewSection: 'd3-l09-s5', prompt: { en: 'An encrypted backup copy exists in the recovery Region, but the recovery role cannot decrypt it. What is the direct lesson?', vi: 'Encrypted backup copy tồn tại ở recovery Region nhưng recovery role không decrypt được. Bài học trực tiếp là gì?' }, options: [
      { id: 'a', en: 'Recovery readiness includes key availability and effective authorization, not only copy existence.', vi: 'Recovery readiness gồm key availability và effective authorization, không chỉ copy tồn tại.', explanation: 'Đúng: dữ liệu không đọc được thì backup chưa chứng minh dùng được trong runbook.' },
      { id: 'b', en: 'All cross-Region copies automatically ignore KMS authorization.', vi: 'Mọi cross-Region copies tự bỏ qua KMS authorization.', explanation: 'Sai: mã hóa/quyền vẫn là điều kiện cần kiểm tra.' },
      { id: 'c', en: 'A DNS health check grants decrypt permission.', vi: 'DNS health check cấp decrypt permission.', explanation: 'Sai: routing và KMS authorization là các cơ chế khác nhau.' },
      { id: 'd', en: 'Increasing restore instance CPU replaces the missing key permissions.', vi: 'Tăng CPU instance restore thay quyền key thiếu.', explanation: 'Sai: capacity không giải quyết access denied với encryption key.' }
    ], correct: ['a'], explanation: 'Kiểm thử restore bằng role thật trong recovery context phát hiện khoảng trống mà inventory tên backup không cho thấy.' },
    { id: 'd3-l09-q19', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['rto', 'timeline'], reviewSection: 'd3-l09-s5', prompt: { en: 'Detection and approval take 5 minutes, app preparation 12, routing 2, and validation 3, all serial. What recovery time should be compared to the objective?', vi: 'Detection/approval mất năm phút, app prepare 12, routing hai, validation ba, tất cả tuần tự. Nên so thời gian recovery nào với mục tiêu?' }, options: [
      { id: 'a', en: '22 minutes from interruption through validated service restoration.', vi: '22 phút từ interruption tới validated service restoration.', explanation: 'Đúng: cộng mọi bước thuộc downtime: 5 + 12 + 2 + 3.' },
      { id: 'b', en: '12 minutes because only app preparation matters.', vi: '12 phút vì chỉ app prepare quan trọng.', explanation: 'Sai: bỏ thời gian quyết định, chuyển traffic và kiểm chứng.' },
      { id: 'c', en: '2 minutes because routing is the only DR operation.', vi: 'Hai phút vì routing là thao tác DR duy nhất.', explanation: 'Sai: workload chưa phục hồi trước khi các bước khác hoàn tất.' },
      { id: 'd', en: 'Zero because the runbook is automated.', vi: 'Không vì runbook tự động.', explanation: 'Sai: automation giảm lỗi/thời gian nhưng không xóa elapsed downtime.' }
    ], correct: ['a'], explanation: 'Đo end-to-end phục hồi chứ không chọn riêng bước nhanh nhất hoặc bước mang tên failover.' },
    { id: 'd3-l09-q20', lessonId: 'd3-l09', domainId: 3, taskId: '3.3', type: 'single', difficulty: 'professional', tags: ['strategy-selection'], reviewSection: 'd3-l09-s3', prompt: { en: 'An architect selects active-active solely because it sounds strongest, without a business RTO/RPO or consistency analysis. What is the best correction?', vi: 'Architect chọn active-active chỉ vì nghe mạnh nhất, chưa có business RTO/RPO hoặc consistency analysis. Cách điều chỉnh tốt nhất là gì?' }, options: [
      { id: 'a', en: 'Define objectives and failure scenarios, then choose and test the least complex strategy that meets them.', vi: 'Định nghĩa objectives/failure scenarios rồi chọn và test strategy ít phức tạp nhất đáp ứng chúng.', explanation: 'Đúng: mức đầu tư phải theo business need, dữ liệu và khả năng vận hành.' },
      { id: 'b', en: 'Keep active-active and assume it guarantees zero RPO for every data model.', vi: 'Giữ active-active và coi luôn bảo đảm zero RPO cho mọi data model.', explanation: 'Sai: data semantics/replication/failure scenario quyết định khả năng mất dữ liệu.' },
      { id: 'c', en: 'Choose backup/restore for every workload regardless of recovery tests.', vi: 'Chọn backup/restore cho mọi workload bất kể recovery tests.', explanation: 'Sai: cực đoan ngược lại vẫn bỏ yêu cầu từng workload.' },
      { id: 'd', en: 'Skip backup planning whenever compute runs in two Regions.', vi: 'Bỏ backup planning mỗi khi compute chạy hai Regions.', explanation: 'Sai: multi-Region compute không bảo vệ đủ trước lỗi dữ liệu logic.' }
    ], correct: ['a'], explanation: 'Tên strategy không thay yêu cầu hoặc bằng chứng; trade-off cần được phân tích và kiểm thử.' }
  ]
};
