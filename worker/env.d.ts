// The optional database binding is not used by the static GitHub Pages site.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
