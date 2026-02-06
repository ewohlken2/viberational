import Link from "next/link";
import { navLinks } from "../data/nav";
import styles from "./MainNavigation.module.css";

type MainNavigationProps = {
  excludeLabel?: string;
  className?: string;
};

export default function MainNavigation({
  excludeLabel = "Portfolio",
  className,
}: MainNavigationProps) {
  const navClassName = [styles.navigation, className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClassName}>
      {navLinks
        .filter((link) => link.label !== excludeLabel)
        .map((link) => (
          <Link
            key={link.label}
            href={link.href}
            data-cursor
            className={styles.link}
          >
            {link.label}
          </Link>
        ))}
    </nav>
  );
}
