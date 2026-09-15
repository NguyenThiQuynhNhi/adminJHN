> HISTORICAL SOURCE REFERENCE — excluded from the current client-review handoff. Use [Agency Dashboard implementation](../AGENCY_DASHBOARD_IMPLEMENTATION.md) for current scope.

in a# Agency Dashboard — Corrective Business-Scope Report

Ngày 2026-09-09. Căn cứ chính: yêu cầu corrective pass `f5a1676b-9f98-4c3c-a90c-8574d2ec2327`. Không coi việc có mặt trong V2 workbook, có dữ liệu module hoặc có code tính toán là bằng chứng được duyệt.

Đã kiểm tra toàn bộ 232 metric trước đợt sửa: **50 giữ lại, 182 loại bỏ**. Từng quyết định và căn cứ độc lập có trong [Scope audit CSV](AGENCY_DASHBOARD_SCOPE_AUDIT.csv). Đối chiếu dashboard gốc tại repository HEAD, handoff mô tả dashboard gốc và các chỉ dẫn trực tiếp trước đó của người dùng. Không gán nguồn A hoặc D khi không có tài liệu phê duyệt độc lập để chứng minh. Căn cứ B không dùng chính UI do lần triển khai V2 vừa tạo ra làm bằng chứng tự phê duyệt.

## 1. Metrics removed

P = Proposed / derived only, không tìm thấy căn cứ độc lập được duyệt. Những metric bị xóa không trở thành câu hỏi mở hay được thay bằng KPI mới.

| No. | Title trước khi xóa | Basis check | Lý do |
|---|---|---|---|
| 82 | Total Listings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 83 | Published Listings | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 84 | Draft Listings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 85 | Pending Review Listings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 86 | Suspended Listings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 87 | Listings by Transaction Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 88 | Listings by Property Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 89 | Listings by Location | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 90 | Listings by Agent | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 91 | Active Inventory Value | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 92 | Listing Age | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 93 | Stale Listings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 95 | Property Impressions | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 99 | CTR | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 100 | KPR | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 101 | Property Performance Funnel | P | Property funnel introduces an additional Impressions stage and unapproved sequential funnel semantics. |
| 102 | Views & Inquiry Trend | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 107 | Total Projects | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 108 | Published Projects | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 109 | Pending Review Projects | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 110 | Rejected Projects | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 111 | Suspended Projects | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 112 | Projects by Developer | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 113 | Projects by Location | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 115 | Total Units / Lots | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 116 | On Sale Units / Lots | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 117 | Sold Out Units / Lots | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 119 | Remaining Inventory | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 120 | Sale Status by Project | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 121 | Upcoming Completions | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 124 | Total Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 125 | Open Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 126 | New Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 127 | Assigned Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 128 | Contact Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 129 | Viewing Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 130 | Proposal Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 131 | Negotiation Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 132 | Asleep Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 133 | Sold Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 134 | Closed Lost Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 135 | Lead Stage Distribution | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 136 | Leads by Intent | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 137 | Leads by Owner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 138 | Won Rate | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 139 | Average Lead Age | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 140 | Follow-ups Due Today | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 141 | Overdue Follow-ups | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 142 | Lead Value / Budget | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 145 | Total Appraisal Requests | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 146 | In Progress Appraisals | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 147 | Converted Appraisals | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 148 | Declined Appraisals | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 150 | Requests by Property Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 151 | Requests by Location | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 152 | Selling Timeline | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 153 | Preferred Valuation Method | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 154 | Preferred Language | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 158 | Appraisal Leads Remaining | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 160 | Coverage Area Count | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 161 | Coverage by Tier | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 164 | Total Contacts | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 166 | Inactive Contacts | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 167 | New Contacts | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 168 | Recently Active Contacts | P | No independent approval found; latest correction requires affirmative traceability for this conditional metric. |
| 169 | Contacts with Leads | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 170 | Contacts with Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 172 | Age Distribution | P | No independent approval found; latest correction requires affirmative traceability for this conditional metric. |
| 173 | Nationality Breakdown | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 174 | Gender Split | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 175 | Buyer Status | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 176 | Preferred Property Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 177 | Desired City / Area | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 178 | Budget Band Distribution | P | No independent approval found; latest correction requires affirmative traceability for this conditional metric. |
| 179 | Purpose | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 181 | Total Groups | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 182 | Members by Group | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 183 | Largest Groups | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 184 | Recently Updated Groups | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 185 | Ungrouped Contacts | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 188 | Upcoming Viewings | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 189 | Completed Viewings | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 190 | No-show Rate | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 191 | Viewings by Agent | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 193 | Open Tasks | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 194 | Tasks Due Today | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 195 | Overdue Tasks | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 196 | Task Completion Rate | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 197 | Jobs by Status | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 198 | Jobs by Property | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 200 | Calls Logged | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 201 | Missed Calls | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 202 | Emails Sent | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 203 | Email Failure Rate | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 204 | SMS Logs | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 205 | Comments Added | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 208 | Activities by Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 209 | Activities by Assignee | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 212 | Total Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 213 | Pending Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 214 | Countered Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 215 | Accepted Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 216 | Rejected Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 217 | Withdrawn Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 218 | Expired Offers | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 219 | Offer Status Distribution | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 221 | Average Offer-to-List Ratio | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 222 | Average Counteroffer Gap | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 223 | Offer Value | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 224 | Accepted Offer Value | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 225 | Offers by Owner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 226 | Offers by Property | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 227 | Expiring Soon | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 230 | Closed Transactions | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 233 | Transactions by Deal Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 235 | Closed Transactions by Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 237 | Public Price Share | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 239 | Suspension / Removal Records | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 240 | Suspension Reason Distribution | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 241 | Closed vs Suspended Records | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 243 | Accepted Agreements | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 244 | Accepted This Period | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 245 | Recent Agreements | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 246 | Average Time to Accept | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 247 | Acceptance Trend | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 251 | New Inquiries | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 254 | Inquiries by Property | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 255 | Unread Messages by Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 259 | Total Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 260 | Active Campaigns | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 261 | Approved Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 262 | Pending Review Campaigns | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 263 | Completed Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 264 | Rejected Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 265 | Rejected (Timeout) Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 266 | Cancelled Campaigns | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 267 | Campaign Status Distribution | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 268 | Upcoming Campaign Starts | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 269 | Campaigns Ending Soon | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 270 | Days Remaining | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 273 | Captured Ad Spend | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 274 | Pending Authorization Amount | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 275 | Average Campaign Price | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 276 | Package Length Distribution | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 277 | Campaigns by Ad Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 278 | Spend by Ad Type | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 280 | Homepage Carousel — New Development | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 281 | Homepage Carousel — Featured Properties | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 282 | Static Banner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 283 | Sponsored Search | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 284 | In-Article Banner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 285 | Property Detail Banner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 286 | City/Area Detail Banner | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 293 | Cost per Click | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 294 | Organic + Paid Performance | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 298 | Current Plan | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 302 | Entitlements Expiring Soon | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 304 | Payment Issues | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |
| 305 | Successful Payments | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 306 | Failed Payments | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 307 | Spend by Engine | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 308 | Transaction History | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 309 | Payment Method Health | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 312 | Total Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 313 | Active Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 314 | Suspended Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 315 | Staff by Role | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 316 | 2FA Adoption | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 317 | Recently Signed In | P | No independent approval found; latest correction requires affirmative traceability for this conditional metric. |
| 319 | Leads by Salesperson | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 320 | Listings by Salesperson | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 321 | Upcoming Viewings by Salesperson | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 322 | Open Tasks by Salesperson | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 323 | Closed Deals by Salesperson | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 325 | Response Time by Staff | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 326 | Team Workload Index | P | Explicit removal in latest correction C; composite workload index is unapproved. |
| 327 | Individual Performance Table | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 329 | Profile Completion | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 330 | Service Area Count | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 331 | Supported Languages | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 332 | Branch Count | P | No independent approved Dashboard requirement found; V2 row/module data/calculation code alone is insufficient. |
| 333 | Profile Views Trend | P | Duplicate or derived variant without a distinct approved requirement; retained canonical metric covers the approved concept. |

## 2. Metrics renamed

| No. | Old title | New title | Reason |
|---|---|---|---|
| 234 | Closed Transaction Trend | Sales Value Trend | Chỉ giữ biểu đồ giá trị Sale đã được chỉ dẫn rõ ở BA correction 6dca5d02 §9; không giữ một KPI đếm giao dịch đóng chung Sale/Rent do V2 đề xuất. |

#103 đã mang tên Top Listings by Conversion trước đợt này và được giữ theo phê duyệt trực tiếp về Views → Inquiry; không ghi nhận như một lần đổi tên mới. Không thêm Engagement Score, Active Chat hay Failed Listing/Transaction.

## 3. Metrics whose calculation changed

| Metric | Old calculation | Current calculation |
|---|---|---|
| #234 Sales Value Trend | Mặc định COUNT các giao dịch closed và Sale suspended/Sold; cho chọn SUM Sale. | Mặc định SUM giá trị Sale thành công theo tháng; predicate dealType === Sale áp dụng trực tiếp. Bỏ lựa chọn Count của metric này. |
| #96 Property Views; #71/#103 ranking; #104 combined performance; #295 performance presentation | Giá trị Views được tính trực tiếp bằng công thức generator trong bản ghi performance theo ngày. | Có các View event xác định trước; hàm countViews riêng tính số quan sát rồi đưa vào projection performance. Không dedup theo Client/Property/Day/Session. Đây là cách trình bày dữ liệu hiện có của mockup, không chốt chính sách lượt xem lặp lại. |
| #69 Recent Activity Feed | Sao chép toàn bộ Leads, Offers, Transactions và mọi CRM record với modifiedAt. | Chỉ New Inquiry, Appraisal Request, Viewing Scheduled, Offer Accepted, Deal Closed; chọn trạng thái hợp lệ và timestamp của sự kiện tương ứng. Không đưa mọi field change vào feed. |
| #324 Sales Value by Staff | Cho phép widget chọn staffAttribution, sau đó GROUP BY field được chọn. | Gọi một hàm attribution nội bộ; bỏ hoàn toàn tác động của widget.staffAttribution. Sale-only predicate giữ nguyên. Quy tắc BA cuối cùng vẫn chưa xác nhận. |

Giữ nguyên các phép tính đúng: Inquiry do Client khởi tạo; nhiều Message trên một Inquiry; không tạo Lead tự động; Inquiry → Viewing suy luận theo contact/property/staff và đếm một lần; response cycle dùng Client message cuối → Agency reply đầu; Rental không đóng góp tiền dù có numeric value; New Development Sale nằm trong Sales chung; listing Sold không cần Lead; Published → confirmed Sold cho Days to Close; Agreement accepted-only; Calendar dùng datetime theo activity.

Các phép tính chỉ phục vụ metric bị loại đã được bỏ khỏi catalog/descriptor, nhánh tính, dữ liệu Team và UI chuyên biệt nơi không còn được dùng. Chart engine chung giữ nguyên, kể cả các renderer hiện không có metric đủ căn cứ sử dụng.

## 4. Configuration changes

- Xóa Age Band và Budget Band khỏi selector, dimension, filter, raw contact projection, helper chuyên biệt và Settings: không tìm thấy căn cứ độc lập để giữ #172/#178. Contact.age, budgetMin/budgetMax vẫn là dữ liệu module gốc; không tự tạo analytics từ chúng.
- Xóa staff attribution khỏi Add/Edit Widget; cấu hình đã lưu không còn điều khiển quy tắc attribution.
- Bỏ stale threshold vì Stale Listings cũng không có căn cứ Dashboard độc lập trong tập tài liệu đã kiểm tra.
- Upcoming window chỉ hiện cho metric op=future; không hiện cho các metric còn lại.
- Rank By chỉ hiện khi metric có các trường xếp hạng được phép. Top N chỉ hiện khi thực sự áp dụng cho ranking/category/record list; scalar và time series không hiện.
- Date Range chỉ hiện khi metric có date field; From/To chỉ hiện khi chọn Custom. Compare chỉ hiện cho dated scalar có phép so sánh kỳ trước.
- Aggregation và Group By chỉ hiện khi có lựa chọn phù hợp.
- Khi đọc localStorage, lọc widget bị loại và các field cấu hình hết hiệu lực; giữ dashboard name/id, panel, widget hợp lệ và cấu hình còn dùng được. Không reset toàn bộ workspace vì một widget cũ bị loại.
- Default Overview bỏ Lead Stage Distribution; Ads & Subscriptions bỏ Coverage Area Count riêng. Những metric trùng tên của Current Plan và Appraisal Remaining trong default mới dùng metric canonical đã tồn tại; không tạo metric thay thế.

## 5. Files modified

Runtime:

- `agency-dashboard-catalog.js`: bỏ các entry không đủ scope.
- `agency-dashboard-model.js`: chỉ còn metadata metric đã audit, bỏ descriptor/nhánh tính chuyên biệt hết scope, sửa Sales Value Trend.
- `agency-dashboard-rules.js`: bỏ band helpers; cô lập View counting, Inquiry record projection và attribution nội bộ.
- `agency-dashboard-mock.js`: raw View observations, bỏ Team workload/ageBand/budgetBand projections, giới hạn feed event categories.
- `agency-dashboard-data.js`: bỏ Team source khỏi quyền fixture không còn dùng.
- `agency-dashboard-source.js`: normalize alias module cũ sang semantic staffId references ở adapter.
- `agency-dashboard.js`: metric-specific Settings và localStorage scope migration.
- `agency-dashboard-charts.js`: bỏ các field render chuyên biệt của Team index/table đã bị loại.
- `dashboard-tools/build_catalog.py`: rebuild không phục hồi metric P từ workbook.
- `dashboard-tools/approved-metrics.json`: danh sách quyết định scope và evidence cho từng metric giữ lại.

Verification/handoff:

- `tests/test_dashboard.py`
- `tests/test_mock_dashboard.py`
- `tests/test_business_rules.py`
- `tests/browser_mock_scenario.py`
- `tests/browser_business_scenario.py`
- `handoff/AGENCY_DASHBOARD_SCOPE_AUDIT.csv`
- `handoff/AGENCY_DASHBOARD_IMPLEMENTATION.md`
- `handoff/AGENCY_DASHBOARD_SCOPE_CORRECTION_REPORT.md`

Không sửa các business workflow, Admin Overview, workbook gốc, cấu trúc builder hoặc cơ chế localStorage.

## 6. Pending business ambiguities

1. Sales attribution: staff role nào nhận giá trị Sale. Tạm dùng reference đã ghi trong dữ liệu để trình bày; hàm nội bộ hỗ trợ đổi cách tra field cho kiểm thử, không là lựa chọn business trên UI.
2. Repeated Inquiry: cùng Client/Agency/Property bấm Chat with Agency lần nữa sẽ dùng lại hay tạo Inquiry. Không triển khai action mới; chỉ đọc các Inquiry context đã lưu qua helper riêng.
3. Repeated View: chưa xác nhận mỗi event hay dedup theo ngày/session/tiêu chí khác. Hàm đếm event được cô lập, không có dedup policy mới.

## 7. Tests run

- 17 Python/QuickJS tests: PASS.
- 50 metric hiện hành × các period/dimension được hỗ trợ: 2,429 phép tính; 1,302 lượt render, không lỗi.
- 800 đánh giá role/plan/suppression: PASS.
- 21 Chrome browser checks: PASS; kiểm tra thực tế 1,302 lượt render DOM của các metric được giữ, Settings theo metric, localStorage migration, CRUD, export, drill-through, suppression và mobile.
- Không có uncaught JavaScript errors; git diff --check: PASS.
- Các test đã loại những assertion chỉ nhằm bảo vệ metric bị từ chối. Các regression về Inquiry/response/Sale-only/NewDev/Sold-without-Lead/Days to Close/Upcoming vẫn được giữ. Kiểm tra tự động xác nhận tính đúng và không lỗi; **không dùng test pass làm bằng chứng scope được phê duyệt**. Scope được kiểm chứng bằng các nguồn độc lập ghi trong audit.
