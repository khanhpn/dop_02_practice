import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("capstone provides working IaC downloads and valid timestamped synthetic log events", async ({
  page,
}) => {
  await page.goto("./#/lab/observability");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Từ một dòng log",
  );
  const cfn = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Tải CloudFormation", exact: true })
    .click();
  expect((await cfn).suggestedFilename()).toBe("cloudformation.yaml");
  await page.getByRole("tab", { name: "Terraform", exact: true }).click();
  await expect(page.locator("pre").first()).toContainText(
    "aws_cloudwatch_event_target",
  );
  const file = page.waitForEvent("download");
  await page
    .getByRole("button", {
      name: "Tạo events.json với thời gian hiện tại",
      exact: true,
    })
    .click();
  const downloaded = await file;
  const records = JSON.parse(
    await readFile((await downloaded.path())!, "utf8"),
  );
  expect(records).toHaveLength(3);
  expect(
    new Set(records.map((r: { message: string }) => JSON.parse(r.message).id))
      .size,
  ).toBe(3);
  for (const r of records) {
    expect(Math.abs(Date.now() - r.timestamp)).toBeLessThan(10000);
    expect(JSON.parse(r.message).level).toBe("ERROR");
  }
  const eventCommand = await page
    .locator("pre")
    .filter({ hasText: "aws events put-events" })
    .innerText();
  const payload = JSON.parse(eventCommand.match(/--entries '(.+)'/)![1]);
  expect(JSON.parse(payload[0].Detail).id).toBe("incident-001");
});
test("mock follows official weights and an expired session submits once after reload", async ({
  page,
}) => {
  await page.goto("./#/practice");
  await page
    .getByRole("button", { name: "Bắt đầu mock exam", exact: true })
    .click();
  await expect(page.getByText("Câu 1 / 75", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kiểm tra đáp án", exact: true }),
  ).not.toBeVisible();
  const initial = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("dop-study-lab:v1") ?? "{}")
        .activeSession,
  );
  expect(initial.questionIds).toHaveLength(75);
  expect(new Set(initial.questionIds).size).toBe(75);
  expect(
    [1, 2, 3, 4, 5, 6].map(
      (d) =>
        initial.questionIds.filter((id: string) => id.startsWith(`d${d}-`))
          .length,
    ),
  ).toEqual([17, 13, 11, 11, 10, 13]);
  expect(initial.expiresAt - initial.startedAt).toBeGreaterThanOrEqual(
    10800000,
  );
  await page
    .locator('input[type="radio"],input[type="checkbox"]')
    .first()
    .check();
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("dop-study-lab:v1") ?? "{}");
    s.activeSession.startedAt = Date.now() - 10801000;
    s.activeSession.expiresAt = Date.now() - 1000;
    localStorage.setItem("dop-study-lab:v1", JSON.stringify(s));
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Tiếp tục phiên đã lưu", exact: true })
    .click();
  await expect(
    page.getByText("KẾT QUẢ LUYỆN TẬP", { exact: true }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dop-study-lab:v1") ?? "{}"),
  );
  expect(saved.activeSession).toBeNull();
  expect(saved.attempts).toHaveLength(1);
  expect(Object.keys(saved.history)).toHaveLength(75);
});
test("practice session resumes answers and flags, submits once, and records skipped questions", async ({
  page,
}) => {
  await page.goto("./#/practice");
  await page
    .getByRole("button", { name: "Luyện bài đã chọn", exact: true })
    .click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Đánh dấu", exact: true }).click();
  await page.getByRole("button", { name: "Câu tiếp", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Tiếp tục phiên đã lưu", exact: true })
    .click();
  await expect(page.getByText("Câu 2 / 20", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Câu trước", exact: true }).click();
  await expect(page.getByRole("radio").first()).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Đã đánh dấu", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Đến câu 20", exact: true }).click();
  await page
    .getByRole("button", { name: "Nộp bài & xem kết quả", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("1/20");
  await page.getByRole("button", { name: "Nộp bài", exact: true }).click();
  await expect(
    page.getByText("KẾT QUẢ LUYỆN TẬP", { exact: true }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dop-study-lab:v1") ?? "{}"),
  );
  expect(saved.activeSession).toBeNull();
  expect(saved.attempts).toHaveLength(1);
  expect(Object.values(saved.history)).toHaveLength(20);
  expect(
    Object.values(saved.history).filter(
      (h) => !(h as { correct: boolean }).correct,
    ).length,
  ).toBeGreaterThanOrEqual(19);
});
test("dashboard, lesson notes, bilingual quiz and knowledge review link", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  await expect(page.getByText("Mỗi ngày, vững hơn một chút")).toBeVisible();
  await page.screenshot({
    path: `artifacts/dashboard-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Bắt đầu học ngay" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const notes = page.getByLabel("Ghi chú cá nhân — tự lưu trên trình duyệt");
  await notes.fill("Tự giải thích trust policy trước khi chọn đáp án.");
  await page.reload();
  await expect(notes).toHaveValue(
    "Tự giải thích trust policy trước khi chọn đáp án.",
  );
  await page.getByRole("button", { name: "Đến phần câu hỏi" }).click();
  await page.getByRole("button", { name: "Câu hỏi tiếng Việt" }).click();
  await expect(
    page.getByRole("button", { name: "Câu hỏi tiếng Việt" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Câu hỏi tiếng Anh" }).click();
  await page.getByRole("radio").first().check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  const review = page.getByRole("link", { name: /Ôn lại kiến thức:/ });
  await expect(review).toBeVisible();
  await review.click();
  await expect(page).toHaveURL(/section=/);
  const section = new URL(page.url()).hash.split("section=")[1];
  await expect(
    page.locator(`[id="${decodeURIComponent(section)}"]`),
  ).toBeVisible();
});
test("project works on mobile with navigation and theme", async ({ page }) => {
  await page.goto("./");
  const menu = page.getByRole("button", { name: "Mở menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await page
      .getByRole("link", { name: "Lộ trình kiến thức", exact: true })
      .click();
  } else
    await page
      .getByRole("link", { name: "Lộ trình kiến thức", exact: true })
      .click();
  await expect(
    page.getByPlaceholder("Tìm kiến thức, dịch vụ, khái niệm…"),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dop-study-lab:v1") ?? "{}"),
  );
  expect(saved.settings.theme).toBe("dark");
});
test("exports state and refuses invalid import without replacing notes", async ({
  page,
}) => {
  await page.goto("./#/settings");
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export backup", exact: true })
    .click();
  expect((await download).suggestedFilename()).toMatch(/dop-study-backup/);
  await page.getByLabel("Chọn file backup").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("alert")).toContainText("Backup không hợp lệ");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
