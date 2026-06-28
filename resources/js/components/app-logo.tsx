
import { Warehouse } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-grey-600 text-white">
                <Warehouse className="size-5" />
            </div>

            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate font-bold leading-tight">
                    Warehouse
                </span>
                <span className="text-xs text-muted-foreground">
                    Management System
                </span>
            </div>
        </>
    );
}