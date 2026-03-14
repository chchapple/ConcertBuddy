# ConcertBuddy – Development Task Breakdown

## User Story 1
As a concert-goer, I want to showcase my music taste so that I meet people who like similar artists.

### Task 1.1: Add music taste section to user profile
**Description:** Create profile fields where users can enter favorite artists, genres, and music-related bio details.  
**Associated Feature/User Story:** Showcase music taste  
**Acceptance Criteria:**  
- User can add favorite artists and genres to profile  
- Music taste data is saved to database  
- Music taste appears on public event profile card  
- User can edit this information later  

### Task 1.2: Display music taste on attendee cards
**Description:** Show music preferences on swipe/profile cards for other attendees.  
**Associated Feature/User Story:** Showcase music taste  
**Acceptance Criteria:**  
- Swipe cards display favorite artists and/or genres  
- Data shown matches saved profile data  
- Layout remains readable on mobile screens  

---

## User Story 2
As a concert-goer, I want to see who else plans to attend the same event so that I can decide who I might connect with.

### Task 2.1: Create event attendance record system
**Description:** Build backend structure that links users to specific events they are attending.  
**Associated Feature/User Story:** View same-event attendees  
**Acceptance Criteria:**  
- System stores attendance by user ID and event ID  
- Only verified ticket holders can be marked attending  
- Attendance list can be queried by event  

### Task 2.2: Build event attendee browsing view
**Description:** Create a page or card stack showing attendees for a selected concert.  
**Associated Feature/User Story:** View same-event attendees  
**Acceptance Criteria:**  
- User can open an event and see attendees for that event only  
- Attendee list excludes the current user  
- Only verified attendees are shown  
- Each attendee card shows profile photo, bio snippet, and music taste  

---

## User Story 3
As a concert-goer, I want to find concerts happening nearby so that I can decide which ones to attend.

### Task 3.1: Build event browsing page
**Description:** Create a page for browsing upcoming concerts.  
**Associated Feature/User Story:** Find nearby concerts  
**Acceptance Criteria:**  
- User can view a list of upcoming events  
- Each event shows artist, venue, date, and location  
- Events are limited to Chico-area scope for MVP  

### Task 3.2: Add event search and filtering
**Description:** Let users search concerts by artist, venue, or date.  
**Associated Feature/User Story:** Find nearby concerts  
**Acceptance Criteria:**  
- User can search by artist name  
- User can search by venue  
- User can filter or search by date  
- Results update correctly based on search input  

### Task 3.3: Build map-based venue discovery view
**Description:** Add a map interface showing local venues and their events.  
**Associated Feature/User Story:** Find nearby concerts  
**Acceptance Criteria:**  
- User can view venues on a map  
- Selecting a venue reveals associated events  
- Only Chico-area venues appear in MVP  
- Map works on mobile layout  

---

## User Story 4
As a concert-goer, I want to talk to someone I connected with so that we can make plans before the event.

### Task 4.1: Create mutual match logic
**Description:** Build backend logic to create a match when two users like each other for the same event.  
**Associated Feature/User Story:** Talk to someone I connected with  
**Acceptance Criteria:**  
- Match is created only when both users express interest  
- Match is tied to a specific event  
- Duplicate matches are prevented  
- Expired event matches are no longer active  

### Task 4.2: Build 1:1 chat interface
**Description:** Create private chat between matched users.  
**Associated Feature/User Story:** Talk to someone I connected with  
**Acceptance Criteria:**  
- Only matched users can send messages to each other  
- Users can send text messages  
- Messages appear in chronological order  
- Chat loads correctly on refresh  

### Task 4.3: Add photo sharing in chat
**Description:** Allow matched users to send photo attachments in messages.  
**Associated Feature/User Story:** Talk to someone I connected with  
**Acceptance Criteria:**  
- User can upload and send an image in chat  
- Recipient can view the image in the chat thread  
- Image file is stored securely  
- Unsupported file types are rejected  

---

## User Story 5
As a concert-goer, I want to narrow down who I see so that I find other attendees I'm more likely to connect with.

### Task 5.1: Add attendee filter controls
**Description:** Build filtering UI for attendee browsing.  
**Associated Feature/User Story:** Narrow down who I see  
**Acceptance Criteria:**  
- User can filter attendee cards by age  
- User can filter attendee cards by gender  
- User can filter attendee cards by ride availability  
- Filters can be changed without reloading the page  

### Task 5.2: Apply filters to attendee query logic
**Description:** Connect filter settings to backend attendee results.  
**Associated Feature/User Story:** Narrow down who I see  
**Acceptance Criteria:**  
- Filtered results only show matching attendees  
- Unverified attendees never appear  
- Empty-state message appears when no results match filters  

---

## User Story 6
As a concert-goer, I want to coordinate a meeting spot so that I can find the person I'm going with.

### Task 6.1: Upload and manage venue floor plans
**Description:** Store floor plan images for supported Chico venues.  
**Associated Feature/User Story:** Coordinate a meeting spot  
**Acceptance Criteria:**  
- Admin can upload a floor plan for a venue  
- Floor plan is linked to the correct venue  
- Supported venue floor plans are retrievable in app  

### Task 6.2: Share pin-drop meeting points in chat
**Description:** Let matched users place a pin on a venue floor plan and share it in chat.  
**Associated Feature/User Story:** Coordinate a meeting spot  
**Acceptance Criteria:**  
- User can open venue floor plan from chat  
- User can place a pin on the map  
- Pin location is shared in the conversation  
- Other user can view the shared pin correctly  

---

## User Story 7
As a concert-goer, I want to back out of plans if something feels off so that I stay in control of who I meet.

### Task 7.1: Add unmatch functionality
**Description:** Allow users to end a match and remove the conversation.  
**Associated Feature/User Story:** Back out of plans  
**Acceptance Criteria:**  
- User can unmatch from the chat or match view  
- Unmatched users can no longer message each other  
- Match no longer appears in active matches list  
- Action takes effect immediately  

---

## User Story 8
As a concert-goer, I want to alert moderators about someone dangerous so that they can be removed.

### Task 8.1: Add report user flow
**Description:** Let users submit reports against another attendee.  
**Associated Feature/User Story:** Alert moderators  
**Acceptance Criteria:**  
- User can report another attendee from profile or chat  
- User must choose or enter a reason for report  
- Report is stored with reporter, reported user, event, and timestamp  
- Confirmation message appears after submission  

### Task 8.2: Build admin report review panel
**Description:** Create an admin view for reviewing submitted reports.  
**Associated Feature/User Story:** Alert moderators  
**Acceptance Criteria:**  
- Admin can view submitted reports  
- Admin can see who submitted the report and who was reported  
- Admin can mark reports as reviewed  
- Admin can suspend or flag reported users  

---

## User Story 9
As a concert-goer, I want to share how my companion behaved so that future users know what to expect.

### Task 9.1: Build post-event rating submission flow
**Description:** Allow users to leave a rating after an event ends.  
**Associated Feature/User Story:** Share how my companion behaved  
**Acceptance Criteria:**  
- Rating is only available after event date has passed  
- User can submit a star rating  
- User can select preset etiquette tags  
- User can only rate users they matched with for that event  

### Task 9.2: Display ratings and etiquette tags on profiles
**Description:** Show reputation data on user profiles.  
**Associated Feature/User Story:** Share how my companion behaved  
**Acceptance Criteria:**  
- User profile displays average star rating  
- Common etiquette tags appear on profile  
- Rating summary updates after new feedback is submitted  
- Ratings are associated with past event interactions only
