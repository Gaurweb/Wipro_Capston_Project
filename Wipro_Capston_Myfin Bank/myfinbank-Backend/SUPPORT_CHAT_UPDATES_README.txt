MyFinBank Support/Chat Query update added.

Run order:
1. Eureka Server
2. Customer Service
3. Admin Service
4. API Gateway
5. Frontend with Live Server

New customer pages:
myfinbank-frontend/myfinbank-frontend/pages/support.html

New admin pages:
myfinbank-frontend/myfinbank-frontend/pages/admin-support.html

New APIs:
POST /api/support/create
GET  /api/support/my
GET  /api/admin/support/all
PUT  /api/admin/support/reply/{id}
PUT  /api/admin/support/close/{id}

Database:
No manual table creation needed if spring.jpa.hibernate.ddl-auto=update.
Customer service will create support_tickets table automatically in customerdb.

Important:
Restart Customer Service, Admin Service, and API Gateway after replacing files.
