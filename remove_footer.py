#!/usr/bin/env python3
"""Remove footer from contact.html"""

# Read the file
with open(r'd:\apple-interiors\contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the footer section - it starts after </section></main> at the end
# and goes until the WhatsApp widget
footer_marker = '<p class="text-gray-600 mb-4">Transform your space'
whatsapp_marker = '<!-- WhatsApp Widget -->'

footer_start_idx = content.find(footer_marker)
whatsapp_start_idx = content.find(whatsapp_marker)

if footer_start_idx == -1:
    print("Footer marker not found!")
    exit(1)

if whatsapp_start_idx == -1:
    print("WhatsApp widget marker not found!")
    exit(1)

# Need to find where the footer actually starts (before <p>)
# Look backward for the start tag
search_back = content[:footer_start_idx]
footer_open_tag_idx = search_back.rfind('</main>\r\n    ')
if footer_open_tag_idx == -1:
    footer_open_tag_idx = search_back.rfind('</section>\r\n    ')

if footer_open_tag_idx == -1:
    print("Could not find footer start!")
    exit(1)

# Adjust to get the position after </main> or </section>
footer_actual_start = footer_open_tag_idx + len('</section>\r\n    ')

print(f"Footer starts at: {footer_actual_start}")
print(f"WhatsApp starts at: {whatsapp_start_idx}")
print(f"Removing {whatsapp_start_idx - footer_actual_start} characters")

# Remove the footer section
new_content = content[:footer_actual_start] + content[whatsapp_start_idx:]

# Write back
with open(r'd:\apple-interiors\contact.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Footer removed successfully!")
