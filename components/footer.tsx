import { Github, Twitter, Linkedin } from "lucide-react"

const footerLinks = [
  {
    heading: "Product",
    links: ["Mock Interviews", "Coding Practice", "Performance Reports", "Pricing"],
  },
  {
    heading: "Resources",
    links: ["Interview Tips", "Question Bank", "Success Stories", "Blog"],
  },
  {
    heading: "Company",
    links: ["About", "Contact", "Help Center", "Careers"],
  },
  {
    heading: "Legal",
    links: ["Privacy", "Terms", "Security", "DPDP Compliance"],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">
                Rehearse <span className="text-primary font-mono">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The meritocracy engine for hackathons.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-secondary hover:border-primary/30 hover:bg-primary/5 transition-all"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{group.heading}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            {"2026 RehearseAI. All rights reserved."}
          </span>
        </div>
      </div>
    </footer>
  )
}
