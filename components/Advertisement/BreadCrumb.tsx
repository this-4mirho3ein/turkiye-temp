import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { ReactNode } from "react";

interface BreadcrumbProps {
  items: { label: string; href: string; component?: ReactNode }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className="py-3 px-2 bg-white border-b-1 md:border-none mb-0 md:mb-1"
    >
      <Breadcrumbs className="text-sm" color="primary" radius="md" size="sm">
        {items.map((item, index) => (
          <BreadcrumbItem
            classNames={{
              separator: "px-0 md:px-1",
            }}
            size="sm"
            key={index}
            href={item.href}
            className="hover:text-blue-500 transition-colors duration-200"
          >
            {item.component ?? item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </nav>
  );
}
