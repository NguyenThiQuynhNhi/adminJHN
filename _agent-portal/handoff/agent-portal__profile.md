# Profile — Agency Profile & My Profile (`profile.html`)

**Purpose:** One page with two tabs to manage the agency-wide profile (shared by all agents) and the signed-in agent's personal profile. The whole page is view-only until "Edit profile" is pressed. All in-memory demo data.

**Access:** Sidebar → Agency → Agency Profile, or the header account dropdown → My Profile.

---

## Layout & structure

Page head ("Profile" + subtitle + a mode pill "View mode" / "Editing…") → two tabs **Agency Profile** / **My Profile** → an info box explaining the `public` flag (shows on the client-facing page) and `premium only` flag → a sticky bottom action bar → discard modal + toasts. No stat cards.

---

## Tab 1 — Agency Profile (8 numbered cards)

- **3.1 Basic information:** Agency Logo (upload/remove, JPG/PNG/WEBP ≤5MB); **Company Name / Trade Name \*** (public); **Company Name (Katakana) \***; Invoice Registration Number ("T" + 13 digits); Establishment Date (must be past); **Representative Name \***; Business Description / Profile / Strengths (public, ≤2000, live count); Website URL (premium only).
- **3.2 Contact & account information:** **Operational Email \***; **Inquiry Email — Main \*** (public); Inquiry Email — CC; **Representative Phone \***; Public Phone Number (public).
- **3.3 Operations & professional services:** **Business Hours \*** (public); Regular Holidays (public); Average Response Time (minutes, default 30); **Specialized Services \*** (public, multi-select chips: Real Estate Brokerage, Direct Property Acquisition, Rental Brokerage, Property Management, Short Sale, Inheritance Consultation).
- **3.4 Service areas:** **Target Cities \*** (public, multi-select chips, **max 15**, searchable; counter "{n} / 15").
- **3.5 Languages supported:** **Supported Languages \*** (public, multi-select chips, **max 5**: Japanese, English, Chinese Simplified, Chinese Traditional, Vietnamese, Korean, Other; counter "{n} / 5").
- **3.6 Licensing & legal information:** **Real Estate License Number \***; **License Expiry Date \*** (must be future); Real Estate Association; Guarantee Association; **Headquarters Address \*** (public); plus a **License Renewal History** mini-table (Renewal Date | Previous Expiry | New Expiry | Issuing Body | remove) with "+ Add renewal entry".
- **3.7 Branch information:** Branches mini-table (Branch Name | Address | remove), "+ Add branch".
- **3.8 Notification settings:** Quiet Hours — Start (22:00) | End (07:00) | Timezone (Asia/Tokyo (UTC+9) / UTC / Asia/Seoul / Asia/Shanghai / Asia/Singapore).

Pre-selected chips: services = [Real Estate Brokerage, Inheritance Consultation]; cities = [Tokyo — Shibuya, Tokyo — Setagaya, Tokyo — Meguro]; langs = [Japanese, English].

## Tab 2 — My Profile (3 numbered cards)

- **4.1 Identity:** Photo (public, round, upload/remove, falls back to "TT"); **Full Name \*** (public, "Taro Tanaka"); **Email (login)** — read-only, locked even in edit mode ("Set by your Agency Admin…"); Phone Number; **Role / Title \*** (public, "Senior Sales Agent").
- **4.2 Bio & working hours:** Bio / Description (public, ≤2000, live count); Working Hours (public, "Mon–Fri 10:00–19:00").
- **4.3 Security & password:** Current password \*, New password \*, Confirm new password \* (all live-validated), plus a Two-factor authentication (2FA) toggle (Email OTP only).

### Password rules (live, 4.3)

At least 12 characters · One uppercase · One lowercase · One number · One symbol · Confirm matches.

---

## Edit / Save flow

- **Edit profile** enables all inputs except file inputs and the read-only login email; reveals edit buttons; un-disables chips; pill → "Editing…".
- **Save changes** (`saveProfile`) validates every enabled required (`*`) field is non-empty; the first empty one gets `.invalid`, scrolls into view + focuses; toast "Please complete the required fields." (error). On success → exits edit, toast "Profile updated successfully."
- **Cancel** → if dirty, opens the discard modal, else exits.

## Modals

**Discard unsaved changes?** — "You have unsaved changes on this page. Discarding will revert every field to its saved value." Buttons "Keep editing" + red "Discard changes". `beforeunload` guards when editing + dirty; ESC closes modals.

> **Behavior note:** the discard handler exits edit mode and toasts "Changes discarded." but does **not** actually restore field values to their saved state — the revert is messaged, not implemented.

## Validation

Required-field non-empty check on save; chip limits (max 15 cities / 5 languages → "Maximum {n} selections."); file upload ≤5MB and JPG/PNG/JPEG/WEBP. Password rules are live-indicated.

## Notifications (toasts, ~3s)

"File size must not exceed 5MB." (error) · "Please upload a JPG, PNG, JPEG or WEBP image." (error) · "Maximum {n} selections." (error) · "Please complete the required fields." (error) · "Profile updated successfully." · "Changes discarded."

## Persistence

None. All state is in-memory; no saved snapshot or storage. Resets on reload.
