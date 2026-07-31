'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

export interface HeaderProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/upload') return 'Document Upload';
  if (pathname === '/skus') return 'SKU Master';
  if (pathname.startsWith('/match/')) {
    const poNumber = pathname.split('/')[2];
    return `Match Verification ${poNumber ? `(${poNumber})` : ''}`;
  }
  return 'System Overview';
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px]">System Online</span>
        </Badge>

        <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="hidden md:inline-block text-xs font-medium text-zinc-300">
            {user?.type || 'Authenticated'}
          </span>
          <button
            onClick={logout}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
