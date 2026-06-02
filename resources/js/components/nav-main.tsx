import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        {item.children?.length ? (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => toggleMenu(item.title)}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronDown
                                            className={`ml-auto h-4 w-4 transition-transform ${
                                                openMenus[item.title]
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {openMenus[item.title] && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.title}
                                                href={child.href}
                                                className="block rounded-md px-2 py-1 text-sm hover:bg-muted"
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}