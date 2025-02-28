# Local Farmers' Marketplace

### Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, React Query.
- Backend: Next.js API routes, Drizzle ORM, PostgreSQL (Neon).
- Auth: NextAuth.js (Google OAuth), JWT.
- Validation: Zod.
- Payments: Stripe.
- Realtime: WebSocket or SSE.
- Deployment: Vercel.



### Things that i have to lool afterwards
- the signin/signup issue -  that after signup the user should be signedin automaticaly
- filter the products by category ✅
- add a search bar ✅
- add a map view of the products 
- add a payment method ✅
- handle the payment method - stripe ✅
- add a notification system 
- add a user profile page ✅
- add a product details page ✅
- add a order page where the user can see all of their orders ✅
- add a product reviews system ✅
- user can review a prodcuct only after they have purchased it


- when an order is placed the order items should be removed form the cart ✅

- add a product edit page (optional) 
- add a product delete page (optional)
- add a product add page (optional)

- when a payment is successfull and if a user tries to go back to the payment page its giving amount 0 error - solve this issue ✅

Web-hooks
- for order confirmations, order cancellations, order updates, product reviews , product ratings, ✅
- add a web-hook for when an order is placed ✅
- add a web-hook for when a product is added/edited/deleted ✅
- add a web-hook for when a user has purchased a product  ✅
- add a web-hook for when a user has reviewed a product ✅
 
- imporve all the ui
- make a component for the auth(sign/signup)
- track order
- cart notification
- send email mail 
- order history


----
Product Filtering & Search: ✅
Filtering: Allow users to filter products by category (e.g., fruits, vegetables), price range, or location.
Search: Implement a search bar to quickly find products by name or keywords.

User Profile & Dashboard:
Enable users to manage their account details (e.g., update email, password, shipping addresses).
Display order history, favorite products, or recommendations.

Real-Time Notifications:
Integrate real-time updates using WebSockets or a service like Pusher/Ably.
Notify users when order statuses change (e.g., when an order is shipped or delivered).

Review & Rating System:
Allow users to leave reviews or ratings on products.
This builds trust and improves the shopping experience.

Admin / Farmer Dashboard:
Create a dashboard where farmers or admins can manage product inventories, view orders, and update product details.

Enhanced Checkout Experience:
Improve the checkout process with features like saving multiple shipping addresses, gift options, or order tracking.
Add a progress indicator to guide users through the checkout steps.

SEO & Performance Optimization:
Implement Server-Side Rendering (SSR) or Static Site Generation (SSG) for public pages like product listings to improve SEO.
Optimize images and code splitting for better performance.
\
Subscription Service:
Allow users to subscribe to weekly/monthly deliveries of fresh produce
Offer subscription discounts

Farmer Profiles:
Detailed pages about the farmers and their practices
Farm stories and sustainable farming methods
Virtual farm tours (images/videos)



----------------
### subscription
- create all the schemas
- validation schemas
- First: Subscription Plans Management
Create API endpoints to manage subscription plans
Build admin interface to create/manage plans
Set up Stripe product/price creation
This is the foundation for everything else
- Second: Subscription Purchase Flow
Create subscription checkout process
Integrate Stripe Subscription API
Handle subscription activation
Set up delivery preferences
- Third: Subscription Management
User dashboard for managing subscriptions
Pause/Resume/Cancel functionality
Change delivery preferences
Update payment methods
- Fourth: Delivery Management
System for tracking deliveries
Farmer interface for viewing subscriptions
Delivery scheduling system
Notification system



----
Implementing webhook handlers for Stripe events
Creating admin interface for managing subscription plans
Adding email notifications for subscription events
Implementing subscription renewal logic
Adding subscription analytics and reporting
Creating a subscription management dashboard for users
Implementing subscription pause/resume/cancel functionality
Adding delivery schedule management
Setting up automated billing and invoicing
Implementing subscription usage tracking