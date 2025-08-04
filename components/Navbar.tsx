'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { name: 'Income', href: '/dashboard/income' },
  { name: 'Expenses', href: '/dashboard/expenses' },
  { name: 'Investments', href: '/dashboard/investments' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md text-black px-6 py-4 flex justify-between items-center">
      <Link href="/dashboard" className="text-xl font-bold text-blue-600">
        FinSage
      </Link>
      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'text-sm font-medium hover:text-blue-600',
              pathname === item.href && 'text-blue-600 underline'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
