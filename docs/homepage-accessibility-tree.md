# Homepage accessibility tree — source-derived audit

This is a **semantic outline inferred from React JSX** on the main homepage and shared components, not a browser-generated accessibility snapshot. A rendered browser snapshot is still required to verify computed roles, names, focus order, and Lighthouse's experimental Agentic Browsing warning.

```text
Document: Real Estate in Nellore | Anantha Real Estate
├── banner (header)
│   ├── link: Anantha Real Estate home
│   ├── navigation: Primary navigation [desktop]
│   │   ├── link: Home
│   │   ├── link: Properties
│   │   ├── link: Projects
│   │   ├── link: Commercials
│   │   ├── link: Services
│   │   ├── link: Property Intelligence
│   │   ├── link: About
│   │   └── link: Contact
│   ├── link: Get in Touch [desktop]
│   ├── button: Open menu / Close menu [mobile, expanded state]
│   └── navigation: Mobile navigation [when expanded]
├── main
│   ├── region: Homepage hero
│   │   ├── image: active slide description
│   │   ├── heading level 1: active slide title
│   │   ├── link: active slide primary action
│   │   ├── link: active slide secondary action
│   │   ├── button: Previous hero slide
│   │   ├── button: Next hero slide
│   │   └── buttons: Go to slide 1–5
│   ├── property-category navigation and listings
│   ├── feature and service sections
│   ├── projects and property cards
│   └── region: Google customer reviews
│       ├── group: active review slide
│       └── buttons: Previous / Next testimonial
├── contentinfo (footer)
│   ├── navigation: Footer quick links
│   ├── links: social profiles, contact information
│   └── navigation: Legal information
└── dialogs [conditional, when opened]
    ├── dialog: Tell us what you need
    │   ├── button: Close enquiry dialog
    │   ├── inputs: Name, Phone, Email, Enquiry purpose, Additional details
    │   └── actions: Submit Enquiry / Continue on WhatsApp
    └── dialog: Central World site visit invitation
        ├── button: Close launch invitation
        └── form: Your Name, Phone Number, Register
```

## Changes implemented

- Named primary, mobile, footer, and legal navigation landmarks.
- Linked mobile menu button to its panel and exposed expanded/collapsed state.
- Added accessible dialog roles/names for the lead enquiry and Central World invitation.
- Named the enquiry purpose selector and close button.

## Follow-up browser checks

1. Capture a real Chrome accessibility tree after JavaScript hydration on desktop and mobile.
2. Verify exactly one main landmark, appropriate heading hierarchy, and no unlabeled buttons/links.
3. Verify dialogs trap focus, return focus to the opener, and close on Escape.
4. Verify contrast, keyboard focus indicators, carousel controls, and hidden review slides.
5. Re-run Lighthouse Agentic Browsing and inspect the expanded failing node details.

This file does not claim the experimental audit has passed.
