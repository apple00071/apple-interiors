// This file handles requests to /api/contact/ (with trailing slash)
// It simply re-exports the handler from /api/contact.js

import contactHandler from '../contact';

export default contactHandler; 