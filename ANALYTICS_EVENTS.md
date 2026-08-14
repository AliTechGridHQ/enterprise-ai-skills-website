# EnterpriseAISkills.com — GA4 Analytics

Measurement ID: `G-HL64FS24QB`

## Automatically collected by GA4 / Enhanced Measurement
- page views
- session and engagement information
- common web interactions enabled in the GA4 web stream

## Custom business events
- `solution_engine_viewed`
- `plan_started`
- `plan_completed`
- `plan_downloaded`
- `plan_print_or_pdf`
- `plan_summary_copied`
- `advisor_chat_opened`
- `training_viewed`
- `training_clicked`
- `services_pricing_viewed`
- `estimate_requested`
- `contact_page_viewed`
- `contact_page_clicked`
- `whatsapp_clicked`
- `phone_clicked`
- `email_clicked`
- `contact_intent`

## Privacy design
The custom event layer does not transmit:
- Advisor answers
- chatbot messages
- customer problem descriptions
- email/phone values entered by users
- confidential business text

It sends event names and basic page/action metadata only.

## Suggested GA4 Key Events after data starts arriving
Consider marking these as Key Events:
1. `plan_completed`
2. `plan_downloaded`
3. `contact_intent`
4. `whatsapp_clicked`
5. `phone_clicked`
6. `email_clicked`

Do not mark every click as a Key Event; focus on actions that indicate real customer intent.
