# Editing website content

Open the file for the section you want to update. Change the words or links inside the double quotes, then save and preview the page.

| I want to update… | Open this file |
| --- | --- |
| The year, title, or tagline at the top of the home page | [hero.json](hero.json) |
| The club introduction, focus, location, or status | [about.json](about.json) |
| The posters in the Updates carousel | [updates.json](updates.json) |
| Project cards featured on the home page | [projects.json](projects.json) |
| Project cards on the department Projects page | [department-projects.json](department-projects.json) |
| Event posters, dates, registration links, or details PDFs | [events.json](events.json) |
| The Mock Hackathon event, report link, captions, and photo filenames | [mock-hackathon-2026.json](mock-hackathon-2026.json) |
| Gallery photos and captions | [gallery.json](gallery.json) |
| Quotes and their authors | [quotes.json](quotes.json) |
| The site logo or menu labels and links | [navigation.json](navigation.json) |
| The contact email or social links | [contact.json](contact.json) |
| The footer text | [footer.json](footer.json) |
| The page shown when an address cannot be found | [not-found.json](not-found.json) |
| The Tech Stack section, currently hidden | [skills.json](skills.json) |

## Add an event, project, or gallery photo

1. Copy an existing entry from its opening `{` to its closing `}`.
2. Paste it after the last entry in the list. Put a comma between the two entries.
3. Give the new entry an unused `id` number and replace its text, image path, and links.

Entries appear in the order listed. Keep at least one entry in the Quotes list.

## Add images or PDFs

Set an event’s `status` in its content file to `upcoming` or `completed` to choose which section it appears in.

Put gallery photos in `public/images/gallery` and posters in `public/images/posters`. In the content file, use a path like `/images/gallery/team-photo.jpg`. The path starts after the `public` folder and uses the exact filename, including its extension and capitalization.

Use `registrationUrl` for the event registration link and `galleryUrl` for the link opened by the **Details PDF** button. If you add `public/events/workshop.pdf`, use `/events/workshop.pdf` as the link. For an external form or PDF, paste its full web address.

In the contact file, change the `href` value under the relevant social network to update its link. The `email` value updates both the displayed address and the email link.

## Replace the Mock Hackathon photos

Open [public/images/events/mock-hackathon-2026](../../public/images/events/mock-hackathon-2026) to find the event photos. To add a photo, put it in that folder and add its filename and caption to the `photos` list in [mock-hackathon-2026.json](mock-hackathon-2026.json). The list controls the order and captions at the beginning of the home gallery. The first photo also appears on the Events listing. Keep at least one entry in the list. The PDF is stored separately at the path in `reportUrl`.
