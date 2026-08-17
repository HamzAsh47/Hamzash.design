import logoLockup from '../assets/logo/Logo_Vertical_Dark_BG.svg'
import { footer, navLinks } from '../content'
import { goToSection } from '../lib/scroll'
import { Icon, type IconName } from './Icon'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          {/* Real vector lockup — never redrawn. */}
          {/* 45KB of vector at the very bottom of the page — no reason for it
              to be in the first paint. */}
          <img
            className="footer__logo"
            src={logoLockup}
            alt="Hamza Ashraf"
            width={240}
            height={80}
            loading="lazy"
            decoding="async"
          />
          <p className="lede footer__tagline">{footer.tagline}</p>
          <p className="footer__positioning">{footer.positioning}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">{footer.navHeading}</h2>
          <ul className="footer__list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button className="footer__link" onClick={() => goToSection(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">{footer.socialHeading}</h2>
          <ul className="footer__list">
            {footer.socials.map((social) => (
              <li key={social.href}>
                <a
                  className="footer__link footer__link--icon"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name={social.icon as IconName} />
                  <span className="footer__link-text">
                    {social.network}
                    {/* The handle is the detail, the network is the label —
                        "@hamzash.47" alone does not say where it goes. */}
                    <span className="footer__platform">{social.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__heading">{footer.portfolioHeading}</h2>
          <ul className="footer__list">
            {footer.portfolioLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="footer__link footer__link--icon"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name={link.icon as IconName} />
                  <span className="footer__link-text">
                    {link.label}
                    <span className="footer__platform">{link.platform}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer__base">
        <span>{footer.copyright}</span>
        <span className="footer__sys">{footer.builtLine}</span>
      </div>
    </footer>
  )
}
