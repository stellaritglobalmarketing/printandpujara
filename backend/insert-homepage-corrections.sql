-- Homepage corrections (client PDF, 30 Sep 2026): offset/digital printers, box customization,
-- xerox rental image and the full client list.
-- Upload first: backend/uploads/machines/{komori-5-color-528,shiv-shakti-offset,bellbond-offset,konica-digital-press}.jpg,
-- backend/uploads/services/{box-customization,xerox-rental}.jpg and every new file in backend/uploads/clients/.
-- Run in phpMyAdmin. Safe to rerun: the column is added once and existing rows are skipped.

-- Printers are grouped on the homepage as offset / digital (finishing machines stay off the printer list).
SET @add_machine_type = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE machines ADD COLUMN machine_type VARCHAR(20) NULL AFTER slug',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'machines' AND COLUMN_NAME = 'machine_type'
);
PREPARE add_machine_type FROM @add_machine_type;
EXECUTE add_machine_type;
DEALLOCATE PREPARE add_machine_type;

START TRANSACTION;

INSERT INTO machines
(name, slug, machine_type, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Komori 5 Colour Offset Press (528)',
 'komori-5-color-528',
 'offset',
 'Five-colour sheet-fed Komori press for long runs of brochures, catalogues and cartons in rich, consistent colour.',
 'Our Komori 528 prints four process colours plus a special fifth colour in a single pass, keeping brand colours consistent across long runs of brochures, catalogues, labels and packaging.',
 CONCAT('5-colour sheet-fed offset', CHAR(10), 'Process colours plus a spot colour in one pass', CHAR(10), 'Long-run commercial and packaging work'),
 '/uploads/machines/komori-5-color-528.jpg',
 1, 1, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM machines WHERE slug = 'komori-5-color-528');

INSERT INTO machines
(name, slug, machine_type, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Shiv Shakti Offset Printing Machine',
 'shiv-shakti-offset',
 'offset',
 'Dependable sheet-fed offset press for everyday commercial print: letterheads, forms, flyers and envelopes.',
 'The Shiv Shakti offset press handles our day-to-day commercial jobs such as letterheads, bill books, forms, flyers and envelopes with clean, sharp results.',
 CONCAT('Sheet-fed offset', CHAR(10), 'Letterheads, forms, flyers and envelopes', CHAR(10), 'Everyday commercial print'),
 '/uploads/machines/shiv-shakti-offset.jpg',
 1, 2, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM machines WHERE slug = 'shiv-shakti-offset');

INSERT INTO machines
(name, slug, machine_type, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Bellbond Offset Printing Machine',
 'bellbond-offset',
 'offset',
 'Sheet-fed offset press that adds capacity for short and medium runs alongside our Komori line.',
 'Our Bellbond offset press takes on short and medium runs, keeping turnaround quick while the larger presses handle volume work.',
 CONCAT('Sheet-fed offset', CHAR(10), 'Short and medium runs', CHAR(10), 'Quick turnaround'),
 '/uploads/machines/bellbond-offset.jpg',
 1, 3, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM machines WHERE slug = 'bellbond-offset');

INSERT INTO machines
(name, slug, machine_type, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Konica Minolta Digital Production Press',
 'konica-digital-press',
 'digital',
 'Digital production press for fast short runs, personalised prints and proofs with no plate setup.',
 'The Konica Minolta production press prints short runs, variable data and proofs straight from file, ideal for visiting cards, invitations, brochures and personalised calendars.',
 CONCAT('Digital production printing', CHAR(10), 'Short runs and variable data', CHAR(10), 'No plates, quick turnaround'),
 '/uploads/machines/konica-digital-press.jpg',
 1, 4, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM machines WHERE slug = 'konica-digital-press');

UPDATE machines SET machine_type = 'digital', sort_order = 5 WHERE slug = 'epson-surecolor-s8130-vinyl-printing-machine';
UPDATE machines SET machine_type = 'digital', sort_order = 6 WHERE slug = 'challenger-fy-3200atplus-h4-flex-printing-machine';
UPDATE machines SET machine_type = 'offset' WHERE slug IN ('high-speed-offset-printing-machine', 'sheet-fed-offset-printing-machine', 'sheet-fed-offset-printing-machine-g40') AND machine_type IS NULL;
UPDATE machines SET machine_type = 'digital' WHERE slug = 'digital-production-printing-machine' AND machine_type IS NULL;
UPDATE machines SET machine_type = 'finishing' WHERE slug IN ('die-cutting-creasing-machine', 'perfect-binding-machine', 'hydraulic-paper-guillotine-cutter') AND machine_type IS NULL;
-- The generic stock entries are replaced on the homepage by the named presses above; they stay active.
UPDATE machines SET is_featured = 0 WHERE slug IN (
 'high-speed-offset-printing-machine', 'sheet-fed-offset-printing-machine', 'sheet-fed-offset-printing-machine-g40',
 'digital-production-printing-machine', 'die-cutting-creasing-machine', 'perfect-binding-machine', 'hydraulic-paper-guillotine-cutter');

-- Box customization is the first service in the (previously empty) Packaging category.
INSERT INTO services
(category_id, title, slug, short_description, description, featured_image_url,
 meta_title, meta_description, sort_order, is_featured, is_active, is_delete)
SELECT c.id,
 'Box Customization',
 'packaging-box-customization',
 'Custom printed mono cartons, rigid and corrugated boxes built to your product size and brand.',
 'We design and print custom boxes (mono cartons, rigid gift boxes and corrugated shippers) sized to your product, with offset-printed artwork, lamination, foiling and die-cut windows as needed.',
 '/uploads/services/box-customization.jpg',
 'Custom Box Printing | Pujara Print N Pack',
 'Custom printed mono cartons, rigid and corrugated boxes sized to your product and brand.',
 601, 1, 1, 0
FROM service_categories c
WHERE c.slug = 'packaging'
  AND NOT EXISTS (SELECT 1 FROM services WHERE slug = 'packaging-box-customization');

UPDATE services SET featured_image_url = '/uploads/services/xerox-rental.jpg'
WHERE slug = 'xerox-printers-rental-xerox-printers-rental';

-- Clients from the correction PDF. Logos: official files (company sites / Wikipedia); *-wordmark.svg = name-only badge where no official logo could be sourced.
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Godrej & Boyce (Godrej Locks)', 'Godrej & Boyce (Godrej Locks)', '', '/uploads/clients/godrej.svg', 1, 1, 200, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/godrej.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Sugee Group', 'Sugee Group', '', '/uploads/clients/sugee.png', 1, 1, 201, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/sugee.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Niwas Housing Finance', 'Niwas Housing Finance', '', '/uploads/clients/niwas-housing.png', 1, 1, 202, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/niwas-housing.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Network18', 'Network18', '', '/uploads/clients/network18.svg', 1, 1, 203, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/network18.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Radio Mirchi', 'Radio Mirchi', '', '/uploads/clients/radio-mirchi.png', 1, 1, 204, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/radio-mirchi.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'The Sleep Company', 'The Sleep Company', '', '/uploads/clients/the-sleep-company.png', 1, 1, 205, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/the-sleep-company.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Croma (Infiniti Retail Ltd.)', 'Croma (Infiniti Retail Ltd.)', '', '/uploads/clients/croma.svg', 1, 1, 206, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/croma.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Amstrad', 'Amstrad', '', '/uploads/clients/amstrad.svg', 1, 1, 207, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/amstrad.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Capital Foods', 'Capital Foods', '', '/uploads/clients/capital-foods.png', 1, 1, 208, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/capital-foods.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Ching''s Secret', 'Ching''s Secret', '', '/uploads/clients/chings.png', 1, 1, 209, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/chings.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Container Corporation of India (CONCOR)', 'Container Corporation of India (CONCOR)', '', '/uploads/clients/concor.svg', 1, 1, 210, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/concor.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'NYK Logistics', 'NYK Logistics', '', '/uploads/clients/nyk.svg', 1, 1, 211, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/nyk.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'TATA AIG', 'TATA AIG', '', '/uploads/clients/tata-aig.png', 1, 1, 212, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/tata-aig.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Fabtech Technologies', 'Fabtech Technologies', '', '/uploads/clients/fabtech.png', 1, 1, 213, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/fabtech.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Faces Canada', 'Faces Canada', '', '/uploads/clients/faces-canada.png', 1, 1, 214, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/faces-canada.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Purplle', 'Purplle', '', '/uploads/clients/purplle.svg', 1, 1, 215, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/purplle.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'HP Adhesives Ltd.', 'HP Adhesives Ltd.', '', '/uploads/clients/hp-adhesives.png', 1, 1, 216, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/hp-adhesives.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Häfele India Pvt. Ltd.', 'Häfele India Pvt. Ltd.', '', '/uploads/clients/hafele.png', 1, 1, 217, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/hafele.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'IDBI Federal Life Insurance', 'IDBI Federal Life Insurance', '', '/uploads/clients/idbi-life.svg', 1, 1, 218, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/idbi-life.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Killer Jeans', 'Killer Jeans', '', '/uploads/clients/killer-jeans.png', 1, 1, 219, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/killer-jeans.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'EZE Perfume', 'EZE Perfume', '', '/uploads/clients/eze-perfume.svg', 1, 1, 220, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/eze-perfume.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Polycab India Ltd.', 'Polycab India Ltd.', '', '/uploads/clients/polycab.png', 1, 1, 221, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/polycab.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Reliance Lifestyle (Reliance Retail)', 'Reliance Lifestyle (Reliance Retail)', '', '/uploads/clients/reliance-lifestyle.svg', 1, 1, 222, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/reliance-lifestyle.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Wipro Enterprises', 'Wipro Enterprises', '', '/uploads/clients/wipro.svg', 1, 1, 223, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/wipro.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Yes Bank', 'Yes Bank', '', '/uploads/clients/yes-bank.svg', 1, 1, 224, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/yes-bank.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Runwal Group', 'Runwal Group', '', '/uploads/clients/runwal.svg', 1, 1, 225, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/runwal.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Quba', 'Quba', '', '/uploads/clients/quba-wordmark.svg', 1, 1, 226, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/quba-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'KDPL', 'KDPL', '', '/uploads/clients/kdpl-wordmark.svg', 1, 1, 227, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/kdpl-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'IndoStar Home Finance', 'IndoStar Home Finance', '', '/uploads/clients/indostar.png', 1, 1, 228, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/indostar.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Abhinav Infra', 'Abhinav Infra', '', '/uploads/clients/abhinav-infra-wordmark.svg', 1, 1, 229, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/abhinav-infra-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Hegde & Hegde Pharmaceutica', 'Hegde & Hegde Pharmaceutica', '', '/uploads/clients/hegde-hegde.png', 1, 1, 230, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/hegde-hegde.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Kingfisher', 'Kingfisher', '', '/uploads/clients/kingfisher.png', 1, 1, 231, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/kingfisher.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Suvarna Wines', 'Suvarna Wines', '', '/uploads/clients/suvarna-wines-wordmark.svg', 1, 1, 232, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/suvarna-wines-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Emco Limited', 'Emco Limited', '', '/uploads/clients/emco-wordmark.svg', 1, 1, 233, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/emco-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Givaudan', 'Givaudan', '', '/uploads/clients/givaudan.svg', 1, 1, 234, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/givaudan.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Hettich', 'Hettich', '', '/uploads/clients/hettich.svg', 1, 1, 235, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/hettich.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Hella Infra Market', 'Hella Infra Market', '', '/uploads/clients/hella-infra.png', 1, 1, 236, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/hella-infra.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'GNV Commodity', 'GNV Commodity', '', '/uploads/clients/gnv-wordmark.svg', 1, 1, 237, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/gnv-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Vanity by Kuche', 'Vanity by Kuche', '', '/uploads/clients/vanity-kuche.png', 1, 1, 238, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/vanity-kuche.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Paxchem Ltd.', 'Paxchem Ltd.', '', '/uploads/clients/paxchem-wordmark.svg', 1, 1, 239, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/paxchem-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Royal International', 'Royal International', '', '/uploads/clients/royal-international-wordmark.svg', 1, 1, 240, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/royal-international-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Supreme Educational Pvt. Ltd.', 'Supreme Educational Pvt. Ltd.', '', '/uploads/clients/supreme-educational.png', 1, 1, 241, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/supreme-educational.png');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Wall 3D', 'Wall 3D', '', '/uploads/clients/wall-3d-wordmark.svg', 1, 1, 242, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/wall-3d-wordmark.svg');
INSERT INTO testimonials (client_name, company_name, message, client_image_url, is_company_public, is_featured, sort_order, is_active, is_delete)
SELECT 'Jyotish Pharmaceutical', 'Jyotish Pharmaceutical', '', '/uploads/clients/jyotish-pharma-wordmark.svg', 1, 1, 243, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE client_image_url = '/uploads/clients/jyotish-pharma-wordmark.svg');

-- Well-known brands lead the homepage strip; every other client keeps its relative order after them.
UPDATE testimonials SET sort_order = sort_order + 100 WHERE sort_order < 100 AND client_image_url NOT IN ('/uploads/clients/godrej.svg', '/uploads/clients/tata-aig.png', '/uploads/clients/yes-bank.svg', '/uploads/clients/wipro.svg', '/uploads/clients/polycab.png', '/uploads/clients/reliance-lifestyle.svg', '/uploads/clients/vivo.svg', '/uploads/clients/oppo.svg', '/uploads/clients/realme.png', '/uploads/clients/viacom.svg', '/uploads/clients/network18.svg', '/uploads/clients/saregama.png', '/uploads/clients/croma.svg', '/uploads/clients/hafele.png', '/uploads/clients/mahindra-logistics.png', '/uploads/clients/zoetis.svg');
UPDATE testimonials SET sort_order = FIELD(client_image_url, '/uploads/clients/godrej.svg', '/uploads/clients/tata-aig.png', '/uploads/clients/yes-bank.svg', '/uploads/clients/wipro.svg', '/uploads/clients/polycab.png', '/uploads/clients/reliance-lifestyle.svg', '/uploads/clients/vivo.svg', '/uploads/clients/oppo.svg', '/uploads/clients/realme.png', '/uploads/clients/viacom.svg', '/uploads/clients/network18.svg', '/uploads/clients/saregama.png', '/uploads/clients/croma.svg', '/uploads/clients/hafele.png', '/uploads/clients/mahindra-logistics.png', '/uploads/clients/zoetis.svg') WHERE client_image_url IN ('/uploads/clients/godrej.svg', '/uploads/clients/tata-aig.png', '/uploads/clients/yes-bank.svg', '/uploads/clients/wipro.svg', '/uploads/clients/polycab.png', '/uploads/clients/reliance-lifestyle.svg', '/uploads/clients/vivo.svg', '/uploads/clients/oppo.svg', '/uploads/clients/realme.png', '/uploads/clients/viacom.svg', '/uploads/clients/network18.svg', '/uploads/clients/saregama.png', '/uploads/clients/croma.svg', '/uploads/clients/hafele.png', '/uploads/clients/mahindra-logistics.png', '/uploads/clients/zoetis.svg');

COMMIT;

SELECT id, name, machine_type, is_featured, sort_order FROM machines ORDER BY is_featured DESC, sort_order, id;
