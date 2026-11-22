# Pocket money app for students: product report

**Framework used** is CIRCLES. The seven steps are Comprehend the situation, Identify the customer, Report the needs, Cut through with priorities, List solutions, Evaluate trade-offs, and Summarize.

**Author** [Your name]

## How to read the numbers

Every number in this report is marked in one of three ways.

- **Verified** means a student told me this directly in my 5 conversations. These were students in different years, including a first year, a third year, and a postgraduate student.
- **Sample** means a made-up number used only to show how the app works.
- **Guess** means my own belief that I have not checked yet.

| Claim | Status | Count |
|---|---|---|
| Most students on pocket money do not track spending | Verified | [fill in: X of 5] |
| Some paste expenses into an AI chatbot but fear leaking their finances | Verified | [fill in: X of 5] |
| Many run out of money before the month ends | Verified | [fill in: X of 5] |
| They cope with mess food, borrowing from friends, or asking parents again | Verified | [fill in: X of 5] |
| Tracking must be quick or they skip it | Verified | [fill in: X of 5] |
| Group payments are a big part of student spending | Guess | Seen myself, not counted |
| A night-time reminder would build the habit | Guess | Idea, not tested |
| Students would act on a nudge to invest | Guess | Not tested |
| Pocket money of ₹8,000 a month in the demo | Sample | Not real data |

## C: Comprehend the situation

- **The setting.** Students who live in hostels or rented rooms away from home have no income. Parents send a fixed amount each month, and it has to cover food, travel, friends, shopping, and groceries.
- **What happens today.** Most students I spoke to do not track spending at all. A few sometimes paste expenses into an AI chatbot, but they worry about leaking their money details. Many run out before the month ends. They get by with the mess, borrowing from friends until the next transfer, or asking parents for more in the middle of the month.
- **Why it matters.** Running low early leads to small loans from friends and awkward calls home. It also leaves nothing to save. A student who can see the pattern can change it.
- **Where Groww fits.** The app is not an investing app. It helps a student make the money last and set a little aside, then points to Groww as the next step.
- **Goal.** Help a student make the monthly money last and keep a small amount aside.
- **Limits we work within.**
  - GPay, PhonePe, and Paytm are closed apps, so we cannot add pop-ups inside them.
  - Only Android phones let an app read bank messages. iPhones do not.
  - The prototype is a web app, so it cannot read real messages. It uses a paste box instead.
  - One person builds it in a short time.

## I: Identify the customer

The main customer is a student who lives away from home and depends on monthly pocket money from parents.

| Person | Role | Why they matter |
|---|---|---|
| Student on pocket money | Main user | Feels the problem every month |
| Friends in a shared bill | Names inside a split | They do not need the app |
| Parents | Send the money | They pay but do not use the app |

- **Differences by year.** I expect first years to be still learning how to handle money, and later years to have set habits. This is a guess, and I plan to check it in the next round of talks.
- **Not the target for now.** Working adults and the wider public. The same design could serve them later.

## R: Report the needs

| # | The student needs to | Status |
|---|---|---|
| N1 | See where the money went without much effort | Verified |
| N2 | Know whether the money will last until the next transfer | Verified |
| N3 | Keep money details private | Verified |
| N4 | Record spending quickly, even when busy | Verified |
| N5 | Split shared costs and get paid back without awkwardness | Guess |
| N6 | Get a gentle push to save or invest a little | Guess |
| N7 | Pay a friend from the same place | Guess |

**Pain points behind the needs**

- **Nothing is tracked.** Money disappears and the student only notices when the balance is low.
- **No early warning.** They find out they are short after it is too late to adjust.
- **Borrowing loops.** They borrow from friends and repay when parents send money, which hides the real gap.
- **Privacy fear.** Pasting bank details into a chatbot feels risky, so many avoid tracking altogether.
- **Effort.** If a payment is made in a hurry, they will not stop to log it.

## C: Cut through with priorities

I rated each need on four things. **Reach** is how many students feel it. **Pain** is how much it hurts. **Fit** is how much it helps the main goal. **Effort** is how hard it is to build. These ratings are my own judgment, so they count as guesses until I test them.

| Need | Reach | Pain | Fit | Effort | Rank |
|---|---|---|---|---|---|
| N1 See where money went | High | Medium | High | Medium | Must |
| N2 Know if money lasts | High | High | High | Low | Must |
| N3 Keep it private | High | High | High | Medium | Must |
| N4 Quick to record | High | High | High | Medium | Must |
| N5 Split shared costs | Medium | Medium | Medium | Medium | Should |
| N6 Nudge to save | Medium | Low | High | Low | Should |
| N7 Pay from the app | Medium | Low | Low | Low | Could |

- **Why N2 sits at the top.** Running out early is the clearest pain students described, and the fix is cheap to build.
- **Why N3 is a rule and not a feature.** If students do not trust the app with their messages, nothing else matters. So every feature must respect it.
- **Why N5 and N6 are second.** They matter, but students need N1 to N4 working before they will use a split or a nudge.

## L: List solutions

**For N1 and N4, recording spending**
- A. A pop-up after every payment.
- B. Read bank messages on the phone and fill in the details.
- C. A short nightly check-in to add what was missed.
- D. Upload the monthly bank statement.
- E. Type each payment by hand.

**For N2, knowing if the money will last**
- A. A meter showing money left, safe spend per day, and current pace.
- B. A weekly summary.
- C. An alert when pace is too high.

**For N3, privacy**
- A. Read and sort messages on the phone only.
- B. Send messages to a cloud service to sort them.

**For N5, splitting**
- A. A split feature inside the app.
- B. A link to an existing split app.

**For N6, saving**
- A. A nudge with a link to Groww.
- B. Investing inside our app.

**For N7, paying**
- A. A button that opens the student's own payment app.
- B. Full connection with payment apps.

**The app that comes out of this** has five tabs. **Home** shows money left and the nudge. **Budget** sets a plan for each category. **Insights** shows where the money went. **Split** tracks shared costs. **Add** reads a pasted bank message. A gear icon opens settings, including the nightly check-in time.

## E: Evaluate trade-offs

| Option | Decision | Why | What we give up |
|---|---|---|---|
| Pop-up after each payment | Drop | Students skip it when busy | Instant, exact records |
| Read bank messages | Choose | Needs almost no effort | iPhone support, for now |
| Nightly check-in | Choose | Catches what was missed | Some entries are late |
| Monthly statement upload | Later | Messages already cover it | Older history |
| Sort messages on the phone | Choose | Answers the privacy fear | Smarter cloud sorting |
| Built-in split | Choose | Replaces borrowing notes | Extra build time |
| Nudge linking to Groww | Choose | Keeps us outside investing rules | Investing in one tap |
| Connection with payment apps | Drop | Those apps are closed | Seamless payment |
| Open the payment app by link | Choose | Cheap and honest | Amount may need retyping |
| Advertisements | Drop | Breaks trust in a money app | Any ad income |
| Explaining why someone spent | Drop | Feels like judging | Simple labels only |

- **On advertisements.** There will be none. A money tool that shows ads would not earn the trust it needs.
- **On judging spending.** Insights only report where money went, such as "₹X above plan so far". The student can mark a payment as luxury, and the app suggests this from the shop name, but it never says why someone spent.
- **Impact on the student.** They should see their month clearly, get an early warning when money is running low, and have fewer small loans and calls home. These are expected results and not yet proven.
- **How we will know it works.** I will watch how many payments get a category, how many days a week the student opens the app, and how often a student runs out before the next transfer. I will set targets only after the first round of testing.

## S: Summarize

- **What we are building.** A private, phone-first app for students on pocket money. It reads bank messages on the phone, shows where money went, warns early when money may run short, splits shared costs, and nudges a small saving toward Groww.
- **Why this shape.** It answers the four needs students raised most, which are seeing where money went, knowing if it will last, keeping data private, and recording quickly. Splitting and the nudge come next.
- **What we gave up.** Pop-ups, deep payment app connections, ads, iPhone message reading, and statement upload for now.
- **Main risks.** The habit may fade after a few days, and message reading works on Android only. Both are noted as open questions.
- **Next test.** Give the prototype to the same 5 students and ask three things. Would you use it for a week, what would make you stop, and does it feel safe with your messages.
