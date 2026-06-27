import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    DollarSign,
    Users,
    Truck,
    FileText,
    BarChart3,
    Settings,
    UserCog,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'POS',
        href: dashboard(), // Update this when you have POS route
        icon: FileText, // Receipt / POS icon
    },
    {
        title: 'Inventory',
        href: dashboard(),
        icon: Package,
        children: [
            { title: 'Brand', href: '/brand' },
            { title: 'Category', href: '/productCategory' },
            { title: 'Product', href: '/product' },
            { title: 'Varient', href: '/varient' },
            { title: 'Stock Adjustment', href: '/stock' },
        ],
    },
    {
        title: 'Finance',
        href: dashboard(),
        icon: DollarSign,
        children: [
            { title: 'Expense list', href: '/expense/list' },
            { title: 'Expense Category', href: '/expense/category' },
            { title: 'Bank', href: '/bank' },
            { title: 'Ledger', href: '/ledger' },
        ],
    },
    {
        title: 'Customer & Sales',
        href: dashboard(),
        icon: Users,
        children: [
            { title: 'Customers', href: '/customer' },
            { title: 'Quotations', href: '/quotations' },
            { title: 'Invoices', href: '/invoices' },
        ],
    },
    {
        title: 'Suppliers',
        href: dashboard(),
        icon: Truck,
        children: [
            { title: 'Suppliers', href: '/suppliers' },
            { title: 'Purchases', href: '/purchases' },
        ],
    },
    {
        title: 'Reports',
        href: dashboard(),
        icon: BarChart3,
    },
    {
        title: 'Administration',
        href: dashboard(),
        icon: Settings,
        children: [
            { title: 'Staff', href: '/staff' },
            { title: 'Packers', href: dashboard() },
            { title: 'Drivers', href: dashboard() },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // Add footer items here if needed
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}