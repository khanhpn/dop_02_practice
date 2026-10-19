import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import { Link as RouterLink } from "react-router-dom";
import { CodeTabs } from "../components/CodeTabs";
import { FlowDiagram } from "../components/FlowDiagram";
import { PageHeading } from "../components/PageHeading";
import cfn from "../labs/observability/cloudformation.yaml?raw";
import tf from "../labs/observability/main.tf?raw";
import cfnUrl from "../labs/observability/cloudformation.yaml?url";
import tfUrl from "../labs/observability/main.tf?url";
import { lessonById, lessonPath } from "../content";
const commands = {
  identify: "aws sts get-caller-identity\naws configure get region",
  deploy:
    "aws cloudformation validate-template --template-body file://cloudformation.yaml --region ap-southeast-1\naws cloudformation deploy --template-file cloudformation.yaml --stack-name dop-observability-lab --region ap-southeast-1",
  outputs:
    'aws cloudformation describe-stacks --stack-name dop-observability-lab --region ap-southeast-1 --query "Stacks[0].Outputs"',
  logs: 'lab_log_group=$(aws cloudformation describe-stacks --stack-name dop-observability-lab --region ap-southeast-1 --query "Stacks[0].Outputs[?OutputKey==\'LogGroupName\'].OutputValue" --output text)\nlab_stream="sample-$(date +%s)"\naws logs create-log-stream --log-group-name "$lab_log_group" --log-stream-name "$lab_stream" --region ap-southeast-1\naws logs put-log-events --log-group-name "$lab_log_group" --log-stream-name "$lab_stream" --log-events file://events.json --region ap-southeast-1',
  alarm:
    'lab_alarm=$(aws cloudformation describe-stacks --stack-name dop-observability-lab --region ap-southeast-1 --query "Stacks[0].Outputs[?OutputKey==\'AlarmName\'].OutputValue" --output text)\naws cloudwatch describe-alarms --alarm-names "$lab_alarm" --region ap-southeast-1 --query "MetricAlarms[0].[StateValue,StateReason,Namespace,MetricName,Statistic,TreatMissingData]"',
  events:
    'aws events put-events --region ap-southeast-1 --entries \'[{"Source":"dop.study","DetailType":"PracticeIncident","Detail":"{\\"id\\":\\"incident-001\\",\\"service\\":\\"checkout\\"}"}]\'',
  receive:
    'lab_queue=$(aws cloudformation describe-stacks --stack-name dop-observability-lab --region ap-southeast-1 --query "Stacks[0].Outputs[?OutputKey==\'IncidentQueueUrl\'].OutputValue" --output text)\naws sqs receive-message --queue-url "$lab_queue" --max-number-of-messages 1 --wait-time-seconds 10 --message-system-attribute-names All --region ap-southeast-1',
  cleanup:
    "aws cloudformation delete-stack --stack-name dop-observability-lab --region ap-southeast-1\naws cloudformation wait stack-delete-complete --stack-name dop-observability-lab --region ap-southeast-1",
  terraform:
    "terraform init\nterraform fmt -check\nterraform validate\nterraform plan -out=lab.tfplan\nterraform apply lab.tfplan\nterraform output\n# Khi kết thúc lab và đã kiểm tra đúng tài nguyên:\nterraform plan -destroy\nterraform destroy",
};
function Command({ value }: { value: string }) {
  return (
    <Box
      component="pre"
      tabIndex={0}
      className="code-block"
      sx={{ borderRadius: 2, my: 2 }}
    >
      <code>{value}</code>
    </Box>
  );
}
export function CapstoneLab() {
  const [generated, setGenerated] = useState("");
  function eventFile() {
    const timestamp = Date.now();
    const records = [1, 2, 3].map((i) => ({
      timestamp,
      message: JSON.stringify({
        level: "ERROR",
        service: "checkout",
        id: `lab-error-${i}`,
      }),
    }));
    const text = JSON.stringify(records, null, 2);
    const url = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "events.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setGenerated(new Date(timestamp).toLocaleTimeString("vi-VN"));
  }
  const steps = [
    {
      title: "Kiểm tra đúng tài khoản và khu vực thực hành",
      detail:
        "Chuẩn bị AWS CLI v2 với quyền truy cập tài khoản sandbox (tài khoản dành riêng cho thực hành). Các lệnh trong bài dùng Region (khu vực AWS) ap-southeast-1. Bạn có thể chọn khu vực khác, nhưng cần thay tên khu vực trong tất cả các lệnh để tránh tạo tài nguyên ở một nơi rồi tìm chúng ở nơi khác. Trước khi bắt đầu, chạy lệnh bên dưới và ghi lại Account cùng ARN của danh tính đang sử dụng. Danh tính này cần được cấp quyền quản lý các dịch vụ xuất hiện trong bài: CloudFormation, CloudWatch Logs, CloudWatch, SNS, EventBridge và SQS.",
      command: commands.identify,
      expected:
        "Kết quả trả về đúng mã tài khoản thực hành và ARN bạn dự định sử dụng. Việc đăng nhập được cấu hình cho AWS CLI trên máy; bạn không cần đưa khóa truy cập vào mã nguồn website.",
    },
    {
      title: "Đọc mẫu cấu hình trước khi triển khai bằng CloudFormation",
      detail:
        "Tải file cloudformation.yaml rồi mở terminal tại thư mục chứa file. Trong CloudFormation, một stack là tập hợp tài nguyên được tạo và quản lý cùng nhau theo mẫu cấu hình. Stack của bài này gồm nhóm nhật ký, bộ lọc tạo chỉ số từ nhật ký, cảnh báo CloudWatch, chủ đề thông báo SNS, quy tắc EventBridge và ba hàng đợi SQS. Hai trong ba hàng đợi là dead-letter queue (DLQ, hàng đợi giữ thông điệp gặp lỗi), phục vụ hai tình huống khác nhau mà bạn sẽ kiểm tra ở bước 7. Hãy đọc các khai báo này trước khi chạy lệnh. Nếu chưa cần nhận email, giữ tham số NotificationEmail ở giá trị rỗng. Khi muốn thử thông báo email, truyền địa chỉ vào tham số này và xác nhận đăng ký qua thư SNS gửi đến.",
      command: commands.deploy,
      expected:
        "Lệnh validate-template chấp nhận mẫu cấu hình, sau đó stack chuyển sang CREATE_COMPLETE. Nếu tạo tài nguyên thất bại, mở tab Events của stack để xem chính xác tài nguyên nào lỗi và thông báo nguyên nhân.",
    },
    {
      title: "Lấy tên và địa chỉ của những tài nguyên vừa tạo",
      detail:
        "Outputs là các giá trị mà mẫu CloudFormation trả về sau khi triển khai, chẳng hạn tên nhóm nhật ký, tên cảnh báo và URL hàng đợi. Dùng các giá trị này cho những bước tiếp theo, vì tên một số tài nguyên được CloudFormation tự tạo. Mở CloudWatch Logs, SQS và EventBridge trong cùng khu vực để đối chiếu. Quy tắc EventBridge của bài nằm trên default event bus (bus sự kiện mặc định) và chỉ nhận các sự kiện phù hợp với nguồn dop.study do bạn gửi thử.",
      command: commands.outputs,
      expected:
        "Bạn nhận được 7 giá trị đầu ra. Nhóm nhật ký có tên /dop-study/dop-observability-lab; hai hàng đợi DLQ có URL riêng nên có thể kiểm tra từng loại lỗi độc lập.",
    },
    {
      title: "Gửi ba bản ghi lỗi trong cùng một phút",
      detail:
        "Bấm nút tạo events.json ngay trước khi chạy lệnh. File chứa ba bản ghi JSON có thời gian hiện tại và mã nhận diện khác nhau; mỗi bản ghi đều có level=ERROR. Metric filter (bộ lọc tạo chỉ số từ nhật ký) sẽ cộng 1 vào ErrorCount cho mỗi bản ghi khớp điều kiện. Vì cả ba thuộc cùng một phút, tổng ErrorCount của phút đó có thể chạm ngưỡng cảnh báo là 3. Bộ lọc chỉ xử lý những bản ghi mới đi vào sau khi nó được tạo, không tự quét lại toàn bộ nhật ký cũ. Các lệnh bên dưới tạo một log stream (luồng nhật ký) mới rồi gửi cả ba bản ghi trong một lần.",
      command: commands.logs,
      expected:
        "Phản hồi PutLogEvents không báo bản ghi bị từ chối trong rejectedLogEventsInfo. Mở nhóm nhật ký và kiểm tra đủ ba bản ghi có level=ERROR, service=checkout.",
    },
    {
      title: "Kiểm tra chỉ số đang theo dõi và lý do cảnh báo",
      detail:
        "Đợi vài phút để CloudWatch tiếp nhận số liệu và đánh giá cảnh báo. Sau đó, đọc StateReason để hiểu vì sao trạng thái thay đổi, đồng thời kiểm tra đúng namespace (không gian tên), tên chỉ số và đơn vị trên biểu đồ. Cấu hình trong bài dùng Sum (tổng) của ErrorCount trong 60 giây và cảnh báo khi tổng từ 3 trở lên. Thuộc tính notBreaching coi khoảng thiếu dữ liệu là không vi phạm ngưỡng, phù hợp với chỉ số chỉ xuất hiện khi có lỗi. Tuy nhiên, chỉ dựa vào đó bạn sẽ không phân biệt được “không có lỗi” với “hệ thống đã ngừng gửi nhật ký”; muốn phát hiện trường hợp thứ hai cần thêm tín hiệu theo dõi việc thu thập dữ liệu. Nếu đã cấu hình email, hãy xác nhận đăng ký nhận thư rồi xem cả lịch sử thay đổi trạng thái của cảnh báo.",
      command: commands.alarm,
      expected:
        "Cảnh báo chuyển sang ALARM khi CloudWatch đánh giá khoảng thời gian có đủ ba lỗi. Khi khoảng đó trôi qua và không có thêm dữ liệu vi phạm, trạng thái có thể trở về OK. Hãy đọc lịch sử thay đổi thay vì kết luận rằng hệ thống chưa từng có lỗi chỉ vì trạng thái hiện tại là OK.",
    },
    {
      title: "Gửi sự kiện thử và kiểm tra quy tắc EventBridge",
      detail:
        "Ở bước này, bạn tự gửi một sự kiện để kiểm tra cách EventBridge định tuyến nó đến SQS. Nhánh này hoạt động độc lập với cảnh báo CloudWatch vừa thử; cảnh báo không tự tạo sự kiện dop.study. Event pattern (mẫu lọc sự kiện) yêu cầu source=dop.study và detail-type=PracticeIncident. Gửi sự kiện đúng mẫu trước, rồi thử đổi DetailType sang tên khác. So sánh hai lần gửi để thấy khác biệt giữa việc EventBridge chấp nhận sự kiện và việc sự kiện khớp quy tắc.",
      command: commands.events,
      expected:
        "Kết quả gửi có FailedEntryCount=0 và trả về EventId. Tiếp tục kiểm tra MatchedEvents hoặc Invocations của quy tắc và thông điệp trong hàng đợi. Chỉ riêng việc API chấp nhận sự kiện chưa chứng minh EventBridge đã chuyển được nó đến nơi nhận.",
    },
    {
      title: "Nhận thông điệp và phân biệt lỗi chuyển giao với lỗi xử lý",
      detail:
        "Lệnh ReceiveMessage bên dưới sử dụng long polling: nó chờ tối đa 10 giây để có thông điệp thay vì trả về ngay khi hàng đợi đang rỗng. Khi nhận được, hãy đọc Body, MessageId, ReceiptHandle và ApproximateReceiveCount. Sau khi xử lý thành công, ứng dụng cần gọi DeleteMessage với ReceiptHandle của lần nhận hiện tại. Để thử tình huống xử lý thất bại, bạn có thể không xoá thông điệp và nhận lại sau mỗi visibility timeout (thời gian tạm ẩn thông điệp) là 30 giây. Khi số lần nhận vượt ngưỡng đã cấu hình, SQS chuyển thông điệp sang ProcessingDLQ. Ngược lại, DeliveryDLQ giữ sự kiện mà EventBridge không chuyển được đến hàng đợi đích. Như vậy, một bên là lỗi trước khi giao tới nơi nhận, còn bên kia là lỗi sau khi ứng dụng đã có thể nhận thông điệp. Lab cơ bản chỉ cần quan sát luồng giao thành công và thử xử lý lại; bạn không cần cố tình thay đổi quyền truy cập.",
      command: commands.receive,
      expected:
        "Nội dung Body chứa incident-001. Khi EventBridge chuyển giao thành công, DeliveryDLQ vẫn rỗng. Nếu bạn thử nhận lại nhiều lần mà không xoá thông điệp, hãy kiểm tra ProcessingDLQ sau khi đạt điều kiện chuyển hàng đợi. Các chỉ số SQS là số liệu xấp xỉ và có độ trễ, nên không nên yêu cầu bộ đếm thay đổi ngay lập tức sau mỗi thao tác.",
    },
    {
      title: "Ghi lại điều đã quan sát rồi dọn tài nguyên",
      detail:
        "Trước khi kết thúc, ghi lại tên chỉ số, lịch sử cảnh báo, EventId và MessageId bạn đã quan sát. Thử tự giải thích vì sao bài này cần hai DLQ với hai nhiệm vụ khác nhau. Sau đó, kiểm tra đúng tên stack dop-observability-lab rồi mới chạy lệnh xoá. Mẫu cấu hình không đặt chính sách Retain (giữ lại tài nguyên khi xoá stack), nên CloudFormation sẽ xoá các tài nguyên thuộc stack theo thứ tự phụ thuộc. Nếu bạn cũng đã triển khai bản Terraform với tên riêng, cần dọn cả những tài nguyên do Terraform quản lý.",
      command: commands.cleanup,
      expected:
        "Stack đạt trạng thái DELETE_COMPLETE và các hàng đợi, nhóm nhật ký, chủ đề SNS, quy tắc EventBridge của lab không còn tồn tại. Chỉ số cũ vẫn có thể xuất hiện trong danh sách một thời gian. Hãy dừng mọi chương trình đang gửi dữ liệu thử để không tiếp tục phát sinh dữ liệu mới.",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="CAPSTONE · DOMAIN 4 + 5 + 6"
        title="Từ một dòng log đến phản ứng có kiểm soát"
        description="Thực hành cách phát hiện lỗi qua nhật ký, gửi cảnh báo và xử lý sự kiện bằng hàng đợi. Bạn sẽ theo dõi từng bước để hiểu hệ thống đã nhận, chuyển và xử lý dữ liệu đến đâu. CloudFormation là bản chính, kèm Terraform để đối chiếu."
      />
      <Alert severity="warning" sx={{ mb: 3 }}>
        Bài thực hành sử dụng CloudWatch Logs, chỉ số tùy chỉnh, cảnh báo, SNS,
        EventBridge và SQS nên có thể phát sinh phí. Hãy dùng tài khoản thực
        hành, chỉ gửi dữ liệu giả và dọn tài nguyên ở bước cuối. Bạn tự chạy các
        lệnh trong tài khoản AWS của mình; website không tự triển khai tài
        nguyên.
      </Alert>
      <FlowDiagram
        diagram={{
          title: "Theo dõi nhật ký và xử lý sự kiện qua hai luồng riêng",
          steps: [
            {
              label: "Nhật ký có cấu trúc",
              detail:
                "Bộ lọc nhận bản ghi JSON có level=ERROR và cộng vào ErrorCount.",
            },
            {
              label: "Chỉ số → cảnh báo → SNS",
              detail:
                "Tổng từ 3 lỗi trong một phút. Đọc StateReason để hiểu lý do cảnh báo.",
            },
            {
              label: "Sự kiện → quy tắc lọc",
              detail:
                "EventBridge kiểm tra source và detail-type trước khi gửi sang SQS.",
            },
            {
              label: "SQS → ứng dụng xử lý",
              detail:
                "Không chuyển được đến SQS: DeliveryDLQ. Nhận nhiều lần mà chưa xử lý xong: ProcessingDLQ.",
            },
          ],
          caption:
            "Hai bước đầu minh họa luồng nhật ký và cảnh báo; hai bước sau minh họa luồng sự kiện và hàng đợi. Trong bài này chúng hoạt động độc lập. Muốn cảnh báo tự kích hoạt quy trình xử lý sự cố, bạn cần bổ sung và kiểm tra cơ chế kết nối hai luồng.",
        }}
      />
      <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
        <Button
          component="a"
          href={cfnUrl}
          download="cloudformation.yaml"
          variant="contained"
          startIcon={<FileDownloadOutlined />}
        >
          Tải CloudFormation
        </Button>
        <Button
          component="a"
          href={tfUrl}
          download="main.tf"
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
        >
          Tải Terraform đối chiếu
        </Button>
      </Stack>
      <CodeTabs
        example={{
          title: "Mẫu cấu hình đầy đủ của bài thực hành",
          cloudformation: cfn,
          terraform: tf,
          deployable: true,
          explanation:
            "Chọn một công cụ để thực hành trước, rồi đối chiếu cách khai báo ở tab còn lại. Bản Terraform dùng tên riêng dop-observability-tf; hãy giữ tập tin state để Terraform biết đang quản lý những tài nguyên nào, cùng lockfile để cố định phiên bản provider. Cả hai bản đều giới hạn quyền gửi đến SQS theo SourceArn của quy tắc EventBridge. Quyền gửi thông báo đến SNS cũng chỉ dành cho cảnh báo CloudWatch của bài, dựa trên ARN cảnh báo và SourceAccount. Hai hàng đợi DLQ được khai báo riêng vì chúng xử lý hai loại lỗi khác nhau.",
        }}
      />
      <Stack spacing={3} sx={{ mt: 4 }}>
        {steps.map((step, i) => (
          <Card key={i} sx={{ p: 3 }}>
            <Typography className="eyebrow" color="secondary" sx={{ mb: 1 }}>
              BƯỚC {i + 1}
            </Typography>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {step.title}
            </Typography>
            <Typography>{step.detail}</Typography>
            {i === 3 && (
              <Stack
                direction="row"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
                sx={{ mt: 2 }}
              >
                <Button
                  onClick={eventFile}
                  variant="outlined"
                  startIcon={<FileDownloadOutlined />}
                >
                  Tạo events.json với thời gian hiện tại
                </Button>
                {generated && (
                  <Typography variant="caption" color="text.secondary">
                    Đã tạo lúc {generated}; gửi ngay sau khi tải.
                  </Typography>
                )}
              </Stack>
            )}
            <Command value={step.command} />
            <Alert severity="info" icon={false}>
              <strong>Quan sát và tự kiểm tra: </strong>
              {step.expected}
            </Alert>
          </Card>
        ))}
      </Stack>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Nếu triển khai bằng Terraform?
        </Typography>
        <Typography>
          Đặt main.tf trong một thư mục thực hành riêng và cấu hình quyền truy
          cập AWS bên ngoài mã nguồn. Chạy terraform plan để đọc trước những
          thay đổi dự kiến, sau đó mới xác nhận triển khai bằng terraform apply.
          Dùng terraform output để lấy tên tài nguyên và URL hàng đợi, thay cho
          các giá trị lấy từ CloudFormation trong những lệnh ở trên. Khi kết
          thúc, đọc danh sách tài nguyên sẽ bị xoá trước khi xác nhận terraform
          destroy.
        </Typography>
        <Command value={commands.terraform} />
      </Card>
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Tự trả lời trước khi kết thúc
        </Typography>
        <Box component="ol" sx={{ pl: 2.5, lineHeight: 2.1 }}>
          <li>
            Nếu ba bản ghi ERROR xuất hiện trong ba phút khác nhau, vì sao cảnh
            báo này có thể không được kích hoạt?
          </li>
          <li>
            PutEvents trả về thành công nhưng hàng đợi chưa có thông điệp. Bạn
            cần kiểm tra những bước nào của luồng chuyển giao?
          </li>
          <li>
            Nếu EventBridge thiếu quyền sqs:SendMessage, việc tăng thời gian tạm
            ẩn thông điệp có giải quyết được lỗi đó không? Vì sao?
          </li>
          <li>
            Vì sao cấu hình notBreaching chưa đủ để phát hiện chương trình thu
            thập nhật ký đã ngừng hoạt động?
          </li>
          <li>
            Nếu một thông điệp được nhận lại, ứng dụng cần làm gì để không tạo
            tác động trùng? Bạn sẽ đặt cơ chế idempotency (xử lý lặp an toàn) ở
            bước nào?
          </li>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Quay lại kiến thức liên quan
        </Typography>
        {["d4-l02", "d4-l05", "d4-l09", "d5-l01"].map((id) => {
          const l = lessonById.get(id);
          return l ? (
            <Link
              key={id}
              component={RouterLink}
              to={lessonPath(id, l.sections[0]?.id)}
              sx={{ display: "block", fontSize: 13, mb: 1 }}
            >
              {l.title} ↗
            </Link>
          ) : null;
        })}
        <Typography variant="h4" sx={{ mt: 3, mb: 1 }}>
          Tài liệu AWS để đối chiếu
        </Typography>
        {[
          {
            title: "Metric filter và default value",
            url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntaxForMetricFilters.html",
          },
          {
            title: "CloudWatch missing data",
            url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html",
          },
          {
            title: "EventBridge dead-letter queues",
            url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html",
          },
          {
            title: "SQS dead-letter queues",
            url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
          },
        ].map((s) => (
          <Link
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            sx={{ display: "block", fontSize: 12, mb: 1 }}
          >
            {s.title} ↗
          </Link>
        ))}
      </Card>
    </>
  );
}
