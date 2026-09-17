# Overview — đối chiếu triển khai

Nguồn: [`OVERVIEW.xlsx`](OVERVIEW.xlsx), sheet **SVC AnalyticsReports**, cột I “Out of scope”. Theo lựa chọn của người dùng, sheet SVC được ưu tiên hơn Q5AnalyticsReports. `Ad Type Usage Breakdown` (r75) và `Appraisal Request – Sent to Agencies` (r84) thuộc scope. Workbook gốc không thay đổi.

Có 165 dòng có tên Metric / Feature: 114 dòng không tick (110 định nghĩa tính năng và 4 tiêu đề nhóm), 51 dòng tick được loại khỏi giao diện. Các dòng chỉ chứa tên section không tính vào số này.

## Mức triển khai

Đây là bộ giao diện HTML/JavaScript chạy trong repository tĩnh hiện có. 13 trang dùng chung bộ lọc, nguồn dữ liệu mẫu, phép tính và renderer. Các thao tác xem chi tiết, đổi biểu đồ, bật/tắt Fraud KPI, thiết lập target, xuất CSV, tạo báo cáo và lưu cấu hình thực hiện trong trình duyệt. Các trang dùng nhãn giao diện nghiệp vụ, không hiển thị banner Demo hoặc thanh điều hướng ngang giữa 13 trang; điều hướng chính nằm ở sidebar Admin.

- Dữ liệu mẫu được sinh theo ngày hiện tại tại Nhật Bản; không gắn cứng tháng. Các xu hướng dùng lịch sử mẫu, không phải dữ liệu vận hành thật.
- `overview-spec.js`: định nghĩa theo workbook, đã sửa theo business model hiện tại và danh sách Automated Alert.
- `overview-data.js`: fixture tài khoản, lịch sử đăng nhập, nhận diện guest, tài sản, hành vi, chat, thanh toán và log.
- `overview-model.js`: bộ lọc, tổng hợp, tính tỷ lệ, phân loại lỗi và mốc inactivity.
- `overview-charts.js`: SVG, bảng dữ liệu có sắp xếp, biểu đồ kết hợp và tooltip.
- `overview-app.js`, `overview.css`: điều hướng, giao diện, lưu cấu hình, xuất báo cáo.
- `index.html`: mở lại nhóm Overview, thêm Content Performance và Cross Analysis, mở KPI Dashboard mặc định.

## Quy tắc bổ sung từ người dùng

- Payment Errors: đúng 5 nhóm Card declined, Authentication failure, Card expired, System/network error, Other. Đếm lỗi chưa giải quyết theo ID duy nhất; loại chưa biết chuyển vào Other.
- Fraud: chỉ đếm flag có status `unhandled` và thuộc loại được bật trong cấu hình KPI. 6 loại có đánh dấu Fraud trong sheet Automated Alert: High Volume Inquiries, Multi-Device Login, Consecutive Failed Logins, Report Received, Consecutive Payment Failure, Mass Reporting. Tắt một loại chỉ thay đổi KPI, không xóa flag hay tắt phát hiện.
- Error Log Count: cửa sổ `(now − 24 giờ, now]`, mức FATAL / ERROR / WARN; loại frontend và validation. Dialog hướng dẫn kiểm tra rồi liên hệ server operations / SVC.
- Withdrawals this month: tài khoản Client rút trong tháng và có lý do.
- Newly inactive users this month: Client vừa vượt 90 ngày không đăng nhập trong tháng, tính một lần mỗi tài khoản trong tháng. Dùng lịch sử các khoảng không đăng nhập, vẫn giữ sự kiện lịch sử sau khi người dùng quay lại; không tính người đã rút trước mốc.
- Hai card độc lập, từ ngày 1 đến ngày xem; tháng hiện tại là provisional. Biểu đồ Withdrawal Trend hiển thị hai chuỗi hàng tháng trong 12 tháng. Dormant User Count cũng dùng 90 ngày theo yêu cầu mới, thay cho 30 ngày trong workbook.
- Guest DAU / WAU / MAU dùng cookie identity mẫu riêng, không cộng gộp với tài khoản thành số người duy nhất.
- Tỷ lệ tổng hợp từ tổng tử số / tổng mẫu số. CPA không có chuyển đổi hiển thị “—”. Giá bán, giá thuê tháng và giá development được tách theo transaction type; không trộn vào một mức giá trung bình.
- Bộ lọc lưu qua điều hướng. Profile / login metrics có chú thích riêng: dùng kỳ và khu vực tài khoản; các thuộc tính bất động sản không áp dụng.
- CSV doanh thu có kỳ trước và MoM, phân subscription theo tier, banner theo placement, option theo sản phẩm. Market report không lẫn doanh thu. Data Monetization chỉ xuất tổng hợp thị trường, không xuất ID tài khoản hay thông tin liên hệ.

## Kết nối production chưa có trong repository

UI không tự tạo backend. Để vận hành thật cần nối API analytics, tài khoản, listing, chat, payment completion / subscription và nguồn log đã được xác nhận. Health check và các queue hiện là số mẫu; mốc đăng nhập mẫu có độ chính xác theo ngày. Khung giờ trả lời mẫu dùng ngày thường 09:00–18:00 JST, chưa có lịch ngày lễ Nhật.

Fraud settings, targets, report shortcuts và schedules được lưu ở localStorage trên trình duyệt này. Lịch giao báo cáo lưu được tần suất, giờ JST, nhiều người nhận và bộ lọc; chưa có scheduler/email backend, nên chưa gửi email tự động. Snapshot thị trường tháng đã hoàn tất được tạo khi mở trang Reports. Print / PDF sử dụng hộp thoại in của trình duyệt. Chốt số cuối tháng thực tế cần snapshot từ backend; dữ liệu mẫu chưa có cơ chế khóa sổ.

## Các dòng trong scope

| Dòng SVC | Metric / Feature | Giao diện |
| --- | --- | --- |
| 5 | Alert Bar (Real-time) | KPI Dashboard |
| 6 | Unresponded Messages | KPI Dashboard |
| 7 | Property Complaints (Unprocessed) | KPI Dashboard |
| 8 | Pending Ad Approvals | KPI Dashboard |
| 9 | Fraud Detections | KPI Dashboard |
| 10 | Payment Errors | KPI Dashboard |
| 11 | Pending Agency Reviews | KPI Dashboard |
| 12 | System Status (Real-time) | KPI Dashboard |
| 13 | API Status | KPI Dashboard |
| 14 | DB Status | KPI Dashboard |
| 15 | Payment Gateway Status | KPI Dashboard |
| 16 | Error Log Count | KPI Dashboard |
| 17 | KPI Cards (Today + Day-on-Day) | KPI Dashboard |
| 18 | Total Users | KPI Dashboard |
| 19 | Active Users DAU/WAU/MAU | KPI Dashboard |
| 20 | Avg Session Time | KPI Dashboard |
| 21 | Today's Revenue | KPI Dashboard |
| 22 | MTD Revenue | KPI Dashboard |
| 23 | MRR (Monthly Recurring Revenue) | KPI Dashboard |
| 24 | Total Listed Properties | KPI Dashboard |
| 25 | Today's Inquiries | KPI Dashboard |
| 26 | Target Setting | KPI Dashboard |
| 27 | Graph Area (Scroll) | KPI Dashboard |
| 28 | Revenue Trend | KPI Dashboard |
| 29 | User Trend | KPI Dashboard |
| 30 | Listing Trend | KPI Dashboard |
| 31 | Listing Trend | KPI Dashboard |
| 32 | Inquiry & Deal Trend | KPI Dashboard |
| 33 | Common Filter Definition | Bộ lọc dùng chung trên Analytics và Reports |
| 35 | Page Views by Section | Content Performance |
| 36 | Unique Visitors by Section | Content Performance |
| 37 | IMP / CL / CTR by Section | Content Performance |
| 38 | CV / CVR by Section | Content Performance |
| 39 | Avg Time on Page by Section | Content Performance |
| 40 | Bounce Rate by Section | Content Performance |
| 42 | New Registration Trend | End User Statistics |
| 43 | Cumulative Registered User Trend | End User Statistics |
| 44 | DAU/WAU/MAU | End User Statistics |
| 45 | Avg Session Time | End User Statistics |
| 46 | Distribution by Nationality / Country | End User Statistics |
| 47 | Member vs Non-Member (Guest) Behavior Comparison Analysis, and total behaviour analysis | End User Statistics |
| 48 | Distribution by Age / Gender | End User Statistics |
| 49 | Distribution by Language / Device | End User Statistics |
| 50 | Acquisition Channel Analysis | End User Statistics |
| 51 | Access by Country Heatmap | End User Statistics |
| 52 | Behavior Metrics Trend | End User Statistics |
| 53 | Behavior Metrics Trend | End User Statistics |
| 54 | Site-wide Funnel Metrics Trend | End User Statistics |
| 55 | Dormant User Count | End User Statistics |
| 56 | Withdrawal Trend | End User Statistics |
| 57 | Chat Message Statistics - End User | End User Statistics |
| 58 | Chat Message Statistics - End User | End User Statistics |
| 59 | Chat Message Statistics - Agencies | End User Statistics |
| 60 | Chat Message Statistics - Response Time | End User Statistics |
| 69 | New Registration Trend | Agency Statistics; Agency League cho r80 |
| 70 | DAU/WAU/MAU | Agency Statistics; Agency League cho r80 |
| 71 | Subscription Plan Distribution | Agency Statistics; Agency League cho r80 |
| 72 | Subscription Plan Listings Utilisation | Agency Statistics; Agency League cho r80 |
| 73 | Ad Adoption Rate | Agency Statistics; Agency League cho r80 |
| 74 | Ad Adoption Rate per Agency | Agency Statistics; Agency League cho r80 |
| 75 | Ad Type Usage Breakdown | Agency Statistics; Agency League cho r80 |
| 76 | Option Product Usage Breakdown | Agency Statistics; Agency League cho r80 |
| 77 | Listing Count Distribution | Agency Statistics; Agency League cho r80 |
| 78 | Response Rate / Speed Distribution | Agency Statistics; Agency League cho r80 |
| 79 | Deal Count Trend | Agency Statistics; Agency League cho r80 |
| 80 | Agency League Table | Agency Statistics; Agency League cho r80 |
| 81 | Revenue Breakdown by Plan | Agency Statistics; Agency League cho r80 |
| 82 | Appraisal Request - Distribution Statistics | Agency Statistics; Agency League cho r80 |
| 83 | Appraisal Request - Agencies Registered | Agency Statistics; Agency League cho r80 |
| 84 | Appraisal Request - Sent to Agencies | Agency Statistics; Agency League cho r80 |
| 91 | Listing Trend (by Type) | Property Statistics |
| 92 | Listings by Area | Property Statistics |
| 93 | Price Range Distribution | Property Statistics |
| 94 | IMP Trend | Property Statistics |
| 95 | CL Trend | Property Statistics |
| 96 | Keep (Save) Count Trend | Property Statistics |
| 97 | CTR | Property Statistics |
| 98 | CV (Inquiry) Trend | Property Statistics |
| 99 | CVR | Property Statistics |
| 100 | Deal Count Trend | Property Statistics |
| 101 | Avg Listing Duration | Property Statistics |
| 102 | Listing End by Reason | Property Statistics |
| 103 | Price Trend by Property / Building Type - Listing Price | Property Statistics |
| 104 | Price Trend by Property / Building Type - Sale Price vs Listing Price | Property Statistics |
| 105 | Price Trend by Building Age | Property Statistics |
| 107 | Total Platform CPA | Revenue & Ad Performance |
| 108 | Subscription Revenue Trend by Plan | Revenue & Ad Performance |
| 109 | Subscription Revenue Trend by Plan | Revenue & Ad Performance |
| 110 | Subscription Slot Utilization Rate | Revenue & Ad Performance |
| 111 | Revenue Trend by Ad Type | Revenue & Ad Performance |
| 112 | Overall CPA (Subscription-based) | Revenue & Ad Performance |
| 113 | CPA by Ad Type | Revenue & Ad Performance |
| 114 | CPA by Placement / Page | Revenue & Ad Performance |
| 115 | IMP / CL / CTR / CV / CVR | Revenue & Ad Performance |
| 116 | Overall CPA (Ad-based) | Revenue & Ad Performance |
| 117 | Ad Effectiveness by Agency | Revenue & Ad Performance |
| 118 | Appraisal Referral Analysis by Area | Revenue & Ad Performance |
| 120 | Avg Price Trend by Area and Property Type | Market Analysis |
| 121 | Area × Property Type × Performance | Market Analysis |
| 122 | Popular Area Ranking | Market Analysis |
| 123 | Popular Route & Station Ranking | Market Analysis |
| 124 | Popularity by Station Distance | Market Analysis |
| 125 | Popularity by Property Detail Attributes | Market Analysis |
| 127 | Supply-Demand Statistics | Market Analysis |
| 128 | Access by Country & Time of Day | Market Analysis |
| 130 | CV Funnel (End User × Property) | Cross Analysis; CRM Marketing cho r137 |
| 137 | CRM Marketing Effectiveness | Cross Analysis; CRM Marketing cho r137 |
| 139 | Monthly Market Report Auto-generation | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 140 | Revenue Report | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 141 | User Report | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 142 | Operational Report | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 143 | Custom Report Builder | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 144 | Scheduled Report Delivery | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |
| 145 | Data Monetization Report | Report Management; Financial / Sales Reports là lối truy cập chuyên biệt |

## Các dòng đã loại do tick Out of scope

| Dòng SVC | Metric / Feature |
| --- | --- |
| 61 | AI Chat Statistics - Number |
| 62 | AI Chat Statistics - Topics |
| 63 | Chat Message Statistics - Memory |
| 64 | Chat Message Statistics - Attachments |
| 65 | Chat Message Statistics - Videos |
| 66 | Chat Message Statistics - blocks by End-Users |
| 67 | Chat Message Statistics - blocks by Agencies |
| 85 | Appraisal Request - Submitted by Agencies |
| 86 | Appraisal Request - JPY Value of Appraisals |
| 126 | Popularity by Keyword |
| 131 | ROAS (Agency × Revenue) |
| 132 | Listing Completeness × Conversion Rate |
| 133 | Plan × LTV (Retention Rate) |
| 134 | Response Speed / Rate × Conversion Rate |
| 135 | Agency Rating × Conversion Rate |
| 136 | Risk Analysis |
| 146 | User Registration Month Retention Rate |
| 147 | Agency Registration Month Retention Rate |
| 148 | Post-Plan Change Retention Rate |
| 149 | Post-First Inquiry Retention Rate |
| 150 | Post-Ad Usage Retention Rate |
| 151 | Post-First Contract Retention Rate |
| 152 | Cohort Comparison Analysis |
| 153 | Cohort LTV Analysis |
| 154 | Cohort Visualization |
| 155 | Activation Event Analysis |
| 156 | Monthly Churn Rate |
| 157 | Churn Rate by Plan |
| 158 | Churn Rate by Area |
| 159 | Churn Rate by Usage Frequency |
| 160 | Cancellation Reason Analysis |
| 161 | Pre-Churn Behavior Analysis |
| 162 | Churn Prediction Score |
| 163 | Threshold Alert Notification |
| 164 | Churn Factor Analysis |
| 165 | Reactivation Rate Analysis |
| 166 | Popular Search Condition Ranking |
| 167 | Zero-Result Search Rate |
| 168 | Search-to-Click Rate |
| 169 | Filter Usage Rate |
| 170 | Price Range Search Distribution |
| 171 | Area Search Distribution |
| 172 | Station Search Distribution |
| 173 | Search Exit Rate |
| 174 | Supply Shortage Analysis |
| 175 | Search Trend Analysis |
| 176 | Trending Search Keywords |
| 177 | Search Heatmap |
| 178 | Dynamic Pricing Integration |
| 179 | AI Search Analytics |
| 180 | Search Suggestion Analytics |

## Kiểm tra

Test sử dụng Python unittest và QuickJS (phụ thuộc chỉ phục vụ kiểm tra, không cần khi mở các trang).

```sh
PYTHONPATH=/tmp/overview-js-runtime python3 -m unittest discover -s overview/tests -v
```

Các kiểm tra bao gồm: parse toàn bộ JavaScript, khởi tạo 13 trang với DOM mock, tính và render mọi metric analytics trong scope, mốc 90 ngày / 24 giờ, lỗi thanh toán, toggle Fraud, đối chiếu chat totals, guest activity, slot capacity, option theo kỳ, đơn vị giá, xuất CSV / lưu cấu hình và đường dẫn tài nguyên. DOM mock không thay thế kiểm tra hình ảnh và thao tác trên trình duyệt thật.

## Admin Overview business-model corrections

- Agency is the registered business account. Total Users, DAU/WAU/MAU and User Trend count Client / End User and Agency accounts, once per account ID, excluding withdrawn accounts, Agency staff and YUUSHI Admin/Support. Session averages use the same account scope and session-weighted durations; guests remain separate.
- Unresponded Messages counts `adminChats` addressed to YUUSHI Admin with status `unresponded`. Pending Agency Reviews counts Agency accounts with status `Pending`. KPI and Operational Report use the same functions.
- Today's Inquiries and Inquiry & Deal Trend use daily Property Inquiry aggregates (`facts.inquiries`, property and Agency ownership) for Client → Agency via Chat with Agency from Property Detail. They never count Admin support chats. Deals remain Agency-recorded Transactions. Repeat-Inquiry handling is not resolved or implemented here.
- MRR sums active recurring Agency subscriptions: monthly fee + annual fee ÷ 12. The mock includes both billing cycles and excludes pending/cancelled subscriptions. ¥120,000 annually contributes ¥10,000. This follows the requested final rule; the client clarification below is internal follow-up, not a runtime setting or a new production workflow. Prior-month comparison uses the mock subscription records at that date; this fixture is not a billing event ledger.
- Target Setting contains only Target Metric, Start Date, End Date and Target Value. Both dates and a positive finite value are required, End Date ≥ Start Date, and account/subscription/listing counts require whole numbers. Existing supported metrics and actual ÷ target × 100 progress are retained. Revenue values may be fractional. No period presets or recurrence.
- Compatibility: existing `agent-stats-dashboard.html`, `agent-league-dashboard.html`, page/alert key `agents`, `D.agents`, local variable `agents`, `agentId`, `messagesAgent` and User Trend column key `agents` are retained. They refer to Agency businesses, not staff. `D.agencies` and `agencyId` expose the normalized semantics. `customerId` and `customers` remain legacy Client keys. Row IDs and the original workbook remain unchanged. Chart renderer consumes the corrected model labels without changes.

## Open BA questions — JHN

Q1: "For Admin Dashboard metrics such as “Today’s Inquiries” and “Inquiry & Deal Trend”, should “Inquiry” refer to property-related inquiries submitted by Clients to Agencies through “Chat with Agency”, rather than messages sent to Yuushi Admin?"

Q2: "For MRR, if an Agency subscribes to an annual plan, should the annual subscription fee be converted to a monthly equivalent by dividing it by 12? For example, an annual plan of ¥120,000 would contribute ¥10,000 to MRR."

Verification after corrections: 20 Python/QuickJS tests passed (including Agency identity exclusions, separate operational queues, annual MRR normalization, target validation/progress, and Operational Report CSV labels). Chrome loaded all 13 pages without uncaught errors or metric-rendering failures. Checked sidebar/rendered links, target form interactions and operational queue destinations; repaired the Overview Pending Ad Approvals destination to the existing `05-booking-approvals.html`. `git diff --check` passed. Fraud alert definitions and metric row IDs were verified unchanged.
