# ARE Agent Inventory Tool — V1

## Goal
Give Prakash Rao, Kondal Rao, Motherland sales team members, and other approved ARE network agents one mobile-first link to submit properties they discover into Anantha Real Estate's private inventory.

## Core principle
Agent submission is not automatic public publishing. Every submission enters ARE as **PENDING** and is reviewed/verified before it can become active/public inventory.

## Agent experience
1. Open a shareable agent inventory link on mobile.
2. Identify the submitting agent (name, phone, agency/team).
3. Add property information either:
   - by typing structured fields, or
   - by speaking a natural-language property description and reviewing the extracted fields before submission.
4. Capture/upload property photos from the phone.
5. Add location using a map/location link or device location when permission is granted; manual village/locality remains available.
6. Add owner/authorised seller details privately.
7. Submit to ARE inventory and receive a property reference ID.

## Minimum property data
- Agent name, phone, agency/team
- Owner/authorised seller name and phone
- Seller role / authority
- Property type
- Sell vs rent/lease
- Village / locality / landmark
- Location/map link and coordinates when available
- Area/size and unit
- Expected price/rent
- Facing and road access when relevant
- Approvals/layout/RERA when known
- Photos
- Additional notes
- Permission/consent confirmation

## Voice intake
The agent can say something like:

> We have a three-acre agricultural land near the airport side. It is in Ravipalem, close to the main road. Owner expects ... These are the property photos.

The tool should transcribe the speech, extract likely fields into a draft, highlight missing/uncertain information, and require the agent to review the structured property before final submission. Voice extraction must never silently invent missing property facts.

## ARE admin workflow
Submitted → Pending verification → Approved / Needs correction / Rejected → Availability status → Private/Published.

ARE admin can:
- edit/correct property details;
- add/remove/reorder photos;
- record verification notes;
- control availability;
- control publication separately from verification;
- retain an audit trail of changes.

## Permissions
- Agent: create submissions and view status of their own submissions.
- ARE Admin: view/edit/verify all submissions and control publication.
- Public user: only sees listings explicitly approved and published by ARE.

Agents must not be able to freely edit or delete the ARE master inventory after verification.

## Existing code to reuse
The current site already has:
- `/sell-your-property` submitting to `/api/property-listings`;
- agent-listed source fields;
- property verification/admin dashboard;
- photo management;
- verification, availability, and publication states;
- property audit logs.

V1 should extend these existing flows rather than create a disconnected inventory database.

## Build order
1. Agent-specific mobile intake page and route.
2. Agent identity/source fields persisted with property record.
3. Camera/gallery photo upload during intake.
4. Location/map capture.
5. Agent submission status view.
6. Voice-to-structured-draft intake.
7. Role-based agent login/permissions.
8. Buyer requirement matching and notifications in a later iteration.

## Acceptance criteria
- An approved agent can submit a property from a phone in a few minutes.
- Photos and location remain linked to the correct property reference ID.
- Every new submission is pending until ARE reviews it.
- ARE can tell exactly which agent sourced each property.
- Owner/contact information remains private.
- Approval does not automatically mean public publication.
- Existing public property pages and admin verification continue working.
