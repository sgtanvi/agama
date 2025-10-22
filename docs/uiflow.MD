# Internal Context
This document is the authoritative product description for the Agama platform.
All code should preserve the described user flows, tone, and privacy guarantees.


User Types and Stories
1. Attendees
Discover Events: “I want to browse upcoming events, see details such as time, location, cost, and tags, and RSVP easily.”
Engage During Event: “I want to upload photos, see live vibe metrics, and receive updates from the organizer so I don’t miss important moments.”
Post-Event Recap: “I want to access a highlight reel or event report to relive the experience and share it with friends.”
2. Organizers
Create Events: “I want a guided flow to set up an event with details, agenda, media, and policies, so that it looks professional and is easy for attendees to understand.”
Monitor Live Dashboard: “I want to see crowd trends, timeline markers, and vibe summaries during the event so I can make operational adjustments in real time.”
Communicate in Real-Time: “I want to send quick updates (e.g., food is served, doors are opening, DJ on stage) via push notifications or SMS-style blasts so attendees and team members are informed instantly.”
Post-Event Reporting: “I want a polished report with attendance trends, highlight moments, and sponsor exposure metrics to share with my partners.”
3. Sponsors
Track Engagement: “I want to see impressions and engagement during my sponsored activity or booth activation.”
Branded Reports: “I want my logo and brand references to be included in post-event reports and highlight reels.”
4. Team Members (Logistics, Photographers, Volunteers)
Role-Specific Access: “I want to contribute within my scope — uploading photos, adding timeline markers, or running check-in — without access to sensitive organizer controls.”
Day-of Coordination: “I want a group chat where I can communicate with the logistics team and receive broadcast alerts (e.g., catering arrival, equipment setup complete).”

Core Features
A. Event Discovery and RSVP
Centralized event listing with tags, categories, and search.
Event detail pages with cover image, venue, date, capacity, price, and organizer info.
RSVP functionality with optional guest lists and confirmations.
Calendar integration (Add to Google/Outlook/Apple).
Shareable event links for distribution across platforms.
B. Event Creation (Organizer Workflow)
Guided form split into stages: basic info, categories/tags, media upload, agenda, policies.
Support for age restrictions (e.g., 18+, 21+), capacity limits, free or paid entry.
Ability to preview before publishing.
Organizer dashboard for editing and duplicating events.
C. Live Vibe Dashboard
Real-time visualization of crowd size and engagement trends derived from photo uploads and metadata.
Timeline markers logged by team members (e.g., “food arrived,” “performance started”) displayed as annotations on graphs.
Automated “vibe sentences” summarizing current energy levels.
Highlight of peak attendance times with correlation to timeline events.
D. Photo Upload and Analysis
Role-based photo upload permissions (photographers, approved attendees).
Image metadata parsing (EXIF data for timestamp/location).
Lightweight CV models for headcount estimation and density heatmaps.
Secure storage with organizer controls over visibility.
E. Surveys and Quick Polls
Post-event surveys for attendees (overall satisfaction, NPS, feedback).
Quick polls during the event (rate the current session, vote on music choice).
Survey results displayed in dashboards and post-event reports.
F. Communication Tools (New Feature)
Day-of Group Chat (Logistics Team): private chat for organizers, volunteers, and staff to coordinate setup, issues, and real-time decisions.
Broadcast Blasts (Attendees): organizers can send announcements to all attendees through push notifications, SMS, or in-app alerts. Examples:
“Food is now being served”
“Main act starting in 10 minutes”
“Survey is live — give us feedback!”
Sponsor Messages: optional branded notifications for sponsors (e.g., “Visit the sponsor lounge for a giveaway”).
Message Templates: pre-built quick-tap alerts for common events (doors open, break starts, speaker on stage).
G. Post-Event Report
Timeline of major events annotated with markers and correlated crowd spikes.
Attendance metrics: peak, average, and total.
Engagement metrics: number of uploads, surveys completed, polls answered.
Sponsor analytics: impressions during sponsored slots, audience engagement.
Exportable as branded PDF or shareable microsite.
H. Roles and Permissions
Organizer: create, edit, delete events; full analytics access.
Logistics: add timeline markers, run check-in, manage day-of coordination.
Photographer: upload and tag photos; trigger real-time analytics.
Sponsor: read-only access to sponsor dashboard and reports.
Attendee: RSVP, upload photos (if granted), participate in polls/surveys.
I. Monetization Hooks
Organizer Pro Subscription: access to post-event reports, sponsor panels, advanced analytics.
Guest Uploader Pass : free but organizer will pay to unlock higher upload limits.
Sponsor Add-On: branded reports and dedicated dashboard modules.

User Journeys
Attendee Journey
Discovers an event in the Agama app.
Views event details, RSVPs, and adds to calendar.
Receives broadcast reminders and live updates during the event.
Uploads photos (if allowed) and participates in quick polls.
Post-event, access highlight reel or surveys.
Organizer Journey
Creates event with details, media, and agenda.
Assigns roles to logistics team and photographer.
During event, monitors vibe dashboard, logs timeline markers, and sends broadcast updates to attendees.
After event, downloads and shares sponsor-ready report.
Logistics Team Journey
Joins organizer’s event as a team member.
Uses group chat to coordinate with other staff (setup, catering, security).
Logs timeline markers as key milestones happen.
Receives organizer broadcasts for action items.
Sponsor Journey
Added to event as a sponsor.
Views sponsor dashboard during event, monitors impressions.
Receives branded post-event report with data on engagement.
Monetization & Pricing Philosophy
Free to Attendees: Guests never pay for participation, uploads, or access to dashboards. Their contribution is encouraged, not monetized.
Organizer Revenue Model: Organizers pay for Pro features (advanced analytics, branded post-event reports, extended history). They may also charge for event tickets, workshops, or conference registrations.
Sponsors: Pay to be included in branded dashboards and post-event reports. Sponsor logos, impressions, and activation moments are highlighted as proof of ROI.
Organizer Flow of Funds: Organizers can (a) cover costs themselves, (b) secure sponsor contributions, and/or (c) collect attendee ticket revenue for paid events.

