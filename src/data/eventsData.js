// // Dummy events data - will be replaced with database in the future
// export const eventsData = [
//   {
//     id: 1,
//     title: 'Summer Music Festival 2025',
//     category: 'Music',
//     price: 13500,
//     image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
//     date: 'July 15, 2025',
//     time: '6:00 PM',
//     fullTime: '6:00 PM - 11:00 PM',
//     duration: '5 hours',
//     location: 'Central Park, New York',
//     fullLocation: 'Central Park, Main Stage Area, 123 Park Avenue, New York, NY 10001',
//     organizer: 'Music Events Inc.',
//     description: {
//       intro: "Get ready for the ultimate summer music experience! The Summer Music Festival 2025 brings together top artists and emerging talents for an unforgettable evening of live performances.",
//       details: "This year's festival features a diverse lineup spanning multiple genres including rock, pop, indie, and electronic music. With multiple stages and food vendors, this is the perfect summer event for music lovers of all ages.",
//       closing: "Whether you're a die-hard music fan or just looking for a fun evening out, this festival promises amazing performances, great food, and an electric atmosphere.",
//       finalNote: "Join thousands of music enthusiasts for a night you won't forget!"
//     },
//     agenda: [
//       { time: '6:00 PM', title: 'Gates Open & Welcome' },
//       { time: '6:30 PM', title: 'Opening Act - Local Bands' },
//       { time: '7:30 PM', title: 'Indie Rock Performance' },
//       { time: '8:30 PM', title: 'Food Break & Networking' },
//       { time: '9:00 PM', title: 'Headliner Performance' },
//       { time: '10:30 PM', title: 'DJ Set & After Party' }
//     ],
//     audience: "This event is perfect for music lovers, festival enthusiasts, families, and anyone looking to enjoy live music in a beautiful outdoor setting. All ages welcome!",
//     tickets: [
//       { id: 1, name: 'General Admission', price: 13500, seats: 500, benefits: ['Access to all stages', 'Festival program', 'Food court access', 'Merchandise discounts'] },
//       { id: 2, name: 'VIP Pass', price: 36000, seats: 100, benefits: ['All General benefits', 'VIP viewing area', 'Exclusive lounge', 'Meet & greet with artists', 'Premium food & drinks'] },
//       { id: 3, name: 'Student Pass', price: 7500, seats: 200, benefits: ['Access to all stages', 'Festival program', 'Valid student ID required'] }
//     ],
//     paymentInfo: {
//       instructions: 'Payment must be completed before the event start date. Please contact us via email or phone to arrange payment. We accept bank transfers and cash payments at our office.',
//       contactName: 'Sarah Johnson',
//       contactEmail: 'payments@musicevents.com',
//       contactPhone: '+1 555 123 4567',
//       deadline: '2 days before event'
//     }
//   },
//   {
//     id: 2,
//     title: 'Tech Innovation Summit 2025',
//     category: 'Tech',
//     price: 36000,
//     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
//     date: 'August 22, 2025',
//     time: '9:00 AM',
//     fullTime: '9:00 AM - 5:00 PM',
//     duration: '8 hours',
//     location: 'Convention Center, San Francisco',
//     fullLocation: 'Convention Center, Hall A, 123 Tech Street, San Francisco, CA 94102',
//     organizer: 'TechHub Innovations',
//     description: {
//       intro: "Join us for the most anticipated tech conference of the year! The Tech Innovation Summit 2025 brings together industry leaders, innovators, and tech enthusiasts for a full day of inspiring talks, interactive workshops, and networking opportunities.",
//       details: "This year's summit focuses on the latest trends in artificial intelligence, cloud computing, cybersecurity, and sustainable technology. You'll have the chance to learn from experts, discover cutting-edge solutions, and connect with like-minded professionals from around the globe.",
//       closing: "Whether you're a developer, entrepreneur, student, or tech enthusiast, this event offers valuable insights and practical knowledge to help you stay ahead in the rapidly evolving tech landscape.",
//       finalNote: "Don't miss this opportunity to be part of the conversation shaping the future of technology!"
//     },
//     agenda: [
//       { time: '9:00 AM', title: 'Registration & Welcome Coffee' },
//       { time: '10:00 AM', title: 'Keynote: The Future of AI in Business' },
//       { time: '11:30 AM', title: 'Panel Discussion: Cybersecurity Best Practices' },
//       { time: '1:00 PM', title: 'Lunch Break & Networking' },
//       { time: '2:00 PM', title: 'Workshop Sessions (Choose Your Track)' },
//       { time: '4:00 PM', title: 'Startup Pitch Competition' },
//       { time: '5:00 PM', title: 'Closing Remarks & Networking Reception' }
//     ],
//     audience: "This event is perfect for software developers, IT professionals, entrepreneurs, students, and anyone interested in technology and innovation. No prior technical expertise required for general sessions, though some workshops may have prerequisites.",
//     tickets: [
//       { id: 1, name: 'General Admission', price: 15000, seats: 150, benefits: ['Access to all keynote sessions', 'Conference materials', 'Lunch and refreshments', 'Networking opportunities'] },
//       { id: 2, name: 'VIP Pass', price: 36000, seats: 45, benefits: ['All General Admission benefits', 'Premium seating', 'Exclusive VIP lounge access', 'Meet & greet with speakers', 'Event swag bag'] },
//       { id: 3, name: 'Student Pass', price: 0, seats: 200, benefits: ['Access to main sessions', 'Conference materials', 'Networking opportunities', 'Valid student ID required'] }
//     ],
//     paymentInfo: {
//       instructions: 'For paid tickets, please transfer the amount to our bank account and send the receipt via email. Bank details will be provided upon registration. Free student passes require valid student ID verification.',
//       contactName: 'Michael Chen',
//       contactEmail: 'register@techhub.com',
//       contactPhone: '+1 415 555 7890',
//       deadline: 'By August 15, 2025'
//     }
//   },
//   {
//     id: 3,
//     title: 'Educational Leadership Workshop',
//     category: 'Education',
//     price: 0,
//     image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
//     date: 'September 5, 2025',
//     time: '10:00 AM',
//     fullTime: '10:00 AM - 4:00 PM',
//     duration: '6 hours',
//     location: 'University Hall, Boston',
//     fullLocation: 'University Hall, Room 201, 456 Education Drive, Boston, MA 02115',
//     organizer: 'Education Excellence Foundation',
//     description: {
//       intro: "Transform your leadership approach with our comprehensive Educational Leadership Workshop. This interactive session is designed for current and aspiring educational leaders looking to enhance their skills and impact.",
//       details: "The workshop covers essential topics including strategic planning, staff development, curriculum innovation, and creating inclusive learning environments. Participants will engage in hands-on activities, case studies, and collaborative discussions.",
//       closing: "Join educators from across the region to share best practices, learn new strategies, and build a network of supportive colleagues committed to educational excellence.",
//       finalNote: "This free workshop is our contribution to developing the next generation of educational leaders!"
//     },
//     agenda: [
//       { time: '10:00 AM', title: 'Welcome & Introduction' },
//       { time: '10:30 AM', title: 'Leadership Fundamentals in Education' },
//       { time: '12:00 PM', title: 'Lunch & Networking' },
//       { time: '1:00 PM', title: 'Workshop: Strategic Planning for Schools' },
//       { time: '2:30 PM', title: 'Panel: Innovative Teaching Methods' },
//       { time: '3:30 PM', title: 'Q&A and Closing Remarks' }
//     ],
//     audience: "This workshop is ideal for teachers, principals, administrators, curriculum coordinators, and anyone in educational leadership or aspiring to leadership roles. All experience levels welcome.",
//     tickets: [
//       { id: 1, name: 'Free Registration', price: 0, seats: 150, benefits: ['Full workshop access', 'Workshop materials', 'Lunch included', 'Certificate of completion', 'Networking opportunities'] }
//     ],
//     paymentInfo: {
//       instructions: 'This is a free event. Simply register and attend. No payment required.',
//       contactName: 'Dr. Emily Roberts',
//       contactEmail: 'info@educationexcellence.org',
//       contactPhone: '+1 617 555 2468',
//       deadline: 'Registration closes September 1, 2025'
//     }
//   },
//   {
//     id: 4,
//     title: 'City Marathon 2025',
//     category: 'Sports',
//     price: 9000,
//     image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop',
//     date: 'October 10, 2025',
//     time: '7:00 AM',
//     fullTime: '7:00 AM - 2:00 PM',
//     duration: '7 hours',
//     location: 'City Stadium, Chicago',
//     fullLocation: 'City Stadium, Starting Line at Grant Park, Chicago, IL 60601',
//     organizer: 'Chicago Sports Association',
//     description: {
//       intro: "Lace up your running shoes for the annual City Marathon 2025! This premier running event brings together thousands of runners from around the world for a challenging and rewarding race through Chicago's scenic routes.",
//       details: "The marathon features multiple race categories including full marathon (26.2 miles), half marathon (13.1 miles), and 5K fun run. The course showcases Chicago's beautiful lakefront, historic neighborhoods, and iconic landmarks.",
//       closing: "Whether you're a seasoned marathoner aiming for a personal best or a first-time runner looking for a new challenge, this event offers a supportive atmosphere and unforgettable experience.",
//       finalNote: "Join us for a day of fitness, community, and achievement!"
//     },
//     agenda: [
//       { time: '7:00 AM', title: 'Check-in & Warm-up Area Opens' },
//       { time: '8:00 AM', title: 'Full Marathon Start' },
//       { time: '9:00 AM', title: 'Half Marathon Start' },
//       { time: '10:00 AM', title: '5K Fun Run Start' },
//       { time: '11:00 AM', title: 'First Finishers Ceremony' },
//       { time: '2:00 PM', title: 'Awards Ceremony & Closing' }
//     ],
//     audience: "This event welcomes runners of all levels, from elite athletes to casual joggers and families. Medical support and hydration stations available throughout the course.",
//     tickets: [
//       { id: 1, name: 'Full Marathon', price: 22500, seats: 1000, benefits: ['26.2 mile course', 'Finisher medal', 'Race t-shirt', 'Timing chip', 'Post-race refreshments'] },
//       { id: 2, name: 'Half Marathon', price: 15000, seats: 1500, benefits: ['13.1 mile course', 'Finisher medal', 'Race t-shirt', 'Timing chip', 'Post-race refreshments'] },
//       { id: 3, name: '5K Fun Run', price: 9000, seats: 2000, benefits: ['5K course', 'Participation medal', 'Race t-shirt', 'Family-friendly', 'Post-race refreshments'] }
//     ],
//     paymentInfo: {
//       instructions: 'Registration fees must be paid at the time of registration. Online payment or bank transfer accepted. Registration fee is non-refundable but transferable to another person.',
//       contactName: 'David Martinez',
//       contactEmail: 'marathon@chicagosports.org',
//       contactPhone: '+1 312 555 3691',
//       deadline: 'Early bird registration until September 30, 2025'
//     }
//   },
//   {
//     id: 5,
//     title: 'Business Networking Gala',
//     category: 'Business',
//     price: 0,
//     image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
//     date: 'November 18, 2025',
//     time: '6:30 PM',
//     fullTime: '6:30 PM - 10:00 PM',
//     duration: '3.5 hours',
//     location: 'Grand Hotel, Los Angeles',
//     fullLocation: 'Grand Hotel Ballroom, 789 Business Boulevard, Los Angeles, CA 90012',
//     organizer: 'LA Business Chamber',
//     description: {
//       intro: "Connect with Los Angeles's top business leaders and entrepreneurs at our exclusive Business Networking Gala. This elegant evening event provides unparalleled opportunities to build relationships, share ideas, and explore collaborations.",
//       details: "The gala features keynote speeches from industry leaders, structured networking sessions, and plenty of time for informal conversations. Attendees represent diverse sectors including technology, finance, real estate, hospitality, and more.",
//       closing: "Whether you're looking to expand your professional network, find potential partners, or simply connect with like-minded professionals, this gala offers the perfect setting.",
//       finalNote: "Dress code: Business formal. Don't miss this premier networking opportunity!"
//     },
//     agenda: [
//       { time: '6:30 PM', title: 'Registration & Welcome Reception' },
//       { time: '7:15 PM', title: 'Keynote Address' },
//       { time: '7:45 PM', title: 'Dinner Service' },
//       { time: '8:30 PM', title: 'Structured Networking Sessions' },
//       { time: '9:30 PM', title: 'Open Networking & Socializing' },
//       { time: '10:00 PM', title: 'Event Conclusion' }
//     ],
//     audience: "This gala is designed for business owners, executives, managers, entrepreneurs, and professionals seeking to expand their network and explore new opportunities. All industries welcome.",
//     tickets: [
//       { id: 1, name: 'Free Admission', price: 0, seats: 300, benefits: ['Gala access', 'Dinner included', 'Networking sessions', 'Event program', 'Business card exchange'] }
//     ],
//     paymentInfo: {
//       instructions: 'This is a complimentary event for business professionals. Registration is required to secure your spot. RSVP by the deadline.',
//       contactName: 'Jennifer Williams',
//       contactEmail: 'events@labusinesschamber.com',
//       contactPhone: '+1 213 555 8520',
//       deadline: 'RSVP by November 10, 2025'
//     }
//   },
//   {
//     id: 6,
//     title: 'Contemporary Art Exhibition',
//     category: 'Art',
//     price: 4500,
//     image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
//     date: 'December 1, 2025',
//     time: '12:00 PM',
//     fullTime: '12:00 PM - 8:00 PM',
//     duration: '8 hours',
//     location: 'Art Gallery, Miami',
//     fullLocation: 'Miami Contemporary Art Gallery, 321 Art District, Miami, FL 33132',
//     organizer: 'Miami Arts Collective',
//     description: {
//       intro: "Experience the cutting edge of contemporary art at our curated exhibition featuring works from established and emerging artists. This immersive showcase celebrates creativity, innovation, and artistic expression.",
//       details: "The exhibition includes paintings, sculptures, digital art, and interactive installations from over 50 artists worldwide. Guided tours, artist talks, and hands-on workshops provide deeper insights into the creative process.",
//       closing: "Whether you're an art collector, enthusiast, or simply curious about contemporary art, this exhibition offers something for everyone in a welcoming, accessible environment.",
//       finalNote: "Join us in celebrating the vibrant world of contemporary art!"
//     },
//     agenda: [
//       { time: '12:00 PM', title: 'Gallery Opens' },
//       { time: '2:00 PM', title: 'Guided Tour Session 1' },
//       { time: '3:30 PM', title: 'Artist Talk: Digital Art Revolution' },
//       { time: '5:00 PM', title: 'Guided Tour Session 2' },
//       { time: '6:30 PM', title: 'Interactive Workshop' },
//       { time: '8:00 PM', title: 'Gallery Closes' }
//     ],
//     audience: "This exhibition welcomes art lovers, students, collectors, and anyone interested in contemporary art and culture. Perfect for individuals and families alike.",
//     tickets: [
//       { id: 1, name: 'General Admission', price: 4500, seats: 200, benefits: ['Full exhibition access', 'Gallery guide', 'Workshop participation', 'Artist meet & greet'] },
//       { id: 2, name: 'Student/Senior', price: 3000, seats: 100, benefits: ['Full exhibition access', 'Gallery guide', 'Valid ID required'] },
//       { id: 3, name: 'Family Pass (4 people)', price: 13500, seats: 50, benefits: ['Exhibition access for 4', 'Gallery guide', 'Kids activity booklet', 'Workshop participation'] }
//     ],
//     paymentInfo: {
//       instructions: 'Tickets can be purchased online or at the gallery entrance. For group bookings (10+ people), please contact us for special rates. Payment can be made via credit card, cash, or mobile payment.',
//       contactName: 'Carlos Rodriguez',
//       contactEmail: 'tickets@miamiarts.org',
//       contactPhone: '+1 305 555 4782',
//       deadline: 'Advance purchase recommended. Same-day tickets subject to availability.'
//     }
//   }
// ];

// // Helper function to get event by ID
// export const getEventById = (id) => {
//   return eventsData.find(event => event.id === parseInt(id));
// };

// // Helper function to get all events
// export const getAllEvents = () => {
//   return eventsData;
// };
