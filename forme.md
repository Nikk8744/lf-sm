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
- filter the products by category
- add a search bar
- add a map view of the products
- add a payment method 
- handle the payment method - stripe
- add a notification system
- add a user profile page
- add a product details page
- add a order page where the user can see all his orders
- add a product reviews system - only after user has purchased the product


- when an order is placed the order items should be removed form the cart

- add a product edit page (optional)
- add a product delete page (optional)
- add a product add page (optional)

Web-hooks
- for order confirmations, order cancellations, order updates, product reviews , product ratings,
- add a web-hook for when an order is placed
- add a web-hook for when a product is added/edited/deleted
- add a web-hook for when a user has purchased a product
- add a web-hook for when a user has reviewed a product
