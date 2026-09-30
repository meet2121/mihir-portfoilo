// Primary navigation. Sections are enabled as their build phase lands,
// so the nav never points at an anchor that doesn't exist yet.
export interface NavItem {
  label: string;
  href: string;
  enabled: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Projects', href: '/#projects', enabled: true },
  { label: 'Experience', href: '/#experience', enabled: true },
  { label: 'Skills', href: '/#skills', enabled: true },
  { label: 'Research', href: '/#research', enabled: true },
  { label: 'Contact', href: '#contact', enabled: true },
];
