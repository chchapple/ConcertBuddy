# ConcertBuddy PRD

## Project Title
ConcertBuddy

## Brief Description
ConcertBuddy is a web app for solo concert-goers to find and connect with other verified attendees going to the same event. Users create profiles, verify their identity and ticket, join specific concerts, swipe through other attendees, match, chat, and coordinate rides or meeting points. The product is focused on making solo concert attendance safer, easier, and more social, starting with venues in Chico.

## Technical Architecture

### Brief Description
ConcertBuddy will use a modern web app architecture with a hosted front end, managed authentication, cloud database, file storage, and Git-based deployment. The system should prioritize fast MVP development, mobile-first design, secure user verification flows, and event-based matching logic.

### Front-End
The front end should be built as a responsive web application optimized for mobile users first, since most users will browse events and matches on their phones. AWS Amplify will host and deploy the client app from GitHub. The UI should include profile creation, event browsing, swipe cards, chat, filters, and venue map views.

### Back-End
Supabase should handle the main backend responsibilities, including PostgreSQL database storage, authentication, storage for photos and tickets, and real-time messaging features. Backend logic should be organized around users, events, attendance verification, matches, messages, ratings, and moderation tools.

### Core Tools and Frameworks
- Front end hosted with AWS Amplify
- Code and version control managed in GitHub
- Database built with Supabase PostgreSQL
- Authentication through Supabase Auth
- File uploads through Supabase Storage
- Real-time chat supported with Supabase realtime features
- Development done in Windsurf IDE

### System Constraints
- Initial release limited to Chico venues and events
- Venue floor plans manually uploaded for local venues
- Ticket verification required before attendance visibility
- Matches only exist within a specific event
- Matches expire after the event date passes
- Safety and moderation features are required in MVP