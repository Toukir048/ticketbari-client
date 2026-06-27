# TicketBari - Online Ticket Booking Platform

## Purpose

TicketBari is a MERN stack online ticket booking platform where users can search, view, book, and pay for travel tickets. The platform supports Bus, Train, Launch, and Plane tickets. It has role-based dashboards for User, Vendor, and Admin.

Users can browse approved tickets, view ticket details, request bookings, make payments after vendor approval, view transaction history, and download paid tickets. Vendors can add tickets, manage their own tickets, accept or reject booking requests, and view revenue overview. Admins can manage users, approve or reject tickets, mark fraud vendors, and advertise selected approved tickets on the homepage.

## Live URL

Live Site: [Add your live site link here]

## Key Features

* Better Auth email/password login and registration
* Better Auth Google social login
* JWT protected backend APIs
* Role-based dashboard for User, Vendor, and Admin
* Responsive Navbar and Footer
* Home page with advertised tickets and latest tickets
* All Tickets page with approved tickets only
* Search tickets by From and To location
* Filter tickets by transport type
* Sort tickets by price
* Pagination on All Tickets page
* Protected Ticket Details page
* Departure countdown
* Booking quantity validation
* Book Now disabled after departure time
* Book Now disabled when ticket quantity is 0
* Vendor ticket add form with ImgBB image upload
* Vendor booking accept/reject system
* Admin ticket approve/reject system
* Admin advertise ticket system with maximum 6 advertised tickets
* User booking status: pending, accepted, rejected, paid
* Stripe payment interface for accepted bookings
* Transaction history table
* PDF ticket download after payment
* Cancel booking before vendor accepts
* Simple live bus seat map
* Dark/Light mode toggle
* Loading spinner
* Invalid route error page
* Fully responsive custom design

## NPM Packages Used

### Client

* @tanstack/react-query
* axios
* better-auth
* framer-motion
* html2canvas
* jspdf
* react
* react-dom
* react-hook-form
* react-icons
* react-router-dom
* recharts
* sweetalert2
* swiper

### Server

* @better-auth/mongo-adapter
* better-auth
* cookie-parser
* cors
* dotenv
* express
* jsonwebtoken
* mongodb
* stripe

## Environment Security

Frontend configuration keys are secured using environment variables.

MongoDB credentials are secured using environment variables.

Environment files are not pushed to GitHub.
