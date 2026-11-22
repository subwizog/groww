# Antigravity build brief: pocket money app for students

## 0. What to build and what to hand back

- **Build** a mobile-first web app described in this file.
- **Hand back** a public link that opens without a login, so reviewers can use it.
- **Also make** a PDF from the file `circles-report.md`. Keep every word exactly as written. Do not add, shorten, or reword anything. Use the same fonts as the app. Save it as `public/report.pdf` and link it from Settings.
- **Do not write** any one-page write-up. The owner writes that page by hand.
- **Stack.** React with Vite, plain CSS variables, data kept in browser local storage. No backend, no login, no advertisements, no analytics, no outside trackers, no calls to any outside server. The app must work offline after the first load.
- **Layout.** Phone width of 390 px. On a desktop screen, show the app as a centered phone-sized column.

## 1. Product in one paragraph

A student who lives away from home gets a fixed pocket money amount each month. The app helps that money last. It reads pasted bank messages on the device, sorts each payment into a category, shows where the money went, warns early when money may run short, splits shared costs with friends, and nudges a small saving toward Groww. It is not an investing app and it never moves money.

## 2. Rules the app must follow

- **Say where, never why.** Insights state facts such as "₹X above plan so far". Never use words like wasted, bad, careless, or overspending.
- **Keep messages on the device.** Pasted text is never sent anywhere.
- **No advertisements, ever.**
- **At most one filled button per screen.** Other buttons are outlined or plain.
- **Label sample data.** All starting numbers carry a "Sample" badge until the user clears them.
- **Plain words.** Sentence case. Short labels. Buttons start with a verb. Errors say what happened and what to do, with no apology.

## 3. Users

- **Main user.** A student on monthly pocket money from parents, living in a hostel or rented room.
- **Friends in a split.** They appear only as names. They do not need the app.
- **Parents.** They send the money. They are not users.

## 4. Scope

**In scope for version 1**
- Home, Budget, Insights, Split, Add, Settings
- Reading a pasted bank message and suggesting category and type
- Nightly check-in
- Equal splits between friends, balances, and settle buttons that open a payment link
- Dark and light themes
- Local storage, offline use, delete-all-data button

**Out of scope for version 1**
- Real connection with GPay, PhonePe, or Paytm
- Reading real messages or notifications (needs a native Android app)
- Bank statement PDF upload
- Investing or moving money inside the app
- Accounts, cloud sync, advertisements
- Custom split amounts and custom categories
- Anyone outside the student user

## 5. Navigation

- Bottom tab bar with five tabs in this order: Home, Budget, Insights, Split, Add.
- A gear icon at the top right of every screen opens Settings. Tapping it again returns to the previous tab.
- Page title sits top left at the Title 1 size.
- Tab bar is a floating glass bar with 28 px corners.

## 6. Screens

### 6.1 Home

From top to bottom:

1. **Hero glass card.** This is the one bold element in the whole app.
   - Small label "Left to spend this month". Large number below it.
   - Under it, "X days to go" with a thin bar showing how much of the month has passed.
   - Two small numbers side by side, "Safe per day" and "Your pace". Pace is shown in amber or red when it is above the safe amount.
   - One status line. If pace is too high, "At this pace your spending money ends on day N, M days early." If not, "You are on track to last the month."
2. **Today card.** "Today you spent ₹X" with small category chips for what was spent. An outlined button "Add what we missed" opens the nightly check-in sheet.
3. **This week card.** Five slim bars, one per category, with the category name beneath. Tapping it opens Insights.
4. **Savings nudge card.** Text depends on the state. If pace is too high, "Spend about ₹X less a day to protect your ₹Y savings." Otherwise, "You can move ₹Y into a monthly plan on Groww." An outlined button "See a ₹500 monthly plan" opens groww.com in a new tab. It is only a link.
5. **Recent payments.** The last four, each with name, category, type, and amount.
6. **Pay with row.** Three outlined chips, GPay, PhonePe, Paytm. Each opens a payment link (see 6.4). Best effort only.

**Empty state.** If the pocket money is not set, show one card "Add your monthly pocket money to begin" with the single filled button "Set pocket money".

### 6.2 Budget

- Top card shows monthly pocket money. Tap to edit.
- One card per category (Food, Travel, Friends, Shopping, Groceries). Each shows name, "₹spent of ₹plan", a progress bar, a thin marker for where the student should be by today, and two outlined buttons "−100" and "+100".
- Progress bar colors follow the pace rules in section 8.
- Tapping a card lists the payments in that category.
- Savings card at the bottom shows pocket money minus the sum of plans. It cannot be edited directly.
- If a change would push plans above pocket money, block it and show "That is more than your pocket money."

### 6.3 Insights (facts only)

- Top card shows total spent, share of the spending budget used, and share of the month passed.
- A switch for "This week" and "This month".
- One card per category, biggest first. Each shows name, spent, and one line, "₹X above plan so far", "₹X below plan so far", or "On plan".
- A card "How payments were marked" with three rows, Everyday, Luxury, and Group, each with a total.
- A card "Biggest single payment".
- **Never show a reason or a judgment.**
- **Learning from messages.** When a message is read, the app suggests a category and a type (see section 7). The student confirms in one tap. The app remembers the choice per shop name on the device and uses it next time.

### 6.4 Split

- A card per group showing each person as "owes you ₹X", "you owe ₹X", or "settled".
  - If the student owes, show outlined buttons "GPay" and "PhonePe". They open a payment link, then the balance resets to zero.
  - If the friend owes the student, show an outlined button "Mark received".
- **New split card.** Fields are group, what for (optional), amount, who paid (You or a member), who shared (chips, all on by default), and which category the student's own share goes under.
- **Rule.** Equal split. Share is amount divided by (people shared plus the student). If a friend paid and is not ticked, add them automatically.
- **Result.** If the student paid, each friend owes them a share. If a friend paid, the student owes that friend a share. The student's own share is added to Insights as a payment typed Group.
- **Checks.** Amount must be above zero. At least one other person must be picked. Errors show under the form.
- **Groups.** The student can add a group, add or remove member names, and save an optional payment ID for each friend on the device.
- **Payment link.** Use the standard Unified Payments Interface link shape `upi://pay?pa=<id>&pn=<name>&am=<amount>&cu=INR&tn=<note>`. If no payment ID is saved, open the link without a payee and show "Add their payment ID to fill this in." On a desktop screen, show "Open this on your phone."

### 6.5 Add

- A text box labelled "Paste a bank message" with the note "Read on this phone only. Nothing is uploaded."
- Two buttons, outlined "Use sample message" and filled "Read message".
- After reading, a result card shows an editable amount, the shop name, category chips, and type chips (Everyday, Luxury, Group), plus a filled "Save expense" button.
- If reading fails, show the error and keep the manual fields so the student can still save.
- **Error messages**
  - Empty box, "Paste a message first."
  - Money received, "That looks like money received. Paste a payment message."
  - No amount, "Could not find an amount. Check the message."

### 6.6 Nightly check-in

- Time is set in Settings (default 22:30).
- A web page cannot send a reliable scheduled alert. So at or after that time, the next time the app opens, show a banner on Home with the text "Anything you paid for today that was not picked up?", category chips, an amount box, and "Save". If browser notifications are allowed, also send one. A future Android app would use a real scheduled notification.
- Settings has a "Preview the reminder" button.

### 6.7 Settings

- Theme: System, Dark, Light.
- Monthly pocket money.
- Nightly check-in time.
- "Start new month" keeps plans and clears payments.
- "Reset sample data".
- "Delete all my data" with a confirm step.
- Privacy note, "Messages are read on this phone only. Nothing is uploaded to a server."
- A link to the report PDF.

## 7. Message reading rules

All reading happens in the browser.

- **Amount.** Match "Rs", "Rs.", "INR", or "₹" followed by a number. Allow commas and decimals. Remove commas before using the number.
- **Direction.** If the text has "credited" or "received" and has no "debited", "paid", or "spent", reject it as money received.
- **Shop name.** The words after "to" or "at", up to "on", "via", "ref", "upi", or a full stop. If none is found, use "Unknown".
- **Category from shop name (lowercase match)**
  - Food: swiggy, zomato, mess, cafe, restaurant, dominos, canteen
  - Travel: uber, ola, rapido, irctc, metro, auto, redbus
  - Shopping: myntra, amazon, ajio, zara, nykaa
  - Groceries: blinkit, zepto, bigbasket, instamart
  - Anything else, Food, and the student can change it
- **Type suggestion.** Suggest Luxury for myntra, ajio, nykaa, zara, bookmyshow. Everything else starts as Everyday. The student can change it, and the app remembers the choice per shop.
- **Sample messages to include on the Add screen**
  - `Rs.240.00 debited from A/c XX1234 on 12-Nov to SWIGGY via UPI. Ref 4821.`
  - `INR 1,100 paid to MYNTRA on 10-Nov. Ref 9930.`
  - `Rs.450 credited to A/c XX1234 on 11-Nov from RAHUL.`

## 8. Rules for the numbers

- Spending budget = sum of the five category plans.
- Savings = pocket money minus spending budget, never below zero.
- Left to spend = spending budget minus total spent.
- Days left = days in month minus today's date number.
- Safe per day = left to spend divided by days left.
- Pace = total spent divided by days passed.
- Money lasts until day = floor of spending budget divided by pace.
- Expected by today for a category = its plan times days passed divided by days in month.
- Pace status for a category = spent divided by expected.
  - Above 1.25, red
  - Above 1.05, amber
  - Below 0.7, teal with the text "below plan"
  - Otherwise, teal with "on plan"
- These cut-off values are guesses and should sit in one settings object so they are easy to change.
- Round every number shown. Use Indian number grouping with the ₹ sign.

## 9. Data model (stored in local storage)

- **Settings** with fields pocketMoney, theme, reminderTime, monthStart.
- **Plans** with one amount per category.
- **Expense** with id, amount, name, category, type, date, source (message, manual, split, nightly).
- **Group** with id, name, and members. Each member has name, optional paymentId, and balance.
- **ShopMemory** with shop name, category, type, learned from the student's confirmations.

## 10. Look and feel

**Idea.** A calm glass look like the latest iPhone system. Keep everything quiet except the Home hero card. That card is where the app spends its boldness.

**Glass cards**
- Dark card fill `rgba(255,255,255,0.08)`, light card fill `rgba(255,255,255,0.72)`.
- Blur `backdrop-filter: blur(24px) saturate(160%)`.
- Border 0.5 px, `rgba(255,255,255,0.18)` in dark and `rgba(0,0,0,0.10)` in light.
- A thin inner top highlight, `inset 0 1px 0 rgba(255,255,255,0.25)`, in dark only.
- If the blur is not supported, use a solid fill at the same tone.
- Place two or three large soft color shapes behind the cards so the glass has something to show through.

**Shapes.** Cards 24 px. Inner tiles 16 px. Buttons 14 px. Chips fully round. Tab bar 28 px.

**Colors**
- Dark background `#14131A`. Light background `#EEEEF6`.
- Text in dark `#F4F3F7`, secondary `#A9A7B5`. Text in light `#1C1B22`, secondary `#5B5A66`.
- Accent in dark `#AFA9EC`, on-accent `#26215C`. Accent in light `#534AB7`, on-accent `#FFFFFF`.
- Background shapes in dark `#3C3489` and `#085041`. In light `#CECBF6` and `#9FE1CB`.
- Status colors, teal `#1D9E75`, amber `#EF9F27`, red `#E24B4A`. Never use color alone to show status, always pair it with words.
- Dark theme is the default.

**Fonts**
- Font stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, "Segoe UI", Roboto, sans-serif`. iPhones then show their own system font. Do not upload or embed Apple font files. Load Inter as the fallback for Android and desktop.
- Sizes and line heights in px
  - Hero number 40 / 44, semibold
  - Page title 28 / 34, semibold
  - Section title 22 / 28, semibold
  - Headline 17 / 22, semibold
  - Body 17 / 22, regular
  - Callout 16 / 21
  - Subhead 15 / 20
  - Footnote 13 / 18
  - Caption 12 / 16
- Never go below 12 px. Keep lines under 80 characters.

**Spacing.** An 8 px grid. Page side padding 16 px. Space between cards 12 px.

**Motion.** Only in reply to a touch, such as a button press, a sheet opening, or a saved toast. No entrance effects on page load. Respect reduced motion.

**Avoid.** Spaced-out capital letters as labels above headings, numbered markers on things that are not a sequence, and the same shadow under every card.

**Access.** Text contrast of at least 4.5 to 1 on top of glass. Visible keyboard focus. Tap targets of at least 44 px. Every icon-only button has a label.

## 11. Sample data (shown with a "Sample" badge)

- Pocket money ₹8,000. Today is day 15 of a 30 day month.
- Plans: Food ₹3,200, Travel ₹1,000, Friends ₹1,000, Shopping ₹800, Groceries ₹600. Savings comes out at ₹1,400.
- Payments
  - Food: Mess extra ₹900, Swiggy ₹240, Zomato ₹310, Cafe night ₹260 (Group)
  - Travel: Auto to station ₹420, Rapido ₹180
  - Friends: Birthday gift ₹700 (Luxury)
  - Shopping: Myntra tee ₹1,100 (Luxury)
  - Groceries: Blinkit ₹180
- Groups: "Hostel gang" with Rahul (owes ₹450), Aman (owes ₹200), Neha (student owes ₹150). "Goa trip" with Rahul (settled) and Isha (owes ₹320).
- On first open show a dismissible note, "This is sample data. Clear it in Settings."

## 12. Hosting and access

- Publish to a public link, for example with Firebase Hosting.
- Open the link in a private browser window with no login and confirm it loads.
- Confirm the Network tab shows no calls to outside servers after load, except the font file and the Groww link when tapped.
- Return the link at the end.

## 13. Acceptance checks

These become the evals. Report each as pass or fail with a note.

| # | Check | Input | Expected |
|---|---|---|---|
| 1 | Read a normal message | Sample message 1 | Amount 240, shop SWIGGY, category Food |
| 2 | Amount with comma | Sample message 2 | Amount 1100, category Shopping, type suggested Luxury |
| 3 | Money received | Sample message 3 | Rejected with the received message |
| 4 | Empty box | Click Read with nothing | "Paste a message first." |
| 5 | No amount | "Paid to Cafe" | "Could not find an amount." |
| 6 | Unknown shop | Valid amount, odd name | Category Food, name kept |
| 7 | Save from message | Confirm result card | Payment appears on Home and Insights |
| 8 | Equal split | ₹1,000, you paid, 3 friends ticked | Each friend owes 250, your share 250 added as Group |
| 9 | No one picked | Untick everyone | "Pick at least one person" |
| 10 | Zero amount | Amount 0 | "Enter an amount first" |
| 11 | Friend paid | Friend pays ₹800, 3 ticked plus you | You owe that friend 200 |
| 12 | Plan above pocket | Raise plans past ₹8,000 | Blocked with message |
| 13 | Savings updates | Lower a plan by 100 | Savings rises by 100 |
| 14 | Theme saved | Pick Light, reload | Still Light |
| 15 | Delete data | Delete all, confirm | App returns to the empty state |
| 16 | Offline | Load once, go offline | App still works |
| 17 | No outside calls | Watch Network tab | None except fonts and the Groww link |
| 18 | Insights wording | Open Insights | No reason text and no judging words |
| 19 | No advertisements | Open every screen | None shown |
| 20 | Report PDF | Open from Settings | Words match circles-report.md |

## 14. Do not

- Do not invent features that are not in this file.
- Do not add sign in, sync, or analytics.
- Do not add reasons to Insights.
- Do not show real looking personal data. Sample data must stay labelled.
- Do not claim the app reads real messages. The web version only reads pasted text.
