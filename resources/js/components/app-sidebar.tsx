import { Link } from '@inertiajs/react';
 import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
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
// import { route } from 'ziggy-js';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'POS',
        href: dashboard(),
        icon: LayoutGrid,
    },
  {
    title: 'Inventory',
    href: dashboard(),
    icon: LayoutGrid,
     children:[
        {
            title:'Brand',
            href:'/brand',
        },
        {
            title:'Category',
            href:'/productCategory',
        },
        {
            title:'Product',
            href:'/product',
        },
        {
            title:'Varient',
            href:'/varient',
        },
        // {
        //     title:'Units',
        //     href:dashboard(),
        // },
        
        // {
        //     title:'Product Type',
        //     href:dashboard(),
        // },
        {
            title:'Stock Adjustment',
            href:'/stock',
        },
    
        
    ]
   
},
{
    title: 'Finance',
    href: dashboard(),
    icon: LayoutGrid,
    children:[
        {
            title:'Expense list',
            href:'/expense/list',
        },
        {
            title:'Expense Category',
             href:'/expense/category',
        },
        {
            title:'Bank',
            href:'/bank',
        },
        {
            title:'Ledger',
            href:'/ledger',
        },
        // {
        //     title:'Taxes',
        //     href:dashboard(),
        // },
        // {
        //     title:'Fees Config',
        //     href:dashboard(),
        // },
        // {
        //     title:'Payment Methods',
        //     href:dashboard(),
        // },
        
    ]
  
},
{
    title: 'Customer & Sales',
    href: dashboard(),
    icon: LayoutGrid,
    children:[
        {
            title:'Customers',
            href:'/customer',
        },
        {
            title:'Quotations',
            href:'/quotations',
        },
        {
            title:'Invoices',
            href:dashboard(),
        },
        
    ]
  
},
{
    title: 'Suppliers',
    href: dashboard(),
    icon: LayoutGrid,
    children:[
        {
            title:'Suppliers',
            href:dashboard(),
        },
        {
            title:'Purchases',
            href:dashboard(),
        },
        
    ]
  
},
{
    title: 'Reports',
    href: dashboard(),
    icon: LayoutGrid,
  
},
{
    title: 'Administration',
    href:dashboard(),
    children:[
        {
            title: 'Staff',
             href:dashboard(),
        },
        {
            title: 'Packers',
             href:dashboard(),
        },
        {
            title: 'Drivers',
             href:dashboard(),
        }
    ]
},

];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
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
