import { navLinks } from "../data/nav";

type MainNavigationProps = {
  excludeLabel?: string;
  className?: string;
};

export default function MainNavigation({
  excludeLabel = "Portfolio",
  className,
}: MainNavigationProps) {
  const navClassName = ["portfolio-nav", className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClassName}>
      {navLinks
        .filter((link) => link.label !== excludeLabel)
        .map((link) => (
          <a
            key={link.label}
            href={link.href}
            data-cursor
            className="portfolio-nav-link"
          >
            {link.label}
          </a>
        ))}
    </nav>
  );
}
