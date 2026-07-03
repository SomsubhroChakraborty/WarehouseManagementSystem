# Warehouse Management System

A modern Warehouse Management System (WMS) built with Laravel, React, Inertia.js, and Tailwind CSS to simplify inventory management, purchasing, sales, customer management, supplier management, and reporting.

## Overview

This project helps businesses efficiently manage their warehouse operations by providing a centralized platform for inventory tracking, purchase management, sales processing, billing, and analytics. It is designed with a clean dashboard, role-based authentication, and real-time inventory updates.

## Features

### Dashboard
- Interactive analytics dashboard
- Inventory overview
- Sales summary
- Purchase summary
- Low stock alerts
- Revenue statistics

### Inventory Management
- Add, update, and delete products
- Product categories
- Brand management
- Product variants
- Stock tracking
- Low stock monitoring

### Purchase Management
- Create purchase orders
- Supplier selection
- Purchase status tracking
- Automatic stock updates
- Purchase history

### Sales Management
- Create sales invoices
- Customer management
- Sales status management
- Partial and completed sales support
- Automatic stock deduction
- Invoice generation

### Billing
- Printable invoices
- Purchase bills
- Sales bills
- Order summaries

### Customer Management
- Add and manage customers
- Customer purchase history
- Contact information

### Supplier Management
- Supplier records
- Supplier purchase history
- Contact management

### User Authentication
- Secure login
- User registration
- Protected routes
- Session management

### Reports
- Sales reports
- Purchase reports
- Inventory reports
- Revenue reports
- Stock reports

## Tech Stack

### Backend
- Laravel
- PHP
- MySQL

### Frontend
- React
- Inertia.js
- Tailwind CSS
- JavaScript

### Other Tools
- Vite
- Axios

## Screenshots

> Add screenshots of:
- Dashboard
- Products
- Inventory
- Purchase Module
- Sales Module
- Invoice
- Reports

Example:

```
docs/
│── dashboard.png
│── products.png
│── sales.png
│── purchase.png
│── invoice.png
```

Then include:

```markdown
## Dashboard

![Dashboard](docs/dashboard.png)

## Sales

![Sales](docs/sales.png)
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/SomsubhroChakraborty/WarehouseManagementSystem.git
```

```bash
cd WarehouseManagementSystem
```

### Install Backend Dependencies

```bash
composer install
```

### Install Frontend Dependencies

```bash
npm install
```

### Configure Environment

Copy the environment file.

```bash
cp .env.example .env
```

Generate the application key.

```bash
php artisan key:generate
```

Update your database credentials in the `.env` file.

```env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Run Migrations

```bash
php artisan migrate
```

### Seed Database (Optional)

```bash
php artisan db:seed
```

### Build Frontend

```bash
npm run dev
```

### Run Server

```bash
php artisan serve
```

The application will be available at:

```
http://127.0.0.1:8000
```

---

## Project Structure

```
app/
bootstrap/
config/
database/
public/
resources/
    ├── js/
    ├── components/
    ├── pages/
routes/
storage/
```

---

## Modules

- Dashboard
- Authentication
- Products
- Categories
- Brands
- Inventory
- Purchases
- Suppliers
- Customers
- Sales
- Billing
- Reports

---

## Future Improvements

- Barcode Scanner Integration
- QR Code Support
- Multi-Warehouse Management
- Email Notifications
- PDF Report Export
- Excel Import/Export
- Role & Permission Management
- Sales Analytics
- Dark Mode
- Mobile Responsive Enhancements

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## Author

**Somsubhro Chakraborty**

GitHub:
https://github.com/SomsubhroChakraborty

LinkedIn:
(Add your LinkedIn profile here)

---

## Repository

https://github.com/SomsubhroChakraborty/WarehouseManagementSystem

---

## License

This project is open-source and available under the MIT License.

---

## Preview

A complete Warehouse Management solution for managing:

- Products
- Inventory
- Purchases
- Sales
- Customers
- Suppliers
- Billing
- Reports

Designed to help small and medium-sized businesses streamline warehouse operations with a clean, responsive, and user-friendly interface.
