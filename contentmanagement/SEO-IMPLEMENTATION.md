# SEO source mapping

SEO remains an Admin-only localStorage mock; source content is not modified. Insight has exactly four fixed configurations and no content-type builder.

| Subtype | Template variables from existing fields | OG image sources |
| --- | --- | --- |
| Area Guide | `title`, `prefecture`, `city`, `area`, `subtitle`, `introDescription`, `description`, `mapDescription` | Existing hero image (`heroImageName`), global default |
| Article | `title`, `shortDescription`, `author`, `contentBody` | First image in rich-text body, global default |
| News | `title`, `shortDescription`, `author`, `contentBody` | First image in rich-text body, global default |
| FAQ | `question`, `answer`, `author` | Global default; individual override may supply an image URL |

Sources inspected: `area-guide.html`, `articles.html`, `news.html`, `faq.html`, and their editors/records in `blog.html`. Article and News share editor fields but have independent SEO settings. `shortDescription` already falls back to body text when saved by the content editor. Body/answer SEO substitutions use plain text. News has no stored publication-date field. The Article/News thumbnail picker is not persisted by `saveBlog`, so it is not presented as an available record image source. No new content fields were added.

The Area Guide preview represents the existing Shibuya city-guide record. City guides have `introDescription`; neighborhood guides have `description`. Missing source values use global fallback rather than a fabricated common summary. Public URLs, Article/News preview descriptions, and illustrative hero art are mock samples, not CMS integration.

Resolution: Individual Page Override → Corresponding Insight Subtype SEO Configuration → Global SEO Default. Blank override fields inherit. Automatic canonical uses the record URL. Each subtype independently stores templates, keywords, OG settings, canonical and indexing rules, and has Search/Social previews.

Storage uses `yuushi.admin.seo.insight.areaGuide`, `.article`, `.news`, and `.faq`. The obsolete generic `yuushi.admin.seo.insight` key is left untouched but is no longer read or applied: untyped generic settings cannot safely be assigned to all subtypes. The existing `insight-1` sample is explicitly an Article; its page override ID is retained. New override writes include their subtype; mismatched subtype overrides are ignored. Property, Agency and Global settings retain their existing keys.

Browser regression checks: load `seo-management.html`, then evaluate `fetch('tests/seo-management.test.js').then(r=>r.text()).then(eval)`. Tests exercise the forms, independent persistence, source variables, previews, image selection, inheritance and override identity, restoring localStorage afterward. Reload the page after running.
